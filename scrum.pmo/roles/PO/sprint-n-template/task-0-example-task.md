
[Back to Planning](./planning.md)

# Task 0: Example Task Title

[task:uuid:<uuidv4>]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-1.1-developer-setup.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Describe the purpose and scope of this task.

## Context
Provide any background or context needed for this task.

## Intention
Clarify the intent and expected outcome.

## Steps
- List the steps required to complete this task.

## Requirements
- List the requirements for this task.
 - Include `[requirement:uuid:<uuidv4>]` backlink to `requiremnents.md` if derived from a requirement.
 - Ensure bidirectional links: task → requirements and requirements → task.

## Acceptance Criteria
- List the acceptance criteria for this task.

## QA Audit & User Feedback
- [ ] QA review pending.
- [ ] Feedback to be collected after task completion.

## Subtasks
- [ ] [Task 0.1: Example Subtask](./task-0.1-example-subtask.md)

---

## Traceability
- Add `[task:uuid:<uuidv4>]` to this task.
- For each subtask, add `[subtask:uuid:<uuidv4>]`.
- If the task is requirement-driven, add `[requirement:uuid:<uuidv4>]` and backlink to `requiremnents.md`.
- In `requiremnents.md`, append the same UUID and a link back to this task (`([task-<n>](./task-<n>-<name>.md))`).

---

[Back to Planning](./planning.md)
