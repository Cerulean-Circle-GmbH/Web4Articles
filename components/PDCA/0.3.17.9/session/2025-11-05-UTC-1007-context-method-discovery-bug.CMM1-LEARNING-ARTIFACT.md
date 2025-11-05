# PDCA: Fix Context Method Discovery in `on()` Pattern

**Component:** Web4TSComponent  
**Version:** 0.3.17.8 → 0.3.17.9 (patch)  
**Date:** 2025-11-05 UTC 10:07  
**Status:** 🟡 PLAN

---

## 📋 **Links**

**Backward (Dependencies):**
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/03180/components/Web4TSComponent/0.3.17.8/src/ts/layer2/DefaultCLI.ts) | [§/components/Web4TSComponent/0.3.17.8/src/ts/layer2/DefaultCLI.ts](components/Web4TSComponent/0.3.17.8/src/ts/layer2/DefaultCLI.ts) - DefaultCLI with `on()` and `discoverMethods()`
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/03180/components/Web4TSComponent/0.3.17.8/src/ts/layer5/Web4TSComponentCLI.ts) | [§/components/Web4TSComponent/0.3.17.8/src/ts/layer5/Web4TSComponentCLI.ts](components/Web4TSComponent/0.3.17.8/src/ts/layer5/Web4TSComponentCLI.ts) - CLI execution with error handling

**Forward (Outcomes):**
- TBD: Black-box test demonstrating the bug
- TBD: Fixed `on()` method with context discovery
- TBD: Test demonstrating fix works

---

## 📝 **PLAN**

### **TRON (Trigger-Response-Outcome-Next)**

**Trigger (User Discovery - Verbatim):**
```
web4tscomponent on PDCA 0.3.5.2 getDualLink
```

**Response (Root Cause Analysis):**

**THE BUG:** Context methods are not discovered after `on()` loads a component!

**Symptom:**
```bash
✅ Component context loaded: PDCA 0.3.5.2
   Path: /Users/Shared/Workspaces/temp/Web4Articles/components/PDCA/0.3.5.2
❌ CLI Error: Unknown command: getDualLink
```

But this works:
```bash
pdca-v0.3.5.2 getDualLink  # ✅ Works!
```

**Root Cause Chain:**

1. **Constructor** (`Web4TSComponentCLI.ts:23-38`):
   - Creates `this.component` (DefaultWeb4TSComponent) ✅
   - Calls `this.discoverMethods()` ✅
   - Discovers: CLI methods + `this.component` methods ✅
   - `this.context` doesn't exist yet ❌

2. **on() method** (`DefaultCLI.ts:228-276`):
   - Loads target component (PDCA 0.3.5.2) ✅
   - Sets `this.context = targetComponent` ✅
   - Sets model context delegation ✅
   - **MISSING:** Does NOT call `this.discoverMethods()` ❌

3. **discoverMethods()** (`DefaultCLI.ts:675-723`):
   - Lines 677-702: Discovers CLI chain methods ✅
   - Lines 704-722: Discovers `this.component` methods ✅
   - **Lines 724+:** No code to discover `this.context` methods ❌

4. **executeDynamicCommandWithChaining** (`Web4TSComponentCLI.ts:120-194`):
   - Line 121: `if (!this.methodSignatures.has(command))` → TRUE ❌
   - Line 122: Returns `{executed: false}` ❌
   - Falls through to line 112: `throw new Error("Unknown command")` ❌

**Why Direct Command Works:**

```bash
pdca-v0.3.5.2 getDualLink  # Creates NEW PDCACLI instance
```
- PDCA methods are in `this.component` (not `this.context`)
- Constructor calls `discoverMethods()` → finds all PDCA methods ✅
- Command execution: Line 181 uses `this.component` ✅

**Outcome (Expected Fix):**

After fix:
```bash
web4tscomponent on PDCA 0.3.5.2 getDualLink <file>  # ✅ Works!
```

**Next:**

1. Write black-box test (REPRODUCE bug)
2. Implement fix in `DefaultCLI.on()`
3. Update `discoverMethods()` to handle context
4. Verify test passes (GREEN)
5. Manual verification

---

## 🧪 **Test-First Development**

### **Test 1: Black-Box - Context Method Discovery**

**Location:** `components/Web4TSComponent/0.3.17.9/test/cli/context-method-discovery.test.ts`

**Test Case:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

describe('Context Method Discovery Bug', () => {
  const projectRoot = execSync('git rev-parse --show-toplevel', { 
    encoding: 'utf8' 
  }).trim();
  
  const web4Cmd = join(
    projectRoot, 
    'components/Web4TSComponent/0.3.17.8/web4tscomponent'
  );

  it('should discover getDualLink after on PDCA 0.3.5.2', () => {
    // ARRANGE: Load PDCA 0.3.5.2 context
    const result = execSync(
      `${web4Cmd} on PDCA 0.3.5.2 completion method`,
      { encoding: 'utf8', cwd: projectRoot }
    );

    // ACT & ASSERT: getDualLink should be in method completions
    expect(result).toContain('getDualLink');
  });

  it('should execute getDualLink after on PDCA 0.3.5.2', () => {
    // ARRANGE: Test file
    const testFile = 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md';
    
    // ACT: Execute getDualLink via context
    const result = execSync(
      `${web4Cmd} on PDCA 0.3.5.2 getDualLink ${testFile}`,
      { encoding: 'utf8', cwd: projectRoot }
    );

    // ASSERT: Should generate dual link
    expect(result).toContain('🔗 Generating Dual Link');
    expect(result).toContain('[GitHub]');
    expect(result).toContain('[§/');
  });
});
```

**Expected Result:** ❌ FAIL (reproduces bug)

---

## 🔧 **Implementation Plan**

### **Fix 1: Update `discoverMethods()` to Handle Context**

**File:** `components/Web4TSComponent/0.3.17.8/src/ts/layer2/DefaultCLI.ts`

**Location:** After line 722 (end of component discovery)

**Add:**
```typescript
// Also discover context methods if context instance is set (after on())
if (this.context) {
  const contextPrototype = Object.getPrototypeOf(this.context);
  const contextMethodNames = Object.getOwnPropertyNames(contextPrototype)
    .filter((name) => typeof contextPrototype[name] === "function")
    .filter((name) => !name.startsWith("_") && name !== "constructor")
    .filter(
      (name) =>
        !["init", "toScenario", "validateModel", "getModel"].includes(name)
    );

  for (const methodName of contextMethodNames) {
    const method = contextPrototype[methodName];
    // Context methods override component methods (context has higher priority)
    this.methodSignatures.set(methodName, {
      name: methodName,
      paramCount: method.length,
      isAsync: method.constructor.name === "AsyncFunction",
    });
  }
}
```

**Rationale:** Same pattern as component discovery, but for `this.context`

### **Fix 2: Re-discover Methods After `on()` Loads Context**

**File:** `components/Web4TSComponent/0.3.17.8/src/ts/layer2/DefaultCLI.ts`

**Location:** Line 255 (after setting `this.context`)

**Change:**
```typescript
// ✅ Store INSTANCE in CLI context (not component context!)
this.context = targetComponent;

// ✅ Re-discover methods to include context methods
this.discoverMethods();
```

**Rationale:** Context is loaded dynamically, must re-run discovery

---

## 🎯 **Execution Plan (QA Decision Point)**

**Option A: Minimal Fix (Fast)**
- Fix `on()` to call `discoverMethods()` after loading context
- Update `discoverMethods()` to discover context methods
- Write single black-box test
- Est: 30 minutes

**Option B: Comprehensive Fix (Thorough)**
- Fix A + white-box unit tests for `discoverMethods()`
- Test context method priority (context > component)
- Test multiple `on()` calls (context switching)
- Document context delegation architecture
- Est: 2 hours

**Option C: Radical Refactor (Perfectionist)**
- Extract method discovery into separate class
- Make discovery testable in isolation
- Add CMM3 verification checklist
- Create architecture diagram
- Est: 1 day

---

## 🤔 **STOP: User Decision Required**

**Question 1:** Which execution plan? (A/B/C)

**Question 2:** Should this be:
- **0.3.17.9** (new patch version) - Bug fix warrants new version
- **0.3.17.8** (in-place fix) - Fix in current version

**Question 3:** Test scope:
- **Black-box only** - Verify external behavior works
- **Black-box + white-box** - Also test internal discovery logic

**My Recommendation:**
- **Plan A** (minimal fix)
- **Version 0.3.17.9** (new patch - clean separation)
- **Black-box only** (CMM3 compliance - external behavior)

**Rationale:**
1. Small bug, simple fix
2. Black-box test demonstrates real-world usage
3. New version = clean PDCA trail
4. Can always add white-box tests later if needed

---

## 📊 **CMM3 Verification Checklist**

- [ ] Black-box test written FIRST
- [ ] Test FAILS (reproduces bug)
- [ ] Fix implemented in DefaultCLI
- [ ] Test PASSES (verifies fix)
- [ ] Manual verification with real command
- [ ] No regressions (existing tests pass)
- [ ] Code committed with PDCA reference
- [ ] Dual links verified

---

## 🔄 **DO** (Implementation)

*Waiting for user feedback on execution plan...*

---

## ✅ **CHECK** (Verification)

*After implementation...*

---

## 🎬 **ACT** (Next Steps)

*After verification...*

---

## 📝 **Notes**

### **CMM4 Learning Moment**

This bug demonstrates **whitebox understanding** (CMM4):

1. **Not just "it doesn't work"** (CMM1)
2. **Not just "context methods missing"** (CMM2)
3. **Exact execution path** (CMM3):
   - Constructor → discoverMethods() [no context yet]
   - on() → sets context [no re-discovery]
   - execute() → methodSignatures.has() [returns false]
   - Throws "Unknown command"

4. **Why it happens** (CMM4):
   - Timing: Discovery happens BEFORE context load
   - Design: No hook to re-discover after dynamic context change
   - Comparison: Direct command works because discovery happens AFTER component creation

**This is the feedback loop mastery** - understanding WHY enables precise fixes.

### **Radical OOP Principle**

The fix maintains Radical OOP:
- `this.methodSignatures` (model) stores discovered methods ✅
- `discoverMethods()` modifies `this.model` ✅
- `on()` triggers re-discovery via `this.discoverMethods()` ✅
- Zero parameters, all state in model ✅

---

**Status:** 🟡 PLAN - Awaiting user feedback on execution plan

