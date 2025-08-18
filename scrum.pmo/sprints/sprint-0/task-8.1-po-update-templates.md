[Back to Sprint 0 Planning](./planning.md) | [Back to Task 8](./task-8-sprint-structure-enforcement.md)

# Task 8.1: PO - Update Sprint Templates

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Update the PO sprint-n-template to enforce proper sprint structure and prevent future structural drift.

## Context
The current template doesn't explicitly prevent subfolders or clarify major vs refinement task patterns.

## Intention
Make it impossible to create sprints with incorrect structure by having clear templates and examples.

## Steps
1. Update `planning.md` template with structure checklist
2. Create `task-X.Y-major-example.md` template
3. Update `task-X.Y.Z-role-refinement.md` template
4. Add "Sprint Structure Rules" section to planning template
5. Include validation checklist in planning template

## Template Updates

### Planning Template Addition
```markdown
## Sprint Structure Checklist
- [ ] All tasks in sprint root (NO subfolders)
- [ ] Major tasks named: task-X.Y-description.md
- [ ] Refinements named: task-X.Y.Z-role-description.md
- [ ] Roles in refinements: scrummaster, developer, po, architect, qa, devops
```

### Example Structure Section
```
sprint-X/
├── planning.md
├── requirements.md (optional)
├── task-X.1-major-deliverable.md
├── task-X.1.1-developer-implementation.md
├── task-X.1.2-qa-testing.md
└── task-X.2-another-major-task.md
```

## Requirements
- Templates must be crystal clear
- Examples must show both patterns
- Checklist must be mandatory

## Acceptance Criteria
- [ ] Planning template includes structure rules
- [ ] Major task template created
- [ ] Refinement template updated with role requirement
- [ ] Examples show correct patterns