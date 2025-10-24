<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# PDCA - TSRanger Prompt Line Navigation Inconsistency Discovery
[Back to Session](../../../../project.state.md) | [Journal Overview](../../../../../../project.journal.overview.md)

**Date**: 2025-08-17 UTC 12:46  
**Objective**: Document critical inconsistency in prompt line behavior between filter mode and navigation mode  
**Role**: ScrumMaster (UX Analysis & Technical Investigation)  
**Issues**: Prompt line updates inconsistently when GitScrumProject is selected via different methods

---

## **📝 Summary**

### **Artifact Links**
- [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/feature/recovery-agent/scrum.pmo/roles/ScrumMaster/PDCA/2025-08-17-UTC-1246-prompt-line-navigation-inconsistency.md) | [./2025-08-17-UTC-1246-prompt-line-navigation-inconsistency.md](./2025-08-17-UTC-1246-prompt-line-navigation-inconsistency.md)

### **QA Decisions**
- [x] Inconsistency confirmed with both test methods
- [x] Root cause identified in prompt line update logic
- [ ] Fix implementation strategy defined
- [ ] UX consistency requirement updated

---

## **📋 Plan**

### **Investigation Strategy**
1. **Test Filter Mode**: Use `tsranger test "g"` to reach GitScrumProject via typing
2. **Test Navigation Mode**: Use `tsranger test "[down][down][down][down][down]"` to reach GitScrumProject via arrow keys
3. **Compare Prompt Line Behavior**: Analyze how prompt line displays selected class in each mode
4. **Document Inconsistency**: Record findings and impact on UX

### **Expected Behavior**
- **Consistent Prompt Updates**: Prompt line should show selected class regardless of selection method
- **Clear Visual Feedback**: User should always know which class is currently selected
- **Navigation Parity**: Filter mode and arrow navigation should behave identically

---

## **⚙️ Do**

### **Test Results: Filter Mode ("g")**
```
Command: components/TSRanger/v2.0/sh/tsranger test "g"
Result Prompt Line: [McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles GitScrumProject
Status: ✅ SHOWS GitScrumProject in prompt line
```

### **Test Results: Navigation Mode ("[down]x5")**
```
Command: components/TSRanger/v2.0/sh/tsranger test "[down][down][down][down][down]"
Result Prompt Line: [McDonges-3.fritz.box] donges@/Users/Shared/Workspaces/2cuGitHub/Web4Articles
Status: ❌ MISSING GitScrumProject in prompt line
```

### **Critical Discovery**
**🚨 INCONSISTENT BEHAVIOR IDENTIFIED:**
- **Filter Mode**: Prompt line correctly appends selected class (`GitScrumProject`)
- **Navigation Mode**: Prompt line does NOT append selected class
- **Impact**: User confusion about which class is actually selected

---

## **✅ Check**

### **QA Feedback**
> "compare tsranger test 'g' and tsranger test '[donw]...' as long at is also on GitScrumProject. the prompt line must update the same way."
*Timestamp: 2025-08-17 UTC 12:46*

### **Verification Results**
- ❌ **Consistency Test Failed**: Prompt line behavior differs between selection methods
- ✅ **Both Reach Target**: Both methods successfully select GitScrumProject 
- ❌ **Visual Feedback Inconsistent**: Only filter mode provides prompt line feedback
- ✅ **Navigation Works**: Arrow key navigation functions correctly

### **Root Cause Analysis**
**Location**: `components/TSRanger/v2.0/src/ts/layer5/RangerView.ts`
**Issue**: `buildColoredCommand()` method likely only updates prompt line for filter/typing scenarios, not for navigation selection changes

---

## **🚀 Act**

### **Required Changes**
1. **Prompt Line Logic Fix**: Update `buildColoredCommand()` to show selected class for both filter and navigation modes
2. **Consistent UX**: Ensure prompt line always reflects currently selected class
3. **Testing**: Verify both selection methods produce identical prompt line display

### **Implementation Strategy**
```typescript
// Current (Filter Mode Only):
if (tokenIdx === 0 && prefix && suggestion.startsWith(prefix)) {
  display = suggestion + ...
}

// Required (Both Modes):
// Always show selected class when no filter is active
if (model.selectedClass && !hasActiveFilter) {
  display = model.selectedClass + ...
}
```

### **Action Items**
- [ ] **Code Investigation**: Analyze `buildColoredCommand()` method implementation
- [ ] **Fix Implementation**: Update prompt line logic for navigation consistency
- [ ] **Test Verification**: Confirm both selection methods show identical prompt behavior
- [ ] **Requirements Update**: Add UX consistency requirement to Sprint 5

### **PDCA Process Update**
- **Plan**: ✅ Investigation strategy executed with parallel testing
- **Do**: ✅ Both test methods completed, inconsistency reproduced
- **Check**: ✅ Critical UX inconsistency confirmed and documented
- **Act**: ⏳ Fix implementation and requirements update pending

---

## **💡 Critical UX inconsistency discovered: Prompt line behavior differs between filter and navigation selection methods! 🔧**
