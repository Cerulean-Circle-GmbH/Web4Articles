[Back to Planning](./planning.md)

# Task 1.5 — Tester: E2E Keyboard Navigation and Execution Tests

[subtask:uuid:5e7f9012-d4e5-4f60-8123-4b5c6d7e8f90]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Goal
Verify TS Ranger supports navigation, filtering, preview correctness, and execution via DefaultCLI.

## Strategy
- Unit-test the model and filtering logic in isolation (non-TTY).
- Provide a smoke test for TTY rendering and quit path, skipped if `process.stdout.isTTY` is false.
- Where possible, simulate keypresses by writing to stdin of a child process and asserting on stdout snapshots.

## Cases
- Classes load contains `TSsh` and `GitScrumProject`.
- Selecting `GitScrumProject` → Methods include `create` and `createProject`.
- Selecting `create` → Params include `projectName`.
- Typing `project` in Params suggests `Web4Scrum` and selecting applies it to preview.
- Preview reflects `tssh GitScrumProject create Web4Scrum`.
- Executing the preview calls `GitScrumProject.create('Web4Scrum')` (mock side effects where needed).

## Acceptance Criteria
- Tests live under `test/tsranger.*.test.ts`.
- Non-TTY unit tests pass in CI.
- TTY smoke test is conditionally skipped without failing CI.

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic task for this sprint).