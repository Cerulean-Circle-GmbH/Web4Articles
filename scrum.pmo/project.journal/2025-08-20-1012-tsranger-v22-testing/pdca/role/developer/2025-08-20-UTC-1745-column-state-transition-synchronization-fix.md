# PDCA: Column State Transition Synchronization Fix

**📎 Previous Commit:** 679f8ff - success: systematic test validation complete  
**🔗 Previous PDCA:** [2025-08-20-UTC-1730-tab-advancement-equivalence-fix.md](../2025-08-20-UTC-1730-tab-advancement-equivalence-fix.md) | [../2025-08-20-UTC-1730-tab-advancement-equivalence-fix.md](../2025-08-20-UTC-1730-tab-advancement-equivalence-fix.md)

## Summary

**Artifact Links:** TSRanger v2.2 Column State Bug Fix  
**QA Decisions:**  
- [x] **CONFIRMED:** Column state transition synchronization bug identified  
- [x] **USER INSIGHT VALIDATED:** Not "filter clearing" - column filtering context mismatch
- [ ] Fix column transitions to sync filtering context properly
- [ ] Fix 3 legitimate bugs: DRY retreat violations + column state transitions

---

## Plan

### Problem Statement  
**CRITICAL DISCOVERY:** Column state transitions are broken. The issue is NOT "filter clearing" but **filtering context synchronization**:

```
g[right] sequence:
- Expected: [Methods] (g) - filtering context switches to methods
- Actual:   [Classes] (g) - filtering context stuck on classes  
```

### Root Cause Analysis
The `selectedColumn` property changes during column transitions, but the **filtering context** doesn't switch accordingly:

1. **Classes Column:** `g` should filter class names  
2. **Methods Column:** typing should filter method names
3. **Back to Classes:** typing should filter class names again

**Current Bug:** When advancing from Classes → Methods, the filtering context stays on classes instead of switching to methods.

### Implementation Strategy
1. **Fix Column Transition Logic:** Remove inappropriate `clearClassFilter()` calls
2. **Add Filtering Context Switching:** Ensure prompt buffer and filtering context sync with `selectedColumn`  
3. **Fix DRY Retreat Violations:** Ensure `[left]` and `[ShiftTab]` behave identically

---

## Do

### Column State Transition Fix

```bash
# Fix the column transition synchronization
cd /Users/Shared/Workspaces/2cuGitHub/Web4Articles
```

The bug is in the `changeColumn()` and left key handling - they call `clearClassFilter()` when they should preserve filter state and switch context.

**Implementing systematic fix for all 3 legitimate bugs...**

---

## Check  

### QA Feedback
User provided critical insight: "basically the cases g[right][down][left], g[right] are testing the switch between the columns. after g[tab] we are in the method column and filter and type methods. on g[right][down][left] we are back to the classes column and filter classes. so it more a state and a model switch"

**✅ USER WAS ABSOLUTELY CORRECT** - This is about column state transitions, not filter clearing.

### Evidence Gathered
- **g[right]**: Shows `[Classes] (g)` instead of `[Methods] (g)` ❌
- **Column Focus**: Changes correctly to Methods column ✅  
- **Filtering Context**: Stuck on Classes context ❌
- **Expected Behavior**: Filtering context should switch with column focus ✅

---

## Act

### Next Steps
1. Remove inappropriate `clearClassFilter()` calls from column transitions
2. Add proper filtering context switching logic  
3. Fix DRY retreat violations for `[left]` vs `[ShiftTab]`
4. Validate all fixes with the 3 legitimate tests

**Proceeding to implement the column state synchronization fix...**
