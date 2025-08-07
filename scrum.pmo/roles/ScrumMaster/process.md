
# First Principles for All Roles

- All scripts and tools (e.g., `oosh`) must be robustly callable from their own directory, from the PATH, or from the project root. Always resolve the project root dynamically to ensure correct CLI and environment behavior regardless of invocation location.
- **DO NOT REPEAT YOURSELF (DRY):** Never duplicate logic, documentation, or code. If you find repetition, always suggest and implement consolidation. Refactor or centralize repeated logic, scripts, or documentation to a single canonical location. This applies to all roles and all artifacts (code, scripts, docs, process).

# Commit & Push Best Practices

As Scrum Master, ensure the following best practices for committing and pushing changes:
- Commit and push after any significant process, template, or documentation update.
- Commit after resolving dependencies or reordering tasks to remove blockers.
- Push before sprint reviews or handoffs to ensure the team works with the latest state.
- Commit and push after incorporating QA feedback or audit learnings.
- Always document the reason for each commit in the commit message for traceability.
- TRON Operational Rule: After each TRON prompt that results in changes, immediately commit and push.
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
- Oversee the creation of the SCRUM management structure.
- Ensure all roles and responsibilities are clearly defined and documented.
- Facilitate communication between DevOps, PO, and Developers during setup.
- Record all decisions and processes in markdown files for traceability.

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. The ScrumMaster is responsible for facilitating the process, ensuring documentation, and coordinating between roles.

---
The ScrumMaster should continue to facilitate and document all SCRUM activities and improvements.
