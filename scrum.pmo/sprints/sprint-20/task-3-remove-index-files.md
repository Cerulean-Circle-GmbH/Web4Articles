[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 3: Remove All Index Files
[task:uuid:e5f6g7h8-i9j0-1234-efgh-i56789012345]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-3.1-developer-delete-index-files.md`)
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
- Add `[task:uuid:e5f6g7h8-i9j0-1234-efgh-i56789012345]` to this task.
- Source: Web4 Compliance Violation Analysis - Index File Architectural Violations

  - up
    - [Web4 Compliance Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0720-web4-compliance-violation-analysis-resolution-strategy.pdca.md)


  - down
    - [Task 3.1: Developer - Delete Index Files](./task-3.1-developer-delete-index-files.md)
    - [Task 3.2: Developer - Move Exports to Interface Files](./task-3.2-developer-move-exports.md)


## Task Description
Remove all 16 identified index.ts files that violate Web4 interface-first dependency principle. Index files create hidden dependencies and violate component isolation by aggregating functionality instead of exposing it through clean interfaces.

## Context
Current state shows 16 index.ts files across components:
- Scenario/0.3.0.4/src/index.ts
- IOR/0.3.0.3/src/index.ts
- User/0.3.0.2/src/index.ts
- Plus 13 more across various components
These violate Web4 architecture requiring interface-first design.

## Intention
Eliminate Web4 architectural violations by removing index files and moving exports to layer3 interface files following ONCE 0.3.0.2 pattern, ensuring clean component interfaces and proper dependency management.

## Steps
1. Identify all 16 index.ts files for removal
2. Extract export functionality from each index file
3. Move exports to appropriate layer3 interface files
4. Update import paths to reference interface files directly
5. Verify all components build and function correctly
6. Delete index files after successful migration

## Requirements
- All 16 index.ts files must be removed
- Export functionality moved to layer3 interface files
- Follow ONCE 0.3.0.2 pattern for integrated exports
- No breaking changes to component functionality
- All builds must pass after index file removal

## Acceptance Criteria
- [ ] All 16 index.ts files are deleted from components
- [ ] Export functionality moved to layer3 interface files
- [ ] Components follow ONCE pattern: exports at bottom of interface files
- [ ] All import paths updated to reference interface files directly
- [ ] All component builds pass without errors
- [ ] Component functionality remains intact
- [ ] No remaining index.ts files in 0.3.0.2+ components

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0730] QA review pending.
  - [ ] Issue: Index files violate Web4 interface-first principle
  - [ ] Resolution: Clean interface-based exports implemented
  - [ ] Example: ONCE 0.3.0.2 pattern applied consistently
- [ ] [2025-09-06-UTC-0730] Feedback to be collected after subtask completion.
  - [ ] Issue: Component builds and import functionality
  - [ ] Resolution: Verify no breaking changes to dependencies
  - [ ] Example: All components maintain proper interface exposure