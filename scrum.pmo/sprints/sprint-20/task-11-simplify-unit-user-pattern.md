[Back to Planning Sprint 20](./planning-2025-09-06-UTC-0730.md)

# Task 11: Simplify Unit to User 0.3.0.4 Pattern
[task:uuid:j0k1l2m3-n4o5-6789-jklm-n01234567890]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-11.1-developer-unit-simplification.md`)
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
- Add `[task:uuid:j0k1l2m3-n4o5-6789-jklm-n01234567890]` to this task.
- Source: Unit Research Analysis - Over-Engineering Violation
```
  - up
    - [Unit Research Analysis](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-0750-comprehensive-unit-research-analysis.pdca.md)
```
```
  - down
    - [Task 11.1: Developer - Replace Complex Unit with Simple Pattern](./task-11.1-developer-unit-simplification.md)
    - [Task 11.2: Developer - Apply User 0.3.0.4 Template to Unit](./task-11.2-developer-unit-template-application.md)
```

## Task Description
Replace over-engineered Unit component (335+ line complex interface) with simple pattern following User 0.3.0.4 template, applying Occam's razor principle to establish proper foundation pattern for all components.

## Context
Current Unit 0.3.0.2 violates TRON's "ocams razor (OR) it" principle with massive over-engineering:
- Unit.ts: 335 lines with UnitScenario, UnitCapability, UnitInterface, etc.
- Complex interfaces violating Web4 simplicity
- Multiple 'any' types throughout complex definitions
- UCP principle violated - Units should be atomic and simple, not complex

## Intention
The Unit component exists to solve fundamental Web4 architecture problems and must be the simplest, cleanest component demonstrating perfect patterns:

### **Why Unit Component Exists:**
1. **Atomic Execution Foundation:** Units provide the smallest executable business logic elements in Web4 architecture, enabling precise component composition and testing granularity. Without Units, there's no atomic foundation for building larger Components and Packages.

2. **Web4 Pattern Template:** As the simplest component in the UCP (Unit-Component-Package) hierarchy, Unit must demonstrate perfect Web4 patterns (empty constructor, scenario initialization, hibernation) that all other components follow. Unit is the reference implementation for Web4 principles.

3. **Single Source of Truth Foundation:** Unit establishes clean interface patterns without duplication, providing the template for ecosystem-wide interface consistency. Unit's clean interfaces enable all other components to follow proper separation patterns.

4. **UCP Hierarchy Foundation:** Units are the atomic elements that Components aggregate into Packages. Without proper Unit foundation, the entire UCP hierarchy cannot function correctly.

### **Problems Unit Solves:**
- **Granularity Problem:** Defines smallest executable operations for precise testing and composition
- **Pattern Problem:** Demonstrates Web4 principles correctly for all components to follow
- **Consistency Problem:** Establishes interface patterns for ecosystem-wide consistency
- **Architecture Problem:** Provides atomic foundation for UCP hierarchy implementation

### **How Unit Solves These Problems:**
The current over-engineered Unit (335+ lines) VIOLATES these purposes by being complex instead of atomic. Unit must be the SIMPLEST component following User 0.3.0.4 pattern to solve these problems correctly. This simplification establishes foundation patterns that enable single source of truth implementation across the entire ecosystem.

## Steps
1. Analyze User 0.3.0.4 simple pattern as template
2. Replace complex Unit.ts with simple Unit.interface.ts
3. Create simple UnitModel.interface.ts following UserModel pattern
4. Implement simple DefaultUnit following DefaultUser pattern
5. Remove all over-engineered interfaces and types
6. Ensure Unit follows Web4 principles: empty constructor, scenario init, simple model

## Requirements
- Unit must be simplest component, not most complex
- Follow User 0.3.0.4 pattern exactly as template
- Remove all over-engineered interfaces (UnitScenario, UnitCapability, etc.)
- Implement simple Unit.interface.ts, UnitModel.interface.ts, DefaultUnit.ts
- No 'any' types in final implementation
- Apply Occam's razor principle throughout

## Acceptance Criteria
- [ ] Unit.ts (335 lines) replaced with simple Unit.interface.ts following User pattern
- [ ] Simple UnitModel.interface.ts created following UserModel pattern
- [ ] Single DefaultUnit.ts in layer2 following DefaultUser pattern
- [ ] No over-engineered interfaces (UnitScenario, UnitCapability, etc.)
- [ ] No 'any' types in Unit interfaces
- [ ] Unit follows Web4 patterns: empty constructor, scenario initialization
- [ ] Unit builds and functions with simple pattern
- [ ] Unit demonstrates foundation pattern for all components

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-0750] QA review pending.
  - [ ] Issue: Unit over-engineering violates Occam's razor principle
  - [ ] Resolution: Simple pattern following User 0.3.0.4 template
  - [ ] Example: Unit becomes simplest component demonstrating Web4 patterns
- [ ] [2025-09-06-UTC-0750] Feedback to be collected after subtask completion.
  - [ ] Issue: Foundation pattern establishment for ecosystem
  - [ ] Resolution: Verify Unit provides clean template for all components
  - [ ] Example: Other components can follow Unit's simplified pattern