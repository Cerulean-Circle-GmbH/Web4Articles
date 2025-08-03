# Developer First Principles & Learnings (Migrated from src/developer/process.md)

## Pathing & Environment
- Always resolve script and tool paths from the git root using `git rev-parse --show-toplevel`.
- Prepend `$GIT_ROOT/node_modules/.bin` to `PATH` in all scripts to ensure local binaries are used.

## Testing & QA
- Automated tests must simulate real shell usage, not just backend logic.
- Manual QA must validate that completions are visible and correct in the shell.
- All warnings and extraneous output must be suppressed in completions.

## Documentation
- Document all process, QA, and architectural learnings in markdown for onboarding and future reference.

# QA Issue: Shell Completion Returns Node Warnings Instead of TS Classes

## Problem
- When running the completion script and pressing [Tab], the shell displays Node.js experimental warnings (e.g., 'ExperimentalWarning: Type Stripping...') as completions, instead of TypeScript class names from the project.

## Root Cause
- The completion backend (TSCompletion.ts) outputs warnings to stdout, which are captured by the shell completion function and interpreted as possible completions.

## Test Requirements (Refined)
- The completion backend must output only valid completions (class, method, or parameter names) to stdout.
- All warnings, errors, and diagnostics must be redirected to stderr or suppressed.
- Automated and manual tests must verify that only valid completions are shown in the shell, with no warnings or extraneous output.

## Next Steps
- Update the completion backend to suppress or redirect Node.js warnings.
- Add/extend automated tests to check for warning-free completions.

# Developer First Principles: Script Pathing & Environment

## Always Run Scripts Relative to Git Root
- Use `git rev-parse --show-toplevel` in scripts to determine the project root.
- All script invocations (Node, TypeScript, etc.) should use absolute paths from the git root for reliability.

## Add Local Binaries to PATH
- Prepend `$GIT_ROOT/node_modules/.bin` to the `PATH` in all shell scripts to ensure local tools (like `ts-node`) are found regardless of the working directory.

## Use `tree` for Structure Analysis
- Use the `tree` command to analyze and document the project structure, especially when debugging or onboarding.

## Example Pattern (Bash):
```bash
GIT_ROOT="$(git rev-parse --show-toplevel)"
export PATH="$GIT_ROOT/node_modules/.bin:$PATH"
ts-node "$GIT_ROOT/src/ts/layer4/TSCompletion.ts" "$@"
```

## Rationale
- This approach ensures scripts are robust, portable, and environment-agnostic, supporting both local and containerized development.
# Subtask Naming and Dependencies

Subtasks will always be named to indicate the affected role (e.g., `task-1.1-developer-setup.md`). Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.
# Developer Role Process

## Role Definition
The Developer is responsible for implementing features, maintaining code quality, and collaborating with other roles to deliver the project according to requirements and best practices.

## Responsibilities
- Follow the structure and conventions set by DevOps and the PO.
- Ensure code and documentation are organized as specified.
- Contribute to the ontology and wiki as new terms and features are developed.
- Provide feedback on the setup for continuous improvement.

## Strict OOP First Principles

- **Interface Segregation**: All CLI logic is abstracted behind a `CLI` interface in `layer3`, ensuring that implementations can be swapped or extended without changing the consumer.
- **Composition over Inheritance**: The main class (`GitScrumProject`) composes a CLI instance, rather than inheriting CLI logic, to maximize flexibility and testability.
- **Single Responsibility**: Each class has a single, well-defined responsibility:
  - `GitScrumProject`: Project creation logic and orchestration.
  - `CLI` (interface): Contract for CLI interaction.
  - `DefaultCLI`: Default implementation that parses parameters and invokes the correct logic.
  - `ParameterParser`: Responsible only for parsing CLI arguments.
- **Dependency Injection**: `GitScrumProject` receives its CLI implementation as a dependency (defaulting to `DefaultCLI`), allowing for easy testing and extension.
- **No Preknowledge Required**: The static `start()` method on `GitScrumProject` is the only entry point needed for CLI usage; no constructor parameters or setup required.
- **Layered Architecture**: Interfaces and contracts are in `layer3`, implementations in `layer2`, and process orchestration in `layer4`.
- **One Class per File**: Every class and interface is defined in its own `.ts` file for clarity and maintainability.

## Example Structure

- `src/ts/layer3/CLI.ts`: CLI interface.
- `src/ts/layer3/DefaultCLI.ts`: DefaultCLI implementation.
- `src/ts/layer2/GitScrumProject.ts`: Composes a CLI instance and delegates CLI logic.
- `src/ts/layer2/ParameterParser.ts`: Parses CLI arguments.

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. Developers are responsible for following conventions, contributing to documentation, and providing feedback.

## Benefits
- Maximizes maintainability, testability, and clarity.
- Supports CMMI Level 4 process improvement by making responsibilities explicit and traceable.
- Enables future extension or replacement of CLI logic without changing core project logic.

---
Developers should continue to maintain and expand the documentation and ontology as the project grows.
