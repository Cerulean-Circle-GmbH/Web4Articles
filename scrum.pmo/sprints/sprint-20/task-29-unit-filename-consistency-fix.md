[Back to Planning Sprint 20](./planning.md)

# Task 29: Unit Filename Consistency Fix
[task:uuid:29a1b2c3-d4e5-f678-9012-345678901234]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- Add `[task:uuid:29a1b2c3-d4e5-f678-9012-345678901234]` to this task.
- Source: TRON QA Feedback on Task 27 - Filename Consistency Issue
- up
  - [Task 27: Model Interface Implementation](./task-27-model-interface-implementation.md)
- down
  - [ ] [Task 29.1: Developer - Unit Link Command Filename Fix](./task-29.1-developer-unit-link-filename-fix.md)
  - [ ] [Task 29.2: Developer - Filename Consistency Validation](./task-29.2-developer-filename-consistency-validation.md)

## Task Description
Fix unit link command to use consistent filename conversion (spaces → dots) like unit create command. Currently unit create converts "Multi Word" → "Multi..Word.unit" but unit link creates "Multi Word.unit" with spaces, violating filename consistency.

## Context
From TRON QA feedback on Task 27: "the filenames still have spaces in them when they should have „." instead. test user link uuid filename in folder scenario/ontology to see if the links are created and updated in the scenario correctly."

## TRON QA Feedback Integration
### Issue Identified
```quote
qa feedback for the corresponding task: the filenames still have spaces in them when they should have „." instead. test
user link uuid filename 
in folder scenario/ontology
to see if the links are created and updated in the scenario correctly. if not create a task to fix that.
```

**Test Results:**
- **unit create:** "UUID Indexing" → "UUID..Indexing.unit" ✅ CORRECT
- **unit link:** "UUID Indexing Test" → "UUID Indexing Test.unit" ❌ INCORRECT (has spaces)

**Root Cause:** Unit link command doesn't apply filename conversion like unit create command

## Intention
Ensure consistent filename handling across all unit CLI commands, with spaces converted to dots for filesystem compatibility while preserving readable names in unit models.

## Complete Technical Specifications

### Current Issue Analysis
**unit create command (WORKING):**
```typescript
// In UnitCLI.ts createUnit method
const filename = name.replace(/\s+/g, '..');  // ✅ Converts spaces to dots
```

**unit link command (BROKEN):**
```typescript
// In DefaultUnit.ts link method - NO filename conversion applied
const linkPath = `${currentDir}/${filename}.unit`;  // ❌ Uses filename as-is with spaces
```

### Fix Implementation Required

**DefaultUnit.ts link() method enhancement:**
```typescript
async link(uuid: string, filename: string): Promise<void> {
  try {
    // Convert multi-word filenames (spaces → single dots) for consistency
    const convertedFilename = filename.replace(/\s+/g, '.');
    
    // Create new LD link to existing unit in different location
    const currentDir = process.cwd();
    const linkPath = `${currentDir}/${convertedFilename}.unit`;  // ✅ Use converted filename
    
    // Load existing unit scenario
    const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
    
    // Update scenario with new link
    existingScenario.model.symlinkPaths.push(linkPath);
    existingScenario.model.namedLinks.push({
      location: `../scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`,
      filename: `${convertedFilename}.unit`  // ✅ Store converted filename (single dots)
    });
    
    // Save updated scenario
    await this.storage.saveScenario(uuid, existingScenario, [linkPath]);
    
    console.log(`✅ Link created: ${convertedFilename}.unit → ${uuid}`);
    console.log(`   Target: ${existingScenario.model.indexPath}`);
  } catch (error) {
    console.error(`Failed to create link: ${(error as Error).message}`);
  }
}
```

### Validation Testing Required

**Test Cases:**
1. **Single Word:** `unit link uuid "Test"` → "Test.unit" ✅
2. **Multi-word:** `unit link uuid "Test Link"` → "Test.Link.unit" ✅
3. **Complex Multi-word:** `unit link uuid "UUID Indexing Test"` → "UUID.Indexing.Test.unit" ✅

**Scenario Update Verification:**
- Check that namedLinks array contains converted filename
- Verify symlinkPaths contains correct link path
- Ensure actual filesystem link uses converted filename

## Implementation Steps
1. Update DefaultUnit.ts link() method to apply filename conversion
2. Apply same conversion logic as used in UnitCLI createUnit method
3. Update namedLinks array to store converted filename
4. Update symlinkPaths array to use converted link path
5. Test multi-word filename conversion in link command
6. Validate scenario updates contain correct converted filenames
7. Ensure consistency between create and link filename handling

## Requirements
- Unit link command applies same filename conversion as unit create
- Multi-word filenames converted consistently (spaces → dots)
- namedLinks array stores converted filenames
- symlinkPaths array uses converted link paths
- Actual filesystem links use converted filenames
- Scenario updates reflect converted filename structure
- Backward compatibility maintained for existing functionality

## Acceptance Criteria
- [ ] DefaultUnit.ts link() method applies filename conversion
- [ ] Multi-word filenames converted to dots consistently
- [ ] namedLinks array stores converted filenames correctly
- [ ] symlinkPaths array uses converted link paths
- [ ] Actual filesystem links created with converted filenames
- [ ] Scenario updates contain correct converted filename structure
- [ ] Test validation confirms consistent filename handling
- [ ] All existing functionality preserved

## TRON QA Feedback (2025-09-07-UTC-0015)
### Critical Correction: Double Dots Are Wrong
```quote
qa feedback for task 29:
UUID..Indexing.unit is WRONG

UUID.Indexing.unit is correct.

where do the multiple .. come from. fix that immediately and answer in the tasks qa section.
```

**Issue Analysis:**
- **Current Implementation:** `name.replace(/\s+/g, '..')` creates double dots
- **TRON's Correction:** Single dots are correct format
- **Root Cause:** Regex replacement uses `'..'` instead of `'.'`

**Immediate Fix Required:**
```typescript
// WRONG (Current)
const filename = name.replace(/\s+/g, '..');  // ❌ Creates double dots

// CORRECT (TRON's Specification)
const filename = name.replace(/\s+/g, '.');   // ✅ Single dots only
```

**Expected Results:**
- **"UUID Indexing"** → **"UUID.Indexing.unit"** ✅ CORRECT
- **"M2 Class"** → **"M2.Class.unit"** ✅ CORRECT
- **"Storage Capabilities"** → **"Storage.Capabilities.unit"** ✅ CORRECT

**Fix Location:** Both UnitCLI.ts createUnit method and DefaultUnit.ts link method

## Dependencies
- Based on Task 27 Model Interface Implementation completion
- Requires consistent filename handling across all unit commands
- **URGENT:** Fix double dot issue immediately per TRON's correction