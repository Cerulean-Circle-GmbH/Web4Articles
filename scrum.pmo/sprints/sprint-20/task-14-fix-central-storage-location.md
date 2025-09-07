[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 14: Fix UnitIndex Central Storage Location
[task:uuid:m3n4o5p6-q7r8-9012-mnop-q34567890123]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-14.1-developer-central-storage-fix.md`)
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
- Add `[task:uuid:m3n4o5p6-q7r8-9012-mnop-q34567890123]` to this task.
- Source: UnitIndex Requirements Analysis - Central Storage Location Issues

  - up
    - [requirement:uuid:9edcd4d6-2126-40fa-aedd-43fdfda24c6e](../requiremnents-2025-09-06-UTC-1132-po-dual-linking.md)
    - [UnitIndex Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1005-unitindex-requirements-analysis-task-planning.pdca.md)


  - down
    - [Task 14.1: Developer - Fix Project Root Detection](./task-14.1-developer-project-root-detection.md)
    - [Task 14.2: Developer - Ensure Central Storage Usage](./task-14.2-developer-central-storage-usage.md)


## Task Description
Fix UnitIndex storage to use central project root scenarios/index/ location instead of creating scenarios in temp folders or other incorrect locations.

## Context
Current implementation creates scenarios in temp/1/7/e/e/1/ instead of central /workspace/scenarios/index/1/7/e/e/1/. This violates the unitIndex requirement for central storage with proper project root detection.

## Intention
Ensure all unit scenarios are stored in the central scenarios/index/ location as required by unitIndex specification, enabling proper ecosystem-wide storage consistency and LD links tracking.

## Steps
1. Fix project root detection in DefaultStorage
2. Ensure scenarios always saved to /workspace/scenarios/index/
3. Test that LD links point to central storage location
4. Validate storage location consistency across all unit operations

## Requirements
- Include `[requirement:uuid:9edcd4d6-2126-40fa-aedd-43fdfda24c6e]` backlink to `requiremnents.md` if derived from a requirement.
- Ensure bidirectional links: task → requirements and requirements → task.

### **Primary Requirement**
- **[requirement:uuid:9edcd4d6-2126-40fa-aedd-43fdfda24c6e] - Unit UUID Index System**
  - **GitHub:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/9edcd4d6-2126-40fa-aedd-43fdfda24c6e.requirement.md) | [§/spec/requirements.md/9edcd4d6-2126-40fa-aedd-43fdfda24c6e.requirement.md](../../../spec/requirements.md/9edcd4d6-2126-40fa-aedd-43fdfda24c6e.requirement.md)
  - **Description:** Units are linux files that are unique and terminal identified via a uuid. They are created in a Units Index with scenarios stored in project root scenarios/index/ using UUID-based folder structure (5 levels deep).
  - **Implementation Status:** pending

### **Specific Requirements**
- All scenarios must be stored in project root scenarios/index/
- LD links must point to central storage location  
- Project root detection must be reliable and consistent
- No scenarios created in temp folders or other locations
- UUID-based folder structure (5 levels deep) as per Unit UUID Index System
- Storage locations use symbolic links to the index
- Unit model tracks all backlink paths for lifecycle management

## Acceptance Criteria
- [ ] Scenarios stored in /workspace/scenarios/index/1/7/e/e/1/ (not temp)
- [ ] LD links point to central storage location
- [ ] Project root detection works reliably
- [ ] All unit operations use central storage consistently
- [ ] No scenarios created outside central storage location

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1005] QA review pending.
  - [ ] Issue: Scenarios created in wrong location violate central storage requirement
  - [ ] Resolution: Fix project root detection and ensure central storage usage
  - [ ] Example: All scenarios in /workspace/scenarios/index/ with proper LD links

- [ ] [2025-09-06-UTC-1540] TRON QA Feedback - LD Link Naming Convention Issue
  ```quote
  the comnand
  unit create „name" „text" 
  should result in name being the link filename normalized to name.unit as filename. consequently you have to add to the array of links the link location and the filename as named linns json wit 2 attributes. fix that. add it to the tasks qa quotes and answer there
  
  - [x] Issue: LD link filename should be `name.unit` instead of `unit-{uuid-prefix}`
  - [x] Issue: Need named links JSON with 2 attributes (location and filename)
  - [x] Resolution: Updated DefaultUnit.toScenario() to use normalized name for link filename
  - [x] Resolution: Added namedLinks array to scenario model with location and filename attributes
  - [x] Example: `unit create final-test "description"` → link filename: `final-test.unit`
  - [x] Validation: namedLinks array contains `{"location": "/workspace/temp/final-test.unit", "filename": "final-test.unit"}`

- [ ] [2025-09-06-UTC-1615] TRON QA Feedback - LD Link Location Issue  
  ```quote
  the 
  namedLinks": [
        {
          "location": "/workspace/temp/final-test.unit",


  does not make much sense. it should be the relative location for the ln link command to the scenario.

  qa feedback to the task. answer and fix.
  
  - [x] Issue: `location` field contains absolute path to link file instead of relative path from link to scenario
  - [x] Issue: Should contain the relative path used by `ln -s` command (e.g., `../scenarios/index/...`)
  - [x] Resolution: Updated namedLinks to store actual relative path used by symlink creation
  - [x] Example: `{"location": "../scenarios/index/a/a/a/1/4/aaa14a78-068e-4196-bfad-f346535a92d4.scenario.json", "filename": "fixed-test.unit"}`
  - [x] Validation: Used `readlinkSync()` to get actual symlink target path and store in namedLinks