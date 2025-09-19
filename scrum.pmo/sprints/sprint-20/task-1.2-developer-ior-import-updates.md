[Back to Main Task](./task-1-ior-single-source-truth.md)

# Task 1.2: Developer - Update All IOR Import References
[subtask:uuid:c3d4e5f6-g7h8-9012-cdef-g34567890123]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Update all import statements across components to reference IOR from the single source of truth (IOR/0.3.0.3) instead of local duplicate files.

## Context
After removing duplicate IOR interface files, all components must be updated to import IOR from the authoritative location to maintain functionality.

## Steps
1. Update User/0.3.0.4/src/ts/layer3/User.interface.ts import
2. Update User/0.3.0.4/src/ts/layer3/Scenario.interface.ts import
3. Update User/0.3.0.4/src/ts/layer2/DefaultUser.ts import
4. Update Scenario component imports in both 0.3.0.2 and 0.3.0.4
5. Update any other components referencing duplicate IOR files
6. Test all component builds pass

## Acceptance Criteria
- [ ] User/0.3.0.4 imports IOR from '../../../../IOR/0.3.0.3/dist/index.js'
- [ ] Scenario components import IOR from '../../../../IOR/0.3.0.3/dist/index.js'
- [ ] All affected components build without errors
- [ ] No remaining imports reference deleted IOR interface files
- [ ] Component functionality remains intact

## Subtasks
None (atomic subtask for this sprint)

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0730] QA review pending.
  - [ ] Issue: Import path correctness
  - [ ] Resolution: Verify all imports reference single source
  - [ ] Example: grep search shows consistent IOR import paths