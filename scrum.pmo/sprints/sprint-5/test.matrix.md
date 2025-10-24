<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

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

### **SPECIFICATION QUESTIONS FOR USER:**

1. **Navigation Bounds**: Does `[down]5x` exceed valid navigation range?
   - Current TSRanger may only have 4 classes, making 5th [down] invalid
   - User assumption of equivalence may be incorrect

2. **User Equivalence Assumption**: Is `[down]5x` ≡ `g` actually correct?
   - If there are only 4 classes total, `[down]5x` = out of bounds
   - If `g` = filter to "g*" classes, totally different operation

3. **Implementation vs Expectation**: Which is wrong?
   - User expectation: `[down]5x` should work like `g`
   - Implementation: `[down]5x` produces empty result
   - Reality: May be specification misunderstanding

### **AMBIGUITY RESOLUTION NEEDED:**
**User must clarify**: Should `[down]5x` actually work, or is user assumption wrong about equivalence?

## **🚨 OTHER CRITICAL ISSUES**

1. **Filter Residue**: `g[tab][left]` shows "g:" incorrectly
2. **Navigation+Advancement**: `[down]5x[tab]` fails if `[down]5x` out of bounds
3. **State Management**: Navigation vs Filter states behave differently

**Root Cause**: Possible specification misunderstanding about navigation limits and filter equivalences.
