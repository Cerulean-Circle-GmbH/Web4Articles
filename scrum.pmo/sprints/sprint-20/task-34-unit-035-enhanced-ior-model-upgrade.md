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

interface UnitReference {
  linkLocation: IOR;                // IOR type (LocalLnIOR, FileIOR, etc.)
  linkTarget: IOR;                  // IOR type (UnitIOR, GitTextIOR, etc.)
  syncStatus: SyncStatus;
}
```

### Specialized IOR Classes
```typescript
// GitTextIOR for git file references
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

// LocalLnIOR for local filesystem references
export class LocalLnIOR implements IOR {
  constructor(private filePath: string) {}
  
  getUrl(): string {
    return `ior:local:ln:file:${this.filePath}`;
  }
  
  getPath(): string {
    return this.filePath.replace('file:', '');
  }
}

// UnitIOR for unit references
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

## Model Upgrade Migration Function

### Migration from Unit 0.3.0.4 to 0.3.0.5
```typescript
export async function modelUpgrade034to035(
  scenario034Path: string,
  sourceFilePath?: string
): Promise<Scenario<UnitModel>> {
  
  // Read 0.3.0.4 scenario
  const scenario034Content = await readFile(scenario034Path, 'utf8');
  const scenario034 = JSON.parse(scenario034Content);
  const model034 = scenario034.model;
  
  // Create enhanced 0.3.0.5 model
  const model035: UnitModel = {
    uuid: model034.uuid,
    name: model034.name,
    
    // Transform origin to IOR type
    origin: model034.origin 
      ? IORFactory.createFromUrl(model034.origin)
      : sourceFilePath 
        ? new GitTextIOR(`https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${sourceFilePath}`)
        : new UnitIOR(model034.uuid),
    
    // Enhance definition with MD format
    definition: model034.definition || generateMDDefinition(model034.name, sourceFilePath),
    
    typeM3: model034.typeM3,
    indexPath: model034.indexPath.replace('0.3.0.4', '0.3.0.5'),
    
    // Transform arrays to IOR references
    references: [
      // Convert symlinkPaths
      ...(model034.symlinkPaths || []).map((path: string) => ({
        linkLocation: new LocalLnIOR(path),
        linkTarget: new UnitIOR(model034.uuid),
        syncStatus: 'SYNCED' as SyncStatus
      })),
      
      // Convert namedLinks
      ...(model034.namedLinks || []).map((link: any) => ({
        linkLocation: new LocalLnIOR(resolveLinkPath(link.location, link.filename)),
        linkTarget: new UnitIOR(model034.uuid),
        syncStatus: 'SYNCED' as SyncStatus
      }))
    ],
    
    createdAt: model034.createdAt,
    updatedAt: new Date().toISOString()
  };
  
  // Create 0.3.0.5 scenario
  const scenario035: Scenario<UnitModel> = {
    ior: {
      uuid: model034.uuid,
      component: 'Unit',
      version: '0.3.0.5'
    },
    owner: scenario034.owner,
    model: model035
  };
  
  // Create master file if origin is GitTextIOR
  if (model035.origin instanceof GitTextIOR && sourceFilePath) {
    const masterFilePath = model035.origin.getMasterFilePath(model035.uuid);
    await ensureDirectoryExists(dirname(masterFilePath));
    await copyFile(sourceFilePath, masterFilePath);
  }
  
  return scenario035;
}

function generateMDDefinition(name: string, sourceFilePath?: string): string {
  return `# ${name}

Enhanced Unit with IOR-based architecture following CORBA 2.3 principles.

## Purpose
Provides ${name} functionality with enhanced IOR model for radical unit traceability.

## IOR Architecture
- **Origin:** IOR type reference to master source
- **References:** IOR-based link tracking with specialized types
- **Type Safety:** All references use proper IOR interface implementations

## Source Reference
${sourceFilePath ? `Original file: \`${basename(sourceFilePath)}\`` : 'Source: Unit creation'}
Component: Unit/0.3.0.5
Type: Enhanced IOR Model`;
}

function resolveLinkPath(location: string, filename: string): string {
  const baseDir = location.replace('../scenarios/', '/workspace/scenarios/');
  return `${dirname(baseDir)}/${filename}`;
}
```

## Acceptance Criteria
- [ ] Unit 0.3.0.5 created with enhanced IOR model
- [ ] All IOR fields use proper IOR types (origin, linkLocation, linkTarget)
- [ ] masterFile field eliminated (origin IS the master reference)
- [ ] Specialized IOR classes implemented (GitTextIOR, LocalLnIOR, UnitIOR)
- [ ] modelUpgrade function provides seamless migration from 0.3.0.4
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

### Enhanced Model Requirements
```quote
i would make it like that but only in one point more simple. the masterFile is not needed when the origin IS an IOR to it. or a GitTextIOr or any other special ior as origin is of type IOR. so no string at all. as well as linkLocation and linkTarget are of type IOR
```

- **Issue:** masterFile field redundant when origin IS the IOR to master file
- **Resolution:** Eliminate masterFile, use pure IOR types for origin, linkLocation, linkTarget
- **Type Safety:** All references use proper IOR interface implementations
- **Simplification:** origin IOR contains master file reference (no redundancy)

---

*Sprint 20 - Enhanced IOR Model Implementation*  
*Priority: High - Foundation for Sprint 22 Interface Deduplication*  
*Blocks: Sprint 22 Auto-Sync and Radical Unit Traceability*