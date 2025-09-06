[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 12: Implement Unit LD Links Speaking Name Resolution System
[task:uuid:k1l2m3n4-o5p6-7890-klmn-o12345678901]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-12.1-developer-speaking-name-resolution.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done

## Traceability
- Add `[task:uuid:k1l2m3n4-o5p6-7890-klmn-o12345678901]` to this task.
- Source: Unit Bootstrapping Research - LD Links System Implementation
```
  - up
    - [Unit Bootstrapping Research](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0820-unit-bootstrapping-ld-links-storage-research.pdca.md)
```
```
  - down
    - [Task 12.1: Developer - Speaking Name Resolution Implementation](./task-12.1-developer-speaking-name-resolution.md)
    - [Task 12.2: Developer - LD Links Management System](./task-12.2-developer-ld-links-management.md)
```

## Task Description
Implement Unit LD Links system that enables speaking name resolution to UUID storage locations, preventing inconsistency and bad redundancy by mapping human-readable names to unique identified units in central storage.

## Context
From TRON feedback: "the unit track the ld links to the central uuid storage. the ld link can have speaking names but always go to a unique identified unit in the storage, so prevent inconsistency and bad redundancy."

Current state: UnitIndexStorage exists but Unit component doesn't provide speaking name resolution interface for other components to use.

## Intention
Enable human-readable names (like "user-alice" or "server-main") to map to unique UUIDs in central storage, preventing naming conflicts and enabling consistent reference across the ecosystem while maintaining central storage integrity.

## Steps
1. Implement speaking name resolution methods in Unit component
2. Create LD links management system for symbolic link tracking
3. Enable speaking name registration and lookup functionality
4. Implement conflict prevention for duplicate speaking names
5. Provide API for other components to use speaking names
6. Test speaking name resolution with existing storage system

## Requirements
- Speaking names must map to unique UUIDs in central storage
- Prevent multiple speaking names pointing to same UUID
- Prevent same speaking name pointing to different UUIDs
- All components can use speaking name resolution via Unit API
- Speaking names resolve to proper scenarios/index/ storage locations
- LD links tracking maintains symbolic link integrity

## Acceptance Criteria
- [ ] Speaking name resolution API implemented in Unit component
- [ ] Speaking names map uniquely to UUID storage locations
- [ ] Conflict prevention for duplicate names implemented
- [ ] LD links management tracks all symbolic links properly
- [ ] Other components can register and resolve speaking names
- [ ] Speaking name resolution works with existing scenarios/index/ system
- [ ] No inconsistency or bad redundancy in name mapping
- [ ] All speaking names resolve to unique identified units

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0830] QA review pending.
  - [ ] Issue: Speaking names must prevent inconsistency and redundancy
  - [ ] Resolution: Unique mapping to central UUID storage
  - [ ] Example: "user-alice" always maps to same UUID, prevents conflicts
- [ ] [2025-09-06-UTC-0830] Feedback to be collected after subtask completion.
  - [ ] Issue: LD links tracking and symbolic link management
  - [ ] Resolution: Verify proper symbolic link lifecycle management
  - [ ] Example: Speaking names maintain consistency across component references