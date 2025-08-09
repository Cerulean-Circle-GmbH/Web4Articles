[Back to Planning](./planning.md) | [Back to Task 4](./task-4.md)

# Task 4.3 — Developer: Replace Preview grid column with Docs (selected element docstring)

[subtask:uuid:ab3c5d7e-8f90-4a12-b3c4-d5e6f7a8b9c0]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:3c9a7b42-8f1e-4f23-ae6d-9c5e0b7a12d3](./task-4.md)

## Goal
Render a new `Docs` column (4th column) that shows the documentation for the currently selected Class/Method/Param using `TSCompletion` doc APIs. Keep the bottom preview line and footer unchanged.

## Steps
1. Replace `Preview` column data with `Docs` in `RangerView`.
2. Add text wrapping for doc content within the column width.
3. Update `RangerController` to fetch docs when selection changes and store in model for view.

## Acceptance Criteria
- Changing selection updates the `Docs` column.
- No overflow; content wraps.
- Bottom preview and footer remain as in Task 2/3.

## QA Audit & User Feedback
- [ ] QA review pending.


