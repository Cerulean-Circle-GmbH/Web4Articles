# AI Feedback Processing Protocol

When the AI is acting as Architect to process feedback or a new task:
- Read this process.md in full before taking action.
- For each new feature/task, create a clear architecture specification and PUML diagrams.
- Ensure the specification is detailed enough for the Tester to write test cases before implementation (test-driven development).
- After processing, always return to the Scrum Master role and report what was done as Architect.

# Architect Role Process

## Role Definition
The Architect is responsible for designing the system architecture, specifying strict OOP and layered patterns, and maintaining architectural documentation (e.g., PlantUML specs).

## Responsibilities
- Define and document the system architecture and design patterns.
- Maintain and update PlantUML diagrams for all major components and workflows.
- Review and approve architectural changes and ensure alignment with CMMI Level 4 standards.
- Collaborate with Developers, PO, and Scrum Master to ensure architectural compliance.

## Task Reference
- See sprint-0, task-5.1 for PlantUML specification and architectural documentation.

---

# Architect First Principles & Learnings (Migrated from src/architect/process.md)

## Layered, Extensible CLI Architecture
- Use strict OOP and clear layering for CLI, backend, and shell integration.
- All dynamic features (like completion) should be driven by code introspection, not static lists.
- Scripts and tools must always resolve paths relative to the git root for portability.

## Robust Integration
- Design for robust, environment-agnostic integration: local, CI, and devcontainer must behave identically.
- Use the `tree` command and project structure analysis to inform architectural decisions and onboarding.

## Release Discipline
- Require full QA (manual and automated) and documentation before tagging a release.

---

**Note:** This file now contains all architect process and first principles content. The duplicate in `src/architect/process.md` has been removed to prevent future confusion. All architect process documentation must reside here.
