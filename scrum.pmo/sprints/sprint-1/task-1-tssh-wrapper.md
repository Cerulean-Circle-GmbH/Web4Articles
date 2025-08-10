[Back to Planning](./planning.md)


[Back to Sprint 1 Planning](./planning.md)

# Task 1: Add tssh shell wrapper and backend

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-1.1-developer-setup.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Create a new shell wrapper `tssh` and a TypeScript backend `TSsh.ts` for project root/unit path detection and CLI integration. This task ensures robust CLI integration and Bash completion for the new tool, following project conventions.

## Context
The project requires a new CLI tool (`tssh`) with a TypeScript backend for advanced shell integration. This is part of the ongoing effort to modularize and automate CLI tooling in Web4Articles, following the OOSH pattern.

## Intention
Enable robust, testable, and extensible CLI integration for shell-based workflows, with strict OOP and ESM compliance. Ensure Bash completion is user-friendly, only ever suggests valid, existing arguments, and never suggests shell-style options or unsupported input. Invalid/unsupported input yields silence (no suggestions, no errors).

## Steps
- Add `src/sh/tssh` as a plain shell script wrapper for `TSsh.ts`.
- In `tssh`, determine the project root and unit path by splitting the absolute path of `$0` at the project name (`Web4Articles`).
  - Part 1: Absolute project path (component path)
  - Part 2: Relative unit path (unit path)
- Add `src/ts/layer1/TSsh.ts` as a TypeScript backend, initially duplicating the logic of `OOSH.ts`.
- Add a method `installCompletion()` to `TSsh.ts` that writes a Bash completion script to `~/.local/share/bash-completion/completions/_tssh_completion`.
  - The script should register Bash completion for `tssh` using a Bash function, similar to `install.oosh-completion.sh`.
- Document the approach and ensure the completion script is installed and works as expected.

## Requirements
- All code must be ESM-compliant and TypeScript-first.
- No CommonJS or legacy Node.js patterns.
- All scripts must resolve the project root dynamically.
- Bash completion must be robust and user-friendly.
- Documentation must be updated to reflect the new tool and its usage.
- The shell script for tssh must be a separate file (not embedded in TSsh.ts) to enforce separation of concerns.
- Adhere to the project's first principles, including separation of concerns.

## Acceptance Criteria
- Running `tssh` calls the TypeScript backend and prints arguments.
- `tssh` can determine and print the project path and unit path.
- `TSsh.ts` can install a working Bash completion script for `tssh`.
- Task documented in this file.

## QA Audit & User Feedback
- [ ] QA review pending.
- [ ] Feedback to be collected after task completion.


## Subtasks
- [ ] [Task 1.0: Architect - Specify tssh architecture and PUML](./task-1.0-architect-tssh-spec.md)
    - Create detailed architecture spec and PlantUML diagrams for tssh and backend.
    - Ensure spec is detailed enough for test-driven development.
- [ ] [Task 1.1.5: Tester - Create test cases for tssh](./task-1.1.5-tester-tssh-testcases.md)
    - Write test cases based on the Architect's spec and PUML diagrams.
    - Ensure all requirements are covered before implementation.
- [ ] [Task 1.1: Developer - Implement tssh shell wrapper](./task-1.1-developer-tssh-wrapper.md)
    - Implement shell script as per spec and test cases.
- [ ] [Task 1.2: Developer - Implement TSsh.ts backend](./task-1.2-developer-tssh-backend.md)
    - Implement backend logic as per spec and test cases.
- [ ] [Task 1.3: Developer - Implement Bash completion for tssh](./task-1.3-developer-tssh-completion.md)
    - Implement completion logic as per spec and test cases.
- [ ] [Task 1.4: PO - Document tssh approach](./task-1.4-po-document-tssh.md)
    - Document design, usage, and rationale for tssh and backend.
- [ ] [Task 1.5: Tester - Add and Run Completion Test Cases for oosh and tssh](./task-1.5-tester-completion-tests.md)
    - Add and run test cases for Bash completion scripts.
    - Document test results and feedback.

## Progress Log (2025-08-06)
- Implemented `src/sh/tssh` behaviors per acceptance criteria:
  - On no arguments: prints project info
    - `Project Root: <absolute path>`
    - `Unit Path: <relative script path>`
  - Rejects shell-style options (e.g., `--install-completion`) with a clear error message and exit code 0.
  - Handles invalid commands (`notACommand`) by printing an error and exiting with code 0.
  - Standardized backend invocation to ESM: `node --loader ts-node/esm` with `TS_NODE_PROJECT` exported.
- Verified that `TSsh.installCompletion` writes to `~/.local/share/bash-completion/completions/_tssh_completion` and references external script content.

## Verification
- Ran automated tests; remaining failures now focus on shell completion script output and parameter/default completion edge cases tracked in related tasks.

---

[Back to Planning](./planning.md)
