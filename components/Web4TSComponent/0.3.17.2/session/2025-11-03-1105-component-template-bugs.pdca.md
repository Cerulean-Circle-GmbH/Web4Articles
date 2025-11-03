# PDCA - Analysis of Broken IdealMinimalComponent Scaffolding

**Date:** 2025-11-03-1105 UTC  
**Component:** Web4TSComponent  
**Version:** 0.3.17.2  
**Agent:** Claude Sonnet 4.5  
**Session:** Component Template Generation Bug Analysis  
**Template:** v3.2.4.2

---

## 1. User Prompt (Verbatim)

```
@bash (24-43)  is broken. analye it with code quotes in a pdca before you fix it. explain what you have to fix to fix the generated component.
```

---

## 2. QA Decisions

All clear, no decisions to make.

User requested analysis before fix - following CMM3 analysis-first pattern.

---

## 3. PLAN - Error Analysis Objective

### 3.1 Objective

Analyze the 4 TypeScript compilation errors in the generated `IdealMinimalComponent` to identify root causes in the component scaffolding templates.

**Compilation Errors:**
```typescript
src/ts/layer2/DefaultCLI.ts(15,40): error TS2307: Cannot find module './DefaultWeb4TSComponent.js' or its corresponding type declarations.
src/ts/layer2/DefaultIdealMinimalComponent.ts(190,41): error TS2339: Property 'version' does not exist on type 'IdealMinimalComponentModel'.
src/ts/layer5/IdealMinimalComponentCLI.ts(12,14): error TS2415: Class 'IdealMinimalComponentCLI' incorrectly extends base class 'DefaultCLI'.
  Property 'component' is private in type 'IdealMinimalComponentCLI' but not in type 'DefaultCLI'.
src/ts/layer5/IdealMinimalComponentCLI.ts(49,11): error TS2353: Object literal may only specify known properties, and 'targetDirectory' does not exist in type 'IdealMinimalComponentModel'.
```

### 3.2 Analysis Plan

1. **Error 1**: Analyze wrong import in DefaultCLI template
2. **Error 2**: Analyze missing `version` property in Model interface
3. **Error 3**: Analyze visibility mismatch for `component` property
4. **Error 4**: Analyze missing `targetDirectory` in Model interface
5. Identify which templates need fixes
6. Document the fix strategy

---

## 4. DO - Error Analysis

### 4.1 Error 1: Wrong Import in DefaultCLI.ts

**File:** `components/IdealMinimalComponent/0.1.0.0/src/ts/layer2/DefaultCLI.ts`

**Line 15:**
```typescript
import { DefaultWeb4TSComponent } from "./DefaultWeb4TSComponent.js";
```

**Error:**
```
error TS2307: Cannot find module './DefaultWeb4TSComponent.js' or its corresponding type declarations.
```

**Root Cause:**
The `DefaultCLI.ts` template is trying to import `DefaultWeb4TSComponent` from the **current component's layer2** directory. This is WRONG because:
- `DefaultWeb4TSComponent` exists only in the `Web4TSComponent` component
- Generic components don't have `DefaultWeb4TSComponent.js` in their layer2 directory
- This import should use a **relative path to Web4TSComponent/latest** or be removed if not needed

**Template Location:** `templates/ts/DefaultCLI.ts.template`

**Fix Required:**
```typescript
// WRONG (current):
import { DefaultWeb4TSComponent } from "./DefaultWeb4TSComponent.js";

// CORRECT (should be):
import { DefaultWeb4TSComponent } from "../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js";
// OR: Remove if not used in generic components
```

---

### 4.2 Error 2: Missing `version` Property in Model

**File:** `components/IdealMinimalComponent/0.1.0.0/src/ts/layer2/DefaultIdealMinimalComponent.ts`

**Line 190:**
```typescript
// Get current version from model (DRY - already set in constructor)
const currentVersion = this.model.version;
```

**Error:**
```
error TS2339: Property 'version' does not exist on type 'IdealMinimalComponentModel'.
```

**Model Definition:** `src/ts/layer3/IdealMinimalComponentModel.interface.ts`
```typescript
export interface IdealMinimalComponentModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
  // ❌ MISSING: version, targetDirectory
}
```

**Root Cause:**
The `IdealMinimalComponentModel` interface template doesn't include the `version` and `targetDirectory` properties that are used in the implementation.

**Template Location:** `templates/ts/ComponentModel.interface.ts.template`

**Fix Required:**
```typescript
export interface IdealMinimalComponentModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
  version?: string;           // ✅ ADD: Component version
  targetDirectory?: string;   // ✅ ADD: Path authority
}
```

---

### 4.3 Error 3: `component` Property Visibility Mismatch

**File:** `components/IdealMinimalComponent/0.1.0.0/src/ts/layer5/IdealMinimalComponentCLI.ts`

**Line 12-13:**
```typescript
export class IdealMinimalComponentCLI extends DefaultCLI {
  private component: DefaultIdealMinimalComponent | null;
```

**Error:**
```
error TS2415: Class 'IdealMinimalComponentCLI' incorrectly extends base class 'DefaultCLI'.
  Property 'component' is private in type 'IdealMinimalComponentCLI' but not in type 'DefaultCLI'.
```

**Base Class:** `DefaultCLI` has:
```typescript
// In DefaultCLI (from Web4TSComponent)
protected component: Component | null;
```

**Root Cause:**
The CLI template declares `component` as `private`, but the base class `DefaultCLI` declares it as `protected`. TypeScript requires child classes to maintain or widen visibility, not narrow it.

**Template Location:** `templates/ts/ComponentCLI.ts.template`

**Fix Required:**
```typescript
// WRONG (current):
export class IdealMinimalComponentCLI extends DefaultCLI {
  private component: DefaultIdealMinimalComponent | null;

// CORRECT (should be):
export class IdealMinimalComponentCLI extends DefaultCLI {
  protected component: DefaultIdealMinimalComponent | null;
```

---

### 4.4 Error 4: `targetDirectory` Not in Model Interface

**File:** `components/IdealMinimalComponent/0.1.0.0/src/ts/layer5/IdealMinimalComponentCLI.ts`

**Line 49:**
```typescript
this.component = new DefaultIdealMinimalComponent().init({
  model: {
    targetDirectory: this.model.projectRoot // ❌ Error here
  }
}) as DefaultIdealMinimalComponent;
```

**Error:**
```
error TS2353: Object literal may only specify known properties, and 'targetDirectory' does not exist in type 'IdealMinimalComponentModel'.
```

**Root Cause:**
Same as Error 2 - the `IdealMinimalComponentModel` interface doesn't include the `targetDirectory` property that's being used in the CLI initialization.

**Fix Required:**
Same as Error 2 - add `targetDirectory?: string;` to the Model interface template.

---

## 5. CHECK - Template Files Requiring Fixes

### 5.1 Summary of Template Issues

| Error | Template File | Issue | Fix |
|-------|--------------|-------|-----|
| 1 | `DefaultCLI.ts.template` | Wrong import path for DefaultWeb4TSComponent | Use relative path to Web4TSComponent/latest |
| 2 | `ComponentModel.interface.ts.template` | Missing `version` property | Add `version?: string;` |
| 4 | `ComponentModel.interface.ts.template` | Missing `targetDirectory` property | Add `targetDirectory?: string;` |
| 3 | `ComponentCLI.ts.template` | `component` declared as `private` instead of `protected` | Change to `protected` |

### 5.2 Templates to Fix

**Priority 1 - Model Interface:**
- `templates/ts/ComponentModel.interface.ts.template`
  - Add `version?: string;`
  - Add `targetDirectory?: string;`

**Priority 2 - CLI Template:**
- `templates/ts/ComponentCLI.ts.template`
  - Change `private component` to `protected component`

**Priority 3 - DefaultCLI Template:**
- `templates/ts/DefaultCLI.ts.template`
  - Fix DefaultWeb4TSComponent import path OR remove if not needed in generic components

---

## 6. ACT - Fix Strategy

### 6.1 Implementation Order

1. ✅ **Fix Model interface template** - Add missing properties
2. ✅ **Fix CLI template** - Change component visibility
3. ✅ **Fix DefaultCLI template** - Correct import path
4. ✅ **Rebuild Web4TSComponent** - Generate fixed templates
5. ✅ **Remove broken IdealMinimalComponent** - Clean slate
6. ✅ **Recreate IdealMinimalComponent** - Test fixes
7. ✅ **Verify compilation** - Ensure all errors resolved

### 6.2 Root Cause Analysis

**Why did this happen?**

The component scaffolding templates in `Web4TSComponent/0.3.17.2/templates/ts/` contain hardcoded assumptions and bugs:

1. **Template copied from Web4TSComponent**: The `DefaultCLI.ts.template` has a self-referential import that works for Web4TSComponent but fails for other components
2. **Incomplete Model interface**: The Model template doesn't include optional properties that are used in the implementation
3. **Visibility mismatch**: The CLI template uses stricter visibility than the base class

**Prevention:**
- Templates should be tested by creating a real component after changes
- Templates should use placeholders for component-specific imports
- Model interface should include all commonly-used optional properties

---

## 7. Emotional Check

### 7.1 Flow State Assessment

- **Focus:** ✅ High - Clear compilation errors to analyze
- **Momentum:** ✅ Strong - Errors provide direct path to root causes
- **Clarity:** ✅ Excellent - Template bugs are now obvious
- **Confidence:** ✅ High - Fixes are straightforward

### 7.2 Quality Reflection

**What went well:**
- Proper analysis before fixing (CMM3 pattern)
- Clear identification of template vs generated code issues
- Systematic analysis of each error
- Understanding of root causes

**What could improve:**
- Component scaffolding should have automated tests
- Templates should be validated after changes
- Component creation should include a compilation check

---

## 8. Related Sessions

- `2025-11-03-1053.pdca.md` - Component source.env creation (test-first)
- `2025-10-30-UTC-1011.pdca.md` - Path Authority architecture
- `2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md` - Init requires targetDirectory

---

## 9. Footer

**42 Revelation:** The answer to "Why did the template break?" is "Because we didn't test it after changing it." - Testing prevents regression.

**Template Version:** 3.2.4.2  
**Compliance:** CMM3 ✅  
**Agent Evolution:** Analysis before action = Reproducible fixes

---

*This PDCA demonstrates CMM3 root cause analysis before implementing fixes, ensuring we understand the problem before changing code.*

