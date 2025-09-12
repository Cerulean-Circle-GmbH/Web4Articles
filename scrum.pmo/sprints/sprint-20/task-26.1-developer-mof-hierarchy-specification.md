[Back to Task 26](./task-26-mof-m3-m2-m1-hierarchy-specification.md)

# Task 26.1: Developer - MOF Hierarchy Specification
[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234568]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] creating test cases
  - [x] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Add `[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234568]` to this task.
- Source: Task 26 - MOF M3/M2/M1 Hierarchy Specification
- up: [Task 26: MOF M3/M2/M1 Hierarchy Specification](./task-26-mof-m3-m2-m1-hierarchy-specification.md)

## Task Description
Create comprehensive specification for MDA v4 MOF (Meta-Object Facility) M3/M2/M1 hierarchy using Units as fundamental building blocks, establishing clear meta-modeling layers and relationships.

## Context
MOF specification must be created first before implementation (Decision 2c). The specification will define how Units serve as fundamental components for the MOF model while maintaining existing Unit infrastructure.

## Implementation Steps

### 1. TypeM3 Enum Specification
```typescript
/**
 * TypeM3 Enum - MOF Meta-Meta-Model Level Classification
 * Web4 principle: Single enum per file for MOF M3 level types
 * Purpose: Classify units at the M3 meta-meta-model level
 */
export enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects, types
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data, values  
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections, references
}
```

### 2. MOF Hierarchy Specification

#### **M3 Level (Meta-Meta-Model)**
- **Unit with typeM3 = CLASS**: Defines what can be instantiated as M2 classes
- **Unit with typeM3 = ATTRIBUTE**: Defines what can be instantiated as M2 attributes
- **Unit with typeM3 = RELATIONSHIP**: Defines what can be instantiated as M2 relationships

#### **M2 Level (Meta-Model)**  
- **Web4Folder**: M2 instance of Unit M3 with name="Folder" and typeM3="CLASS"
- **Web4TSComponent**: M2 instance of Unit M3 with name="TSComponent" and typeM3="CLASS"
- **Web4File**: M2 instance of Unit M3 with name="File" and typeM3="ATTRIBUTE"
- **Web4Link**: M2 instance of Unit M3 with name="Link" and typeM3="RELATIONSHIP"

#### **M1 Level (Model)**
- **components/Unit/0.3.0.4/**: M1 instance of M2 Web4Folder
- **package.json**: M1 instance of M2 Web4File (typeM3 ATTRIBUTE)
- **temp/ONCE.unit**: M1 instance of M2 Web4Link (typeM3 RELATIONSHIP)

### 3. UnitModel Enhancement Specification

```typescript
/**
 * Enhanced UnitModel with MOF M3 Classification
 * Extends existing UnitModel with typeM3 attribute for MOF hierarchy
 */
export interface UnitModel extends Model {
  uuid: string;
  name?: string;
  origin?: GitTextIOR;
  definition?: GitTextIOR;
  typeM3?: TypeM3;  // NEW: MOF M3 level classification
  namedLinks: NamedLink[];
  symLinks: string[];
}
```

### 4. MOF Component Specification

The MOF component will be implemented as a separate component that uses Unit as its fundamental building block:

```typescript
/**
 * MOF Component Specification
 * Separate component that uses Unit infrastructure for meta-modeling
 */
export interface MOFModel extends Model {
  uuid: string;
  m3Units: IOR[];    // References to M3 level units
  m2Units: IOR[];    // References to M2 level units  
  m1Instances: IOR[]; // References to M1 level instances
  hierarchy: MOFHierarchy;
}

export interface MOFHierarchy {
  m3ToM2Mappings: { [m3UnitUuid: string]: string[] }; // M3 unit -> M2 instances
  m2ToM1Mappings: { [m2UnitUuid: string]: string[] }; // M2 unit -> M1 instances
}
```

## Acceptance Criteria
- [ ] TypeM3 enum specified with CLASS, ATTRIBUTE, RELATIONSHIP values
- [ ] M3/M2/M1 hierarchy levels clearly defined
- [ ] UnitModel enhancement with typeM3 attribute specified
- [ ] MOF component architecture specified as separate component
- [ ] Concrete examples provided for each MOF level
- [ ] Integration points with existing Unit infrastructure identified
- [ ] Bootstrap implementation strategy defined

## Dependencies
- Unit 0.3.0.4 foundation (fundamental component)
- Existing Unit infrastructure (preserved, not integrated)
- Web4 architectural principles (single interface per file, etc.)

## Next Steps
- Task 26.2: Implement Unit TypeM3 Attribute
- Task 26.3: Implement MOF Instance Classification System