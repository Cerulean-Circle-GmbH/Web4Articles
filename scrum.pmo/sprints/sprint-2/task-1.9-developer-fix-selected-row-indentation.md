[Back to Planning](./planning.md)

# Task 1.9: Developer — Fix selected row indentation across columns in TSRanger

[requirement:uuid:a2f4c3d0-9b8a-4f1e-8c3b-5e7a2f9d6c1b](./requiremnents.md)

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
The selected row in each column is misaligned (indentation off). The output shows the selected item overwriting the column title area (e.g., `GitScrumProjectoverlayRun`). Fix rendering so the selected item always aligns in its column width, with proper spacing before/after.

## Context
See `requiremnents.md` example and compare desired vs actual. Reproduce with scripted test mode.

## Intention
Ensure consistent column rendering: header row, then items, with selection highlighting not affecting alignment or adjacent columns.

## Steps
- Reproduce with: `src/sh/tsranger test "[down][down][right][tab]abc[left][q]"` and
  `src/sh/tsranger test "[down][down][down][down][down]"`
- Adjust `RangerView` to pad items within `colWidth`, and ensure selection styling does not remove spacing.
- Verify each column's selected row keeps its column boundary and spacing.

## Requirements
- Selected item must never spill into adjacent column labels.
- Selection inverse/bold/color must not change the visible width.

## Acceptance Criteria
- The provided sequences render exactly as shown in the desired example in `requiremnents.md`.
- No truncation or overlap in any of the 4 columns when selected row changes.
- Scripted test mode runs and exits leaving the final screen state intact.

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic subtask for this sprint).

