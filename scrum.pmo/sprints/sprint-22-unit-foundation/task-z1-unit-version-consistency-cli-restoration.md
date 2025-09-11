[Back to Sprint 22 Planning](./planning.md)

# Task Z1: Unit Version Consistency and CLI Restoration
[task:uuid:fb062758-1ecf-400a-9a22-53cc165bcb5c]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-z1.1-developer-symlink-fix.md`)
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
- Add `[task:uuid:fb062758-1ecf-400a-9a22-53cc165bcb5c]` to this task.
- This task addresses Unit version management confusion identified in session 2025-09-10-UTC-2052
```
  - up
    - [Unit Version Analysis and Task Verification](../../project.journal/2025-09-10-UTC-2052-session/pdca/role/background-agent/2025-09-10-UTC-2056-unit-version-analysis-and-task-verification.md)
```
```
  - down
    - [Task Z1.1: Developer Symlink Correction](./task-z1.1-developer-symlink-correction.md)
    - [Task Z1.2: Developer CLI Access Restoration](./task-z1.2-developer-cli-access-restoration.md)
    - [Task Z1.3: Tester Version Consistency Validation](./task-z1.3-tester-version-consistency-validation.md)
```

## Task Description
Fix Unit version management confusion where latest symlink points to Unit 0.1.3.0 (no CLI) while actual working version is Unit 0.3.0.5 with complete TSCompletion integration. Restore proper CLI access through standard unit command and ensure version consistency across all Unit references.

## Context
**Version Management Problem:**
- **Latest Symlink**: Points to Unit 0.1.3.0 (missing layer5/UnitCLI.ts)
- **Actual Working Version**: Unit 0.3.0.5 with TSRanger dynamic CLI and TSCompletion
- **Script Configuration**: `/scripts/unit` correctly uses 0.3.0.5 but symlink creates confusion
- **Tool Failure**: `unit` command fails with "Unit CLI not found" due to symlink misdirection

**TSCompletion Implementation Status:**
- **Requested**: 2025-09-07-UTC-0320 - "implement also the color requirements and the usage format from the tsranger tscompletion"
- **Implemented**: Unit 0.3.0.5 with DefaultCLI extension and dynamic method discovery
- **Inaccessible**: Due to version management confusion and symlink issues

## Intention
Restore proper Unit CLI access by:
- Fixing version management and symlink configuration
- Ensuring Unit 0.3.0.5 accessibility through standard commands
- Documenting version consistency and TSCompletion integration
- Providing clear CLI output documentation for both working versions
- Eliminating confusion between Unit versions and their capabilities

## Steps
1. **Symlink Correction** (Developer)
   - Fix Unit/latest symlink to point to working version 0.3.0.5
   - Verify script/versions symlinks point to correct components
   - Update any hardcoded version references

2. **CLI Access Restoration** (Developer)
   - Ensure unit command works from any directory
   - Verify TSCompletion integration accessibility
   - Test dynamic method discovery functionality
   - Document CLI output format and capabilities

3. **Version Consistency Validation** (Tester)
   - Verify all Unit versions use correct version numbers in output
   - Test scenario creation uses proper version references
   - Validate CLI functionality across different access methods
   - Confirm TSCompletion integration works as expected

## Requirements

### Web4 Compliance Requirements
- **Empty Constructor Principle**: All Unit classes maintain empty constructors
- **Scenario-First Development**: Version information in scenario creation
- **Version Consistency**: Each version correctly identifies itself in output and scenarios
- **IOR Architecture**: Proper version references in IOR objects

### Technical Requirements
- **Vitest ONLY**: All tests use Vitest with ESM imports (Jest is BANNED)
- **ESM modules**: TypeScript-first with modern JS features
- **CLI Accessibility**: Unit command works from project root
- **TSCompletion Integration**: Dynamic method discovery and color output
- **Version Management**: Clear separation and access to different Unit versions

## CLI Output Documentation

### **Unit 0.3.0.5 CLI Output (WORKING):**
```bash
$ components/Unit/0.3.0.5/unit
unit CLI Tool v0.3.0.5 - Dynamic Method Discovery

Usage:
  unit help                    # Show this help
  unit info                    # Show component info

Commands automatically discovered from component methods
Add new methods to component and they become available immediately

Web4 Integration:
  Unit operates as atomic Web4 element with terminal identification (uni-t).
  All units use central UUID storage with enhanced references array.
  Internal CLI architecture with DefaultCLI base class and dynamic method discovery.
```

### **Unit 0.3.0.4 CLI Output (BUILD ERROR):**
```bash
$ cd components/Unit/0.3.0.4 && npm run build
src/ts/layer2/DefaultUnit.ts:94:43 - error TS2345: Argument of type 'TypeM3 | undefined' is not assignable to parameter of type 'TypeM3'.
  Type 'undefined' is not assignable to type 'TypeM3'.

94       if (!Object.values(TypeM3).includes(this.model.typeM3)) return false;
                                             ~~~~~~~~~~~~~~~~~

❌ Cannot get CLI output due to TypeScript compilation error
```

## Acceptance Criteria

### Web4 Compliance Criteria
- [ ] **Version Consistency**: Unit 0.3.0.5 always writes and uses '0.3.0.5' in output and scenario creation
- [ ] **Empty Constructor**: All Unit classes maintain empty constructors with scenario initialization
- [ ] **IOR References**: Version information properly included in IOR objects
- [ ] **Scenario-First**: All unit creation uses scenario-based initialization

### Functional Criteria
- [ ] **CLI Access Restored**: `unit` command works from project root accessing 0.3.0.5
- [ ] **Latest Symlink Fixed**: Unit/latest points to working version with CLI
- [ ] **TSCompletion Available**: Dynamic method discovery accessible through standard unit command
- [ ] **Version Scripts Working**: scripts/versions/unit-v0.3.0.5 provides CLI access
- [ ] **Build Issues Documented**: Unit 0.3.0.4 TypeM3 compilation error analyzed
- [ ] **Output Documentation**: Both CLI outputs captured and documented in task
- [ ] **Version Verification**: All Unit versions correctly identify themselves
- [ ] **Script Configuration**: All unit scripts reference correct working versions

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] CLI functionality restoration verification
  - [ ] Version consistency validation across all Unit components
  - [ ] TSCompletion integration accessibility testing
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Developer experience with restored CLI access
  - [ ] Version management clarity improvement
  - [ ] TSCompletion functionality verification

## Subtasks
- [Task Z1.1: Developer Symlink Correction](./task-z1.1-developer-symlink-correction.md)
- [Task Z1.2: Developer CLI Access Restoration](./task-z1.2-developer-cli-access-restoration.md)
- [Task Z1.3: Tester Version Consistency Validation](./task-z1.3-tester-version-consistency-validation.md)