# See also:
- [Tech Stack](../../../docs/tech-stack.md#typescript-shells--cli-execution)
- [Architecture Spec](task-1.0-architect-tssh-spec.md)
- [Shell Wrapper Task](task-1.1-developer-tssh-wrapper.md)
- [Backend Task](task-1.2-developer-tssh-backend.md)
- [Completion Task](task-1.3-developer-tssh-completion.md)
- [PO Documentation Task](task-1.4-po-document-tssh.md)
- [Completion Test Task](task-1.5-tester-completion-tests.md)
- [Main Wrapper Task](task-1-tssh-wrapper.md)

[Back to Main Task](./task-1-tssh-wrapper.md)


# Task 1.1.5: Tester - Create test cases for tssh

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Status
- [x] Planned
- [x] In Progress
  - [x] reading architecture spec
  - [x] writing test cases
- [x] QA Review
- [ ] Done

## Artifacts
- [Architect Spec](./task-1.1-architect-tssh-spec.md)
- [Main Task](./task-1-tssh-wrapper.md)
- [Integration Test Code](../../../test/tssh-cli.integration.test.ts)

## Goal
Define test cases for the `tssh` shell script and TypeScript backend, covering:
- Argument parsing, project/unit path resolution
- Interactive, context-aware UX (fuzzy search, inline/tab completion, navigation)
- Real-time TypeScript class/method/parameter discovery (project and node_modules)
- Ability to call any class method with arguments, with suggestions and validation
- Strict ESM, OOP, and extensibility (plugins, context help, UI enhancements)
- Robust CLI integration, Bash completion, and OOSH/tssh integration

## Steps
1. Read the architecture spec and PUML diagrams from Task 1.0.
2. Define test cases for:
   - Project root and unit path detection
   - Argument forwarding
   - Backend invocation
   - Bash completion installation and behavior
   - Robustness and error handling
   - No shell-style options (e.g., --install-completion); all actions must be positional arguments (e.g., `tssh TSsh installCompletion`)
   - Completion script must be a separate file, not embedded in TypeScript
3. Ensure tests cover both automated and manual QA scenarios.
4. Document all test cases and expected results.

## Test Cases

### 1. Project Root and Unit Path Detection
- **Given**: The shell script `tssh` is invoked from any directory.
- **When**: It runs, splitting `$0` at `Web4Articles`.
- **Then**: It prints the absolute project path and the relative unit path.
- **Test**: Run `tssh` from various locations and verify correct output.

### 2. Argument Forwarding
- **Given**: The user passes arguments to `tssh`.
- **When**: The script runs.
- **Then**: All arguments are forwarded to the TypeScript backend and printed by the backend.
- **Test**: Run `tssh arg1 arg2` and verify backend output matches.

### 3. Backend Invocation
- **Given**: The shell script is called.
- **When**: It invokes the TypeScript backend using `ts-node --esm`.
- **Then**: The backend receives and processes the arguments, project path, and unit path.
- **Test**: Add logging to backend and verify correct values are received.

### 4. Bash Completion Installation
- **Given**: The user runs `tssh TSsh installCompletion`.
- **When**: The backend's `installCompletion()` is called.
- **Then**: A Bash completion script (from a separate file) is written to `~/.local/share/bash-completion/completions/_tssh_completion`.
- **Test**: Check file existence and content after running install. Verify the script is not embedded in TypeScript.

### 5. Bash Completion Behavior
- **Given**: Bash completion is installed for `tssh`.
- **When**: The user presses [Tab] after typing `tssh` or subcommands.
- **Then**: The completion suggestions are robust, user-friendly, and match the backend logic. If no valid completions exist, nothing is suggested (no error or output is shown).
- **Test**: Manually and automatically test completion in a shell session. Confirm that invalid completions are silent (no suggestions, no errors).

### 6. Interactive, Context-Aware UX and Discovery
- **Given**: The user interacts with tssh in the shell.
- **When**: They type or tab-complete class/method/parameter names.
- **Then**: tssh provides real-time, context-aware, fuzzy completion for all TypeScript classes, methods, and parameters in the project and node_modules. Inline and tab completion both work. Navigation is intuitive and interactive.
- **Test**: Try various completions and verify suggestions are correct, context-aware, and fuzzy-matched. Confirm navigation and selection are smooth.

### 7. Method Invocation and Validation
- **Given**: The user calls a TypeScript class method via tssh.
- **When**: They provide arguments (with or without completion).
- **Then**: tssh validates arguments, provides suggestions, and invokes the method, printing results or errors as appropriate.
- **Test**: Call various methods with/without arguments, verify validation, suggestions, and output.

### 8. Extensibility and OOSH/tssh Integration
- **Given**: The project is extended with plugins or OOSH integration.
- **When**: New features or UI enhancements are added.
- **Then**: tssh remains robust, extensible, and all completion/UX features continue to work. OOSH delegates all TypeScript/ESM logic to tssh via a clear interface.
- **Test**: Add a plugin or OOSH integration, verify all features and completions still work.

### 9. Robustness and Error Handling
- **Given**: The user provides invalid input or runs in an unexpected environment.
- **When**: The CLI script or backend encounters errors (not during completion).
- **Then**: Errors are handled gracefully, and the user receives clear feedback. (For Bash completion, invalid completions are silent—no output or error.)
- **Test**: Simulate CLI errors and verify user-facing messages are clear and no stack traces are shown. For completion, confirm silence on invalid input.

### 10. No Shell-Style Options
- **Given**: The user attempts to run `tssh --install-completion` or similar.
- **When**: The CLI script or backend is called.
- **Then**: The command is rejected or ignored; only positional arguments are accepted. (No error is shown for completion attempts; CLI invocations should print a clear error.)
- **Test**: Run `tssh --install-completion` and verify it does not trigger completion installation. For completion, confirm silence; for CLI, expect an error message.

## Acceptance Criteria
- Test cases are complete, clear, and cover all architectural requirements.
- Test cases are referenced by Developer and Tester subtasks.
- All test cases are documented and committed before implementation begins.

## Subtasks
- None (atomic subtask for this sprint)

## Lessons Learned (2025-08-04)


### tssh CLI: Tester Process Update
- Test cases for `tssh` must use real, user-facing scenarios only.
- Avoid placeholder arguments; focus on actual CLI features and error handling.
- Ensure tests cover all key CLI and completion behaviors. Error handling and user feedback are only required for direct CLI invocations—not for Bash completion, which must remain silent on invalid input.
- All automated test cases must be placed in the top-level `test/` directory.
- Reference the canonical test: `test/tssh-cli.integration.test.ts`.
- Manual QA must confirm completions are visible, correct, and warning-free in the shell. Invalid completions must be silent (no output, no error).
- Document all findings and feedback in process docs and tasks for traceability.

#### Key Takeaways
- Realistic, feedback-driven test cases ensure robust CLI and completion features.
- Bash completion scripts must never print errors or output for invalid completions; silence is the standard behavior.
- Tester-Developer feedback loops are critical for quality and user experience.


