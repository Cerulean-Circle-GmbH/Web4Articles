[Back to Planning Sprint 20](./planning.md)

# Task 27: Model Interface Implementation (Essential Methods)
[task:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-27.1-developer-model-interface-creation.md`)
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
- Add `[task:uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890]` to this task.
- Source: TRON Feedback on Scenario Interface Generalization and Model Methods
- up
  - [Model Interface Methods Analysis PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2320-model-interface-methods-analysis.pdca.md)
  - [Scenario Model Interface Generalization PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-2310-scenario-model-interface-generalization.pdca.md)
- down
  - [Task 27.1: Developer - Model Interface Creation](./task-27.1-developer-model-interface-creation.md)
  - [Task 27.2: Developer - UnitModel Interface Update](./task-27.2-developer-unitmodel-interface-update.md)
  - [Task 27.3: Developer - Scenario Interface Generalization](./task-27.3-developer-scenario-interface-generalization.md)
  - [Task 27.4: Developer - DefaultUnit Model Methods Implementation](./task-27.4-developer-defaultunit-model-methods.md)

## Task Description
Implement minimal Model interface with essential methods (uuid property + toScenario/init/validate methods) to enable scenario generalization and universal hibernation pattern across Web4 ecosystem. Apply TRON's QA feedback: minimal Model (uuid only), separate change tracking, generic Scenario with complexity monitoring.

## Context
From TRON feedback on Scenario interface: missing Model interface generalization causes Scenario to be hardcoded to UnitModel instead of being general enough for all components. TRON suggested toScenario() method belongs in Model interface, disagreed with createdAt/updatedAt in base Model (should be in change event object), and noted potential complexity concerns with generic Scenario template.

## Intention
Create foundational Model interface that enables universal hibernation pattern, scenario generalization, and consistent component architecture across Web4 ecosystem while maintaining Occam's Razor simplicity and addressing TRON's QA concerns.

## Steps
1. Create minimal Model interface with uuid property only (Occam's Razor applied)
2. Add essential methods: toScenario(), init(), validate() to Model interface
3. Create separate ChangeEvent interface for change tracking (TRON's feedback)
4. **NEW:** Create separate NamedLink interface (Web4 compliance - single interface per file)
5. Update UnitModel to extend minimal Model interface
6. Update Scenario interface to use generic template with QA warning
7. **NEW:** Fix OntologyAgent File unit terminal identity (UUID: 7e4edfc3-f746-419f-ad31-e4b49bed9549)
8. **NEW:** Enhance unit creation to preserve description in definition field
9. Update DefaultUnit to implement Model interface methods
10. Validate implementation with TypeScript compilation and testing
11. Document generic template complexity concerns for future monitoring

## Requirements
- Model interface with minimal essential properties (uuid only)
- Essential methods: toScenario(), init(), validate() in Model interface
- Separate ChangeEvent interface for audit trail (not in base Model)
- **NEW:** Separate NamedLink interface (Web4 compliance - single interface per file)
- UnitModel extends Model interface (inherits uuid, implements methods)
- Generic Scenario interface: Scenario<T extends Model = Model>
- **NEW:** OntologyAgent File unit terminal identity completed (definition field preservation)
- **NEW:** Unit creation process enhanced to preserve description in definition field
- DefaultUnit implements Model interface methods correctly
- TypeScript compilation success with new interface structure
- Backward compatibility maintained during transition
- QA warning documented for generic template complexity monitoring
- Web4 compliance: single interface per file, type safety, generalization

## Acceptance Criteria
- [ ] Model.interface.ts created with minimal structure (uuid property only)
- [ ] Model interface includes toScenario(name?: string): Promise<Scenario<this>>
- [ ] Model interface includes init(scenario: Scenario<this>): this
- [ ] Model interface includes validate(): Promise<boolean>
- [ ] ChangeEvent.interface.ts created for separate change tracking
- [ ] **NEW:** NamedLink.interface.ts created as separate file (Web4 compliance)
- [ ] UnitModel.interface.ts updated to extend Model interface (single interface only)
- [ ] Scenario.interface.ts updated to generic template with QA warning
- [ ] **NEW:** OntologyAgent File unit (7e4edfc3) terminal identity completed
- [ ] **NEW:** Unit creation enhanced to store description in definition field
- [ ] DefaultUnit.ts implements all Model interface methods correctly
- [ ] TypeScript compilation succeeds with new interface structure
- [ ] All existing tests pass with updated interfaces
- [ ] Generic template complexity warning documented in Scenario interface
- [ ] Backward compatibility validated with existing component usage
- [ ] **NEW:** All interface files contain single interface only (Web4 compliance validated)

## TRON QA Feedback Integration
### Original Issue Identified by TRON
```quote
"lets look at components/Unit/0.3.0.4/src/ts/layer3/Scenario.interface.ts

there has been a Model interface and Scenario model should be of type Model and UnitModel has to implement/extend Model. otherwise Scenarios are not general enough."
```

**Current Problem:**
```typescript
// CURRENT (Not general enough)
export interface Scenario {
  ior: IOR;
  owner: string;
  model: any;  // ❌ Should be typed Model, currently UnitModel-specific
}
```

### TRON's Method Suggestion
```quote
"isn't the signature 
  async toScenario(name?: string): Promise<Scenario> {
method another good fit for the Model interface?"
```

**Analysis:** TRON correctly identified that toScenario() is fundamental model operation that should be in base Model interface for universal hibernation pattern.

### TRON QA Concerns on Proposed Fix
```quote
"i disagree withe createdAt and updatedAt from ocams perspective. these attributes would be better in a change event object. i cannot forsee the upraising complexity of the template typed scenario. lets give it a try but note my qa feedback in the unit task."
```

**QA Feedback Applied:**
- **Occam's Razor:** createdAt/updatedAt removed from base Model (better in change event object)
- **Complexity Warning:** Cannot foresee complexity of template typed scenario - documented for monitoring
- **Minimal Approach:** Model interface with uuid only, essential methods only
- **Separate Concerns:** Change tracking as independent ChangeEvent interface

## Complete Technical Specifications

### Model Interface Implementation (Complete Code)
```typescript
/**
 * Model Interface - Minimal base interface for all Web4 component models
 * Web4 principle: Single interface per file, minimal essential structure
 * Purpose: Universal identifier and fundamental model operations
 * 
 * TRON QA Feedback Applied:
 * - Occam's Razor: Only uuid property (createdAt/updatedAt moved to ChangeEvent)
 * - toScenario() method perfect fit for Model interface (TRON's suggestion)
 * - Generic template complexity concerns documented for monitoring
 */
export interface Model {
  uuid: string;                    // UUIDv4 format - universal identifier (ONLY essential property)

  // Universal model methods
  toScenario(name?: string): Promise<Scenario<this>>;  // TRON's excellent suggestion - hibernation pattern
  init(scenario: Scenario<this>): this;                // Web4 standard pattern - empty constructor + scenario init
  validate(): Promise<boolean>;                        // Model integrity validation - type safety
}
```

### ChangeEvent Interface Implementation (Complete Code)
```typescript
/**
 * ChangeEvent Interface - Separate concern for tracking model changes
 * Web4 principle: Single responsibility, separate from model structure
 * Purpose: Track creation and modification events independently
 * 
 * TRON Feedback: createdAt/updatedAt better in change event object (Occam's Razor)
 */
export interface ChangeEvent {
  targetUuid: string;              // UUID of the model being tracked
  eventType: 'created' | 'updated' | 'deleted';
  timestamp: string;               // ISO 8601 timestamp
  actor: string;                   // Who made the change
  changes?: Record<string, any>;   // What changed (optional)
}
```

### Updated UnitModel Implementation (Complete Code)
```typescript
/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */
import { Model } from './Model.interface.js';
import { TypeM3 } from './UnitModel.interface.js';

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
  createdAt: string;               // ❌ UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
  updatedAt: string;               // ❌ UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
}
```

### NamedLink Interface Implementation (Separate File - Web4 Compliance)
```typescript
/**
 * NamedLink Interface - Named link structure for LD link management
 * Web4 principle: Single interface per file
 * Purpose: Bidirectional linking between workspace locations and central storage
 * 
 * TRON Feedback: Web4 compliance violation identified - multiple interfaces in single file
 * Fixed: NamedLink moved to separate interface file
 */
export interface NamedLink {
  location: string;                // Relative path from link to scenario
  filename: string;                // Link filename (e.g., "test-unit.unit")
}
```

### Generic Scenario Interface Implementation (Complete Code)
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

### DefaultUnit Model Methods Implementation (Complete Code)
```typescript
export class DefaultUnit implements Unit {
  private model: UnitModel;

  // Implementing Model interface methods
  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    // Store unit name in execution capabilities if provided (TRON's suggestion integration)
    if (name && !this.model.executionCapabilities.includes(name)) {
      this.model.executionCapabilities.push(name);
    }

    // Create owner data
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Unit',
      version: '0.3.0.4'
    });

    // Return typed scenario
    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Unit',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: this.model
    };
  }

  init(scenario: Scenario<UnitModel>): this {
    if (scenario.model) {
      this.model = scenario.model;
    }
    
    // Check for missing terminal identity and show warnings (backward compatibility)
    this.showTerminalIdentityWarning();
    
    return this;
  }

  async validate(): Promise<boolean> {
    // Comprehensive UnitModel validation
    try {
      // Required string properties
      if (!this.model.uuid || typeof this.model.uuid !== 'string') return false;
      if (!this.model.name || typeof this.model.name !== 'string') return false;
      if (!this.model.origin || typeof this.model.origin !== 'string') return false;
      if (!this.model.definition || typeof this.model.definition !== 'string') return false;
      if (!this.model.indexPath || typeof this.model.indexPath !== 'string') return false;
      
      // TypeM3 validation
      if (!Object.values(TypeM3).includes(this.model.typeM3)) return false;
      
      // Array properties
      if (!Array.isArray(this.model.symlinkPaths)) return false;
      if (!Array.isArray(this.model.namedLinks)) return false;
      if (!Array.isArray(this.model.executionCapabilities)) return false;
      if (!Array.isArray(this.model.storageCapabilities)) return false;
      
      // Timestamp validation
      if (!this.model.createdAt || isNaN(Date.parse(this.model.createdAt))) return false;
      if (!this.model.updatedAt || isNaN(Date.parse(this.model.updatedAt))) return false;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  private showTerminalIdentityWarning(): void {
    // Existing implementation for backward compatibility warnings
    if (!this.model.name || !this.model.origin || !this.model.definition) {
      console.warn(`⚠️  Warning: Unit '${this.model.uuid}' missing terminal identity information:\n`);
      if (!this.model.name) console.warn('   - name: not specified');
      if (!this.model.origin) console.warn('   - origin: not specified');
      if (!this.model.definition) console.warn('   - definition: not specified');
      console.warn('\n   Next build version will require migration method for missing model info.');
      console.warn('   Please update unit with complete terminal identity (uni-t) attributes.');
    }
  }
}
```

## OntologyAgent Unit Fix Integration

### Issue Identified in OntologyAgent's File Unit
**Created Unit:** UUID `7e4edfc3-f746-419f-ad31-e4b49bed9549` (File M2 Class)
**Command Used:** `unit create File "M2 Class for M1 file instances"`

**Problems Found:**
```json
{
  "model": {
    "name": "",        // ❌ Empty - should be "File"
    "origin": "",      // ❌ Empty - missing source reference  
    "definition": "",  // ❌ Empty - should contain "M2 Class for M1 file instances"
    "typeM3": "CLASS"  // ✅ Correct M2 Class classification
  }
}
```

### TRON's Key Insight: Description = Definition
```quote
"the lost description is the definition and should be stored there"
```

**Fix Implementation:**
```bash
# Complete terminal identity for OntologyAgent's File unit
cd scenarios/ontology
echo "M2 Class for M1 file instances" > file-definition.txt
../scripts/unit definition 7e4edfc3-f746-419f-ad31-e4b49bed9549 "file-definition.txt" "1:1" "1:30"
```

**Expected Result:**
```json
{
  "model": {
    "name": "File",
    "origin": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scenarios/ontology/file-definition.txt#L1:1-L1:30",
    "definition": "M2 Class for M1 file instances"  // ✅ TRON's insight: description preserved in definition
  }
}
```

### Enhanced Unit Creation Process
**Current Issue:** Unit create command loses description
**Improvement:** Enhance DefaultUnit to store description in definition field

```typescript
// Enhanced unit creation in DefaultUnit
async create(name: string, description?: string): Promise<void> {
  this.model.name = name;
  
  if (description) {
    this.model.definition = description;  // ✅ TRON's insight: store description as definition
  }
  
  // Continue with existing creation logic...
}
```

## Implementation Approach
- Minimal Model interface following Occam's Razor principle
- Generic Scenario with documented complexity concerns
- **NEW:** OntologyAgent unit fixes integrated for comprehensive execution
- **NEW:** Web4 compliance restored with single interface per file
- Progressive adoption across Web4 ecosystem
- Future monitoring of template complexity impact

## Dependencies
- Builds on Unit 0.3.0.4 foundation with TypeM3 attribute
- **NEW:** Fixes OntologyAgent File unit (UUID: 7e4edfc3) terminal identity
- Requires TypeScript compilation and interface resolution
- Foundation for universal hibernation pattern across Web4 components