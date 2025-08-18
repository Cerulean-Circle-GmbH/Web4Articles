# 🧪 TSRanger Test Matrix - Simple to Complex Sequences

**Built from user feedback aggregated from PDCAs**  
**Date:** 2025-08-17-UTC-2055  
**Source:** User guidance: "build up the matrix at first from simple to longer sequences from the pdca user feedback"

## **📋 LEVEL 1: Navigation Foundation**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `[down]` | Shows class only, NO method | "multiple times should have no method in the prompt" | ✅ EXISTS |
| `[down][down]` | Shows class only, NO method | Same principle applied | ✅ EXISTS (in [down][down][tab] test) |
| `[down]5x` | Shows class only, NO method | User: navigation principle | ❌ FAILS - empty prompt |
| `g` | Shows class only, NO method | User: "alternative to [down]5x" | ✅ EXISTS |

## **📋 LEVEL 2: Basic Advancement**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `[tab]` | Shows class + method | "only on [tab] the method comes in" | ✅ EXISTS |
| `[right]` | Shows class + method | Should be identical to [tab] | ✅ EXISTS |

## **📋 LEVEL 3: Filter + Advancement**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `g[tab]` | GitScrumProject + method | "previously it prompted GitScrumProject [s]tart" | ✅ EXISTS |
| `g[right]` | GitScrumProject + method | Should be identical to g[tab] | ✅ EXISTS |

## **📋 LEVEL 4: Navigation + Advancement Equivalences**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `[down]5x[tab]` | GitScrumProject + method | "[down]5x[tab] does not add method. this is wrong" | ✅ EXISTS |
| `g[tab]` | GitScrumProject + method | User: "should behave the same" | ✅ EXISTS |

**🚨 BROKEN EQUIVALENCE**: `[down]5x[tab]` ≠ `g[tab]` (Level 4 validation failed)

## **📋 LEVEL 5: Retreat Operations**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `g[tab][left]` | GitScrumProject only (clean, no filter) | "[left] deletes filter correctly but prompt has 'g:' wrongly" | ✅ EXISTS |
| `[down]5x[tab][left]` | GitScrumProject only (clean, no filter) | Equivalent sequence | ❌ FAILS - empty prompt |
| `g[right][left]` | GitScrumProject only (clean, no filter) | DRY: should be identical to g[tab][left] | ✅ EXISTS |

## **📋 LEVEL 6: Complex Navigation Patterns**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `g[right][down][left]` | No filter should be set on class | "no filter should be set on class" | ✅ EXISTS |
| `g[right][down][right][left][tab]` | Should have method name and no filter | "should have a method name and no filter set" | ✅ EXISTS |
| `g[down][down][tab]` | Should NOT set any filter | "g[down]... setd filter, but it should not" | ✅ EXISTS |

## **📋 LEVEL 7: Multiple Operations**

| **Sequence** | **Expected Behavior** | **User Feedback Source** | **Test Case Status** |
|-------------|---------------------|-------------------------|-------------------|
| `g[tab][down]` | Shows Logger log after navigation | "only on g[tab][down]" works | ✅ EXISTS |
| `[down][up]` | Navigation should update prompt | "does not update the prompt anymore" | ✅ EXISTS |

## **📋 VALIDATION STATUS**

**✅ WORKING:**
- Level 1: `[down]`, `g` navigation foundation
- Level 2: `[tab]`, `[right]` basic advancement  
- Level 3: `g[tab]`, `g[right]` filter advancement

**❌ BROKEN:**
- Level 4: `[down]5x[tab]` ≠ `g[tab]` equivalence
- Level 5: `g[tab][left]` filter residue issue

**❓ TO CHECK:**
- `[down][down]` multiple navigation
- `[down]5x` navigation sequence
- `[down]5x[tab][left]` retreat equivalence

## **🎯 NEXT STEPS**

1. ✅ Verify all matrix entries have corresponding test cases
2. ❓ Test missing sequences (`[down][down]`, `[down]5x`)
3. 🔧 Fix broken equivalences (`[down]5x[tab]` advancement)
4. 🔍 Identify specification ambiguities
5. ✅ Complete matrix validation

## **🚨 CRITICAL SPECIFICATION AMBIGUITY FOUND**

### **MAJOR DISCOVERY: `[down]5x` COMPLETELY BROKEN**

**Test Results:**
- `[down]5x`: ❌ FAILS - produces empty prompt (no class shown)
- `[down]5x[tab][left]`: ❌ FAILS - produces empty prompt 
- `g`: ✅ WORKS - shows GitScrumProject

### **SPECIFICATION CLARIFIED BY USER:**

> **"only the one that ends up on GitScrumProject should work like the other. its based on the current test set of classes"**

**CORRECTED UNDERSTANDING:**
- Equivalence is **POSITIONAL**: Navigate to GitScrumProject vs Filter to GitScrumProject
- `[down]Nx` where N = however many steps to reach GitScrumProject
- `g` filter = direct selection of GitScrumProject
- These should behave identically because both result in GitScrumProject selected

### **🎯 USER CONFIRMED CORRECT MAPPING:**

**ACTUAL CLASS LIST FROM UI:** ✅ **CONFIRMED BY USER**
```
[Classes]
Logger         ← Start position
OOSH           ← [down]1 
ParameterParser ← [down]2
TSsh           ← [down]3  
DefaultCLI     ← [down]4
GitScrumProject ← [down]5  🎯 TARGET
RangerModel    ← [down]6
TestClass      ← [down]7
```

**🚨 REAL BUG IDENTIFIED:**
User's equivalence expectation is **100% CORRECT**:
- `[down]5` → **SHOULD** navigate to GitScrumProject (position 5)
- `g` → **DOES** filter to GitScrumProject ✅  
- These **SHOULD** behave identically: both land on GitScrumProject

**❌ NAVIGATION LOGIC BROKEN:**
`[down]5` produces empty output instead of reaching GitScrumProject at position 5.
The bug is in the navigation implementation, not user specification.

## **🚨 OTHER CRITICAL ISSUES**

1. **Filter Residue**: `g[tab][left]` shows "g:" incorrectly
2. **Navigation+Advancement**: `[down]5x[tab]` fails if `[down]5x` out of bounds
3. **State Management**: Navigation vs Filter states behave differently

**Root Cause**: Possible specification misunderstanding about navigation limits and filter equivalences.
