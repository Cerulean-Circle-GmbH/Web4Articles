[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 15: Implement Unit Model Separation - UnitIndex as Unit Model
[task:uuid:n4o5p6q7-r8s9-0123-nopq-r45678901234]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-15.1-developer-unitindex-model.md`)
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
- Add `[task:uuid:n4o5p6q7-r8s9-0123-nopq-r45678901234]` to this task.
- Source: UnitIndex Model Research - Model Separation Architecture
```
  - up
    - [UnitIndex Model Research](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1010-unitindex-as-unit-model-research.pdca.md)
```
```
  - down
    - [Task 15.1: Developer - Replace Unit Model with UnitIndex Model](./task-15.1-developer-unitindex-model.md)
    - [Task 15.2: Developer - Update Requirement Model with Unit References](./task-15.2-developer-requirement-unit-references.md)
```

## Task Description
Implement proper Unit model separation where unitIndex becomes the actual Unit model containing storage capabilities, and Requirement models reference Units via IOR or complete scenario with UUIDv4 compliance.

## Context
Current Unit model contains Requirement-like attributes (name, description) while unitIndex contains actual Unit capabilities (indexPath, symlinkPaths). This violates proper model separation where Unit model should focus on storage/execution capabilities and Requirement models should handle specification/tracking.

## Intention
Establish clean model architecture separation where:
1. **Unit Model (unitIndex):** Contains indexPath, symlinkPaths, executionCapabilities, storageCapabilities
2. **Requirement Model:** Contains name, description, status, and references Unit via IOR or complete scenario
3. **UUIDv4 Compliance:** All UUIDs follow proper UUIDv4 format standard

## Steps
1. Replace current UnitModel with proper UnitIndex model structure
2. Update Unit component to use unitIndex as actual model
3. Create Requirement model with Unit reference capability
4. Implement UUIDv4 compliance for all UUID generation
5. Test model separation with Unit and Requirement interaction
6. Validate clean architecture separation

## Requirements
- UnitIndex becomes the actual Unit model with storage capabilities
- Current UnitModel attributes moved to Requirement model where appropriate
- Requirement models reference Units via IOR or complete scenario
- All UUIDs must be valid UUIDv4 format
- Clean separation between Unit (storage/execution) and Requirement (specification/tracking)
- Web4 compliance maintained throughout model separation

## Acceptance Criteria
- [ ] UnitModel replaced with proper UnitIndex model structure
- [ ] Unit model contains: indexPath, symlinkPaths, executionCapabilities, storageCapabilities
- [ ] Requirement model contains: name, description, status, unit reference (IOR or scenario)
- [ ] All UUIDs generated using UUIDv4 format standard
- [ ] Unit component uses unitIndex as actual model
- [ ] Requirement components reference Units via IOR or complete scenario
- [ ] Clean architecture separation between Unit and Requirement models
- [ ] Web4 compliance maintained with scenario initialization and hibernation

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1015] QA review pending.
  - [ ] Issue: Current Unit model contains Requirement-like attributes
  - [ ] Resolution: UnitIndex becomes actual Unit model with storage capabilities
  - [ ] Example: Unit model focuses on indexPath/symlinkPaths, Requirement model on name/description
- [ ] [2025-09-06-UTC-1015] Feedback to be collected after subtask completion.
  - [ ] Issue: Model separation and UUIDv4 compliance
  - [ ] Resolution: Verify clean separation and proper UUID format
  - [ ] Example: Requirements reference Units cleanly without model duplication