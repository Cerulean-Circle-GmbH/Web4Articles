[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 5: Split Multiple Interface Files
[task:uuid:i9j0k1l2-m3n4-5678-ijkl-m90123456789]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-5.1-developer-split-user-interfaces.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Add `[task:uuid:i9j0k1l2-m3n4-5678-ijkl-m90123456789]` to this task.
- Source: Web4 Compliance Violation Analysis - Single Responsibility Violations

  - up
    - [Web4 Compliance Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0720-web4-compliance-violation-analysis-resolution-strategy.pdca.md)


  - down
    - [Task 5.1: Developer - Split User 0.3.0.2 Interfaces](./task-5.1-developer-split-user-interfaces.md)
    - [Task 5.2: Developer - Split ONCE ServiceRegistry Interfaces](./task-5.2-developer-split-once-interfaces.md)
    - [Task 5.3: Developer - Split HttpServer Interfaces](./task-5.3-developer-split-httpserver-interfaces.md)


## Task Description
Split multiple interface files that violate Web4 single responsibility principle into separate files, following User 0.3.0.4 pattern where each interface has its own file.

## Context
Current violations of "one interface per file" principle:
- User/0.3.0.2/UserModel.interface.ts: 4 interfaces (UserProfile, UserSettings, UserModel, AuthCredentials)
- ONCE/0.3.0.2/ServiceRegistry.interface.ts: 2 interfaces (ServiceRegistration, ServiceRegistry)
- HttpServer/0.3.0.2/HttpServer.interface.ts: 2 interfaces (ServiceCapable, HttpServer)

## Intention
Implement Web4 single responsibility principle by ensuring each interface file contains only one interface definition, making interfaces easier to maintain, test, and reuse independently.

## Steps
1. Split User/0.3.0.2 UserModel.interface.ts into 4 separate files
2. Split ONCE/0.3.0.2 ServiceRegistry.interface.ts into 2 separate files
3. Split HttpServer/0.3.0.2 HttpServer.interface.ts into 2 separate files
4. Update all import statements to reference new interface files
5. Verify all components build correctly after interface splitting
6. Apply User 0.3.0.4 naming patterns consistently

## Requirements
- Each interface must have its own file following naming convention
- User 0.3.0.4 pattern must be applied as template
- All import statements must be updated correctly
- No breaking changes to component functionality
- All builds must pass after interface splitting

## Acceptance Criteria
- [ ] User/0.3.0.2 has 4 separate interface files: UserProfile.interface.ts, UserSettings.interface.ts, UserModel.interface.ts, AuthCredentials.interface.ts
- [ ] ONCE/0.3.0.2 has 2 separate interface files: ServiceRegistration.interface.ts, ServiceRegistry.interface.ts
- [ ] HttpServer/0.3.0.2 has 2 separate interface files: ServiceCapable.interface.ts, HttpServer.interface.ts
- [ ] All import statements updated to reference new interface files
- [ ] All component builds pass without errors
- [ ] Interface naming follows User 0.3.0.4 pattern consistently
- [ ] No multiple interfaces remain in single files

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0730] QA review pending.
  - [ ] Issue: Multiple interfaces violate single responsibility
  - [ ] Resolution: Each interface in separate file following User 0.3.0.4 pattern
  - [ ] Example: Clean interface separation enables independent maintenance
- [ ] [2025-09-06-UTC-0730] Feedback to be collected after subtask completion.
  - [ ] Issue: Import statement correctness and build functionality
  - [ ] Resolution: Verify all references updated and components build
  - [ ] Example: All components maintain functionality with split interfaces