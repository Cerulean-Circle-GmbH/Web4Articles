[Back to Sprint 12 Planning](./planning.md)

# Task 12.2: Comprehensive Sprint Cleanup

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Execute comprehensive cleanup of all sprints to ensure consistent structure per Sprint 0 Task 8 standards.

## Context
Review of all sprints revealed multiple structural inconsistencies:
- Mixed naming patterns
- Missing role indicators
- Inconsistent major vs refinement task numbering
- Some sprints missing planning.md

## Intention
Bring all sprints to standard structure before it becomes harder to fix.

## Issues by Sprint

### Critical Issues
1. **Sprint 0**: Mixed task-X and task-X.Y patterns
2. **Sprint 1**: Duplicate task-1-tssh-wrapper.md
3. **Sprint 9**: Missing planning.md

### Moderate Issues
4. **Sprint 2**: Has task-1.md (unclear if major or summary)
5. **Sprint 3**: Very long task numbers (up to 1.15)
6. **Sprint 7**: Appears to duplicate Sprint 5 tasks

### Minor Issues
7. **Sprint 6**: Check role naming in refinements
8. **Sprint 8**: Has requirements but no tasks
9. **Sprint 10**: Empty directory

### Future Sprints (OK as-is)
- Sprint 13-18: Planning only (not yet executed)
- Sprint 17: Has planning-preview.md

## Cleanup Phases

### Phase 1: Critical Fixes
- Fix Sprint 0 foundation structure
- Resolve Sprint 1 duplicates
- Add Sprint 9 planning

### Phase 2: Standardization
- Ensure all refinements have roles
- Fix numbering consistency
- Clarify major vs refinement tasks

### Phase 3: Validation
- Run validation against all sprints
- Document findings
- Update automated checking

## Requirements
- Preserve git history with git mv
- Document all changes
- Update planning files
- Maintain traceability

## Acceptance Criteria
- [ ] All sprints follow standard structure
- [ ] No duplicate task files
- [ ] All refinements have role indicators
- [ ] Validation checklist passes

## Subtasks
- Task 12.2.1 (ScrumMaster): Fix Sprint 0-3 structures
- Task 12.2.2 (ScrumMaster): Fix Sprint 5-9 structures
- Task 12.2.3 (Developer): Create validation script
- Task 12.2.4 (QA): Validate all changes