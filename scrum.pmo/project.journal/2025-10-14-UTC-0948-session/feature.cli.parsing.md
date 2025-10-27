<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Feature: CLI Argument Parsing with Method Chaining

**Created:** 2025-10-21 UTC  
**Context:** "Simple" fix for `setCICDVersion` turned into deep CLI parsing discovery  
**Related PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/2025-10-21-UTC-0209.pdca.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/2025-10-21-UTC-0209.pdca.md](2025-10-21-UTC-0209.pdca.md)

---

## 🎯 The Problem

**User Request:** "Fix `setCICDVersion` to support context-optional pattern like `upgrade` and `tree`"

**Expected Behavior:**
```bash
web4tscomponent setCICDVersion test 0.3.13.3
# Should set the 'test' link to point to version 0.3.13.3
```

**Actual Behavior:**
```bash
❌ CLI Error: Invalid targetVersion: undefined. Must be one of: dev, latest, prod, test
🐛 DEBUG: { targetVersion: undefined, version: 'current', argsLength: 0 }
```

**The Mystery:** Why are NO arguments being passed to the method?

---

## 🔍 Investigation Journey

### Step 1: Initial Hypothesis (WRONG)
*"Must be ts-node caching from old compiled JavaScript"*

**Test:** Force complete rebuild with `rm -rf dist`  
**Result:** Still fails after clean rebuild  
**Conclusion:** Auto-build system works perfectly, not a caching issue ✅

### Step 2: Second Hypothesis (WRONG)
*"Must be testing wrong - maybe need to call it differently"*

**Test:** Call Node directly: `node dist/ts/layer5/Web4TSComponentCLI.js setCICDVersion test 0.3.13.3`  
**Result:** Still undefined  
**Conclusion:** Wrapper script passes arguments correctly, not a shell script issue ✅

### Step 3: Third Hypothesis (WRONG)
*"Maybe @cliValues annotation is missing parameter name"*

**Finding:** Line 4735 had `@cliValues dev latest prod test` without parameter name  
**Fix:** Changed to `@cliValues targetVersion dev latest prod test`  
**Test:** Still undefined after rebuild  
**Conclusion:** While this IS a bug, it's not THE bug causing arguments to disappear ⚠️

### Step 4: Discovery - TSCompletion Works
**Test:** Check what TSCompletion discovers
```bash
node -e "import('./dist/ts/layer4/TSCompletion.js').then(m => { 
  const params = m.TSCompletion.getEnhancedMethodParameters('DefaultWeb4TSComponent', 'setCICDVersion'); 
  console.log(JSON.stringify(params, null, 2)); 
})"
```

**Result:**
```json
[
  {
    "name": "targetVersion",
    "type": "string",
    "required": true,
    "description": "Semantic link to set: 'dev', 'latest', 'prod', 'test'",
    "default": null
  },
  {
    "name": "version",
    "type": "string",
    "required": false,
    "description": "Version to set for the link (default: current context version)",
    "default": "current"
  }
]
```

**Conclusion:** TSCompletion correctly discovers 2 parameters ✅

### Step 5: Debug at Method Level
**Added:** `console.log('🐛 DEBUG setCICDVersion called with:', { targetVersion, version, argsLength: arguments.length });`

**Result:**
```
🐛 DEBUG setCICDVersion called with: { targetVersion: undefined, version: 'current', argsLength: 0 }
```

**KEY FINDING:** `argsLength: 0` - The method is being called with ZERO arguments!

---

## 💡 Root Cause Discovery

### The CLI Routing Code

**File:** `components/Web4TSComponent/0.3.13.2/src/ts/layer5/Web4TSComponentCLI.ts`

```typescript:130:157
// Intelligently determine how many arguments this method consumes
const consumedArgs = this.determineArgumentConsumption(command, args);
const methodArgs = args.slice(0, consumedArgs);
const remainingArgs = args.slice(consumedArgs);

// Execute the method
const componentInstance = this.getOrCreateTSComponent();
const method = (componentInstance as any)[command];

if (signature.isAsync) {
  await method.apply(componentInstance, methodArgs);
} else {
  method.apply(componentInstance, methodArgs);
}
```

**Key Insight:** If `determineArgumentConsumption` returns 0, then `methodArgs` will be empty!

### The determineArgumentConsumption Logic

```typescript:164:189
private determineArgumentConsumption(command: string, args: string[]): number {
  const signature = this.methodSignatures.get(command)!;
  
  // Special handling for methods that MUST consume all their args
  if (command === 'completeParameter' || command === 'completion') {
    const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
    return methodSpecificMaxArgs !== null ? Math.min(methodSpecificMaxArgs, args.length) : args.length;
  }
  
  // Get max args from TypeScript signature (handles optional parameters)
  const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
  const maxArgs = methodSpecificMaxArgs !== null ? methodSpecificMaxArgs : signature.paramCount;
  
  // ALWAYS check for next command to enable chaining
  // Stop consuming args when we encounter a known method name
  for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
    if (this.methodSignatures.has(args[i])) {
      // Found next command, consume up to this point
      return i;
    }
  }
  
  // No next command found, consume up to method's parameter count
  return Math.min(maxArgs, args.length);
}
```

**Line 182 is THE SMOKING GUN:**
```typescript
if (this.methodSignatures.has(args[i])) {
  return i;
}
```

### The Conflict

**Command:** `web4tscomponent setCICDVersion test 0.3.13.3`

**What happens:**
1. `command = "setCICDVersion"`
2. `args = ["test", "0.3.13.3"]`
3. Loop starts: `i = 0`, checking `args[0] = "test"`
4. `this.methodSignatures.has("test")` returns `true` (there IS a `test` method!)
5. **Returns `i = 0`** (consume ZERO arguments)
6. `methodArgs = args.slice(0, 0) = []` (empty array)
7. Method called with NO arguments: `setCICDVersion()`

**Verification:**
```bash
$ web4tscomponent | grep "^  web4tscomponent test"
  web4tscomponent test <?scope:'all'> <references>
    Execute test command - runs tests WITHOUT promotion
```

YES! There IS a `test` method in the CLI!

---

## 🏗️ Architecture Analysis

### The Method Chaining Design

**Intent:** Enable commands like:
```bash
web4tscomponent on Component 0.1.0.0 tree links upgrade nextPatch
```

**Mechanism:** Parse arguments until hitting a known method name, then start chaining.

**Example:**
```bash
web4tscomponent on Component 0.1.0.0 tree
                └─┬─┘ └───┬───┘ └─┬──┘ └┬┘
                  │       │       │      └─ Next method (chain)
                  │       └───┬───┘
                  │           └─ Arguments for 'on'
                  └─ First method
```

### The Collision Problem

**When parameter values match method names:**

| Method | Parameter | Value | Collision |
|--------|-----------|-------|-----------|
| `setCICDVersion` | `targetVersion` | `"test"` | ✅ YES - conflicts with `test()` method |
| `setCICDVersion` | `targetVersion` | `"dev"` | ❓ Need to check if `dev()` exists |
| `setCICDVersion` | `targetVersion` | `"prod"` | ❓ Need to check if `prod()` exists |
| `setCICDVersion` | `targetVersion` | `"latest"` | ❓ Need to check if `latest()` exists |

**Check all semantic links:**
```bash
$ web4tscomponent | grep -E "^  web4tscomponent (dev|test|prod|latest) "
  web4tscomponent test <?scope:'all'> <references>
```

Only `test` conflicts currently, but the design is fragile!

---

## 🎯 The Real Solution Needed

### Current Logic (WRONG for this case)
```typescript
for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
  if (this.methodSignatures.has(args[i])) {
    return i;  // ❌ Immediately assumes it's a method chain
  }
}
```

### Correct Logic (respecting @cliValues)
```typescript
for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
  // FIRST: Check if this argument is a valid value for its parameter position
  const paramInfo = getParameterInfo(command, i);
  if (paramInfo && paramInfo.cliValues && paramInfo.cliValues.includes(args[i])) {
    // Valid parameter value - continue consuming
    continue;
  }
  
  // THEN: Check if it's a method name (chaining)
  if (this.methodSignatures.has(args[i])) {
    return i;  // Found next command in chain
  }
}
```

**Priority Order:**
1. **Valid @cliValues** (parameter value) - CONSUME
2. **Method name** (chaining) - STOP
3. **Neither** - CONSUME (as arbitrary string parameter)

---

## 📊 Similar Patterns in Other Methods

### Methods with Enum-like Parameters

**Potential conflicts to check:**

```typescript
// From method signatures:
create(component: string, version: string = '0.1.0.0', features: string = 'all')
// features: 'all', 'cli', 'spec', 'vitest', 'layers'
// Could 'cli' conflict with future cli() method?

test(scope: string = 'all', references: string)
// scope: 'all'
// Already checked - no 'all' method exists

setCICDVersion(targetVersion: string, version: string = 'current')
// targetVersion: 'dev', 'latest', 'prod', 'test'
// ✅ CONFIRMED: 'test' conflicts!
```

---

## 🧪 Test Cases Needed

### Case 1: Parameter Value = Method Name
```bash
web4tscomponent setCICDVersion test 0.3.13.3
# Expected: Set test link to 0.3.13.3
# Actual: Error (consumes 0 args, thinks 'test' is method chain)
```

### Case 2: Parameter Value ≠ Method Name
```bash
web4tscomponent setCICDVersion latest 0.3.13.3
# Expected: Set latest link to 0.3.13.3
# Actual: ??? (need to test after checking if 'latest' method exists)
```

### Case 3: Legitimate Chaining
```bash
web4tscomponent setCICDVersion dev 0.3.13.2 tree
# Expected: Set dev link, then show tree
# Must still work after fix!
```

### Case 4: Ambiguous Case
```bash
# If we had a method called 'latest':
web4tscomponent setCICDVersion latest latest
# First 'latest' = targetVersion parameter value
# Second 'latest' = version parameter value
# Neither should trigger chaining!
```

---

## 🔧 Implementation Requirements

### 1. Enhance TSCompletion to Extract @cliValues

**Current:** TSCompletion extracts parameter names, types, defaults  
**Needed:** Also extract `@cliValues` annotations

```typescript
interface ParameterInfo {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  cliValues?: string[];  // ← ADD THIS
}
```

### 2. Pass @cliValues to determineArgumentConsumption

**Current:** Only uses `getMethodMaxArguments(command)`  
**Needed:** Full parameter info for each position

```typescript
private determineArgumentConsumption(command: string, args: string[]): number {
  // Get FULL parameter info, not just count
  const params = TSCompletion.getEnhancedMethodParameters('DefaultWeb4TSComponent', command);
  
  for (let i = 0; i < Math.min(params.length, args.length); i++) {
    const param = params[i];
    const argValue = args[i];
    
    // Priority 1: Check @cliValues
    if (param.cliValues && param.cliValues.includes(argValue)) {
      continue;  // Valid value, keep consuming
    }
    
    // Priority 2: Check method chaining
    if (this.methodSignatures.has(argValue)) {
      return i;  // Next command found
    }
    
    // Priority 3: Arbitrary string - keep consuming
  }
  
  return Math.min(params.length, args.length);
}
```

### 3. Update @cliValues Parser in TSCompletion

**File:** `components/Web4TSComponent/0.3.13.2/src/ts/layer4/TSCompletion.ts`

**Current behavior:** Reads JSDoc but doesn't extract `@cliValues`  
**Needed:** Parse `@cliValues paramName value1 value2 value3` format

**Example annotation:**
```typescript
/**
 * @cliValues targetVersion dev latest prod test
 * @cliValues scope all cli spec vitest layers
 */
```

**Expected structure:**
```javascript
{
  "targetVersion": ["dev", "latest", "prod", "test"],
  "scope": ["all", "cli", "spec", "vitest", "layers"]
}
```

---

## 📝 Lessons Learned

### 1. "Simple" Fixes Can Reveal Deep Issues
**Started with:** "Just make setCICDVersion context-optional like upgrade"  
**Ended with:** Fundamental CLI parsing ambiguity between parameter values and method names

### 2. Auto-Build System Works Perfectly
User was RIGHT to challenge the caching hypothesis. The component auto-rebuild system is solid.

### 3. Debug Output is King
Adding `console.log` with `arguments.length` immediately revealed the real problem (0 args).

### 4. Method Chaining Creates Namespace Pollution
Every method name becomes a "reserved word" that can conflict with parameter values.

### 5. Priority Ordering is Critical
When multiple interpretations are possible:
- Parameter value (constrained by @cliValues)
- Method name (chaining)
- Arbitrary string (no constraints)

The MOST SPECIFIC interpretation should win first!

### 6. Test What You Assume
Never assumed `test` was a method name - it seemed like just a semantic link value. Wrong!

---

## 🎓 Web4 Patterns Demonstrated

### DRY Principle
- Shared `node_modules` via symlinks
- Single source of truth for version (directory name)
- Auto-discovery of methods (no hardcoded routing)

### CMM4 Feedback Loop
- Hit a wall → Debug → Understand deeper → Fix root cause
- Each hypothesis tested systematically
- Evidence-based conclusions (not assumptions)

### OOSH (Object-Oriented Shell)
- Methods as first-class shell commands
- Method chaining as shell piping alternative
- But collision between OOP methods and shell argument values!

---

## 🚀 Next Steps

### Immediate Fix Needed
1. Extract `@cliValues` in TSCompletion
2. Modify `determineArgumentConsumption` to check values first
3. Test all semantic link values (dev, test, prod, latest)
4. Ensure legitimate chaining still works

### Long-term Improvements
1. Consider namespace prefixing for semantic commands (`_dev`, `_test`)
2. Add CLI ambiguity warnings at method discovery time
3. Document this pattern for future component developers
4. Consider making @cliValues MANDATORY for enum-like parameters

### Documentation
1. Update Web4TSComponent README with this case study
2. Add to component standards: "Avoid method names matching common string values"
3. Create test suite for CLI parsing edge cases

---

## 🔗 Related Documents

- **Completion Flow:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.completion.analysis.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.completion.analysis.md](feature.completion.analysis.md)
- **Method Chaining Fix (P99):** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/2025-10-18-UTC-2300.pdca.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/2025-10-18-UTC-2300.pdca.md](2025-10-18-UTC-2300.pdca.md)
- **Feature Gap Analysis:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature-gap-analysis-table.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature-gap-analysis-table.md](feature-gap-analysis-table.md)

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨

