# See also:
- [Tech Stack](../../../docs/tech-stack.md#typescript-shells--cli-execution)
- [Architecture Spec](task-1.1-architect-tssh-spec.md)
- [Shell Wrapper Task](task-1.1-developer-tssh-wrapper.md)
- [Completion Task](task-1.3-developer-tssh-completion.md)
- [PO Documentation Task](task-1.4-po-document-tssh.md)
- [Completion Test Task](task-1.5-tester-completion-tests.md)
- [Test Cases](task-1.6-tester-tssh-testcases.md)
- [Main Wrapper Task](task-1-tssh-wrapper.md)

# Task 1.2: Developer - Implement TSsh.ts backend

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Goal
Implement the TypeScript backend for `tssh` as specified in the enhanced architecture, with:
- Interactive, context-aware UX (fuzzy search, inline/tab completion, navigation)
- Real-time TypeScript class/method/parameter discovery (project and node_modules)
- Ability to call any class method with arguments, with suggestions and validation
- Strict ESM, OOP, and extensibility (plugins, context help, UI enhancements)
- Robust CLI integration, Bash completion, and OOSH/tssh integration

## Implementation Tasks
- Create `src/ts/layer1/TSsh.ts` as the backend entry point. It must:
    - Accept arguments, project path, and unit path
    - Handle CLI logic, class/method/parameter discovery, and expose `installCompletion()` to generate a Bash completion script
    - Provide interactive, context-aware completion for classes, methods, and parameters (inline and tab), with fuzzy search/navigation
    - Allow calling any TypeScript class method in the project or node_modules, with suggestions and validation
    - Be extensible for plugins, context help, and UI enhancements
    - Use strict ESM and OOP only
- Implement class/method/parameter discovery for all TypeScript classes in the project and node_modules.
- Provide robust error handling and logging.
- Ensure all shell and completion scripts are in separate files, not embedded in TypeScript.
- No shell-style options (e.g., --install-completion) are allowed; only positional arguments.
- Completion must only ever suggest valid, existing arguments. Invalid/unsupported input yields silence (no suggestions, no errors).
- OOSH must delegate all TypeScript/ESM logic to tssh via a clear interface.

## Acceptance Criteria
- Backend handles CLI logic, class/method/parameter discovery, and completion installation robustly.
- Backend provides interactive, context-aware completion for classes, methods, and parameters (inline and tab), and supports fuzzy search/navigation.
- Backend allows calling any TypeScript class method in the project or node_modules, with suggestions and validation.
- Backend is extensible for plugins, context help, and UI enhancements.
- Backend is strict ESM and OOP only.
- Backend provides robust error handling and logging.
- Completion is robust and user-friendly, only suggesting valid arguments.
- No shell-style options are allowed.
- All shell and completion scripts are in separate files.
- OOSH delegates all TypeScript/ESM logic to tssh via a clear interface.
