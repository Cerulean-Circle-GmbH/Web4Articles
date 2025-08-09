[Back to Planning](./planning.md)

# Task 1.4 — Developer: Command Execution Bridge to DefaultCLI

[subtask:uuid:4d6f8091-c3d4-4e5f-9012-3a4b5c6d7e8f]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:0e2f5b1a-3c7d-4f91-9ab2-7d3a6e8c5f90](./task-1.md)

## Goal
Execute the selected Class/Method/Params via the existing CLI machinery, preserving the positional-args-only contract.

## Steps
1. Build a command array: `[className, methodName, ...params]` from current model state.
2. Import the module dynamically as `DefaultCLI` does, or call `DefaultCLI` programmatically:
   - Try `../layer1/<Class>.ts`, fallback to `../layer2/<Class>.ts`.
   - Resolve class reference by name.
   - If method exists, call `ClassRef[methodName](...params)`; await if Promise.
   - Else, if `help()` exists, call it.
3. Handle errors with `Logger` and show a non-blocking toast/footer message in TUI.
4. Do not spawn subprocesses unless strictly necessary; prefer in-process calls for speed.

## Acceptance Criteria
- Pressing Enter on the Preview column executes the current command in-process.
- Errors are logged and shown in the footer; TUI remains responsive.
- No shell-style flags are introduced anywhere.

## QA Audit & User Feedback
- [ ] QA review pending.