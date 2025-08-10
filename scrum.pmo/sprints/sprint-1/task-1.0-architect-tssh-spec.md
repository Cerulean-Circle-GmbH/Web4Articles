[Back to Planning](./planning.md)


[Back to Main Task](./task-1-tssh-wrapper.md)


# Task 1.0: Architect - Specify tssh architecture and PUML

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating diagrams
  - [x] writing specification
- [x] QA Review
- [x] Done


## Artifacts
- [tssh-architecture.puml (Sequence/Flow)](../../../../docs/puml/tssh-architecture.puml)
- [tssh-architecture-structure.puml (Component/Package)](../../../../docs/puml/tssh-architecture-structure.puml)
- [Main Task](./task-1-tssh-wrapper.md)


## Goal
Specify the architecture for the `tssh` CLI tool and backend, providing a clear, testable, and maintainable design for robust CLI integration and Bash completion.

## Context
This subtask refines the CLI architecture for `tssh` as part of modularizing and automating CLI tooling in Web4Articles. It ensures strict OOP, ESM, and separation of concerns, and provides the basis for test-driven development.

## Specification (for Tester)
**Layered Architecture:**
- `src/sh/tssh`: Shell script wrapper. Resolves project root and unit path by splitting `$0` at `Web4Articles`. Forwards all arguments to the TypeScript backend using `ts-node --esm`.
- `src/ts/layer1/TSsh.ts`: TypeScript backend. Strict ESM, OOP. Receives arguments, project path, and unit path. Handles CLI logic and exposes `installCompletion()` to generate a Bash completion script.
- Bash completion: Installed via backend, writes to `~/.local/share/bash-completion/completions/_tssh_completion` and registers a Bash function for `tssh`.

**Diagrams:**
- [Sequence/Flow](../../../../docs/puml/tssh-architecture.puml): Shows invocation and data flow from user to shell to backend and completion.
- [Component/Package](../../../../docs/puml/tssh-architecture-structure.puml): Shows structural relationships between shell, backend, and completion logic.

**Design Decisions:**
- Strict separation of shell and TypeScript logic.
- All backend logic is encapsulated in classes (OOP, ESM only).
- Dynamic project root resolution for portability.
- Completion logic delegated to backend for maintainability and testability.

**Testable Requirements:**
- Shell script must print project path, unit path, and forward arguments.
- Backend must handle CLI logic and install completion robustly, using only positional arguments (e.g., `tssh TSsh installCompletion`).
- Bash completion must be user-friendly and robust. Completion only ever suggests valid, existing arguments; shell-style options and unsupported arguments are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).
- No shell-style options (e.g., --install-completion) are allowed.
- All shell and completion scripts must be in separate files, not embedded in TypeScript.

## Steps
1. Define layered architecture and document in this file.
2. Create and link PlantUML diagrams for flow and structure.
3. Ensure the specification is detailed enough for the Tester to write test cases before implementation.
4. Document all design decisions and rationale.

## Acceptance Criteria
- Architecture spec and PUML diagrams are complete and committed.
- The spec is referenced by Developer and Tester subtasks.
- All design decisions are documented and traceable.
- Tester can create comprehensive test cases from this specification.

## Subtasks
- None (atomic subtask for this sprint)

# QA Feedback (2025-08-04)

**Issue:**
The initial PlantUML diagram for tssh architecture mixed diagram types inappropriately. Specifically, line 12 attempted to use both sequence and component/package diagram elements together, which is not valid PlantUML syntax. The package block was commented out, but this should be avoided for clarity and correctness.

**User Feedback:**
Mixing sequence and component/package diagrams in a single PlantUML file is confusing and not best practice. It is clearer to split them into two separate files: one for flow/sequence, and one for structure/component relationships. Each diagram can reference or be linked from the other for context.

**Resolution:**
Use either a sequence diagram (showing message flow between actors and components) or a component/package diagram (showing structure and relationships), but do not mix both in a single diagram. For onboarding and architecture, prefer a clear component or package diagram for structure, and a separate sequence diagram for flow if needed.

**Action:**
A second PUML file (`tssh-architecture-structure.puml`) was created for the component/package view, and both diagrams are now referenced in the artifacts section. The diagram was updated to remove the commented package blocks. Future diagrams will strictly separate diagram types and follow PlantUML best practices. This improves clarity, onboarding, and maintainability.
# QA Feedback (2025-08-04)

**Issue:**
The initial PlantUML diagram for tssh architecture mixed diagram types inappropriately. Specifically, line 12 attempted to use both sequence and component/package diagram elements together, which is not valid PlantUML syntax. The package block was commented out, but this should be avoided for clarity and correctness.

**Resolution:**
Use either a sequence diagram (showing message flow between actors and components) or a component/package diagram (showing structure and relationships), but do not mix both in a single diagram. For onboarding and architecture, prefer a clear component or package diagram for structure, and a separate sequence diagram for flow if needed.

**Action:**
The diagram was updated to remove the commented package blocks. Future diagrams will strictly separate diagram types and follow PlantUML best practices.

