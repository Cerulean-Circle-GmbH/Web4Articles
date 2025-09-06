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
- [ ] QA Review
- [ ] Done

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
- [ ] **Scripts Integration (QA Feedback):**
  - [ ] Unit link created in scripts directory
  - [ ] Version link created in scripts/versions for Unit 0.3.0.4

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0830] QA review pending.
  - [ ] Issue: Speaking names must prevent inconsistency and redundancy
  - [ ] Resolution: Unique mapping to central UUID storage
  - [ ] Example: "user-alice" always maps to same UUID, prevents conflicts
- [x] [2025-09-06-UTC-0910] TRON QA Feedback collected.
  - [x] Issue: "i did not see a unit link in scripts nor a new version link"
  - [x] Resolution: Add unit link in scripts directory and version link in scripts/versions
  - [x] Example: scripts/unit and scripts/versions/unit-v0.3.0.4 created
- [ ] [2025-09-06-UTC-0920] TRON QA Feedback collected.
  - [ ] Issue: "i expect a ln link in the temp folder and a new unit in the index as uuid.scenario.json and the ln link pointing to it with the file name test-unit as you named it in your testcase. cannot see anything like that."
  - [ ] Resolution: Implement proper LD links creation in temp folder pointing to scenarios/index/ storage
  - [ ] Example: temp/test-unit -> scenarios/index/a/b/c/d/e/[uuid].scenario.json
- [ ] [2025-09-06-UTC-0925] TRON QA Feedback collected.
  - [ ] Issue: "we are in radical oop most modern typescript. read the tech stack again . there was never room for a js require() … add this feedback quoted to the task as my previous feedback."
  - [ ] Resolution: Fix require() usage with modern ESM imports, use dynamic imports and proper TypeScript patterns
  - [ ] Example: Replace require('fs') with import('fs') and fix all CJS violations
  
### **QA Section Response to TRON Feedback:**

**Issue 1 - Missing LD Links and Storage Integration:**
The Unit component is not properly creating LD links in temp folder or storing scenarios in index because:
1. Storage integration incomplete - UnitIndexStorage not properly initialized
2. Speaking name links not created in current directory (temp folder)
3. Scenarios not saved to scenarios/index/ with proper UUID structure

**Resolution with Dual Links:**
- **Fix DefaultUnit.ts:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts) | [components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts](../../../../components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts)
- **Implement proper scenario saving:** Create actual UUID-based storage in scenarios/index/
- **Create LD links:** Generate symbolic links from temp/test-unit to scenarios/index/[uuid].scenario.json

**Issue 2 - require() CJS Violation in Modern TypeScript:**
The code uses require() which violates modern ESM TypeScript standards per tech stack:
- **Tech Stack Reference:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/docs/tech-stack.md) | [docs/tech-stack.md](../../../../docs/tech-stack.md)
- **Violation:** "No legacy CJS baggage - Full support for import.meta.url, top-level await, and all modern JS features"

**Resolution with Dual Links:**
- **Fix findProjectRoot method:** Replace require() with dynamic import() or fs promises
- **Use ESM patterns:** Modern TypeScript with proper import statements
- **Remove CJS violations:** Eliminate all require() usage throughout implementation