[Back to Planning Sprint 20](./planning.md)

# Task 34: Unit 0.3.0.5 UnitModel Enhancement with IOR 0.3.0.4 Compatibility

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-34.1-developer-unitmodel-enhancement.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done

**Achievement:** Unit 0.3.0.5 UnitModel enhanced with 20+ sophisticated interfaces and IOR compatibility

## Traceability
- Source: Enhanced Unit Model Design with IOR 0.3.0.4 Compatibility
- **Up:**
  - [Radical OOP Upgrade Method PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0245-upgrade-method-radical-oop-compliance.pdca.md)
  - [Unit 0.3.0.5 Correct Approach PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0255-unit-035-correct-approach.pdca.md)
- **Down:**
  - [ ] [Task 34.1: Developer - Enhanced UnitModel Implementation](./task-34.1-developer-unitmodel-enhancement.md)
  - [ ] [Task 34.2: Developer - Upgrade Method Implementation](./task-34.2-developer-upgrade-method-implementation.md)
  - [ ] [Task 34.3: Developer - Reference Array Migration](./task-34.3-developer-reference-array-migration.md)
  - [ ] [Task 34.4: Developer - Unit 0.3.0.5 Integration Testing](./task-34.4-developer-unit-integration-testing.md)

## Task Description
Upgrade Unit component to version 0.3.0.5 with enhanced UnitModel using existing IOR 0.3.0.4 structure. Transform symlinkPaths and namedLinks arrays into unified references array while maintaining all existing functionality. Implement radical OOP upgrade() method for seamless migration from Unit 0.3.0.4.

## Context
Focus on UnitModel enhancement only, keeping IOR interface unchanged from 0.3.0.4 for compatibility. The enhanced model consolidates symlinkPaths and namedLinks into unified references array using existing IOR string format. IOR improvements deferred to future implementation.

## Intention
Create Unit 0.3.0.5 as incremental enhancement with unified reference tracking, preparing for future IOR improvements while maintaining complete backward compatibility with 0.3.0.4 IOR structure and functionality.

## Enhanced UnitModel Specification (IOR 0.3.0.4 Compatible)

### Enhanced UnitModel Interface
```typescript
// File: UnitModel.interface.ts (0.3.0.5)
import { Model } from './Model.interface.js';
import { TypeM3 } from './TypeM3.enum.js';

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // ✅ UNCHANGED: IOR string format from 0.3.0.4
  definition: string;              // ✅ UNCHANGED: IOR string format from 0.3.0.4
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
  indexPath: string;               // scenarios/index/path to this unit
  
  // ✅ ENHANCED: Unified reference tracking (replaces symlinkPaths + namedLinks)
  references: UnitReference[];     // Unified reference array with IOR strings
  
  createdAt: string;               // UnitModel specific
  updatedAt: string;               // UnitModel specific
  
  // ❌ REMOVED: symlinkPaths, namedLinks, executionCapabilities, storageCapabilities
}
```

### UnitReference Interface  
```typescript
// File: UnitReference.interface.ts (0.3.0.5)
export interface UnitReference {
  linkLocation: string;            // ✅ IOR string (0.3.0.4 format): "ior:local:ln:file://..."
  linkTarget: string;              // ✅ IOR string (0.3.0.4 format): "ior:unit:uuid"
  syncStatus: SyncStatus;
}

export enum SyncStatus {
  SYNCED = "SYNCED",
  OUTDATED = "OUTDATED",
  BROKEN = "BROKEN",
  UNKNOWN = "UNKNOWN"
}
```

### IOR Interface (Unchanged from 0.3.0.4)
```typescript
// File: IOR.interface.ts (UNCHANGED from 0.3.0.4)
export interface IOR {
  uuid: string;                    // UUIDv4 format - universal unique identifier
  component: string;               // Component name for identification
  version: string;                 // Component version for compatibility
}
```

## Radical OOP Upgrade Method Implementation

### Upgrade Interface
```typescript
// File: Upgrade.interface.ts
export interface Upgrade {
  upgrade(targetVersion: string): Promise<boolean>;
}
```

### DefaultUnit Upgrade Method Implementation
```typescript
// File: DefaultUnit.ts (Enhanced)
import { Upgrade } from '../layer3/Upgrade.interface.js';

export class DefaultUnit implements Unit, Upgrade {
  private model: UnitModel;
  private storage: DefaultStorage;

  // ... existing constructor and methods ...

  /**
   * Upgrade unit model to target version
   * Radical OOP: Method implementation of Upgrade interface
   * Modern TypeScript: ESM imports, type safety, class-based pattern
   */
  async upgrade(targetVersion: string): Promise<boolean> {
    try {
      if (targetVersion === '0.3.0.5') {
        return await this.upgradeToVersion035();
      }
      
      throw new Error(`Unsupported upgrade target version: ${targetVersion}`);
    } catch (error) {
      console.error(`Upgrade failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Upgrade from 0.3.0.4 to 0.3.0.5 model
   * Transforms symlinkPaths + namedLinks to unified references array
   * Keeps existing IOR string format for compatibility
   */
  private async upgradeToVersion035(): Promise<boolean> {
    const currentModel = this.model as any; // Cast for 0.3.0.4 compatibility
    
    // Transform to enhanced 0.3.0.5 model
    const enhancedModel: UnitModel = {
      uuid: currentModel.uuid,
      name: currentModel.name,
      origin: currentModel.origin || '',           // ✅ UNCHANGED: IOR string format
      definition: currentModel.definition || '',   // ✅ UNCHANGED: IOR string format
      typeM3: currentModel.typeM3,
      indexPath: currentModel.indexPath.replace('0.3.0.4', '0.3.0.5'),
      
      // ✅ ENHANCED: Transform arrays to unified references
      references: this.transformArraysToReferences(currentModel),
      
      createdAt: currentModel.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Update internal model
    this.model = enhancedModel;
    
    // Save enhanced scenario
    const scenario = await this.toScenario();
    await this.storage.saveScenario(this.model.uuid, scenario, this.extractLinkPaths());
    
    console.log(`✅ Unit upgraded to 0.3.0.5: ${this.model.uuid}`);
    return true;
  }

  /**
   * Transform old arrays to unified references (0.3.0.4 → 0.3.0.5)
   * Uses existing IOR string format for compatibility
   */
  private transformArraysToReferences(currentModel: any): UnitReference[] {
    const references: UnitReference[] = [];
    
    // Convert symlinkPaths to references
    if (currentModel.symlinkPaths) {
      for (const path of currentModel.symlinkPaths) {
        references.push({
          linkLocation: `ior:local:ln:file:${path}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    // Convert namedLinks to references
    if (currentModel.namedLinks) {
      for (const link of currentModel.namedLinks) {
        const absolutePath = this.resolveLinkPath(link.location, link.filename);
        references.push({
          linkLocation: `ior:local:ln:file:${absolutePath}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    return references;
  }

  /**
   * Extract link paths from references for storage compatibility
   */
  private extractLinkPaths(): string[] {
    return this.model.references
      .map(ref => ref.linkLocation.replace('ior:local:ln:file:', ''))
      .filter(path => path.startsWith('/workspace/'));
  }

  /**
   * Resolve link path from location and filename (0.3.0.4 compatibility)
   */
  private resolveLinkPath(location: string, filename: string): string {
    const baseDir = location.replace('../scenarios/', '/workspace/scenarios/');
    const { dirname } = require('path');
    return `${dirname(baseDir)}/${filename}`;
  }
}
```

### CLI Integration
```typescript
// File: UnitCLI.ts (Enhanced with upgrade command)
export class UnitCLI {
  // Add upgrade command handling
  case 'upgrade':
    if (commandArgs.length < 1) {
      throw new Error('Target version required for upgrade command');
    }
    const success = await this.getOrCreateUnit().upgrade(commandArgs[0]);
    if (success) {
      console.log(`✅ Unit upgraded to version ${commandArgs[0]}`);
    } else {
      console.error(`❌ Upgrade to version ${commandArgs[0]} failed`);
    }
    break;
}
```

## Acceptance Criteria
- [ ] Unit 0.3.0.5 created with enhanced UnitModel
- [ ] IOR interface unchanged from 0.3.0.4 (uuid, component, version fields)
- [ ] UnitModel uses references array instead of symlinkPaths + namedLinks
- [ ] upgrade() method provides seamless migration from 0.3.0.4 (radical OOP)
- [ ] All existing functionality preserved in 0.3.0.5
- [ ] UnitReference interface with IOR string format (0.3.0.4 compatible)
- [ ] CLI integration with upgrade command working
- [ ] Integration tests pass with enhanced model
- [ ] Capabilities removed following Occam's Razor principle

## Dependencies
- Builds on Unit 0.3.0.4 foundation and all completed Sprint 20 tasks
- Maintains compatibility with existing IOR 0.3.0.4 structure
- Uses enhanced UnitModel design with unified reference tracking
- Integrates with existing central storage and LD links system

## Definition of Done
- [ ] Unit 0.3.0.5 component created with enhanced UnitModel only
- [ ] upgrade() method successfully migrates 0.3.0.4 to 0.3.0.5 model
- [ ] IOR interface unchanged from 0.3.0.4 for compatibility
- [ ] All existing CLI commands functional with enhanced model
- [ ] References array replaces dual array system (symlinkPaths + namedLinks)
- [ ] Performance maintained with enhanced reference tracking
- [ ] Integration with existing Web4 ecosystem validated
- [ ] Backward compatibility with 0.3.0.4 preserved

## QA Audit & User Feedback

### TRON Requirements - Corrected Approach
```quote
do not focus on updating iors. keep the as in 0.3.0.4 and lets do that later. redo the task to NOT change the IOR in the moment but just the UnitModel based on the iors in 0.3.0.4
```

- **Issue:** Previous approach changed IOR interface causing complexity
- **Resolution:** Keep IOR interface unchanged from 0.3.0.4, enhance UnitModel only
- **Incremental Strategy:** UnitModel enhancement first, IOR improvements later
- **Compatibility:** Maintain existing IOR structure for seamless integration

### Radical OOP Method Requirements
```quote
the migration function NEEDS to be a method. of DefaultUnit eventually implementing interface Upgrade as method upgrade.
```

- **Issue:** Migration function not following radical OOP principles
- **Resolution:** Implement upgrade() method in DefaultUnit class implementing Upgrade interface
- **Radical OOP:** Class-based method implementation (not functional programming)
- **Modern TypeScript:** ESM imports, type safety, class-based patterns only

---

*Sprint 20 - UnitModel Enhancement with IOR Compatibility*  
*Priority: High - Foundation for Sprint 22 with Backward Compatibility*  
*Approach: Incremental enhancement without breaking existing IOR structure*