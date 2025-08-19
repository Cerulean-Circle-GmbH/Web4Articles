[Back to Sprint 0 Planning](./planning.md)

# Task 8: Sprint Structure Enforcement

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Establish and enforce the standard sprint folder structure for all future sprints. Document the requirements and update templates to prevent structural drift.

## Context
Sprint 12 cleanup revealed issues with task organization:
- Tasks were placed in a subfolder `tasks/`
- No clear distinction between major tasks and role-based refinements
- Naming convention not enforced

## Intention
Ensure all future sprints follow the standard structure automatically.

## Sprint Structure Standard

### Required Structure
```
sprint-X/
├── planning.md              # Sprint planning document
├── requirements.md          # Optional requirements
├── task-X.Y-description.md  # Major tasks (deliverables)
└── task-X.Y.Z-role-desc.md  # Role-based refinements
```

### Rules
1. **NO subfolders** - All tasks at sprint root level
2. **Major tasks** - Primary deliverables (task-X.Y)
3. **Refinements** - Supporting work by role (task-X.Y.Z-role)
4. **Flat structure** - Everything in one directory

### Naming Convention
- Major task: `task-{sprint}.{task}-{description}.md`
- Refinement: `task-{sprint}.{task}.{subtask}-{role}-{description}.md`
- Role must be: scrummaster, developer, po, architect, qa, devops

## Steps
1. Update PO sprint template with structure rules
2. Add validation checklist to planning template
3. Create example showing major vs refinement tasks
4. Document in recovery process

## Requirements
- Sprint template must enforce flat structure
- Planning template must include structure checklist
- Examples must show correct naming

## Acceptance Criteria
- [ ] PO template updated with structure rules
- [ ] Planning template includes validation checklist
- [ ] Example tasks show major vs refinement pattern
- [ ] Recovery process validates sprint structure

## Subtasks
- Task 8.1 (PO): Update sprint templates
- Task 8.2 (ScrumMaster): Add to recovery validation
- Task 8.3 (Developer): Create structure validation script