[Back to Task 27](./task-27-model-interface-implementation.md)

# Task 27.3: Developer - DefaultUnit Model Methods Implementation
[task:uuid:27c3d4e5-f6g7-8901-2345-67890123456b]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- Add `[task:uuid:27c3d4e5-f6g7-8901-2345-67890123456b]` to this task.
- Source: Task 27 Model Interface Implementation - DefaultUnit Methods
- up
  - [Task 27: Model Interface Implementation](./task-27-model-interface-implementation.md)
- down
  - No further breakdown needed - implementation level subtask

## Task Description
Implement Model interface methods in DefaultUnit class: toScenario(), init(), and validate(). Update DefaultUnit to properly implement the Model interface contract while maintaining all existing functionality and Web4 compliance patterns.

## Context
Depends on Task 27.2 completion (extended interfaces). DefaultUnit must implement Model interface methods to provide universal hibernation pattern. TRON suggested toScenario() method belongs in Model interface. Implementation must maintain backward compatibility with existing Unit functionality.

## Intention
Enable DefaultUnit to serve as Model interface implementation example while maintaining all existing Unit functionality and providing foundation for universal hibernation pattern across Web4 ecosystem.

## Complete Technical Specifications

### DefaultUnit Class Updates (Complete Code)
**File:** `components/Unit/0.3.0.4/src/ts/layer2/DefaultUnit.ts`

**Import Updates:**
```typescript
import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel, TypeM3 } from '../layer3/UnitModel.interface.js';
import { Model } from '../layer3/Model.interface.js';  // NEW: Import base Model
import { DefaultStorage } from './DefaultStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';
```

**Class Declaration Update:**
```typescript
export class DefaultUnit implements Unit, Model {  // NEW: Implement Model interface
  private model: UnitModel;
  private storage: DefaultStorage;
  
  // ... existing constructor and other methods
}
```

### Model Interface Methods Implementation (Complete Code)

**toScenario() Method (TRON's Suggestion):**
```typescript
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
```

**init() Method (Web4 Standard Pattern):**
```typescript
init(scenario: Scenario<UnitModel>): this {
  if (scenario.model) {
    this.model = scenario.model;
  }
  
  // Check for missing terminal identity and show warnings (backward compatibility)
  this.showTerminalIdentityWarning();
  
  // Initialize storage with scenario - Web4 pattern
  const storageScenario = {
    ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.0.4' },
    owner: '',
    model: { 
      uuid: crypto.randomUUID(), 
      projectRoot: this.findProjectRoot(), 
      indexBaseDir: 'scenarios/index', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    }
  };
  this.storage.init(storageScenario);
  
  return this;
}
```

**validate() Method (Model Integrity):**
```typescript
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
```

**Existing Method Updates:**
```typescript
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
```

## Implementation Steps
1. Add Model interface import to DefaultUnit.ts
2. Update class declaration to implement both Unit and Model interfaces
3. Ensure toScenario() method signature matches Model interface
4. Update init() method signature to use generic Scenario<UnitModel>
5. Implement validate() method with comprehensive UnitModel validation
6. Update all method return types to match Model interface requirements
7. Validate TypeScript compilation with Model interface implementation
8. Test all existing functionality still works with Model interface

## Requirements
- DefaultUnit implements Model interface correctly
- toScenario() method matches Model interface signature
- init() method uses generic Scenario<UnitModel> type
- validate() method provides comprehensive UnitModel validation
- All existing functionality preserved during Model interface integration
- TypeScript compilation success with Model interface implementation
- Backward compatibility maintained for existing Unit usage

## Acceptance Criteria
- [ ] DefaultUnit.ts imports Model interface correctly
- [ ] DefaultUnit class implements both Unit and Model interfaces
- [ ] toScenario() method signature matches Model interface
- [ ] init() method uses generic Scenario<UnitModel> type
- [ ] validate() method implemented with comprehensive validation logic
- [ ] All method return types match Model interface requirements
- [ ] TypeScript compilation succeeds with Model interface implementation
- [ ] All existing Unit functionality preserved and working
- [ ] Backward compatibility validated with existing usage patterns

## Dependencies
- Task 27.2: Extended Interfaces Implementation (UnitModel extends Model, Generic Scenario)
- Foundation for Task 27.4: Unit CLI Enhancement and Validation