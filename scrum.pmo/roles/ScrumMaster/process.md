# Subtask Dependency Management

Subtasks must always be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks. The Scrum Master should review all subtasks for dependency issues during sprint planning and execution.
# Verification of Automated Actions

Always verify that every automated or scripted action (such as file deletions, moves, or edits) has actually been completed as intended. Double-check by listing directories or checking file existence after the operation. Document any discrepancies and resolve them immediately. This ensures traceability, reliability, and trust in automation, and supports CMMI Level 4 process improvement by making verification explicit and auditable.
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
