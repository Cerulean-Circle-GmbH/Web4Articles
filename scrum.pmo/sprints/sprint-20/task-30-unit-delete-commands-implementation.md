[Back to Planning Sprint 20](./planning.md)

# Task 30: Unit Delete Commands Implementation
[task:uuid:30b2c3d4-e5f6-7890-1234-567890123456]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

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
- Add `[task:uuid:30b2c3d4-e5f6-7890-1234-567890123456]` to this task.
- Source: TRON Request for Unit Delete Commands
- up
  - [Task 27: Model Interface Implementation](./task-27-model-interface-implementation.md)
- down
  - [ ] [Task 30.1: Developer - Unit DeleteLink Command Implementation](./task-30.1-developer-unit-deletelink-command.md)
  - [ ] [Task 30.2: Developer - Unit DeleteUnit Command Implementation](./task-30.2-developer-unit-deleteunit-command.md)
  - [ ] [Task 30.3: Developer - Delete Commands CLI Integration](./task-30.3-developer-delete-commands-cli-integration.md)
  - [ ] [Task 30.4: Developer - Delete Commands Validation Testing](./task-30.4-developer-delete-commands-validation.md)

## Task Description
Implement unit delete commands: deleteLink to remove only a link file from the model while preserving the unit, and deleteUnit to delete the entire unit from index and all its LD link files. Provide granular deletion control for unit management.

## Context
From TRON request: Need deleteLink command to remove specific link files while preserving unit in central storage, and deleteUnit command for complete unit removal including all links and central storage cleanup.

## TRON Request Integration
### Commands Requested
```quote
add a task to add a
unit deleteLink <lnfile.unit>
unit deleteUnit <lnfile.unit>

which delete only a link file from the model
and
delete the ent unit from the index and all its ln link files.
```

**Command Specifications:**
- **deleteLink:** Remove only specific link file, update model, preserve unit in central storage
- **deleteUnit:** Complete unit removal from index and all associated LD link files

## Intention
Provide comprehensive unit lifecycle management with granular deletion control, enabling both selective link removal and complete unit cleanup while maintaining data integrity and proper cleanup of filesystem artifacts.

## Complete Technical Specifications

### deleteLink Command Implementation

**Command Signature:**
```bash
unit deleteLink <lnfile.unit>
```

**DefaultUnit.ts deleteLink() method:**
```typescript
async deleteLink(linkFilename: string): Promise<void> {
  try {
    // Resolve link file to get target UUID
    const { readlinkSync, unlinkSync } = await import('fs');
    const currentDir = process.cwd();
    const linkPath = `${currentDir}/${linkFilename}`;
    
    // Read the symlink to get scenario path
    const scenarioPath = readlinkSync(linkPath);
    const uuid = this.extractUuidFromPath(scenarioPath);
    
    // Load unit scenario
    const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
    
    // Remove link from symlinkPaths
    const linkIndex = scenario.model.symlinkPaths.indexOf(linkPath);
    if (linkIndex > -1) {
      scenario.model.symlinkPaths.splice(linkIndex, 1);
    }
    
    // Remove from namedLinks
    const namedLinkIndex = scenario.model.namedLinks.findIndex(
      link => link.filename === linkFilename
    );
    if (namedLinkIndex > -1) {
      scenario.model.namedLinks.splice(namedLinkIndex, 1);
    }
    
    // Update scenario in storage
    await this.storage.saveScenario(uuid, scenario, scenario.model.symlinkPaths);
    
    // Remove the actual link file
    unlinkSync(linkPath);
    
    console.log(`✅ Link deleted: ${linkFilename}`);
    console.log(`   Unit ${uuid} preserved in central storage`);
    console.log(`   Remaining links: ${scenario.model.symlinkPaths.length}`);
  } catch (error) {
    console.error(`Failed to delete link: ${(error as Error).message}`);
  }
}
```

### deleteUnit Command Implementation

**Command Signature:**
```bash
unit deleteUnit <lnfile.unit>
```

**DefaultUnit.ts deleteUnit() method:**
```typescript
async deleteUnit(linkFilename: string): Promise<void> {
  try {
    // Resolve link file to get target UUID
    const { readlinkSync, unlinkSync } = await import('fs');
    const { unlink } = await import('fs/promises');
    const currentDir = process.cwd();
    const linkPath = `${currentDir}/${linkFilename}`;
    
    // Read the symlink to get scenario path
    const scenarioPath = readlinkSync(linkPath);
    const uuid = this.extractUuidFromPath(scenarioPath);
    
    // Load unit scenario to get all links
    const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
    
    // Delete all LD link files
    for (const symlinkPath of scenario.model.symlinkPaths) {
      try {
        unlinkSync(symlinkPath);
        console.log(`   Deleted link: ${symlinkPath}`);
      } catch (error) {
        console.warn(`   Warning: Could not delete link ${symlinkPath}: ${(error as Error).message}`);
      }
    }
    
    // Delete the unit scenario from central storage
    const scenarioFullPath = `/workspace${scenarioPath.startsWith('/workspace') ? scenarioPath.slice(10) : scenarioPath}`;
    await unlink(scenarioFullPath);
    
    console.log(`✅ Unit deleted completely: ${uuid}`);
    console.log(`   Scenario removed: ${scenarioFullPath}`);
    console.log(`   Links deleted: ${scenario.model.symlinkPaths.length}`);
    console.log(`   Named links removed: ${scenario.model.namedLinks.length}`);
  } catch (error) {
    console.error(`Failed to delete unit: ${(error as Error).message}`);
  }
}

private extractUuidFromPath(scenarioPath: string): string {
  // Extract UUID from path like ../index/f/8/f/8/6/uuid.scenario.json
  const pathParts = scenarioPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  return filename.replace('.scenario.json', '');
}
```

### CLI Integration Implementation

**UnitCLI.ts command handling:**
```typescript
// Add to run method command handling
case 'deleteLink':
  if (args.length >= 2) {
    await this.deleteLink(args[1]);
  } else {
    console.error('Usage: unit deleteLink <lnfile.unit>');
  }
  break;

case 'deleteUnit':
  if (args.length >= 2) {
    await this.deleteUnit(args[1]);
  } else {
    console.error('Usage: unit deleteUnit <lnfile.unit>');
  }
  break;
```

**Method implementations:**
```typescript
private async deleteLink(linkFilename: string): Promise<void> {
  const unit = this.getOrCreateUnit();
  await unit.deleteLink(linkFilename);
}

private async deleteUnit(linkFilename: string): Promise<void> {
  const unit = this.getOrCreateUnit();
  await unit.deleteUnit(linkFilename);
}
```

**Usage documentation update:**
```typescript
private showUsage(): void {
  console.log('Usage:');
  console.log('  unit create <name> [description]                # Create unit');
  console.log('  unit link <uuid> <filename>                     # Create link to existing unit');
  console.log('  unit list <uuid>                                # List all links to unit');
  console.log('  unit origin <uuid>                              # Show origin and definition links');
  console.log('  unit deleteLink <lnfile.unit>                   # Delete specific link file only');
  console.log('  unit deleteUnit <lnfile.unit>                   # Delete entire unit and all links');
  // ... rest of usage
}
```

## Implementation Steps
1. Fix unit link command filename conversion (spaces → dots)
2. Implement deleteLink method in DefaultUnit
3. Implement deleteUnit method in DefaultUnit
4. Add UUID extraction helper method
5. Integrate delete commands in UnitCLI command handling
6. Update usage documentation with new commands
7. Test filename consistency across all commands
8. Validate delete operations work correctly

## Requirements
- Unit link command applies filename conversion (spaces → dots)
- deleteLink command removes only specific link file
- deleteUnit command removes entire unit and all links
- Scenario updates reflect link deletions correctly
- Central storage cleanup for complete unit deletion
- Error handling for missing files or invalid operations
- Usage documentation includes new delete commands
- Consistent filename handling across all unit commands

## Acceptance Criteria
- [ ] Unit link command applies filename conversion consistently
- [ ] deleteLink method implemented in DefaultUnit
- [ ] deleteUnit method implemented in DefaultUnit
- [ ] UUID extraction helper method implemented
- [ ] Delete commands integrated in UnitCLI command handling
- [ ] Usage documentation updated with delete commands
- [ ] Multi-word filename consistency validated across all commands
- [ ] Delete operations tested and working correctly
- [ ] Scenario updates verified for link deletions
- [ ] Central storage cleanup validated for unit deletion

## Dependencies
- Based on Task 27 Model Interface Implementation
- Requires consistent filename handling fix
- Foundation for comprehensive unit lifecycle management