[Back to Task 26](./task-26-mof-m3-m2-m1-hierarchy-specification.md)

# Task 26.2: Developer - Unit TypeM3 Attribute Implementation
[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234569]

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
- Add `[task:uuid:z8a9b0c1-d2e3-4567-zabc-d78901234569]` to this task.
- Source: Task 26 - MOF M3/M2/M1 Hierarchy Specification
- up: [Task 26: MOF M3/M2/M1 Hierarchy Specification](./task-26-mof-m3-m2-m1-hierarchy-specification.md)
- depends: [Task 26.1: Developer - MOF Hierarchy Specification](./task-26.1-developer-mof-hierarchy-specification.md)

## Task Description
Implement the TypeM3 attribute in UnitModel and create the TypeM3 enum as separate files following Web4 compliance (single type per file), enabling MOF M3 level classification for Units.

## Context
Following Task 26.1 specification, implement the TypeM3 enum and integrate it into UnitModel. This enables Units to be classified at the MOF M3 meta-meta-model level as CLASS, ATTRIBUTE, or RELATIONSHIP.

## Implementation Steps

### 1. Create TypeM3 Enum File
**File:** `components/Unit/0.3.0.4/src/ts/layer3/TypeM3.enum.ts`
```typescript
/**
 * TypeM3 Enum - MOF Meta-Meta-Model Level Classification
 * Web4 principle: Single enum per file for MOF M3 level types
 * Purpose: Classify units at the M3 meta-meta-model level
 * 
 * Values:
 * - CLASS: Components, classes, objects, types that can be instantiated
 * - ATTRIBUTE: Files, properties, data, values that describe characteristics  
 * - RELATIONSHIP: LD Links, associations, connections, references between entities
 */
export enum TypeM3 {
  CLASS = "CLASS",
  ATTRIBUTE = "ATTRIBUTE", 
  RELATIONSHIP = "RELATIONSHIP"
}
```

### 2. Update UnitModel Interface
**File:** `components/Unit/0.3.0.4/src/ts/layer3/UnitModel.interface.ts`
```typescript
/**
 * Unit Model Interface - Enhanced with MOF M3 Classification
 * Web4 principle: Single interface per file
 * Purpose: Unit model with MOF M3 level classification support
 */
import { Model } from './Model.interface.js';
import { NamedLink } from './NamedLink.interface.js';
import { GitTextIOR } from './GitTextIOR.interface.js';
import { TypeM3 } from './TypeM3.enum.js';

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

### 3. Update DefaultUnit Implementation
**File:** `components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts`
Add support for typeM3 in constructor, toScenario, and CLI display methods:

```typescript
// In constructor data initialization
this.data = {
  uuid: '',
  name: undefined,
  origin: undefined,
  definition: undefined,
  typeM3: undefined,  // NEW: Initialize typeM3 as optional
  namedLinks: [],
  symLinks: []
};

// In toScenario method
async toScenario(name?: string): Promise<Scenario> {
  return {
    ior: {
      uuid: this.data.uuid,
      component: 'Unit',
      version: '0.3.0.4'
    },
    owner: JSON.stringify({
      component: 'Unit',
      version: '0.3.0.4',
      timestamp: new Date().toISOString()
    }),
    model: {
      uuid: this.data.uuid,
      name: this.data.name,
      origin: this.data.origin,
      definition: this.data.definition,
      typeM3: this.data.typeM3,  // NEW: Include typeM3 in scenario
      namedLinks: this.data.namedLinks,
      symLinks: this.data.symLinks
    }
  };
}

// In info display method
async info(): Promise<void> {
  console.log(`Unit Information:`);
  console.log(`  UUID: ${this.data.uuid}`);
  console.log(`  Name: ${this.data.name || 'Not set'}`);
  console.log(`  TypeM3: ${this.data.typeM3 || 'Not classified'}`);  // NEW: Display typeM3
  if (this.data.origin) {
    console.log(`  Origin: ${this.data.origin.url}`);
  }
  if (this.data.definition) {
    console.log(`  Definition: ${this.data.definition.url}`);
  }
  console.log(`  Named Links: ${this.data.namedLinks.length}`);
  console.log(`  Symbolic Links: ${this.data.symLinks.length}`);
}
```

### 4. Update UnitCLI Commands
**File:** `components/Unit/0.3.0.4/src/ts/layer5/UnitCLI.ts`
Add support for typeM3 parameter in create and classification commands:

```typescript
// Enhanced create method with typeM3 support
async create(args: string[]): Promise<void> {
  if (args.length < 2) {
    console.log('Usage: unit create <name> <definition> [typeM3]');
    console.log('TypeM3 values: CLASS, ATTRIBUTE, RELATIONSHIP');
    return;
  }

  const [name, definition, typeM3String] = args;
  
  // Validate typeM3 if provided
  let typeM3: TypeM3 | undefined;
  if (typeM3String) {
    if (Object.values(TypeM3).includes(typeM3String as TypeM3)) {
      typeM3 = typeM3String as TypeM3;
    } else {
      console.log(`❌ Invalid typeM3: ${typeM3String}`);
      console.log('Valid values: CLASS, ATTRIBUTE, RELATIONSHIP');
      return;
    }
  }

  const unit = new DefaultUnit();
  await unit.initialize({});
  
  // Set unit properties including typeM3
  unit.data.name = name;
  unit.data.definition = { url: definition } as GitTextIOR;
  if (typeM3) {
    unit.data.typeM3 = typeM3;
  }

  // Save and create links as before...
  const scenario = await unit.toScenario();
  // ... existing implementation
}

// New classify method to set typeM3 for existing units
async classify(args: string[]): Promise<void> {
  if (args.length !== 2) {
    console.log('Usage: unit classify <uuid> <typeM3>');
    console.log('TypeM3 values: CLASS, ATTRIBUTE, RELATIONSHIP');
    return;
  }

  const [uuid, typeM3String] = args;
  
  // Validate typeM3
  if (!Object.values(TypeM3).includes(typeM3String as TypeM3)) {
    console.log(`❌ Invalid typeM3: ${typeM3String}`);
    console.log('Valid values: CLASS, ATTRIBUTE, RELATIONSHIP');
    return;
  }

  const typeM3 = typeM3String as TypeM3;
  
  // Load existing unit and update typeM3
  const unit = new DefaultUnit();
  try {
    const scenario = await this.loadUnitScenario(uuid);
    await unit.fromScenario(scenario);
    unit.data.typeM3 = typeM3;
    
    // Save updated scenario
    const updatedScenario = await unit.toScenario();
    await this.saveUnitScenario(updatedScenario);
    
    console.log(`✅ Unit ${uuid} classified as ${typeM3}`);
  } catch (error) {
    console.log(`❌ Error classifying unit: ${error.message}`);
  }
}
```

### 5. Update CLI Usage Display
Add the new classify command to the usage display:

```typescript
// In usage method
async usage(): Promise<void> {
  console.log('Usage: unit <command> [arguments]');
  console.log('');
  console.log('Commands:');
  console.log('  create <name> <definition> [typeM3]  Create a new unit with optional MOF classification');
  console.log('  classify <uuid> <typeM3>             Classify existing unit with MOF typeM3');
  console.log('  info <uuid>                          Display unit information including typeM3');
  // ... existing commands
  console.log('');
  console.log('TypeM3 Classifications:');
  console.log('  CLASS        - Components, classes, objects that can be instantiated');
  console.log('  ATTRIBUTE    - Files, properties, data that describe characteristics');
  console.log('  RELATIONSHIP - LD Links, associations, connections between entities');
}
```

## Acceptance Criteria
- [ ] TypeM3 enum created as separate file following Web4 compliance
- [ ] UnitModel interface updated with optional typeM3 attribute
- [ ] DefaultUnit implementation supports typeM3 in all relevant methods
- [ ] Unit CLI supports typeM3 parameter in create command
- [ ] New classify command implemented for setting typeM3 on existing units
- [ ] CLI usage updated to document typeM3 functionality
- [ ] TypeM3 values properly validated in CLI commands
- [ ] Unit info command displays typeM3 classification
- [ ] Backward compatibility maintained (typeM3 is optional)

## Dependencies
- Task 26.1: MOF Hierarchy Specification (completed)
- Unit 0.3.0.4 foundation with existing Model interface
- Web4 architectural principles (single enum per file)

## Next Steps
- Task 26.3: Implement MOF Instance Classification System
- Test typeM3 functionality with concrete examples
- Validate MOF M3 classification with Unit ecosystem