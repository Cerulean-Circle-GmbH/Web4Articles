[Back to Planning Sprint 20](./planning.md)

# Task 16: High Priority Scenario Migration Strategy - Read/Recreate/Replace LD Links
[task:uuid:p7q8r9s0-t1u2-3456-pqrs-t78901234567]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-16.1-developer-scenario-read-recreate.md`)
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

## Traceability
- Add `[task:uuid:p7q8r9s0-t1u2-3456-pqrs-t78901234567]` to this task.
- Source: Task 13 Research - TRON Decision on Migration Strategy
```
  - up
    - [Task 13 Research PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1640-task-13-scenario-format-research.pdca.md)
```
```
  - down
    - [Task 16.1: Developer - Implement Scenario Read/Recreate Engine](./task-16.1-developer-scenario-read-recreate.md)
    - [Task 16.2: Developer - LD Links Replacement System](./task-16.2-developer-ld-links-replacement.md)
```

## Task Description
Implement high priority scenario migration strategy: Read existing scenarios with referenced version, use model to create new command (requirement/unit) in new version with new UUID and format, delete old scenario, replace LD links keeping original names.

## Context
From TRON Decision 1: Instead of in-place format migration, create entirely new scenarios with new UUIDs using the correct Web4 format, then replace the LD links to point to new scenarios while preserving the original link names. This ensures clean Web4 compliance without format conversion risks.

## Intention
Migrate 57 old-format scenarios to Web4 standard by recreating them with proper format rather than converting, ensuring zero format inconsistencies and maintaining all existing LD link functionality.

## Steps
1. Read existing scenario with old format (IOR uppercase, v1.0, base64 owner)
2. Extract model data from old scenario
3. Create new command instance (requirement/unit) with extracted model
4. Generate new scenario with new UUID and Web4 format (ior lowercase, 0.3.0.4, JSON owner)
5. Save new scenario to central storage
6. Update all LD links from old UUID to new UUID, keeping original link names
7. Delete old scenario file
8. Validate all links work with new scenario

## Requirements
- Read old scenarios and extract model data correctly
- Create new command instances (requirement 0.3.0.4, unit 0.3.0.4) from model data
- Generate new UUIDs for recreated scenarios
- Maintain all existing LD link names during replacement
- Ensure Web4 format compliance (lowercase ior, semantic versioning, JSON owner)
- Preserve all functionality after migration
- Clean up old scenario files after successful migration

## Acceptance Criteria
- [ ] 57 old-format scenarios successfully read and model data extracted
- [ ] New command instances created with extracted model data
- [ ] New scenarios generated with Web4 compliant format and new UUIDs
- [ ] All LD links updated to point to new scenarios with original names preserved
- [ ] Old scenario files removed after successful migration
- [ ] All existing functionality continues to work with new scenarios
- [ ] Zero format inconsistencies remain in central storage
- [ ] Migration process is reversible if needed

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1720] TRON Decision Implementation
  ```quote
  1 read the existing scenarios with the referenced version. then use the model to create a new command to eg requirement or unit in the new version and let it create a new unit with a new uuid and format. then delete the one that was just loaded and replace the ln links from the old by ln links to the new keeping their names. cteate a high priority task from this!
  ```
  - [ ] Issue: Need high priority task for read/recreate/replace strategy
  - [ ] Resolution: Created Task 16 with read/recreate/replace LD links approach
  - [ ] Example: Old scenario → extract model → new requirement 0.3.0.4 → new UUID → replace LD links

## Dependencies
- Requires Requirement component migration to v0.3.0.4 (see Task 17)
- Migration should be postponed until Requirement v0.3.0.4 is available