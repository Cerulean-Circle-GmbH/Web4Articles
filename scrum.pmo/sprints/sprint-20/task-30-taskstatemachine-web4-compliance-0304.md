[Back to Planning Sprint 20](./planning.md)

# Task 30: Create Web4 Compliant TaskStateMachine 0.3.0.4
[task:uuid:t1s2m3n4-a5b6-7890-task-s78901234567]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-30.1-developer-web4-compliance-implementation.md`)
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
- Add `[task:uuid:t1s2m3n4-a5b6-7890-task-s78901234567]` to this task.
- Source: TaskStateMachine Domain Model Discovery - Web4 Compliance Analysis
**Up:**
- [TaskStateMachine Discovery PDCA](../../project.journal/2025-09-06-UTC-1132-session/pdca/role/po/2025-09-06-UTC-1132-src-domain-investigation.md)
- [Web4 Compliance Analysis](../../project.journal/2025-09-06-UTC-1132-session/pdca/role/po/2025-09-06-UTC-1132-taskstatemachine-web4-compliance-analysis.md)
**Down:**
- [Task 30.1: Developer - Web4 Compliance Implementation](./task-30.1-developer-web4-compliance-implementation.md)
- [Task 30.2: Developer - Empty Constructor Pattern Application](./task-30.2-developer-empty-constructor-pattern.md)
- [Task 30.3: Developer - IOR Integration for Task References](./task-30.3-developer-ior-integration-task-references.md)
- [Task 30.4: Developer - 0.3.0.4 Component Structure Creation](./task-30.4-developer-0304-component-structure.md)

## Task Description
Create Web4 compliant version 0.3.0.4 of TaskStateMachine component, migrating from TSRanger v1.0 domain model to standalone Web4 component with proper Empty Constructor Principle, IOR integration, and CMM3 task status automation capabilities.

## Context
TaskStateMachine exists in TSRanger/v1.0/src/domain/ but lacks Web4 compliance. Current implementation has Web4 violations:
- No Empty Constructor Principle
- No IOR-based object references
- Old component structure (not 0.3.0.4 format)
- No Web4 component CLI integration
- No scenario-based testing approach

## Intention
Create standalone Web4TaskStateMachine 0.3.0.4 component following Web4 methodology for systematic task status automation, enabling CMM3 compliance for Sprint management.

## Steps
1. Analyze current TaskStateMachine Web4 compliance gaps
2. Create Web4TaskStateMachine 0.3.0.4 component structure
3. Implement Empty Constructor Principle for TaskStateMachine
4. Add IOR integration for task references
5. Create CLI tool for task status automation
6. Implement scenario-based testing
7. Test on Sprint 20 tasks for CMM3 automation

## Requirements
- Include `[requirement:uuid:d3190ece-605e-45a4-b78f-93ab5be2fa60]` backlink to `requiremnents.md` if derived from a requirement.
- Include `[requirement:uuid:69f580d9-7520-4558-9e83-a9827ec8afd0]` backlink to `requiremnents.md` if derived from a requirement.
- Ensure bidirectional links: task → requirements and requirements → task.

### **Primary Requirements**

#### **[requirement:uuid:d3190ece-605e-45a4-b78f-93ab5be2fa60] - Web4 Empty Constructor Principle**
- **GitHub:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/d3190ece-605e-45a4-b78f-93ab5be2fa60.requirement.md) | [§/spec/requirements.md/d3190ece-605e-45a4-b78f-93ab5be2fa60.requirement.md](../../../spec/requirements.md/d3190ece-605e-45a4-b78f-93ab5be2fa60.requirement.md)
- **Description:** All objects MUST have empty constructors with NO initialization parameters. Objects created empty, then configured via setters.
- **Implementation Status:** pending

#### **[requirement:uuid:69f580d9-7520-4558-9e83-a9827ec8afd0] - Web4 IOR Interoperable Object Reference Architecture**
- **GitHub:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/spec/requirements.md/69f580d9-7520-4558-9e83-a9827ec8afd0.requirement.md) | [§/spec/requirements.md/69f580d9-7520-4558-9e83-a9827ec8afd0.requirement.md](../../../spec/requirements.md/69f580d9-7520-4558-9e83-a9827ec8afd0.requirement.md)
- **Description:** Objects referenced by IORs, not direct memory pointers. IOR-based references enabling distributed object networks with true location transparency.
- **Implementation Status:** pending

### **Specific Requirements**
- Web4 Empty Constructor Principle compliance
- IOR-based task references instead of direct file paths
- 0.3.0.4 component structure with proper layer architecture
- CLI tool for systematic task status automation (CMM3)
- Scenario-based testing approach
- Integration with existing Sprint 20 task management
- Markdown task file parsing capabilities
- Planning.md ↔ task file status synchronization

## Acceptance Criteria
- [ ] Web4TaskStateMachine 0.3.0.4 component created with proper structure
- [ ] Empty Constructor Principle applied to all TaskStateMachine classes
- [ ] IOR integration for task references and object addressing
- [ ] CLI tool created for task status automation
- [ ] Can parse existing Sprint 20 task files
- [ ] Can synchronize planning.md with task file status
- [ ] Scenario-based testing implemented
- [ ] CMM3 automation capabilities validated

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1132] QA review pending.
  - [ ] Issue: TaskStateMachine exists but lacks Web4 compliance
  - [ ] Resolution: Create Web4 compliant 0.3.0.4 version with Empty Constructor and IOR
  - [ ] Example: Web4TaskStateMachine with systematic task status automation

## Subtasks
- [ ] [Task 27.1: Developer - Web4 Compliance Implementation](./task-27.1-developer-web4-compliance-implementation.md)
- [ ] [Task 27.2: Developer - Empty Constructor Pattern Application](./task-27.2-developer-empty-constructor-pattern.md)  
- [ ] [Task 27.3: Developer - IOR Integration for Task References](./task-27.3-developer-ior-integration-task-references.md)
- [ ] [Task 27.4: Developer - 0.3.0.4 Component Structure Creation](./task-27.4-developer-0304-component-structure.md)