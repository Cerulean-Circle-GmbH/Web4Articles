[Back to Sprint 2 Planning](./planning.md)

# Task 7.2 — Tester: Scripted non-interactive coverage and contracts
[task:uuid:2f9f5b89-0c2a-4e9e-9b78-1c5f0b1d4a22]
[subtask:uuid:bb0e6a31-4dcb-4ee7-9d9c-5f3c4aef6c20]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Expand and harden the scripted test suite to guarantee non-interactive execution and assert prompt rendering contracts.

## Context
- Intermittent hangs occurred due to accidental interactive paths.
- Some tests asserted outputs from code not on the executed path.

## Intention
Ensure all behavior is verified through `tsranger test "<keys>"` with deterministic environment and explicit output contracts for cursor/caret.

## Steps
- Add guard tests that fail if interactive TTY setup is reached (e.g., environment flag `TSRANGER_TEST_MODE` required and verified in output trace).
- Introduce a small breadcrumb trace (env-guarded) `TRACE_EXEC_PATH=1` that prints `tsranger→TSRanger.run(test)→RangerController→RangerView` once, and assert it in tests.
- Extend cases: `t[tab]`, `t[right]`, `g[tab]c`, `g[right]c`, `g[tab][down]`, `g[tab][down][down]`, boundary backspaces.
- Extract a test helper `getPromptLine()` and `expectCursorAt()` with clear marker semantics.

## Requirements
- Tests must only spawn `src/sh/tsranger` with `test` mode.
- No interactive listeners; use environment to simulate TTY size (`COLUMNS`, `LINES`).

## Acceptance Criteria
- Running `npm test` passes on CI with `TSRANGER_SCENARIO=ci.vitest` (future) and never blocks.
- Trace line appears exactly once when `TRACE_EXEC_PATH=1` and not otherwise.
- All specified scripted sequences assert expected command line and filters.

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
