# See also:
- [Tech Stack](../../../docs/tech-stack.md#typescript-shells--cli-execution)
- [Architecture Spec](task-1.1-architect-tssh-spec.md)
- [Shell Wrapper Task](task-1.1-developer-tssh-wrapper.md)
- [Backend Task](task-1.2-developer-tssh-backend.md)
- [PO Documentation Task](task-1.4-po-document-tssh.md)
- [Completion Test Task](task-1.5-tester-completion-tests.md)
- [Test Cases](task-1.6-tester-tssh-testcases.md)
- [Main Wrapper Task](task-1-tssh-wrapper.md)

# Task 1.3: Developer - Implement Bash completion for tssh

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Goal
Implement Bash completion for `tssh`, ensuring robust, user-friendly, and maintainable completion logic, and supporting advanced interactive UX:
- Inline and tab completion for TypeScript classes, methods, and parameters
- Real-time, context-aware suggestions (not just static lists)
- Fuzzy search and navigation
- Extensibility for future UI enhancements

## Implementation Tasks
- Write Bash completion logic in a separate file (not embedded in TypeScript).
- Completion must be installed by the backend, writing to `~/.local/share/bash-completion/completions/_tssh_completion` and registering a Bash function for `tssh`.
- Completion must only ever suggest valid, existing arguments. Invalid/unsupported input yields silence (no suggestions, no errors).
- No shell-style options (e.g., --install-completion) are allowed; only positional arguments.
- Completion logic must be delegated to the TypeScript backend for maintainability and testability.
- Completion must support inline and tab completion for TypeScript classes, methods, and parameters, with real-time, context-aware suggestions and fuzzy search/navigation.
- Completion must be extensible for future UI enhancements.

## Acceptance Criteria
- Completion is robust, user-friendly, and only suggests valid arguments.
- Completion logic is delegated to the backend and is testable.
- Completion supports inline and tab completion for TypeScript classes, methods, and parameters, with real-time, context-aware suggestions and fuzzy search/navigation.
- Completion is extensible for future UI enhancements.
- No shell-style options are allowed.
- All completion scripts are in separate files.
