# Canonical Task and Subtask Naming & Numbering Conventions

## Purpose
To ensure all tasks and subtasks across the project are consistently named, numbered, and easy to reference, supporting CMMI Level 4 traceability and continuous improvement.

- **Main Tasks:**
  - Format: `task-<number>-<short-description>.md`
  - Example: `task-1-tssh-wrapper.md`
  - **PO tasks are always main tasks** (e.g., `task-2-po-submodule-management-tool.md`).
  - Only PO documentation or requirement breakdowns are subtasks (e.g., `task-2.1-po-requirements.md`).
- **Subtasks:**
  - Format: `task-<main-number>.<subnumber>-<role>-<short-description>.md`
  - Example: `task-1.2-developer-tssh-wrapper.md`
  - Subtasks must always indicate the affected role (developer, tester, po, etc.)
  - Subtasks must be ordered sequentially (1.1, 1.2, 1.3, ...), with no duplicates or gaps.
  - If a blocking dependency is unavoidable, the Scrum Master is responsible for reordering or splitting tasks.
- **Templates:**
  - See `scrum.pmo/roles/PO/sprint-n-template/task-0-example-task.md` and `task-0.1-example-subtask.md` for canonical templates.

- Number all main tasks and subtasks sequentially within each sprint or context.
- **PO tasks are always main tasks (e.g., task-2-po-...).**
- Subtasks always start at `.1` (e.g., `task-1.1-...`), and increment by one for each new subtask.
- Never duplicate subtask numbers within the same main task.
- Always update all cross-links and references when renaming or reordering tasks.

## Where to Document
- This file: `docs/canonical-task-naming-conventions.md` (link from README)
- Reference in all process.md files for each role (Developer, Tester, PO, etc.)
- Sprint planning and wrapper files must link to this canonical convention.

## Example
```
task-1-tssh-wrapper.md
  task-1.1-architect-tssh-spec.md
  task-1.2-developer-tssh-wrapper.md
  task-1.3-developer-tssh-backend.md
  task-1.4-developer-tssh-completion.md
  task-1.5-po-document-tssh.md
  task-1.6-tester-completion-tests.md
  task-1.7-tester-tssh-testcases.md
task-2-po-submodule-management-tool.md
  task-2.1-po-requirements.md
  task-2.2-developer-implementation.md
```

## Lessons Learned from Renumbering
- Inconsistent or duplicate numbering leads to confusion, broken links, and wasted time.
- Always check for existing files and links before renaming or creating new tasks.
- Use a single canonical source for conventions and update all process docs and planning files when changes are made.
- Automate cross-link updates where possible.
- CMMI 4 requires traceability: every change in task structure must be reflected in documentation and process files.

---

[Back to README](../README.md)
