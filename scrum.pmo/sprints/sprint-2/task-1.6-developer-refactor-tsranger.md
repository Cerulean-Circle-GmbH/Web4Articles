[Back to Planning](./planning.md)

# Task 1.6: Developer - Refactor TSRanger to one class per TS file

## Status
- [ ] Planned
- [ ] In Progress
  - [x] implementing
  - [x] testing
- [ ] QA Review
- [x] Done

## Goal
Refactor `src/ts/layer4/TSRanger.ts` by extracting `RangerModel`, `RangerView`, and `RangerController` into their own files, preserving all current functionality and CLI behavior.

## Rationale
Align with project first principles: Separation of Concerns and Radical OOP. Each unit/class must live in its own file.

## Deliverables
- `src/ts/layer4/RangerModel.ts`
- `src/ts/layer4/RangerView.ts`
- `src/ts/layer4/RangerController.ts`
- Updated `src/ts/layer4/TSRanger.ts` to import and wire the above classes

## Acceptance Criteria
- All automated tests pass (`npm test`).
- No change in TSRanger behavior, input handling, or rendering.
- No global functions introduced; all logic remains inside classes.
- CLI entrypoint `TSRanger.start()` still works when invoked directly.
- Imports are ESM-compliant with explicit `.ts` extensions.

## Implementation Notes
- Move the exact implementations of Model/View/Controller from `TSRanger.ts` into their own files with `export`ed classes.
- Keep logging and `TSCompletion` usage intact in the controller.
- Ensure relative import paths remain correct from `layer4`.

## Definition of Done
- Code compiles and tests pass.
- New files committed and planning updated in `scrum.pmo/sprints/sprint-2/planning.md`.
- Brief note added to `recovery.md` summarizing the change.

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic task for this sprint).