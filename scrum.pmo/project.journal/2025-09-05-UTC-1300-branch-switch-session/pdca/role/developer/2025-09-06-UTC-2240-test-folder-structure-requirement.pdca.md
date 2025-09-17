# **PDCA: Test Folder Structure Requirement v0.1.2.2**

**Date:** 2025-09-06-UTC-2240  
**Role:** Developer  
**Sprint:** Sprint 20  
**Session:** [dev/2025-09-05-UTC-1300-branch-switch-session](../../../2025-09-05-UTC-1300-branch-switch-session)  
**Component:** Web4 Architecture Standards  
**Task:** Global Test Folder Structure Requirement and Unit 0.3.0.4 Fix  

---

## **🎯 SUMMARY**

TRON identified incorrect test folder structure in Unit 0.3.0.4: test folder is child of src folder instead of sibling. Need to create global requirement v0.1.2.2 for correct test folder structure and fix Unit component immediately. Test folder must be next to src folder, not inside it.

### **TRON Feedback**
```quote
amazing…
i was reviewing components/Unit/0.3.0.4/src/test/unit.acceptance.test.ts in the mean time… the test folder has to be next to the src folder… not a child. make this a requirement with v0.1.2.2 globally and fix it now. pdca
```

### **My Answer (2025-09-06-UTC-2240)**
Creating global requirement v0.1.2.2 for test folder structure (test/ as sibling to src/, not child) and fixing Unit 0.3.0.4 component immediately. Test folder structure violation identified and will be corrected.

---

## **📋 PLAN**

### **Implementation Scope**
1. **Create Global Requirement:** Use Web4Requirement tool for v0.1.2.2 test folder structure
2. **Fix Unit Component:** Move test/ from src/test/ to test/ (sibling to src/)
3. **Update Import Paths:** Fix test file imports to reflect new structure
4. **Update Build Configuration:** Ensure tsconfig and package.json work with new structure
5. **Validate Fix:** Test that npm run build and npm test work correctly

### **Correct Structure**
```
components/Unit/0.3.0.4/
├── src/
│   └── ts/
│       ├── layer2/
│       ├── layer3/
│       └── layer5/
├── test/                    # ✅ CORRECT: Sibling to src/
│   └── unit.acceptance.test.ts
├── package.json
└── tsconfig.json
```

### **Current Incorrect Structure**
```
components/Unit/0.3.0.4/
├── src/
│   ├── test/               # ❌ INCORRECT: Child of src/
│   │   └── unit.acceptance.test.ts
│   └── ts/
├── package.json
└── tsconfig.json
```

---

## **🔧 DO**

### **Step 1: Create Global Requirement v0.1.2.2**

**✅ COMPLETE:** Global requirement created using Web4Requirement tool
```bash
components/Web4Requirement/0.1.2.2/requirement.sh create "Test Folder Structure Standard" "Test folders must be siblings to src folders, not children, for proper separation of concerns and build tool compatibility" "v0.1.2.2-test-folder-structure" "Web4TSComponent"
```

**Result:**
- ✅ **UUID:** 1bb60c85-0bf3-4217-b66e-ce9583757acb
- ✅ **Title:** Test Folder Structure Standard
- ✅ **Central Index:** `/workspace/scenarios/index/1/b/b/6/0/1bb60c85-0bf3-4217-b66e-ce9583757acb.scenario.json`
- ✅ **MD View:** `/workspace/spec/requirements.md/1bb60c85-0bf3-4217-b66e-ce9583757acb.requirement.md`

### **Step 2: Fix Unit Component Test Structure**

**✅ COMPLETE:** Moved test folder from `src/test/` to `test/` (sibling to src/)
```bash
cd components/Unit/0.3.0.4 && mv src/test test
```

**Structure Fixed:**
```
components/Unit/0.3.0.4/
├── src/                     # Source code
│   └── ts/
│       ├── layer2/
│       ├── layer3/
│       └── layer5/
├── test/                    # ✅ CORRECT: Sibling to src/
│   └── unit.acceptance.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### **Step 3: Update Import Paths**

**✅ COMPLETE:** Fixed test file imports to reflect new structure
```typescript
// BEFORE (incorrect)
import { DefaultUnit } from '../ts/layer2/DefaultUnit.js';
import { TypeM3 } from '../ts/layer3/UnitModel.interface.js';

// AFTER (correct)
import { DefaultUnit } from '../src/ts/layer2/DefaultUnit.js';
import { TypeM3 } from '../src/ts/layer3/UnitModel.interface.js';
```

### **Step 4: Update Vitest Configuration**

**✅ COMPLETE:** Updated vitest.config.ts to look for tests in correct location
```typescript
// BEFORE (incorrect)
include: ['src/test/**/*.test.ts'],

// AFTER (correct)
include: ['test/**/*.test.ts'],
```

### **Step 5: Validate Fix**

**✅ BUILD SUCCESS:** `npm run build` completed with no errors
**✅ TEST SUCCESS:** `npm run test:run` - All 11 tests passed
```bash
✓ test/unit.acceptance.test.ts (11 tests) 34ms
Test Files  1 passed (1)
Tests  11 passed (11)
Duration  270ms
```

---

## **✅ CHECK**

### **Global Requirement v0.1.2.2 Validation**

**✅ Requirement Created:** Test Folder Structure Standard established globally
**✅ CMM3 Compliance:** Used Web4Requirement tool (not manual creation)
**✅ Central Storage:** Requirement stored in scenarios/index/ with UUID
**✅ MD View Generated:** Auto-generated markdown view for documentation

### **Unit Component Fix Validation**

**✅ Structure Corrected:** test/ folder is now sibling to src/ (not child)
**✅ Imports Fixed:** Test files import from ../src/ path correctly
**✅ Build Compatibility:** TypeScript compilation works with new structure
**✅ Test Configuration:** Vitest finds and runs tests in new location
**✅ All Tests Pass:** 11/11 acceptance tests successful

### **Web4 Compliance Maintained**

**✅ TypeM3 Attribute:** MOF hierarchy classification preserved
**✅ Terminal Identity:** Unit terminal identity warnings still work
**✅ Central Storage:** LD links and scenario storage functional
**✅ Functionality:** All unit operations work correctly

---

## **🎬 ACT**

### **Global Requirement v0.1.2.2 Established**

**Test Folder Structure Standard:**
- **Requirement ID:** v0.1.2.2-test-folder-structure
- **UUID:** 1bb60c85-0bf3-4217-b66e-ce9583757acb
- **Standard:** Test folders must be siblings to src folders, not children
- **Rationale:** Proper separation of concerns and build tool compatibility
- **Scope:** Global Web4 architecture requirement

### **Unit Component Compliance Achieved**

**Before (Incorrect):**
```
components/Unit/0.3.0.4/
├── src/
│   ├── test/               # ❌ INCORRECT: Child of src/
│   │   └── unit.acceptance.test.ts
│   └── ts/
```

**After (Compliant):**
```
components/Unit/0.3.0.4/
├── src/                    # Source code only
│   └── ts/
├── test/                   # ✅ CORRECT: Sibling to src/
│   └── unit.acceptance.test.ts
```

### **Implementation Results**

**✅ Global Standard:** v0.1.2.2 test folder structure requirement created
**✅ Unit Compliance:** Unit 0.3.0.4 now follows correct test folder structure  
**✅ Build Success:** npm run build works correctly
**✅ Test Success:** All 11 acceptance tests pass
**✅ Zero Breaking Changes:** All functionality preserved

### **Traceability**
- **Requirement:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/1bb60c85-0bf3-4217-b66e-ce9583757acb.requirement.md) | [spec/requirements.md/1bb60c85-0bf3-4217-b66e-ce9583757acb.requirement.md](../../../../spec/requirements.md/1bb60c85-0bf3-4217-b66e-ce9583757acb.requirement.md)
- **Implementation:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2240-test-folder-structure-requirement.pdca.md) | [scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2240-test-folder-structure-requirement.pdca.md](scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2240-test-folder-structure-requirement.pdca.md)

### **Next Steps**
**Global Standard Applied:** Unit 0.3.0.4 now complies with v0.1.2.2 test folder structure requirement. Standard available for application across all Web4 components.