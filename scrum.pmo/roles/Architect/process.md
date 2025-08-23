[Back to Roles](../)

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
- Apply systematic investigation methodology for architectural analysis and system design review.
- Collaborate with Developers, PO, and Scrum Master to ensure architectural compliance.
- Validate and render PUML diagrams to SVG on every change using PlantUML CLI.
- Ensure the diagrams compile without warnings/errors locally and in CI.

## Systematic Investigation for Architectural Analysis

### Architect-Specific Investigation Areas
- **System Design:** Create comprehensive architectural solutions with proper documentation
- **Framework Innovation:** Design revolutionary approaches (e.g., 3 Degrees of Freedom)
- **PUML Documentation:** Provide visual architecture diagrams for complex designs
- **Future Vision:** Balance current needs with long-term architectural goals
- **Root Cause Analysis:** Identify architectural debt and design quality issues

### Investigation Methodology for Architects
1. **Problem Definition**: Analyze architectural symptoms and design challenges
2. **Evidence Collection**: System design analysis, component interaction review, architectural assessment
3. **Design Analysis**: Multiple architectural solutions, framework evaluation, scalability assessment
4. **Systematic Validation**: Design experiments, architectural prototyping, integration testing
5. **Solution Framework**: Immediate architectural fixes, systematic design improvements, revolutionary framework development

### Architectural Analysis Framework
Based on systematic investigation principles:

#### Architectural Root Cause Investigation
- **System Design Analysis:** Review component architecture for design flaws
- **Integration Assessment:** Analyze component interactions and dependencies
- **Scalability Evaluation:** Assess architectural capability for future requirements
- **Performance Analysis:** Identify architectural bottlenecks and optimization opportunities

#### Framework Development Process
1. **Revolutionary Vision Assessment:** Evaluate transformational architectural concepts
2. **Multi-Sprint Planning:** Systematic implementation timeline for complex changes
3. **Skill Mix Analysis:** Determine required expertise and role coordination
4. **Integration Strategy:** Comprehensive testing and validation planning

### Matrix-Based Architectural Analysis
Based on "3 Degrees of Freedom" framework for TSRanger:
1. **COLUMNS (WHO/WHERE):** What architectural components are affected
2. **PROMPT (WHAT):** What behaviors the architecture must support
3. **FILTER (HOW):** What conditions the architectural design must handle

**Example - TSRanger Architectural Matrix:**
```
| Architectural Component | Current Design | Proposed Design | Impact Assessment | Implementation Priority |
|------------------------|----------------|-----------------|-------------------|------------------------|
| Filter State Management | Mutable operations | Immutable FilterStateEngine | Critical - Prevents corruption | Emergency |
| Navigation System | Mixed responsibilities | Dedicated NavigationController | High - Clean separation | Current Sprint |
```

### Integration with Development Process
- **Evidence-Based Architecture:** Convert investigation findings into systematic design solutions
- **Framework Prevention:** Ensure architectural decisions prevent recurrence of design issues
- **Implementation Readiness:** Architectural specifications enable immediate developer execution
- **PUML Integration**: All architectural analysis results in updated system diagrams and documentation

## Task Reference
- See sprint-0, task-5.1 for PlantUML specification and architectural documentation.

## PlantUML Rendering Procedure (Architect)

1. Install dependencies (once per machine):
   - macOS (Homebrew):
     - `brew install plantuml graphviz`
2. Render all PUMLs to SVG:
   - From the project root:
     - `plantuml -tsvg src/puml/*.puml`
3. Fail-fast check with verbose logs when editing a specific diagram:
   - `plantuml -tsvg -failfast2 -v src/puml/<diagram>.puml`
4. Verify outputs:
   - Ensure corresponding `.svg` files are created next to `.puml` files under `src/puml/`.
5. Commit artifacts:
   - Include updated `.puml` and generated `.svg` files in the same commit for traceability.
6. CI note:
   - Add a CI step to render PUML (`plantuml -tsvg src/puml/*.puml`) to catch syntax regressions.

---

# Architect First Principles & Learnings (Canonical)

## CMMI Level 4 Feedback & Learning
- All architectural process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant debugging or integration session, summarize what was learned and how it will change future architecture or process.

## Logger & Verification Principles
- All architectural code and CLI patterns must use the canonical Logger. Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.

## Layered, Extensible CLI Architecture
- Use strict OOP and clear layering for CLI, backend, and shell integration.
- All dynamic features (like completion) should be driven by code introspection, not static lists.
- Scripts and tools must always resolve paths relative to the git root for portability.

## Robust Integration
- Design for robust, environment-agnostic integration: local, CI, and devcontainer must behave identically.
- Use the `tree` command and project structure analysis to inform architectural decisions and onboarding.

## Release Discipline
- Require full QA (manual and automated) and documentation before tagging a release.
- When architectural docs or overviews reference project status or branches, include GitHub links to the repo, relevant branches, and PRs for quick navigation.

---

**Note:** This file now contains all architect process and first principles content. The duplicate in `src/architect/process.md` has been removed to prevent future confusion. All architect process documentation must reside here.

## PDCA Requirement (Shared)
- Use the shared PDCA template at `scrum.pmo/roles/_shared/PDCA/template.md`.
- After each QA/user prompt or significant architectural action, create a UTC-named PDCA entry under `scrum.pmo/roles/Architect/PDCA/`.
- In Check, include concrete evidence (tree, rg, git logs) and a verbatim quote of the QA prompt.
- Plan must include bold-labelled subsections: Objective, Scope, Targets (metrics), Inputs, Acceptance Criteria, Assumptions, Constraints, Options Considered, Rationale for Selected Option, Risks and Mitigations.

## Recovery → PDCA → Commit & Push (Enforced)
- After recovery or any QA prompt: perform recovery, write PDCA (UTC, QA quote, Actions with artifact links), then commit and push immediately.

## Linking Policy (GitHub-first dual-linking)
- Always provide both links in this order where applicable:
  - GitHub web link first, then the relative path link.
- Example:
  - `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/<branch>/scrum.pmo/roles/Architect/process.md): [scrum.pmo/roles/Architect/process.md](../../scrum.pmo/roles/Architect/process.md)`
