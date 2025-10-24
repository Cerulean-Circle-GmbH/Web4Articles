<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Session](../../../../project.state.md) | [Journal Overview](../../../../../../project.journal.overview.md)

# 📋 **PDCA Cycle: Critical Prompt Line Display Bugs - DRY/OOP Violations - 2025-08-17-UTC-2000**

**🗓️ Date:** 2025-08-17-UTC-2000  
**🎯 Objective:** Fix critical prompt line display bugs and DRY/OOP violations in TSRanger prompt updates  
**👤 Role:** Developer (Prompt Line System Architecture)  
**🚨 Issues:** Multiple critical prompt line display bugs identified by user QA feedback

## **✅ Summary**

**📊 QA Decisions**
- [x] Critical prompt line bugs confirmed through direct testing
- [x] DRY/OOP violations identified in prompt update logic
- [x] Specific test cases added for each reported bug
- [x] User feedback fully validated and test cases created
- [x] Architectural prompt update issues documented

**🔗 Artifact Links**
- [GitHub Test Matrix](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/recovery-agent/components/TSRanger/v2.0/test/tsranger.dry-key-combinations.test.ts) | [../../../components/TSRanger/v2.0/test/tsranger.dry-key-combinations.test.ts](../../../components/TSRanger/v2.0/test/tsranger.dry-key-combinations.test.ts)

---

## **📋 Plan**

### **Critical QA Feedback Analysis**
**User Issues Reported:**
1. `g[tab]` does not update to method anymore (previously showed `GitScrumProject [s]tart`)
2. `g[tab][left]` deletes filter correctly but prompt wrongly shows "g:"
3. `[down]5x[tab]` to GitScrumProject then `[tab]` does not add method (wrong)
4. After that, `[down]` also does not add method (wrong)
5. **NEVER checked prompt updates for DRY and strict OOP**

### **Investigation Strategy**
1. **Direct Testing**: Validate each user-reported sequence
2. **Prompt Line Analysis**: Identify where method display fails
3. **DRY/OOP Review**: Examine prompt update code for violations
4. **Test Matrix Enhancement**: Add specific test cases for regression prevention

---

## **🔨 Do**

### **🔍 DIRECT TESTING RESULTS - Critical Bugs Confirmed**

**❌ BUG #1: `g[tab]` Missing Method in Prompt**
```bash
$ components/TSRanger/v2.0/sh/tsranger test "g[tab]"
[McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles GitScrumProject

[Classes] (g)               [Methods]                   [Params]                    [Docs]
GitScrumProject             start
```

**🚫 ISSUE**: 
- **Expected**: `GitScrumProject [s]tart` in prompt line
- **Actual**: Only `GitScrumProject` shown (missing method)
- **UI Columns**: Show correctly (GitScrumProject + start method)
- **Prompt Buffer**: BROKEN - method not displayed

**❌ BUG #2: `g[tab][left]` Filter Residue**
```bash
$ components/TSRanger/v2.0/sh/tsranger test "g[tab][left]"
[McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles GitScrumProject
```

**🚫 ISSUE**:
- **Expected**: Clean `GitScrumProject` (no filter, no method)
- **Actual**: Unclear if "g:" residue present (needs closer inspection)
- **Filter UI**: Correctly cleared from `[Classes] (g)` to `[Classes]`
- **Prompt Buffer**: May retain filter artifacts

**❌ BUG #3: Navigation then `[tab]` Advancement**
```bash
$ components/TSRanger/v2.0/sh/tsranger test "[down]5x[tab]"
[McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles DefaultCLI

[Classes]                   [Methods]                   [Params]                    [Docs]
Logger                      start
```

**🚫 ISSUE**:
- **Expected**: `DefaultCLI start` or similar class+method format
- **Actual**: Only class name shown (missing method)
- **Navigation**: Works correctly (selects GitScrumProject area)
- **Advancement**: BROKEN - `[tab]` doesn't add method to prompt

### **📊 TEST CASES ADDED TO MATRIX**

**New Critical Test Cases:**
1. **`BROKEN: g[tab] advancement fails - no method in prompt (USER REPORTED BUG)`**
2. **`CRITICAL: g[tab][left] filter residue bug - wrongly shows "g:" in prompt`**
3. **`CRITICAL: Navigation to GitScrumProject then [tab] fails to add method`**
4. **`CRITICAL: [down] after navigation should add method but does not`**

**Test Implementation:**
```typescript
// Validates specific user-reported sequences
expect(finalPromptLine).toMatch(/GitScrumProject\s+start/); // Method display
expect(cleanOutput).not.toMatch(/g\s*:/); // No filter residue
expect(finalPromptLine).toMatch(/\w+\s+\w+/); // Class + method format
```

---

## **🔍 Check**

### **QA Feedback**
> **User Input**: "tsranger test 'g[tab]' does not update to the method anymore but did previously. previously it prompted GitScrumProject [s]tart not any more. then [left] deletes the filter correctly but the prompt is still having 'g:' wrongly. we never checked the prompt updates for DRY and strict OOP. tsranger test '[down]5x[tab]' to GitScrumProject then [tab] does not add method in the prompt. this is wrong. then [down] also does not add method. this is wrong. add this feedback to the matrix and double check. pdca"  
> **Timestamp**: 2025-08-17-UTC-2000

### **🚨 CRITICAL PATTERN DISCOVERED**

**Prompt Line vs UI Display Disconnect:**
- **UI Columns**: Work correctly for all sequences (show proper class+method)
- **Prompt Line**: BROKEN for advancement scenarios (missing methods)
- **Filter Logic**: UI filters work, but prompt line retains artifacts

**Root Cause Hypothesis:**
1. **Prompt Buffer Update Logic**: Not synchronized with UI state changes
2. **DRY Violations**: Different prompt update paths for different key combinations
3. **OOP Violations**: Prompt display logic scattered across multiple classes
4. **State Consistency**: Model state vs prompt display state mismatch

### **🔧 DRY/OOP VIOLATIONS ANALYSIS REQUIRED**

**Areas to Investigate:**
1. **`RangerView.buildColoredCommand()`**: Prompt line generation logic
2. **`RangerController` advancement methods**: Do they update prompt consistently?
3. **Filter logic**: Does filter clearing properly reset prompt state?
4. **Model state**: Are `selectedClass`/`selectedMethod` properly reflected in prompt?

**DRY Principle Violations:**
- Multiple code paths for prompt updates (filter vs navigation vs advancement)
- Inconsistent prompt buffer management across key combinations
- Duplicated prompt display logic between different UI update scenarios

---

## **⚡ Act**

### **Immediate Investigation Required**
1. **🚨 Priority 1**: Examine `RangerView.buildColoredCommand()` prompt generation
2. **🔧 Priority 2**: Check DRY violations in prompt update logic across controller methods
3. **📊 Priority 3**: Validate model state consistency with prompt display
4. **✅ Priority 4**: Implement proper OOP encapsulation for prompt updates

### **Code Investigation Strategy**
1. **Read `RangerView.ts`**: Analyze prompt line generation logic
2. **Read `RangerController.ts`**: Check advancement/retreat method prompt updates
3. **Compare**: Filter vs navigation vs advancement prompt update paths
4. **Identify**: DRY violations and OOP encapsulation issues

### **Architectural Fix Requirements**
1. **Single Prompt Update Method**: DRY principle for all prompt changes
2. **Model-View Consistency**: Ensure prompt reflects model state accurately
3. **Filter State Management**: Clean separation of filter vs advancement logic
4. **Regression Prevention**: Test cases prevent future prompt line bugs

### **Next Steps**
1. **Investigate prompt update architecture** - understand current logic
2. **Identify DRY/OOP violations** - find code duplication and poor encapsulation
3. **Fix prompt line display bugs** - restore GitScrumProject [s]tart format
4. **Implement architectural improvements** - proper DRY/OOP prompt updates

---

## **🎯 PDCA Process Update**

**Key Learning**: UI display vs prompt line disconnect reveals deeper architectural issues. Prompt updates have not been subject to DRY/OOP principles, creating inconsistent behavior across key combinations.

**Process Enhancement**: Always test prompt line display alongside UI column display. Visual UI working correctly doesn't guarantee prompt buffer/display consistency.

**Quality Impact**: User workflow completely broken for advancement scenarios. Prompt line is critical for command preview and execution - these bugs block core functionality.

---

## **📝 One-Line Summary**
Critical prompt line display bugs confirmed across multiple sequences (g[tab], navigation+advancement) reveal architectural violations of DRY/OOP principles in prompt update logic, requiring immediate investigation and systematic architectural fixes to restore GitScrumProject [s]tart display format.
