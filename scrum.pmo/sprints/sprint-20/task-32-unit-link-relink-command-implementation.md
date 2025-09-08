[Back to Planning Sprint 20](./planning.md)

# Task 32: Unit Link Relink Command Implementation
[task:uuid:32c1d2e3-f4g5-h6i7-j8k9-l0m1n2o3p4q5]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- Add `[task:uuid:32c1d2e3-f4g5-h6i7-j8k9-l0m1n2o3p4q5]` to this task.
- Source: TRON Respecification of Unit Link Command Functionality
- up
  - [Task 29: Unit Filename Consistency Fix](./task-29-unit-filename-consistency-fix.md)
- down
  - [ ] [Task 32.1: Developer - Link File Resolution Implementation](./task-32.1-developer-link-file-resolution.md)
  - [ ] [Task 32.2: Developer - Target Folder Link Creation](./task-32.2-developer-target-folder-link-creation.md)
  - [ ] [Task 32.3: Developer - Model Update for Multiple Links](./task-32.3-developer-model-update-multiple-links.md)
  - [ ] [Task 32.4: Developer - Relink Command Testing and Validation](./task-32.4-developer-relink-command-testing.md)

## Task Description
Implement unit link relink command with correct signature: `unit link <lnlinkfile.unit> <targetfolder>` to create additional links to the same unit in different locations. Command should read existing link file to get unit UUID, create new link in target folder, and update model to track multiple links correctly.

## Context
From TRON respecification: Current unit link command implementation doesn't match intended functionality. Required command should use existing link file as reference to create additional links to same unit in different target folders, enabling organized link management across multiple locations.

## TRON Request Respecification
### Command Signature Clarification
```quote
mmmh i do not find it myself.
let me respecify:
unit link <lnlinkfile.unit> <targetfolder> shall create another link to the same unit in another location and correctly update the model. create a task for this and pdca
```

**Correct Command Specification:**
- **Signature:** `unit link <lnlinkfile.unit> <targetfolder>`
- **Input:** Existing link file (not UUID directly)
- **Target:** Folder location for new link
- **Functionality:** Create additional link to same unit
- **Model Update:** Track multiple links correctly

**Current vs. Required:**
- **Current:** `unit link <uuid> <filename>` (creates link using UUID)
- **Required:** `unit link <lnlinkfile.unit> <targetfolder>` (creates additional link using existing link)

## Intention
Enable creation of multiple links to same unit across different locations using existing links as reference, with proper model tracking and organized link management.

## Complete Technical Specifications

### Unit Link Relink Implementation

**Command Signature:**
```bash
unit link <lnlinkfile.unit> <targetfolder>
```

**DefaultUnit.ts relink() method:**
```typescript
async relink(linkFilename: string, targetFolder: string): Promise<void> {
  try {
    // Read existing link to get target UUID
    const { readlinkSync } = await import('fs');
    const { resolve, basename, dirname } = await import('path');
    
    const currentDir = process.cwd();
    const existingLinkPath = resolve(currentDir, linkFilename);
    
    // Extract UUID from existing link
    const scenarioPath = readlinkSync(existingLinkPath);
    const uuid = this.extractUuidFromPath(scenarioPath);
    
    // Load unit scenario
    const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
    
    // Create new link in target folder
    const targetPath = resolve(targetFolder);
    const linkBasename = basename(linkFilename);
    const newLinkPath = `${targetPath}/${linkBasename}`;
    
    // Create directory if it doesn't exist
    const { mkdir } = await import('fs/promises');
    await mkdir(targetPath, { recursive: true });
    
    // Create symbolic link to same scenario
    const { symlink } = await import('fs/promises');
    const relativePath = this.calculateRelativePath(targetPath, scenario.model.indexPath);
    await symlink(relativePath, newLinkPath);
    
    // Update scenario model with new link
    scenario.model.symlinkPaths.push(newLinkPath);
    scenario.model.namedLinks.push({
      location: relativePath,
      filename: linkBasename
    });
    
    // Save updated scenario
    await this.storage.saveScenario(uuid, scenario, scenario.model.symlinkPaths);
    
    console.log(`✅ Additional link created: ${linkBasename}`);
    console.log(`   Source: ${existingLinkPath}`);
    console.log(`   Target: ${newLinkPath}`);
    console.log(`   Unit: ${uuid}`);
    console.log(`   Total links: ${scenario.model.symlinkPaths.length}`);
  } catch (error) {
    console.error(`Failed to create additional link: ${(error as Error).message}`);
  }
}

private extractUuidFromPath(scenarioPath: string): string {
  // Extract UUID from path like ../scenarios/index/a/b/c/d/e/uuid.scenario.json
  const pathParts = scenarioPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  return filename.replace('.scenario.json', '');
}

private calculateRelativePath(fromPath: string, toPath: string): string {
  const { relative } = require('path');
  return relative(fromPath, toPath);
}
```

### UnitCLI Integration

**UnitCLI.ts command handling update:**
```typescript
// Update run method to handle relink command
case 'link':
  if (args.length >= 3) {
    await this.relinkUnit(args[1], args[2]);  // <lnlinkfile.unit> <targetfolder>
  } else {
    console.error('Usage: unit link <lnlinkfile.unit> <targetfolder>');
  }
  break;

// Add relink method
private async relinkUnit(linkFilename: string, targetFolder: string): Promise<void> {
  const unit = this.getOrCreateUnit();
  await unit.relink(linkFilename, targetFolder);
}
```

### Usage Documentation Update

**Updated usage display:**
```typescript
console.log('  unit link <lnlinkfile.unit> <targetfolder>      # Create additional link to same unit');
console.log('  link         Create additional LD link to same unit in different location');
console.log('  <lnlinkfile.unit>  Existing link file to use as reference');
console.log('  <targetfolder>     Target folder for new link creation');
```

### Example Usage Scenarios

**Creating Multiple Links to Same Unit:**
```bash
# Create initial unit
unit create "Shared Component" "Component used across multiple projects"

# Create additional links in different project folders
unit link Shared.Component.unit /workspace/project-a/components/
unit link Shared.Component.unit /workspace/project-b/libs/
unit link Shared.Component.unit /workspace/project-c/shared/

# All links point to same unit scenario, model tracks all locations
```

## Implementation Steps
1. Rename current link() method to createInitialLink() for clarity
2. Implement new relink() method for additional link creation
3. Add helper methods for UUID extraction and relative path calculation
4. Update UnitCLI command handling for new signature
5. Update usage documentation with correct command specification
6. Add Vitest tests for relink functionality
7. Validate multiple links point to same unit scenario
8. Test model updates track all link locations correctly

## Requirements
- Command signature: `unit link <lnlinkfile.unit> <targetfolder>`
- Uses existing link file to extract unit UUID
- Creates additional link in specified target folder
- Updates scenario model with new link information
- Maintains all existing links to same unit
- Proper relative path calculation for cross-folder linking
- Error handling for missing files or invalid paths
- Usage documentation reflects correct command specification

## Acceptance Criteria
- [ ] Unit link command signature updated to use existing link file
- [ ] relink() method implemented in DefaultUnit
- [ ] UUID extraction from existing link file working
- [ ] Target folder link creation functional
- [ ] Model updates track multiple links correctly
- [ ] UnitCLI command handling updated for new signature
- [ ] Usage documentation reflects correct specification
- [ ] Vitest tests added for relink functionality
- [ ] Multiple links to same unit validated
- [ ] All existing functionality preserved

## Dependencies
- Task 29: Unit Filename Consistency Fix (filename conversion standards)
- Foundation for organized unit link management across multiple locations