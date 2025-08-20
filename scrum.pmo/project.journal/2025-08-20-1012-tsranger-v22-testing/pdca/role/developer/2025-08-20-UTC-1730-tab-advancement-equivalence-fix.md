# PDCA: Tab Advancement Equivalence Fix

**Previous PDCA:** [2025-08-20-UTC-1620-false-negative-test-elimination-critical-lesson.md]  
**Commit SHA:** 3b4ee83  
**Cross-Reference:** [TSRanger v2.2 Tab Advancement Bug](../../../../../components/TSRanger/v2.2/test/comprehensive-testing-matrix.md#REQ-FLT-ADV-001)

## Plan
### Problem Statement
**CRITICAL BUG CONFIRMED:** Tab advancement inconsistency between filter and navigation approaches:
- ✅ `g[tab][down][down]` works perfectly 
- ❌ `[down]×5[tab][down][down]` does NOT work identically

### Root Cause Analysis
The `selectedClass` getter depends on both `filteredClasses()` and `selectedIndexPerColumn[0]`:
```typescript
get selectedClass(): string | undefined {
  return this.filteredClasses()[this.selectedIndexPerColumn[0]];
}
```

**Issue:** When navigating via `[down]` keys, filter state may be inconsistent, causing `filteredClasses()` to return different results than expected, making `selectedClass` unreliable.

### Solution Strategy
Implement debug logging to identify exact filter state discrepancies, then fix tab advancement to work consistently regardless of how the class was reached.

## Do
### Implementation
Add temporary debug logging to `handleTabRightAdvancement()` to capture filter state and selectedClass values.

## Check
Run both sequences and compare debug output:
- `g[tab][down][down]` 
- `[down]×5[tab][down][down]`

## Act
Fix the identified inconsistency based on debug findings.
