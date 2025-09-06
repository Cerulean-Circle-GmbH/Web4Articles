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
Implement proper Unit model separation following accepted example where model field contains all unitIndex data (no separate unitIndex field), and Requirement models reference Units via IOR or complete scenario with UUIDv4 compliance.

## Context
Current implementation violates accepted example by having both "model" and "unitIndex" fields. Accepted example shows single "model" field containing indexPath, symlinkPaths, and capabilities. Current structure creates redundant data and non-compliance.

## Intention
Establish clean model architecture separation following accepted example exactly:

**Accepted Example Structure:**
```json
{
  "ior": { "uuid": "unit-123", "component": "Unit", "version": "0.3.0.4" },
  "owner": "...",
  "model": {
    "uuid": "unit-123",
    "indexPath": "/workspace/scenarios/index/u/n/i/t/1/unit-123.scenario.json",
    "symlinkPaths": ["/workspace/components/SomeComponent/unit-reference"],
    "createdAt": "2025-06-06T...",
    "updatedAt": "2025-06-06T...",
    "executionCapabilities": ["transform", "validate"],
    "storageCapabilities": ["scenarios", "ld-links"]
  }
}
```

**Key Requirements:**
1. **Single Model Field:** Remove separate unitIndex field completely
2. **Model IS UnitIndex:** Model contains indexPath, symlinkPaths, capabilities
3. **No Redundancy:** UUID only in IOR, storage data only in model
4. **UUIDv4 Compliance:** crypto.randomUUID() for all UUID generation

## Steps
1. **Remove unitIndex field:** Eliminate separate unitIndex field from scenarios completely
2. **Update UnitModel interface:** Model contains indexPath, symlinkPaths, executionCapabilities, storageCapabilities
3. **Fix DefaultStorage:** Remove unitIndex field creation, put all data in model
4. **Update DefaultUnit:** Model IS the unitIndex, no separate unitIndex tracking
5. **UUIDv4 Implementation:** Use crypto.randomUUID() for all UUID generation
6. **Test compliance:** Validate scenario structure matches accepted example exactly
7. **Central storage:** Ensure scenarios stored in /workspace/scenarios/index/ not temp folders

## Requirements
- UnitIndex becomes the actual Unit model with storage capabilities
- Current UnitModel attributes moved to Requirement model where appropriate
- Requirement models reference Units via IOR or complete scenario
- All UUIDs must be valid UUIDv4 format
- Clean separation between Unit (storage/execution) and Requirement (specification/tracking)
- Web4 compliance maintained throughout model separation

## Acceptance Criteria
- [ ] **Scenario Structure Compliance:** Matches accepted example exactly with single model field
- [ ] **No unitIndex field:** Separate unitIndex field completely removed from scenarios
- [ ] **Model IS unitIndex:** Model contains indexPath, symlinkPaths, executionCapabilities, storageCapabilities
- [ ] **UUIDv4 Compliance:** All UUIDs generated using crypto.randomUUID()
- [ ] **No Redundancy:** UUID only in IOR, no duplication in model
- [ ] **Central Storage:** All scenarios stored in /workspace/scenarios/index/ not temp folders
- [ ] **LD Links Working:** Symbolic links point to central storage location
- [ ] **Exact Structure Match:** Implementation produces scenarios identical to accepted example format
- [ ] **Web4 Compliance:** Empty constructor, scenario initialization, toScenario() hibernation

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1015] QA review pending.
  - [ ] Issue: Current Unit model contains Requirement-like attributes
  - [ ] Resolution: UnitIndex becomes actual Unit model with storage capabilities
  - [ ] Example: Unit model focuses on indexPath/symlinkPaths, Requirement model on name/description
- [ ] [2025-09-06-UTC-1015] Feedback to be collected after subtask completion.
  - [ ] Issue: Model separation and UUIDv4 compliance
  - [ ] Resolution: Verify clean separation and proper UUID format
  - [ ] Example: Requirements reference Units cleanly without model duplication