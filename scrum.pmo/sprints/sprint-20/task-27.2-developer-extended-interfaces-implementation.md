[Back to Task 27](./task-27-model-interface-implementation.md)

# Task 27.2: Developer - Extended Interfaces Implementation
[task:uuid:27b2c3d4-e5f6-7890-1234-56789012345a]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- Add `[task:uuid:27b2c3d4-e5f6-7890-1234-56789012345a]` to this task.
- Source: Task 27 Model Interface Implementation - Extended Interfaces
- up
  - [Task 27: Model Interface Implementation](./task-27-model-interface-implementation.md)
- down
  - No further breakdown needed - implementation level subtask

## Task Description
Update UnitModel interface to extend minimal Model interface and update Scenario interface to use generic template with documented complexity concerns. Integrate base interfaces created in Task 27.1 to create extended, type-safe interface system.

## Context
Depends on Task 27.1 completion (Model, ChangeEvent, NamedLink base interfaces). UnitModel must extend Model interface to inherit uuid and methods. Scenario must become generic template to support any Model-compliant component while documenting TRON's complexity concerns.

## Intention
Create extended interfaces that provide type safety and generalization while maintaining backward compatibility and Web4 compliance principles.

## Complete Technical Specifications

### Updated UnitModel Interface (Complete Code)
**File:** `components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts`
```typescript
/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */
import { Model } from './Model.interface.js';
import { NamedLink } from './NamedLink.interface.js';

export enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data  
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections
}

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
  indexPath: string;               // scenarios/index/path to this unit
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  executionCapabilities: string[]; // What unit can execute
  storageCapabilities: string[];   // Storage features
  createdAt: string;               // UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
  updatedAt: string;               // UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
}
```

### Generic Scenario Interface Implementation (Complete Code)
**File:** `components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts`
```typescript
/**
 * Scenario Interface - Universal hibernation pattern with typed Model
 * Web4 principle: Single interface per file, generic model support
 * Purpose: Universal scenario structure supporting any Model-compliant component
 * 
 * ⚠️ TRON QA WARNING: Cannot foresee complexity of template typed scenario
 * Future monitoring required for template complexity management
 * Template complexity concerns documented for future assessment
 */
import { IOR } from './IOR.interface.js';
import { Model } from './Model.interface.js';

export interface Scenario<T extends Model = Model> {
  ior: IOR;                        // Component identification and versioning
  owner: string;                   // JSON string with ownership metadata
  model: T;                        // Typed model extending minimal base Model interface
}
```

## Implementation Steps
1. Update UnitModel.interface.ts to import Model and NamedLink interfaces
2. Change UnitModel interface declaration to extend Model
3. Remove uuid property from UnitModel (inherited from Model)
4. Add TypeM3 enum to UnitModel file (if not already present)
5. Update Scenario.interface.ts to import Model interface
6. Add generic type parameter to Scenario interface with Model constraint
7. Add TRON's complexity warning documentation to Scenario interface
8. Validate all imports resolve correctly
9. Test TypeScript compilation with extended interfaces

## Requirements
- UnitModel extends Model interface (inherits uuid, implements methods)
- NamedLink interface imported separately (Web4 compliance)
- Generic Scenario interface: Scenario<T extends Model = Model>
- TypeM3 enum properly defined in UnitModel file
- TRON's complexity warning documented in Scenario interface
- Proper import statements for all dependencies
- TypeScript compilation success with extended interfaces
- Backward compatibility maintained during transition

## Acceptance Criteria
- [ ] UnitModel.interface.ts updated to extend Model interface
- [ ] UnitModel imports Model and NamedLink interfaces correctly
- [ ] UUID property removed from UnitModel (inherited from Model)
- [ ] TypeM3 enum present and properly defined
- [ ] Scenario.interface.ts updated to generic template
- [ ] Scenario imports Model interface correctly
- [ ] Generic type parameter <T extends Model = Model> implemented
- [ ] TRON's complexity warning documented in Scenario interface
- [ ] All import statements resolve correctly
- [ ] TypeScript compilation succeeds with extended interfaces
- [ ] Backward compatibility validated

## Dependencies
- Task 27.1: Base Interfaces Creation (Model, ChangeEvent, NamedLink must exist)
- Foundation for Task 27.3: DefaultUnit Model Methods Implementation