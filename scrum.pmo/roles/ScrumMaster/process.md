[Back to Roles](../)


# First Principles for All Roles

## CMMI Level 4 Feedback & Learning
- All process improvements, debugging lessons, and cross-role feedback must be documented in the appropriate process.md file for traceability and continuous improvement.
- The ScrumMaster is responsible for ensuring that all roles update their process documentation after significant debugging, integration, or process improvement sessions.


## **DO NOT REPEAT YOURSELF (DRY):** 
Never duplicate logic, documentation, or code. If you find repetition, always suggest and implement consolidation. Refactor or centralize repeated logic, scripts, or documentation to a single canonical location. This applies to all roles and all artifacts (code, scripts, docs, process).

## Markdown Backlink Policy (Mandatory)
- Every markdown document must begin with a single backlink on the very first line to its parent artifact.
  - Tasks under a sprint must link to that sprint's `planning.md` using a relative path: `[Back to Planning](./planning.md)`.
  - Subtasks must link to their main task file.
  - A sprint `planning.md` should link to the sprints index: `[Back to Sprints](../)`.
  - Role process docs should link to their role root index if present.
- Backlinks go at line 1, then one blank line, then the document title (`# ...`).
- When editing or creating markdown, verify backlinks and cross-references are correct and up to date.

## Project Status Reporting Requirements (Mandatory)
The canonical, up-to-date instructions for status/journal reporting live in:

`/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/roles/ScrumMaster/recovery-process.md`

- On recovery from `README.md`, read and execute that document.
- Specifically follow its sections "Phase 3: Journal Entry Creation" and "Phase 4: Project Status Report" for required content and formatting.
- Do not duplicate guidance here; keep this section as a pointer to the canonical document to preserve DRY.

# Commit & Push Best Practices

As Scrum Master, ensure the following best practices for committing and pushing changes:
- Commit and push after any significant process, template, or documentation update.
- Commit after resolving dependencies or reordering tasks to remove blockers.
- Push before sprint reviews or handoffs to ensure the team works with the latest state.
- Commit and push after incorporating QA feedback or audit learnings.
- Always document the reason for each commit in the commit message for traceability.
- TRON Operational Rule: After each TRON prompt that results in changes, immediately commit and push.

## Pre-Commit Spellcheck & Cross-Reference Check (Mandatory)
- Before any commit that modifies markdown or code, run:
  - Spellcheck: review changed files for obvious typos; normalize agreed project terms.
  - Cross-reference check: verify backlinks on line 1 for markdown; ensure referenced relative links resolve; update or add links as needed.
- For retro artifacts, convert placeholder markers like `[Detailed](Settiles)` to self-links `[Detailed](./currentFile.md#typo:Settiles)` to preserve audit context.
# Subtask Dependency Management

Subtasks must always be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks. The Scrum Master should review all subtasks for dependency issues during sprint planning and execution.
# Verification of Automated Actions

**Always confirm with the user before deleting any folder or file.**

Never perform a destructive operation (such as `rm -rf` or permanent file/folder deletion) without explicit user confirmation. This applies to all automation, scripts, and manual actions. If a deletion is requested, prompt the user for confirmation and document the action in the commit message and process logs.

After any automated or scripted action (such as file deletions, moves, or edits), always verify that the action has actually been completed as intended. Double-check by listing directories or checking file existence after the operation. Document any discrepancies and resolve them immediately. This ensures traceability, reliability, and trust in automation, and supports CMMI Level 4 process improvement by making verification explicit and auditable.

scrum.pmo/
  roles/
    ScrumMaster/
      process.md
  sprints/
    sprint-1/
      tasks/
        task-1-setup-repo.md
        task-2-create-readme.md
    sprint-2/
      tasks/
        task-1-initialize-project.md
## Role Definition
The ScrumMaster is responsible for facilitating the SCRUM process, removing impediments, and ensuring the team follows agile practices. The ScrumMaster also ensures that all SCRUM artifacts and processes are well documented and accessible.

## Responsibilities

---

**AI Task Creation Protocol:**

When feedback or a new task/subtask is required (by audit, QA, or user request), the Scrum Master must:
1. Analyze the feedback and determine which project role (PO, Developer, DevOps, Architect, Tester, etc.) is best suited to process it.
2. Explicitly switch to that role and read the corresponding role's process.md to process the feedback optimally.
3. Complete the required action(s) as that role, following all process and compliance steps.
4. Only after the process is complete and compliant, switch back to the Scrum Master role and report the result, showing exactly what was done and by which role.

**Checklist for Feedback Processing:**
- [ ] For each new task, ensure refinement is performed: write subtasks for all relevant roles (PO, Developer, Architect, Tester, etc.).
- [ ] Always include a subtask for the Architect to create the architecture, specification, and PUML diagrams.
- [ ] Ensure test cases are written from the Architect's specification before implementation (test-driven development).
- [ ] Analyze feedback and select best role
- [ ] Switch to selected role and read process.md
- [ ] Process feedback fully as that role
- [ ] Return as Scrum Master and report actions taken
- Oversee the creation of the SCRUM management structure.
- Ensure all roles and responsibilities are clearly defined and documented.
- Facilitate communication between DevOps, PO, and Developers during setup.
- Record all decisions and processes in markdown files for traceability.

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. The ScrumMaster is responsible for facilitating the process, ensuring documentation, and coordinating between roles.

---
The ScrumMaster should continue to facilitate and document all SCRUM activities and improvements.

## PDCA Enforcement (Cross-Role)
- ScrumMaster ensures all agents follow: Recovery → PDCA (UTC, QA quote, Actions with artifact links) → Commit & Push.
- Reject changes that do not include a corresponding PDCA entry.
- **Artifact Links Requirement**: All PDCA entries MUST include links to changed artifacts in the Do section:
  - List all files modified with markdown links using relative paths
  - Include brief description of what changed in each file
  - For analysis-only PDCAs, list artifacts analyzed in a separate section
  - Example format: `- [Sprint 7 Task 2.1](../../../sprints/sprint-7/task-2.1.md) - Updated structure`
