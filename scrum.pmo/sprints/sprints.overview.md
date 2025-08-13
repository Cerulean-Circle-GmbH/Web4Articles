[Back to Scrum PMO](../)

# Sprints Overview

This document provides a comprehensive overview of all sprints in the Web4Articles project, their goals, and key deliverables.

## Sprint Timeline

### **Sprint 0** - Foundation Setup
- **Planning**: [sprint-0/planning.md](./sprint-0/planning.md)
- **Goal**: Establish the foundational project structure, documentation, and onboarding workflow including SCRUM management directories, project wiki submodule, ontology page, role documentation, and templates for new subprojects.
- **Status**: Completed

### **Sprint 1** - CLI Tool Foundation  
- **Planning**: [sprint-1/planning.md](./sprint-1/planning.md)
- **Goal**: Establish the new `tssh` CLI tool and backend, ensuring robust shell integration, Bash completion, and documentation following project conventions.
- **Status**: Completed

### **Sprint 2** - Interactive Shell (TSRanger v1)
- **Planning**: [sprint-2/planning.md](./sprint-2/planning.md)
- **Goal**: Deliver a ranger-like interactive shell (TS Ranger) that leverages TSCompletion and the existing CLI pattern to navigate and execute TypeScript classes and methods with discoverable completions and minimal keystrokes.
- **Status**: Completed

### **Sprint 3** - Project Templating Tool
- **Planning**: [sprint-3/planning.md](./sprint-3/planning.md)
- **Goal**: Deliver a comprehensive `GitScrumProject` tool that can create new GitHub repositories from this project as a template, referencing the application source as a git submodule with documented release and recovery processes.
- **Status**: Completed

### **Sprint 4** - DevContainer Environment
- **Planning**: [sprint-4/planning.md](./sprint-4/planning.md)
- **Goal**: Deliver a cross-platform devcontainer that standardizes local and CI environments including Node.js, bash/coreutils, PlantUML + Graphviz, and optional GitHub CLI with proper PATH and mount configurations.
- **Status**: Completed

### **Sprint 5** - TSRanger v2 Implementation
- **Planning**: [sprint-5/planning.md](./sprint-5/planning.md)
- **Goal**: Deliver TS Ranger v2 under `src.v2`, consolidating Sprint 2 learnings and QA feedback with stable TUI UX, shell-like prompt editing, deterministic test mode, and Docs column backed by TSCompletion.
- **Status**: Completed

### **Sprint 6** - Versioned Folder Structure
- **Planning**: [sprint-6/planning.md](./sprint-6/planning.md)
- **Goal**: Refactor to a versioned top-level structure (v2/src/ and v2/test/) with dependencies referenced relative to v2/src, migrating src.v2 → v2/src and test.v2 → v2/test while preserving DRY principles.
- **Status**: Completed

### **Sprint 7** - TSRanger v2 Continuation
- **Planning**: [sprint-7/planning.md](./sprint-7/planning.md)
- **Goal**: Continue TSRanger v2 development (appears to be continuation of Sprint 5 work)
- **Status**: Completed
- **Note**: Planning document appears to be duplicate of Sprint 5

### **Sprint 8** - Ranger Analysis
- **Planning**: [sprint-8/planning.md](./sprint-8/planning.md)
- **Goal**: Analyze and formalize TSRanger TUI behavior from README and code, derive comprehensive key input test cases, and produce concrete requirements documentation.
- **Deliverables**: 
  - `ranger.tui.behavior.md`: Detailed behavior of Python ranger TUI
  - `ranger.requirements.md`: Functional/non-functional requirements
  - `ranger.keyinput.testcases.md`: Derived key input test cases
  - `tsranger.tui.behavior.analyzed.md`: Current TSRanger behavior analysis
- **Status**: Completed

### **Sprint 9** - Merge Operations
- **Planning**: No formal planning document
- **Tasks**: Contains merge execution tasks (task-9.22, task-9.7, task-9.8)
- **Focus**: Release branch merging and testing
- **Status**: Completed

### **Sprint 10** - AI-GPL License Enforcement
- **Planning**: [sprint-10/plan.md](./sprint-10/plan.md)
- **Goal**: Establish an explicit AI-GPL addendum to AGPLv3, enforce license headers and backlinks across the repository with TypeScript tooling, and integrate automated checks into CI for new files.
- **Deliverables**:
  - AI-GPL addendum document
  - TypeScript license header enforcement tool
  - CI integration for automated compliance checks
- **Status**: Completed

### **Sprint 11** - TypeScript Recovery/CI Tooling *(Current Sprint)*
- **Planning**: [sprint-11/planning.md](./sprint-11/planning.md)
- **Goal**: Replace brittle shell one-liners with small, testable ESM TypeScript tools integrated with TSRanger/TSsh for journaling, PR reporting, protected-path scanning, and link hygiene.
- **Stories**:
  1. PR Reporter Tool - List open PRs to release/dev as Markdown
  2. Journal Generator - Render project.state.md from template
  3. Branch Overview Renderer - Include unresolved PRs
  4. Protected-Path Diff Scanner - Detect deletions under protected paths
  5. Backlink/Cross-link Validator - Verify and autofix links
- **Status**: In Planning

## Project Evolution Summary

The project has progressed through several phases:

1. **Foundation** (Sprint 0-1): Basic project structure and CLI tooling
2. **Interactive Tools** (Sprint 2-3): TSRanger development and project templating
3. **Environment & Architecture** (Sprint 4-7): DevContainer setup and versioned folder restructuring
4. **Analysis & Compliance** (Sprint 8-10): Ranger behavior analysis and license enforcement
5. **Tooling Maturity** (Sprint 11): Replacing shell scripts with robust TypeScript tools

Each sprint builds upon previous work, following CMMI Level 4 practices with comprehensive documentation, testing, and continuous improvement.

