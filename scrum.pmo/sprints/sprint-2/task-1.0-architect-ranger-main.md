[Back to Planning](./planning.md)

# Task 1 — Architect: TS Ranger Shell Specification

[task:uuid:0e2f5b1a-3c7d-4f91-9ab2-7d3a6e8c5f90]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing
  - [x] testing
- [x] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:d4e5f6a7-b8c9-0123-4567-890abcdef012](../sprint-0/requiremnents.md)
- down
  - [Task 1.1 — Architect: TS Ranger Shell Specification (role-specific)](./task-1.1-architect-ranger-spec.md)
  - [Task 1.2 — Developer: Interactive TUI (Core Navigation)](./task-1.2-developer-ranger-tui.md)
  - [Task 1.3 — Developer: Integrate TSCompletion for Live Suggestions](./task-1.3-developer-completion-integration.md)
  - [Task 1.4 — Developer: Command Execution Bridge to DefaultCLI](./task-1.4-developer-execution-bridge.md)
  - [Task 1.5 — Tester: E2E Keyboard Navigation and Execution Tests](./task-1.5-tester-e2e-tests.md)
  - [Task 1.6 — PO: User Guide and Demo Scenarios](./task-1.6-po-user-guide.md)
  - [Task 1.7 — Developer: Refactor TSRanger to one class per TS file](./task-1.7-developer-refactor-tsranger.md)



## Goal
Design a ranger-like, keyboard-first interactive shell (TS Ranger) that lists discoverable targets from TypeScript classes and methods, powered by `TSCompletion`. The shell must integrate with the existing `DefaultCLI` to execute selected actions.

## Scope
- Navigation model inspired by `ranger`/`fzf`: left/right to change columns (Classes → Methods → Params → Preview), up/down to move, enter to select/execute.
- Non-intrusive: runs as `node --loader ts-node/esm src/ts/layer4/TSRanger.ts` or through a wrapper `tssh TSranger start` (positional args only).
- Uses `TSCompletion` APIs for discovery and filtering.
- Executes via `DefaultCLI` with positional args only.
- No external frameworks beyond devDeps already allowed. Pure TypeScript ESM.

## UX
- Columns:
  - Classes: `TSCompletion.getClasses()`
  - Methods: `TSCompletion.getClassMethods(class)`
  - Params: `TSCompletion.getMethodParameters(class, method)`
  - Preview: shows command to execute (e.g., `tssh <Class> <Method> <Params...>`) with live updates
- Keyboard:
  - Up/Down: move selection
  - Left/Right: move between columns
  - Type to filter the active column
  - Enter: if on Params column with all required args resolved, executes; otherwise drill down
  - Backspace: clear filter
  - Esc/q: quit without changes

## Architecture
- New `src/ts/layer4/TSRanger.ts` exporting class `TSRanger` with `start()` static entry.
- Decouple rendering (terminal drawing) from data/completion:
  - `RangerModel`: selection state, filters, and lists
  - `RangerView`: minimal terminal renderer using ANSI escape codes
  - `RangerController`: input handling, lifecycle, and execution bridging
- Bridge execution via `DefaultCLI` by spawning `node --loader ts-node/esm src/ts/layer2/DefaultCLI.ts <Class> <Method> ...` or directly importing and invoking in-process, preserving positional-args-only contract.

## Non-Goals
- Mouse support
- Persisted layouts
- External plugin system

## Acceptance Criteria
- Startable via `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`.
- Shows four columns and supports navigation and filtering as defined.
- Lists are populated from `TSCompletion` only.
- Enter on a selected method with parameters prompts/focuses Params column; when resolved, executes command via `DefaultCLI` bridge.
- Preview always reflects the exact command to be executed.
- Zero CommonJS. ESM only. Works under `vitest` environment for non-interactive parts.

## Deliverables
- `src/ts/layer4/TSRanger.ts` with `start()`
- Minimal unit tests for model/filtering (non-TTY)
- E2E smoke test that renders and quits (skipped in CI if TTY unavailable)
- Docs and demo in PO task

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- [x] [Task 1.1 — Architect: TS Ranger Shell Specification (role-specific)](./task-1.1-architect-ranger-spec.md)