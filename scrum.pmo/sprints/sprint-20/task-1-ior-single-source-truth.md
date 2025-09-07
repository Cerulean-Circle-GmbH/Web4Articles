[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 1: Establish Single Source of Truth for IOR Interface
[task:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-1.1-developer-ior-consolidation.md`)
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
- Add `[task:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890]` to this task.
- Source: Web4 Compliance Violation Analysis - IOR Duplication Resolution

  - up
    - [Web4 Compliance Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0720-web4-compliance-violation-analysis-resolution-strategy.pdca.md)


  - down
    - [Task 1.1: Developer - IOR Interface Consolidation](./task-1.1-developer-ior-consolidation.md)
    - [Task 1.2: Developer - Update All IOR Import References](./task-1.2-developer-ior-import-updates.md)


## Task Description
Establish IOR/0.3.0.3 as the single source of truth for IOR interface definition and eliminate all duplicate IOR interfaces across components. This addresses the critical DRY violation where IOR is duplicated in User/0.3.0.4, Scenario/0.3.0.2, and Scenario/0.3.0.4 components.

## Context
Current state shows IOR interface duplicated in 4+ locations with different definitions:
- IOR/0.3.0.3: Extended definition with location/endpoint fields (authoritative)
- User/0.3.0.4: Simple definition with only uuid/component/version
- Scenario components: Additional duplicates
This violates Web4 DRY principle and creates semantic inconsistency.

## Intention
Create single source of truth for IOR interface to maintain semantic consistency across all components and eliminate DRY violations that lead to version drift and maintenance issues.

## Steps
1. Validate IOR/0.3.0.3 as authoritative IOR definition
2. Remove duplicate IOR interface files from other components
3. Update all import statements to reference IOR/0.3.0.3
4. Verify all components build correctly with single IOR source
5. Test component interactions still work properly

## Requirements
- IOR/0.3.0.3 must be the single source of truth for IOR interface
- All duplicate IOR interfaces must be removed
- All components must import IOR from IOR/0.3.0.3/dist/index.js
- No breaking changes to component functionality
- All builds must pass after consolidation

## Acceptance Criteria
- [ ] IOR interface exists only in IOR/0.3.0.3/src/ts/layer3/IOR.interface.ts
- [ ] User/0.3.0.4/src/ts/layer3/IOR.interface.ts is deleted
- [ ] Scenario/0.3.0.2/src/ts/layer3/IOR.interface.ts is deleted  
- [ ] Scenario/0.3.0.4/src/ts/layer3/IOR.interface.ts is deleted
- [ ] All components import IOR from '../../../../IOR/0.3.0.3/dist/index.js'
- [ ] All component builds pass without errors
- [ ] User 0.3.0.4 CLI still functions correctly
- [ ] No duplicate IOR definitions exist in codebase

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0730] QA review pending.
  - [ ] Issue: Multiple IOR definitions cause semantic inconsistency
  - [ ] Resolution: Single source of truth established
  - [ ] Example: IOR/0.3.0.3 as authoritative definition
- [ ] [2025-09-06-UTC-0730] Feedback to be collected after subtask completion.
  - [ ] Issue: Component builds and functionality
  - [ ] Resolution: Verify no breaking changes
  - [ ] Example: User 0.3.0.4 CLI maintains functionality