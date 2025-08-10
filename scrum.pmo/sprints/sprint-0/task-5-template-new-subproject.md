[Back to Planning](./planning.md)


[Back to Planning](../planning.md)

# Task 5: Template for New Subproject Setup

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
- PO: Document the steps required to set up a new subproject using this template project.

## Context
- The role derives the steps and understanding from the PO's task description and documents any additional context or constraints.

## Intention
- The PO double-checks that the role has captured the correct intent from the task description and context.

## Steps
- [x] Commit and push the current project state to GitHub to serve as a template.
- [x] Design and implement a strict OOP TypeScript CLI tool (`GitScrumProject`) for subproject creation, with parameter parsing in a separate class and interface abstraction.
- [x] Organize all scripts into a layered folder structure (`src/ts/layer1-5` for TypeScript, `src/sh` for shell scripts) for maintainability and clarity.
- [x] Create a shell wrapper (`oosh`) to invoke the TypeScript CLI with the correct parameters.
- [x] Ensure all scripts and classes are in the correct folders, with imports updated for the new structure.
- [x] Remove old/duplicate files and commit the cleaned-up state.
- [x] Document all steps, requirements, and QA feedback in this task for traceability and CMMI Level 4 compliance.

## Requirements

## Resulting File Structure & Rationale

- `src/ts/layer1-5/`: TypeScript code is organized into five layers to enforce strict separation of concerns and OOP principles:
  - `layer1`: Infrastructure (utilities, low-level helpers)
  - `layer2`: Implementations (concrete classes, business logic)
  - `layer3`: Interfaces and abstract types (contracts, abstractions)
  - `layer4`: Process orchestration (entry points, workflows)
  - `layer5`: UI or CLI presentation (user interaction, output formatting)
- `src/sh/`: Contains all shell scripts, including the `oosh` wrapper for invoking the TypeScript CLI. This keeps scripting logic separate from application logic and ensures maintainability.
- All scripts and classes are placed in their respective folders, and imports are updated to reflect this structure.
- Old or duplicate files are removed to avoid confusion and ensure a clean, maintainable codebase.

This structure is chosen to maximize clarity, maintainability, and testability, and to support CMMI Level 4 process improvement by making responsibilities explicit and traceable.

---
The current project must be fully committed and pushed to GitHub before use as a template.
The CLI tool must follow strict OOP principles (interface, class, separation of concerns).
Scripts must be organized in a layered folder structure for clarity and maintainability.
The shell wrapper must correctly invoke the TypeScript CLI and pass all parameters.
All old/duplicate files must be removed to avoid confusion.
All steps, requirements, and QA feedback must be documented in this task for future reference and process improvement.

## Acceptance Criteria
- New subproject is initialized with the correct structure and documentation.
- All steps are clearly documented for future use.


## QA Audit & User Feedback
2025-08-03 UTC: QA: 
- The initial attempt to commit and push was done in the wrong directory (wiki submodule), which led to confusion and missed updates. This was corrected by ensuring all git operations are performed in the project root. 
- The CLI tool and all scripts were refactored to follow strict OOP and layered architecture, with diligent migration and cleanup of old files.
- All steps, requirements, and QA feedback are now documented in this task for traceability and CMMI Level 4 process improvement. 
- Future subproject creation must always verify the working directory, follow the layered structure, and document all actions and learnings for continuous improvement.

---
## Subtasks


### 5.1 Architect: PlantUML Specification
- [x] Design and maintain the PlantUML diagram for the CLI OOP architecture in `src/puml`.
- [x] Document rationale and design decisions in the diagram and architect process.md.
- [ ] Review and update the diagram as the architecture evolves.

### 5.2 Developer: Implementation
- [x] Implement the CLI interface (`CLI.ts`) and default implementation (`DefaultCLI.ts`) in `layer3`.
- [x] Refactor `GitScrumProject` to compose a CLI instance and delegate CLI logic.
- [x] Ensure every class/interface is in its own `.ts` file.
- [x] Implement and update the shell wrapper (`oosh`).
- [x] Remove old/duplicate files and update imports.

### 5.3 Developer: Testing
- [ ] Create and run tests for CLI argument parsing and subproject creation.
- [ ] Validate that the CLI tool works end-to-end for new subproject setup.

### 5.4 Developer: Documentation
- [x] Document strict OOP process in the official developer process.md.
- [ ] Update onboarding and usage documentation as needed.

### 5.5 PO: Planning & Acceptance
- [x] Define requirements and acceptance criteria for subproject setup.
- [x] Review subtasks and ensure all roles are covered.
- [ ] Accept/reject completed work based on acceptance criteria.

### 5.6 Scrum Master: Process & Verification
- [x] Ensure all actions (especially file deletions/moves) are verified and documented.
- [x] Update Scrum Master process.md to require verification of automated actions.
- [ ] Facilitate QA review and process improvement documentation.

---
