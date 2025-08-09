[Back to Planning](./planning.md)

# Task 1.2 — Developer: Interactive TUI (Core Navigation)

[subtask:uuid:2b4d6f80-a1b2-4c3d-9e0f-1a2b3c4d5e6f]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:0e2f5b1a-3c7d-4f91-9ab2-7d3a6e8c5f90](./task-1.md)

## Goal
Implement the core TUI for TS Ranger with keyboard navigation and column rendering.

## Steps
1. Create `src/ts/layer4/TSRanger.ts` exporting `class TSRanger` with `static start()`; it wires controller/model/view.
2. Implement `RangerModel` in the same file (or split later) to hold:
   - `classes`, `methods`, `params`
   - `selectedColumn`, `selectedIndexPerColumn`
   - `filters` per column, and derived filtered lists
3. Implement `RangerView` minimal terminal renderer using ANSI:
   - Clear screen, draw four columns, highlight selection
   - Render footer with key help and preview command
4. Implement `RangerController`:
   - Read raw key input from `process.stdin`
   - Map arrows, enter, letters, backspace, esc/q
   - Update model, refresh view
5. Initialize lists from `TSCompletion` and refresh on selection/filter changes.
6. Keep rendering decoupled and pure (stateless functions where possible).

## Constraints
- ESM only; no external TUI deps.
- No options-style flags; positional args only for execution.
- Keep file under 400 SLOC initially; split if needed.

## Acceptance Criteria
- Binary starts with `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`.
- Four columns render; navigation and filtering work as specified.
- Preview updates as selection/params change.
- Exits cleanly on `q`/`Esc` without leaving terminal in raw mode.

## QA Audit & User Feedback
- [ ] QA review pending.