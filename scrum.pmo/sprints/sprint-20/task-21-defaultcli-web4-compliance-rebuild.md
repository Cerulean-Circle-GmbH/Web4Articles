[Back to Planning Sprint 20](./planning.md)

# Task 21: DefaultCLI Web4 Compliance Assessment and Rebuild 0.3.0.4
[task:uuid:u3v4w5x6-y7z8-9012-uvwx-y34567890123]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-21.1-developer-defaultcli-compliance-assessment.md`)
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
- Add `[task:uuid:u3v4w5x6-y7z8-9012-uvwx-y34567890123]` to this task.
- Source: CLI Compliance Planning - DefaultCLI Foundation Requirements
- up
  - [CLI Compliance Planning PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/po/2025-09-06-UTC-2115-comprehensive-cli-compliance-task-planning.pdca.md)
- down
  - [Task 21.1: Developer - DefaultCLI Compliance Assessment](./task-21.1-developer-defaultcli-compliance-assessment.md)
  - [Task 21.2: Developer - DefaultCLI 0.3.0.4 Rebuild from Scratch](./task-21.2-developer-defaultcli-rebuild.md)
  - [Task 21.3: Developer - Static Start Method and Shell Parameters](./task-21.3-developer-static-start-implementation.md)

## Task Description
Assess current DefaultCLI for Web4 compliance violations and rebuild from scratch as dependency-free 0.3.0.4 version with static start method, proper build validation, and foundation for DRY terminal rendering system.

## Context
From TRON Requirements: DefaultCLI needs Web4 compliance assessment and potential rebuild from scratch. Must be dependency-free base component with npm run clean/build/start functionality, static start method for radical OOP, and foundation for terminal rendering centralization.

## Intention
Create Web4 compliant DefaultCLI 0.3.0.4 as foundation for entire CLI ecosystem, enabling proper inheritance, DRY terminal rendering, and dependency-free base component architecture.

## Steps
1. Assess current DefaultCLI 0.3.0.4 for Web4 compliance violations
2. Document all non-compliant patterns and architectural issues
3. Rebuild DefaultCLI from scratch as 0.3.0.4 if compliance violations found
4. Implement dependency-free architecture (builds itself without external dependencies)
5. Add npm run clean, npm run build, npm start functionality
6. Implement static start method for radical OOP (no main functional entity point)
7. Add shell parameter handling in static start method
8. Create foundation for DRY terminal rendering system
9. Validate complete build and start workflow
10. Prepare for UnitCLI and other component inheritance

## Requirements
- DefaultCLI must be completely Web4 compliant (empty constructor, scenario initialization)
- Must be dependency-free base component (builds without external dependencies)
- npm run clean, npm run build, npm start must work correctly
- npm start must start component with no preconditions (builds and starts)
- Static start method implementation for radical OOP (no main functional entity)
- Shell parameter handling in static start method
- Foundation for DRY terminal rendering system
- Proper inheritance base for UnitCLI and other CLI components
- Web4 architectural principles throughout (no bypasses or shortcuts)

## Acceptance Criteria
- [ ] Current DefaultCLI assessed for all Web4 compliance violations
- [ ] Non-compliant patterns and architectural issues documented
- [ ] DefaultCLI 0.3.0.4 rebuilt from scratch if compliance violations found
- [ ] Dependency-free architecture implemented (no external dependencies)
- [ ] npm run clean removes all build artifacts successfully
- [ ] npm run build compiles TypeScript without errors
- [ ] npm start builds and starts component with no preconditions
- [ ] Static start method implemented for radical OOP shell parameter handling
- [ ] Foundation for DRY terminal rendering system created
- [ ] Proper inheritance base prepared for UnitCLI and other components
- [ ] Complete Web4 compliance validated throughout implementation
- [ ] Build and start workflow tested and validated

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-2115] TRON Requirements - DefaultCLI Compliance Foundation
  ```quote
  at first we need again a web4 compliant dependency free DefaultCLI. assess the defaultCLI for compliance. in worst case create id from scratch as 0.3.0.4. check that it builds with npm run clean, npm run build. npm start just starts every component with no preconditions, it builds and just starts. starting in radical oop always means, no main functional entity point but a static start method getting the sh parameters.
  ```
  - [x] Issue: DefaultCLI needs Web4 compliance assessment and potential rebuild
  - [x] Resolution: Assessed compliance violations, rebuilt from scratch as 0.3.0.4
  - [x] Validation: npm run clean/build/start functionality with static start method working
  - [x] **QA Specification Request:** Detailed specifications provided during PDCA work for DRY Web4 compliant implementation

- [ ] [2025-09-06-UTC-2140] TRON QA Feedback - CLI Model Compliance and DRY Violations
  ```quote
  the cli model is incompliant ant has a lot of DRY violations. what is really needed. ocams razor. task qa feedback!
  ```
  - [ ] Issue: CLIModel interface has compliance violations and DRY violations
  - [ ] Issue: Over-engineering with unnecessary attributes (Occam's Razor violation)
  - [ ] Resolution: Simplify CLIModel to essential attributes only, eliminate DRY violations
  - [ ] Analysis: What is really needed for CLI functionality vs unnecessary complexity
  - [ ] Principle: Occam's Razor - simplest solution with minimal attributes

## Dependencies
- Foundation for all other CLI compliance tasks (Tasks 22-26)
- Must be completed before UnitCLI migration and terminal rendering centralization
- Prerequisite for proper CLI ecosystem dependency resolution