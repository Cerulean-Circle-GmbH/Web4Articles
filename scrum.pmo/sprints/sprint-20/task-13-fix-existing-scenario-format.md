[Back to Planning Sprint 20](./planning.md)

# Task 13: Fix Existing Scenario Format to Web4 Standard
[task:uuid:l2m3n4o5-p6q7-8901-lmno-p23456789012]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-13.1-developer-scenario-format-migration.md`)
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
- Add `[task:uuid:l2m3n4o5-p6q7-8901-lmno-p23456789012]` to this task.
- Source: Unit Version Analysis - Existing Storage Format Compliance

  - up
    - [requirement:uuid:571814f6-1493-4384-8104-edb3d6eb38fd](../requiremnents-2025-09-06-UTC-1132-po-dual-linking.md)
    - [Unit Version Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0830-unit-version-analysis-perfect-web4-implementation.pdca.md)


  - down
    - [Task 13.1: Developer - Migrate IOR Uppercase to Lowercase](./task-13.1-developer-migrate-ior-format.md)
    - [Task 13.2: Developer - Fix Version Format in Existing Scenarios](./task-13.2-developer-fix-version-format.md)
    - [Task 13.3: Developer - Upgrade Owner Encoding to Proper Encryption](./task-13.3-developer-upgrade-owner-encryption.md)


## Task Description
Fix existing 100+ scenarios in scenarios/index/ storage to use proper Web4 standard format (lowercase "ior", semantic versioning, proper encryption) while preserving unitIndex LD links tracking.

## Context
From Unit Version Analysis: requirement-v0.1.2.2 created correct storage system with LD links but used old scenario format ("IOR" uppercase, "v1.0", base64 encoding). Need to migrate existing scenarios to Web4 standard while preserving working storage and LD links system.

## Intention
Make existing scenarios/index/ storage compatible with Web4 standard scenario format so that new components (like Unit 0.3.0.4) can properly bootstrap from existing storage without breaking the working LD links and unitIndex tracking system.

## Steps
1. Scan all existing scenarios in scenarios/index/ for format violations
2. Migrate "IOR" (uppercase) to "ior" (lowercase) in all scenarios
3. Convert version format from "v1.0" to semantic versioning "0.3.0.4"
4. Upgrade owner encoding from base64 to proper encryption
5. Preserve unitIndex field and all LD links during migration
6. Validate all scenarios follow Web4 standard after migration

## Requirements
- Include `[requirement:uuid:571814f6-1493-4384-8104-edb3d6eb38fd]` backlink to `requiremnents.md` if derived from a requirement.
- Ensure bidirectional links: task → requirements and requirements → task.

### **Primary Requirement**
- **[requirement:uuid:571814f6-1493-4384-8104-edb3d6eb38fd] - Web4 Scenario-First Development**
  - **GitHub:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/571814f6-1493-4384-8104-edb3d6eb38fd.requirement.md) | [§/spec/requirements.md/571814f6-1493-4384-8104-edb3d6eb38fd.requirement.md](../../../spec/requirements.md/571814f6-1493-4384-8104-edb3d6eb38fd.requirement.md)
  - **Description:** Every object instance is a scenario that can be hibernated/resurrected. Objects as persistent scenarios with complete state preservation rather than transient runtime entities. All formats (CSV/JSON/XML/Database) become semantically identical hibernation mechanisms.
  - **Implementation Status:** pending

### **Specific Requirements**
- All scenarios must use lowercase "ior" field
- All scenarios must use semantic versioning format
- All scenarios must use proper owner encryption (not base64)
- unitIndex field and LD links must be preserved during migration
- No breaking changes to existing symbolic links
- All 100+ scenarios must be migrated consistently
- Object instances as persistent scenarios per Web4 Scenario-First Development
- Complete state preservation for hibernation/resurrection capability

## Acceptance Criteria
- [ ] All scenarios in scenarios/index/ use lowercase "ior" field
- [ ] All scenarios use semantic versioning (0.3.0.4 format) instead of "v1.0"
- [ ] All scenarios use proper owner encryption instead of base64
- [ ] unitIndex field preserved in all scenarios during migration
- [ ] All existing symbolic links continue to work after migration
- [ ] No scenarios remain with old format violations
- [ ] Migration process documented and reversible if needed
- [ ] All components can bootstrap from migrated scenarios

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0830] QA review pending.
  - [ ] Issue: Existing scenarios use old format breaking Web4 compliance
  - [ ] Resolution: Systematic migration to Web4 standard preserving LD links
  - [ ] Example: 100+ scenarios migrated with unitIndex preservation
- [ ] [2025-09-06-UTC-0830] Feedback to be collected after subtask completion.
  - [ ] Issue: Storage system integrity during migration
  - [ ] Resolution: Verify no breaking changes to symbolic links or storage
  - [ ] Example: All components continue to work with migrated scenarios