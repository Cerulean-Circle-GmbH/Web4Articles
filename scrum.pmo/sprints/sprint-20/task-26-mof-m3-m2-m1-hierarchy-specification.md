[Back to Planning Sprint 20](./planning.md)

# Task 26: MOF M3/M2/M1 Hierarchy Specification with Unit TypeM3 Attribute
[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234567]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-26.1-developer-mof-hierarchy-specification.md`)
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
- Add `[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234567]` to this task.
- Source: MDA v4 MOF Model Planning - MOF Hierarchy Requirements
- up
  - [MDA v4 MOF Model Planning PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2130-mda-v4-mof-model-unit-planning.pdca.md)
- down
  - [Task 26.1: Developer - MOF Hierarchy Specification](./task-26.1-developer-mof-hierarchy-specification.md)
  - [Task 26.2: Developer - Unit TypeM3 Attribute Implementation](./task-26.2-developer-unit-typem3-implementation.md)
  - [Task 26.3: Developer - MOF Instance Classification System](./task-26.3-developer-mof-instance-classification.md)

## Task Description
Create MOF specification tasks first, then implement Unit typeM3 attribute with enum values (CLASS, ATTRIBUTE, RELATIONSHIP) for MDA v4 MOF model hierarchy, using Unit as fundamental component while keeping units infrastructure.

## Context
From TRON Decisions: Create MOF specification tasks first (2c), then bootstrap gradually with Unit typeM3 attribute (2a). Use enum values CLASS, ATTRIBUTE, RELATIONSHIP for consistency (3b). MOF model as separate component using Unit as fundamental component, keeping units infrastructure (1a and c).

## Intention
Establish MDA v4 MOF model foundation with proper M3/M2/M1 hierarchy specification, enabling Unit component to serve as fundamental building block for meta-modeling while maintaining existing infrastructure.

## Steps
1. Create MOF M3/M2/M1 hierarchy specification tasks
2. Specify MOF model as separate component using Unit as fundamental component
3. Add typeM3 attribute to UnitModel with enum values: CLASS, ATTRIBUTE, RELATIONSHIP
4. Implement MOF instance classification system
5. Bootstrap MOF model gradually starting with Unit typeM3 attribute
6. Maintain existing Unit infrastructure during MOF implementation
7. Validate MOF hierarchy with concrete examples (File, LD Link, Component)
8. Test MOF classification system with Unit component
9. Integrate MOF model with existing Web4 ecosystem

## Requirements
- MOF M3/M2/M1 hierarchy properly specified before implementation
- Unit serves as fundamental component for MOF model implementation
- TypeM3 attribute added to UnitModel with enum values: CLASS, ATTRIBUTE, RELATIONSHIP
- Existing Unit infrastructure maintained during MOF implementation
- MOF model implemented as separate component (not integrated into Unit)
- File = M1 instance of unit typeM3 ATTRIBUTE
- LD Link = M1 instance of unit typeM3 RELATIONSHIP  
- Component = M1 instance of unit typeM3 CLASS
- Bootstrap approach: specification tasks first, then gradual implementation
- MOF instance classification system functional

## Acceptance Criteria
- [ ] MOF M3/M2/M1 hierarchy specification tasks created
- [ ] MOF model specified as separate component using Unit as fundamental component
- [ ] TypeM3 attribute added to UnitModel with enum values: CLASS, ATTRIBUTE, RELATIONSHIP
- [ ] MOF instance classification system implemented
- [ ] Existing Unit infrastructure preserved during MOF implementation
- [ ] File, LD Link, Component mapping to typeM3 values validated
- [ ] Bootstrap approach implemented: specification first, then gradual implementation
- [ ] MOF hierarchy tested with concrete examples
- [ ] MOF model integration with Web4 ecosystem functional

## MOF Hierarchy Examples

### **M3 Level (Meta-Meta-Model):**
```typescript
// Unit TypeM3 Enum
enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections
}
```

### **M2 Level (Meta-Model):**
```
Web4Folder: M2 instance of Unit M3 with name="Folder" and typeM3="CLASS"
Web4TSComponent: M2 instance of Unit M3 with name="TSComponent" and typeM3="CLASS"  
Web4File: M2 instance of Unit M3 with name="File" and typeM3="ATTRIBUTE"
```

### **M1 Level (Model):**
```
components/Unit/0.3.0.4/: M1 instance of M2 Web4Folder
package.json: M1 instance of M2 Web4File (typeM3 ATTRIBUTE)
temp/ONCE.unit: M1 instance of M2 Web4Link (typeM3 RELATIONSHIP)
```

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-2130] TRON Decisions - MOF Implementation Strategy
  ```quote
  1a and c but not integrated but M3 impl will use unit as fundamental component. keep units infrastructure.
  2c then a 
  3b very good question 
  4 a
  ```
  - [x] Decision 1: Add typeM3 attribute (1a) and separate MOF component (1c) using Unit as fundamental
  - [x] Decision 2: Create specification tasks first (2c), then bootstrap gradually (2a)
  - [x] Decision 3: Use enum values CLASS, ATTRIBUTE, RELATIONSHIP for consistency (3b)
  - [x] Decision 4: Use Web4Requirement tool for CMM3 compliance (4a)

## Dependencies
- Builds on Unit 0.3.0.4 foundation (fundamental component)
- Uses existing Unit infrastructure (no integration, separate component)
- Foundation for MDA v4 MOF model implementation in Web4 ecosystem