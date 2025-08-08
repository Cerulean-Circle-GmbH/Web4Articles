# See also:

[Back to Sprint 1 Planning](./planning.md)

# Task 1: Add tssh shell wrapper and backend

## Naming Conventions

## Status
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing

## Task Description
Create a new shell wrapper `tssh` and a TypeScript backend `TSsh.ts` for project root/unit path detection and CLI integration. This task ensures robust CLI integration and Bash completion for the new tool, following project conventions.

## Context
The project requires a new CLI tool (`tssh`) with a TypeScript backend for advanced shell integration. This is part of the ongoing effort to modularize and automate CLI tooling in Web4Articles, following the OOSH pattern.

## Intention
Create a next-generation, TypeScript-native shell (tssh) that:

## Steps
  - Part 1: Absolute project path (component path)
  - Part 2: Relative unit path (unit path)
  - Discover all TypeScript classes and methods in the project and node_modules at runtime.
  - Provide real-time, context-aware completion for classes, methods, and parameters (inline and tab).
  - Allow calling any class method with arguments, with validation and suggestions.
  - Support interactive navigation and fuzzy search for classes/methods (UX inspired by ranger/nushell).
  - Be extensible for future plugins, context-sensitive help, and UI enhancements.
  - The script should register Bash completion for `tssh` using a Bash function, similar to `install.oosh-completion.sh`.

## Requirements
  - Provide interactive, ranger/nushell-like UX (fuzzy search, context-aware navigation, inline completion)
  - Discover and complete all TypeScript classes/methods/parameters in project and node_modules
  - Allow calling any class method with arguments, with suggestions and validation
  - Be extensible for plugins and UI enhancements

## Acceptance Criteria

## QA Audit & User Feedback


## Subtasks
    - Create detailed architecture spec and PlantUML diagrams for tssh and backend.
    - Ensure spec is detailed enough for test-driven development.
    - Write test cases based on the Architect's spec and PUML diagrams.
    - Ensure all requirements are covered before implementation.
    - Implement shell script as per spec and test cases.
    - Implement backend logic as per spec and test cases.
    - Implement completion logic as per spec and test cases.
    - Document design, usage, and rationale for tssh and backend.
    - Add and run test cases for Bash completion scripts.
    - Document test results and feedback.


[Back to Planning](./planning.md)
