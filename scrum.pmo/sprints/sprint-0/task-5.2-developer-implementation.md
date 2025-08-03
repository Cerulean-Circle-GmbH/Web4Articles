# [Back to Sprint 0 Planning](./planning.md)
# [Back to Main Task 5](./task-5-template-new-subproject.md)

# Task 5.2: Developer - Implementation

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
Implement the CLI interface, default implementation, and shell/TypeScript completion for the oosh CLI, following strict OOP and process requirements.

## Context
- This subtask is derived from Task 5 and focuses on implementing the CLI, completion, and related developer logic.

## Intention
- Ensure the CLI and completion logic are robust, extensible, and developer-friendly.

## Steps
- Implement the CLI interface and default implementation in TypeScript.
- Implement the oosh shell wrapper and bash completion script.
- Implement the TypeScript completion backend for dynamic tab completion.
- Ensure all code follows strict OOP and process requirements.

## Requirements
- An automated test must simulate terminal completion (as described in the manual test) and capture the real output, verifying the completion logic end-to-end.
- CLI and completion logic must be implemented in TypeScript and shell as specified.
- The TSCompletion class must generically discover available TypeScript classes, their methods, and method parameters from the project source code (not hardcoded for a specific class).
- Completion must work for any class, method, or parameter in the project, supporting future extensibility.
- All code must follow strict OOP, naming, and process conventions.

## Acceptance Criteria
- CLI and completion work as specified and pass all tests.
- Code is reviewed and accepted by the team.

## QA Audit & User Feedback
- [ ] QA review pending.
- [ ] Feedback to be collected after implementation and review.

## Subtasks
- None (atomic subtask for this sprint).

---

## Completion Specification

The following describes the shell and TypeScript completion integration for the oosh CLI:

> When the user types `oosh` and presses [Tab], the shell calls a TypeScript class `TSCompletion` implementing the `Completion` interface. The completion responds with a list of TypeScript classes. As the user types further (e.g., `oosh GitScrumProject` [Tab]), the completion lists available methods, then sub-methods or parameters, and finally default parameter values. This enables context-aware tab completion for the CLI, driven by the TypeScript backend.

Example flow:

```
oosh [Tab]                # completes: GitScrumProject
oosh GitScrumProject [Tab] # completes: create createProject
oosh GitScrumProject create [Tab] # completes: project
oosh GitScrumProject create project [Tab] # completes: Web4Scrum
```

This specification is implemented by a shell script for bash completion and a TypeScript backend for dynamic completions.
