# See also:
- [Tech Stack](../../../docs/tech-stack.md#typescript-shells--cli-execution)
- [Architecture Spec](task-1.1-architect-tssh-spec.md)
- [Backend Task](task-1.1-developer-tssh-backend.md)
- [Completion Task](task-1.2-developer-tssh-completion.md)
- [PO Documentation Task](task-1.3-po-document-tssh.md)
- [Completion Test Task](task-1.4-tester-completion-tests.md)
- [Test Cases](task-1.5-tester-tssh-testcases.md)
- [Main Wrapper Task](task-1-tssh-wrapper.md)

# Task 1.1: Developer - Implement tssh shell wrapper

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Goal
Implement the `tssh` shell script and TypeScript backend according to the enhanced architecture spec, with:
- Interactive, context-aware UX (fuzzy search, inline/tab completion, navigation)
- Real-time TypeScript class/method/parameter discovery (project and node_modules)
- Ability to call any class method with arguments, with suggestions and validation
- Strict ESM, OOP, and extensibility (plugins, context help, UI enhancements)
- Robust CLI integration, Bash completion, and OOSH/tssh integration

## Implementation Tasks
- Write `src/sh/tssh` shell script wrapper. It must resolve the project root and unit path by splitting `$0` at `Web4Articles`, then forward all arguments to the TypeScript backend using `ts-node --esm`.
- Write `src/ts/layer1/TSsh.ts` backend. It must:
    - Accept arguments, project path, and unit path
    - Handle CLI logic, class/method/parameter discovery, and expose `installCompletion()` to generate a Bash completion script
    - Provide interactive, context-aware completion for classes, methods, and parameters (inline and tab), with fuzzy search/navigation
    - Allow calling any TypeScript class method in the project or node_modules, with suggestions and validation
    - Be extensible for plugins, context help, and UI enhancements
    - Use strict ESM and OOP only
- Write Bash completion logic. It must be installed by the backend, write to `~/.local/share/bash-completion/completions/_tssh_completion`, and register a Bash function for `tssh`.
- Ensure all shell and completion scripts are in separate files, not embedded in TypeScript.
- No shell-style options (e.g., --install-completion) are allowed; only positional arguments.
- Completion must only ever suggest valid, existing arguments. Invalid/unsupported input yields silence (no suggestions, no errors).
- OOSH must delegate all TypeScript/ESM logic to tssh via a clear interface.

## Acceptance Criteria
- Running `tssh` prints the project path, unit path, and arguments.
- The script is ESM-compliant and separated from TypeScript logic.
- The script is documented and committed.
- Backend provides interactive, context-aware completion for classes, methods, and parameters (inline and tab), and supports fuzzy search/navigation.
- Backend allows calling any TypeScript class method in the project or node_modules, with suggestions and validation.
- Backend is extensible for plugins, context help, and UI enhancements.
- Bash completion is robust and user-friendly, only suggesting valid arguments.
- OOSH delegates all TypeScript/ESM logic to tssh via a clear interface.
