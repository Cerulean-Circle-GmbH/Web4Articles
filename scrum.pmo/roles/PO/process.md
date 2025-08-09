# Product Owner (PO) Role Process

## CMMI Level 4 Feedback & Learning
- All process improvements, debugging lessons, and cross-role feedback must be documented in this file for traceability and continuous improvement.
- After any significant requirements change, debugging, or integration session, summarize what was learned and how it will change future requirements or documentation.
 - QA feedback recording: Do not summarize stakeholder/PO feedback. Capture it verbatim as a blockquote with an explicit UTC timestamp (ISO-8601). Include backlinks to the relevant sprint/task.

## Logger & Verification Principles
- All requirements, documentation, and automation must reference the canonical Logger and verification principles where applicable. Logging must be environment-aware, non-intrusive in production, and support traceability for debugging and process improvement.
- After any automated or scripted action, always verify the intended effect (e.g., file creation, output, or state change) and document any discrepancies for process improvement.

## Role Definition
The Product Owner (PO) is responsible for defining the vision, requirements, and priorities of the project. The PO ensures that the project delivers value to stakeholders and that all documentation and artifacts align with business goals.

## Responsibilities

## Task Reference
See `sprint-0` tasks for detailed step-by-step initialization and setup instructions. The PO is responsible for defining requirements, reviewing structure, and ensuring documentation aligns with project goals.

The PO should continue to refine requirements and documentation as the project progresses.

# Product Owner (PO) Process

## Role Definition
The Product Owner is responsible for defining, prioritizing, and maintaining the product backlog, writing clear and actionable tasks, and ensuring all tasks and subtasks are consistent with the sprint planning.

- All tasks and subtasks must follow the template structure provided in `sprint-n-template`.
- Each sprint must have a `planning.md` file that lists all tasks and their priorities, and each task/subtask must backlink to the planning file and its parent task.
- When writing a new task or subtask, copy the relevant template from `sprint-n-template` and update the content as needed.
- Subtasks must always indicate the affected role in the filename (see naming conventions in the templates).
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.
- Ensure all links, statuses, and priorities are correct and consistent with `planning.md`.
- Review and update the planning file whenever tasks or subtasks are added, removed, or reprioritized.

## Referenced Templates
- [Sprint Planning Template](./sprint-n-template/planning.md)
- [Task Template](./sprint-n-template/task-0-example-task.md)
- [Subtask Template](./sprint-n-template/task-0.1-example-subtask.md)

## How to Use the Templates

### Step-by-Step Task Creation & Planning Update Process

1. **Create or Update Sprint Planning**
   - Copy the `planning.md` template into the new sprint folder if not present.
   - Set the sprint goal and list all tasks in priority order.
   - For each task, add a checklist entry with a link to the task file (e.g., `[Task 1: ...](./task-1-example.md)`).

2. **Create a New Task**
   - Copy the task template and name the file using the convention `task-<number>-<short-description>.md`.
   - Fill in all required sections: naming conventions, status, description, context, intention, steps, requirements, acceptance criteria, QA audit, and subtasks.
   - At the top of the task file, add a backlink to the sprint's `planning.md` (e.g., `[Back to Sprint 1 Planning](./planning.md)`).
   - Add the new task to the sprint's `planning.md` if not already present.

3. **Add Subtasks**
   - For each subtask, copy the subtask template and name the file using the convention `task-<number>.<subnumber>-<role>-<short-description>.md`.
   - Fill in all required sections for the subtask, including the full status breakdown (Planned, In Progress, QA Review, Done, with all sub-statuses).
   - Link each subtask from the parent task's "Subtasks" section, and ensure the status format matches the template.
   - Add a backlink at the top of each subtask to its parent task, using the correct format (e.g., `[Back to Main Task](./task-1-tssh-wrapper.md)`).
   - Add a Subtasks section to each subtask, even if it is atomic ("None (atomic subtask for this sprint)").
   - Ensure each subtask is also listed in the sprint's `planning.md` under its parent task.
   - Checklist for each subtask:
     - [ ] Full status breakdown present
     - [ ] Backlink to parent task present and correct
     - [ ] Subtasks section present (even if atomic)
     - [ ] Listed in parent task and planning.md
     - [ ] All links work

4. **Check Backlinks and Navigation**
   - Ensure every task links back to its sprint planning file.
   - Ensure every subtask links back to its parent task.
   - Verify that all links in planning, tasks, and subtasks are correct and not broken.

5. **Check Dependencies and Order**
   - Review all tasks and subtasks for dependencies.
   - Subtasks must be ordered to avoid blocking dependencies. If unavoidable, notify the Scrum Master to resolve by reordering or splitting tasks.
   - Update the planning file if task order or dependencies change.

6. **Final Review**
   - Before starting the sprint, review all planning, tasks, and subtasks for completeness, correct links, and compliance with templates.
   - Ensure all QA audit and feedback sections are present and ready for use.

**Tip:**
Following this process ensures traceability, rapid onboarding, and minimal user intervention. The PO should proactively maintain planning, links, and task structure to keep the project audit-ready and reduce the need for external corrections.

---

**AI Role Switching Protocol:**

When the Scrum Master requests a new task or task update, the AI must:
1. Switch to the Product Owner (PO) role.
2. Read and follow this process.md in full.
3. Create or update the task and planning as a PO, ensuring full compliance with all templates and process steps.
4. Only after the task is complete and compliant, switch back to the Scrum Master role and report the result to the user, showing exactly what the PO did.

## Best Practices
- Use clear, concise language and actionable steps.
- Keep all documentation up-to-date and reviewed by the team.
- Capture QA feedback and audit learnings in each task's QA section.

## Managing Sprint Requirements (requiremnents.md)
- Each sprint may contain a `requiremnents.md` listing unchecked requirements.
- For every new requirement, create a MAIN task and optional SUBTASKS:
  - Generate a UUID v4 and include it in the MAIN task in the form `[requirement:uuid:<uuidv4>]` on a dedicated line near the top. Make it a backlink to `requiremnents.md`.
  - Enrich the original requirement entry in `requiremnents.md` by appending the same UUID tag and a markdown link to the MAIN task for traceability.
  - Add a unique task UUID line to each MAIN task using `[task:uuid:<uuidv4>]` and to each SUBTASK using `[subtask:uuid:<uuidv4>]` within the first block of the document.
  - MAIN task naming scheme: `task-<N>-<short-name>.md` where `<N>` is the next integer starting at 1. MAIN tasks can have Status: Planned, In Progress (refinement/implementing/testing), QA Review, Done.
  - If the MAIN task is in refinement, create role-specific SUBTASKS: `task-<N>.<M>-<role>-<short-name>.md` where `<M>` starts at 1. SUBTASKS do not have a refinement phase; they use Planned/In Progress/QA Review/Done only.
  - Update `planning.md` to list the MAIN tasks. Optionally list SUBTASKS indented under their MAIN task.
  - After implementation and verification, check off the corresponding requirement in `requiremnents.md`.
- Ensure backlinks: the task must start with `[Back to Planning](./planning.md)` as the first line.
 - Add a "Traceability" section to each task per Sprint 2 pattern:
   - MAIN tasks: include an Up item linking to `[requirement:uuid:<uuidv4>]` in `requiremnents.md` and a Down list linking to each subtask.
   - SUBTASKS: include an Up list linking to the requirement UUID and the parent MAIN task; Down may be omitted unless deeper subtasks exist.

### PO Cross-Reference Checklist (DO NOT SKIP)
- [ ] When adding or modifying tasks in planning, immediately update `requiremnents.md` to include:
  - The requirement entry with `[requirement:uuid:<uuidv4>]` and a link to the MAIN task
  - The status checkbox (unchecked until delivered)
- [ ] Ensure every new MAIN task contains a backlink to `requiremnents.md` with the same UUID.
- [ ] Re-run a quick link check: planning ↔ tasks ↔ subtasks ↔ requiremnents.md.
