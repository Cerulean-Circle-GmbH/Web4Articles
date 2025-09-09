[Back to Planning Sprint 20](./planning.md)

# Task 34: Unit 0.3.0.5 Enhanced IOR Model Upgrade

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-34.1-developer-ior-model-implementation.md`)
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
- Source: CORBA IOR Research and Enhanced Unit Model Design
- **Up:**
  - [CORBA IOR Research PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0230-corba-ior-research-web4-adaptation.pdca.md)
  - [Pure IOR Type System PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0225-pure-ior-type-system.pdca.md)
- **Down:**
  - [ ] [Task 34.1: Developer - Enhanced IOR Model Implementation](./task-34.1-developer-ior-model-implementation.md)
  - [ ] [Task 34.2: Developer - Specialized IOR Classes Creation](./task-34.2-developer-specialized-ior-classes.md)
  - [ ] [Task 34.3: Developer - Model Upgrade Migration Function](./task-34.3-developer-model-upgrade-migration.md)
  - [ ] [Task 34.4: Developer - Unit 0.3.0.5 Integration Testing](./task-34.4-developer-unit-integration-testing.md)

## Task Description
Upgrade Unit component to version 0.3.0.5 with enhanced IOR model based on CORBA 2.3 principles. Implement specialized IOR string types with implementation classes (GitTextIOR, LocalLnIOR, UnitIOR) while maintaining all existing functionality. Provide modelUpgrade function for seamless migration from Unit 0.3.0.4.

## Context
Based on CORBA 2.3 IOR research, Web4 IORs should be strings of type IOR with specialized implementation classes providing protocol-specific functionality. The enhanced model eliminates redundant masterFile field (origin IS the master reference) and uses pure IOR types for origin, linkLocation, and linkTarget fields.

## Intention
Create Unit 0.3.0.5 as the foundation for radical unit traceability with enhanced IOR model, preparing for Sprint 22 interface deduplication and auto-sync capabilities while maintaining backward compatibility through migration function.

## Enhanced IOR Model Specification

### Enhanced UnitModel Interface
```typescript
// File: UnitModel.interface.ts
export interface UnitModel extends Model {
  uuid: string;
  name: string;
  origin: IOR;                      // ✅ IOR type - IS the master file reference
  definition: string;               // MD formatted text
  typeM3: TypeM3;
  indexPath: string;
  
  // ❌ ELIMINATED: masterFile (origin IS the master reference)
  
  references: UnitReference[];      // Pure IOR types
  createdAt: string;
  updatedAt: string;
  
  // ❌ OCCAM'D OUT: executionCapabilities, storageCapabilities
}
```

### UnitReference Interface  
```typescript
// File: UnitReference.interface.ts
export interface UnitReference {
  linkLocation: IOR;                // IOR type (LocalLnIOR, FileIOR, etc.)
  linkTarget: IOR;                  // IOR type (UnitIOR, GitTextIOR, etc.)
  syncStatus: SyncStatus;
}
```

### GitTextIOR Class
```typescript
// File: GitTextIOR.ts
export class GitTextIOR implements IOR {
  constructor(
    private gitUrl: string,
    private startPos?: string,
    private endPos?: string
  ) {}
  
  getUrl(): string {
    return `ior:git:text:${this.gitUrl}`;
  }
  
  getMasterFilePath(uuid: string): string {
    const uuidPath = uuid.split('').slice(0, 10).join('/').match(/.{1,2}/g)?.slice(0, 5).join('/') || '';
    return `/workspace/scenarios/index/${uuidPath}/${uuid}.master.file`;
  }
}
```

### LocalLnIOR Class
```typescript
// File: LocalLnIOR.ts
export class LocalLnIOR implements IOR {
  constructor(private filePath: string) {}
  
  getUrl(): string {
    return `ior:local:ln:file:${this.filePath}`;
  }
  
  getPath(): string {
    return this.filePath.replace('file:', '');
  }
}
```

### UnitIOR Class
```typescript
// File: UnitIOR.ts
export class UnitIOR implements IOR {
  constructor(private uuid: string) {}
  
  getUrl(): string {
    return `ior:unit:${this.uuid}`;
  }
  
  getScenarioPath(): string {
    const uuidPath = this.uuid.split('').slice(0, 10).join('/').match(/.{1,2}/g)?.slice(0, 5).join('/') || '';
    return `/workspace/scenarios/index/${uuidPath}/${this.uuid}.scenario.json`;
  }
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
   * Radical OOP: Private method for specific version upgrade logic
   */
  private async upgradeToVersion035(): Promise<boolean> {
    // Current model (0.3.0.4 format)
    const currentModel = this.model;
    
    // Transform to enhanced 0.3.0.5 model with pure IOR types
    const enhancedModel: UnitModel = {
      uuid: currentModel.uuid,
      name: currentModel.name,
      
      // Transform origin to IOR type
      origin: this.createIORFromString(currentModel.origin) || this.createDefaultOriginIOR(),
      
      // Enhance definition with MD format
      definition: currentModel.definition || this.generateDefaultMDDefinition(),
      
      typeM3: currentModel.typeM3,
      indexPath: currentModel.indexPath.replace('0.3.0.4', '0.3.0.5'),
      
      // Transform arrays to IOR references
      references: await this.transformArraysToIORReferences(currentModel),
      
      createdAt: currentModel.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Create master file from origin IOR
    await this.createMasterFileFromOrigin(enhancedModel);
    
    // Update internal model
    this.model = enhancedModel;
    
    // Save enhanced scenario
    await this.storage.saveScenario(this.model.uuid, this.toScenario(), []);
    
    console.log(`✅ Unit upgraded to 0.3.0.5: ${this.model.uuid}`);
    return true;
  }

  /**
   * Create IOR from string value (radical OOP helper method)
   */
  private createIORFromString(iorString: string): IOR | null {
    if (!iorString) return null;
    
    if (iorString.startsWith('ior:git:text:')) {
      const gitUrl = iorString.replace('ior:git:text:', '');
      return new GitTextIOR(gitUrl);
    } else if (iorString.startsWith('ior:local:ln:')) {
      const filePath = iorString.replace('ior:local:ln:', '');
      return new LocalLnIOR(filePath);
    } else if (iorString.startsWith('ior:unit:')) {
      const uuid = iorString.replace('ior:unit:', '');
      return new UnitIOR(uuid);
    }
    
    return null;
  }

  /**
   * Create default origin IOR for units without origin
   */
  private createDefaultOriginIOR(): IOR {
    return new UnitIOR(this.model.uuid);
  }

  /**
   * Generate default MD definition
   */
  private generateDefaultMDDefinition(): string {
    return `# ${this.model.name}

Enhanced Unit with IOR-based architecture following CORBA 2.3 principles.

## Purpose
Provides ${this.model.name} functionality with enhanced IOR model for radical unit traceability.

## IOR Architecture
- **Origin:** IOR type reference to master source
- **References:** IOR-based link tracking with specialized types
- **Type Safety:** All references use proper IOR interface implementations

## Web4 Integration
Follows radical OOP principles with modern TypeScript implementation.`;
  }

  /**
   * Transform current arrays to IOR references
   */
  private async transformArraysToIORReferences(currentModel: any): Promise<UnitReference[]> {
    const references: UnitReference[] = [];
    
    // Convert symlinkPaths to IOR references
    if (currentModel.symlinkPaths) {
      for (const path of currentModel.symlinkPaths) {
        references.push({
          linkLocation: new LocalLnIOR(path),
          linkTarget: new UnitIOR(currentModel.uuid),
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    // Convert namedLinks to IOR references
    if (currentModel.namedLinks) {
      for (const link of currentModel.namedLinks) {
        const absolutePath = this.resolveLinkPath(link.location, link.filename);
        references.push({
          linkLocation: new LocalLnIOR(absolutePath),
          linkTarget: new UnitIOR(currentModel.uuid),
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    return references;
  }

  /**
   * Create master file from origin IOR
   */
  private async createMasterFileFromOrigin(model: UnitModel): Promise<void> {
    if (model.origin instanceof GitTextIOR) {
      const masterFilePath = model.origin.getMasterFilePath(model.uuid);
      const { mkdir } = await import('fs/promises');
      await mkdir(dirname(masterFilePath), { recursive: true });
      
      // Copy source to master file if source exists
      const sourceFile = this.extractSourceFileFromOrigin(model.origin);
      if (sourceFile && existsSync(sourceFile)) {
        const { copyFile } = await import('fs/promises');
        await copyFile(sourceFile, masterFilePath);
      }
    }
  }
  }
}
```

### CLI Integration
```typescript
// File: UnitCLI.ts (Enhanced with upgrade command)
export class UnitCLI {
  private unit: DefaultUnit | null = null;

  // Add upgrade command to CLI
  async handleUpgrade(args: string[]): Promise<void> {
    if (args.length < 1) {
      throw new Error('Target version required for upgrade command');
    }
    
    const targetVersion = args[0];
    const unit = this.getOrCreateUnit();
    
    const success = await unit.upgrade(targetVersion);
    if (success) {
      console.log(`✅ Unit upgraded to version ${targetVersion}`);
    } else {
      console.error(`❌ Upgrade to version ${targetVersion} failed`);
    }
  }
}
```

## Acceptance Criteria
- [ ] Unit 0.3.0.5 created with enhanced IOR model
- [ ] All IOR fields use proper IOR types (origin, linkLocation, linkTarget)
- [ ] masterFile field eliminated (origin IS the master reference)
- [ ] Specialized IOR classes implemented (GitTextIOR, LocalLnIOR, UnitIOR)
- [ ] upgrade() method provides seamless migration from 0.3.0.4 (radical OOP)
- [ ] All existing functionality preserved in 0.3.0.5
- [ ] .master.file storage format implemented
- [ ] IOR.md documentation created with CORBA principles and Web4 adaptations
- [ ] Integration tests pass with enhanced IOR model
- [ ] CLI commands work with IOR-based references

## Dependencies
- Builds on Unit 0.3.0.4 foundation and all completed Sprint 20 tasks
- Requires IOR.md documentation for implementation guidance
- Uses enhanced IOR model design from CORBA 2.3 research
- Integrates with existing central storage and LD links system

## Definition of Done
- [ ] Unit 0.3.0.5 component created with enhanced IOR model
- [ ] All specialized IOR classes implemented and tested
- [ ] modelUpgrade function successfully migrates existing units
- [ ] IOR.md documentation complete with CORBA principles and Web4 adaptations
- [ ] All existing CLI commands functional with IOR-based model
- [ ] Interface deduplication capability demonstrated
- [ ] Performance benchmarks meet requirements
- [ ] Integration with existing Web4 ecosystem validated

## QA Audit & User Feedback

### TRON Requirements - Enhanced IOR Model
```quote
now its perfect… still the corba iors have an internal model as you found out but still can be serialized to a string with ior:profile,profile/path#anchor?wueryParameter where profile is basically a url or ior:tcp:ip:https:tsl:/host1:port1/failoverhost2:port2/… a protocol stack with multiple endpoints but this is much to much for the MVP. lets start with the specialized IORs as you understand them and implement IOR protocol stack to object and endpoint mapping later.
```

- **Issue:** Need enhanced IOR model based on CORBA principles with specialized IOR types
- **Resolution:** Implement specialized IOR strings with implementation classes
- **MVP Scope:** Simple specialized IORs, defer complex protocol stack to future
- **Architecture:** CORBA-inspired tagged profiles adapted for Web4 needs

### Radical OOP Method Requirements
```quote
the migration function NEEDS to be a method. of DefaultUnit eventually implementing interface Upgrade as method upgrade.
```

- **Issue:** Migration function not following radical OOP principles
- **Resolution:** Implement upgrade() method in DefaultUnit class implementing Upgrade interface
- **Radical OOP:** Class-based method implementation (not functional programming)
- **Modern TypeScript:** ESM imports, type safety, class-based patterns only

### Enhanced IOR Model Requirements  
```quote
the masterFile is not needed when the origin IS an IOR to it. or a GitTextIOr or any other special ior as origin is of type IOR. so no string at all. as well as linkLocation and linkTarget are of type IOR
```

- **Issue:** masterFile field redundant when origin IS the IOR to master file
- **Resolution:** Eliminate masterFile, use pure IOR types for origin, linkLocation, linkTarget
- **Type Safety:** All references use proper IOR interface implementations
- **Simplification:** origin IOR contains master file reference (no redundancy)

---

*Sprint 20 - Enhanced IOR Model Implementation*  
*Priority: High - Foundation for Sprint 22 Interface Deduplication*  
*Blocks: Sprint 22 Auto-Sync and Radical Unit Traceability*