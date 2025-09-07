[Back to Planning Sprint 20](./planning.md)

# Task 19: Unit Advanced CLI Commands - Link Management and Source Integration
[task:uuid:s0t1u2v3-w4x5-6789-stuv-w01234567890]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-19.1-developer-defaultcli-base-component.md`)
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
- Add `[task:uuid:s0t1u2v3-w4x5-6789-stuv-w01234567890]` to this task.
- Source: Task 18 Completion - Advanced CLI Commands Requirements

  - up
    - [Task 18 Implementation PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1835-task-18-implementation.pdca.md)


  - down
    - [Task 19.1: Developer - DefaultCLI Base Component Creation](./task-19.1-developer-defaultcli-base-component.md)
    - [Task 19.2: Developer - Advanced Unit CLI Commands Implementation](./task-19.2-developer-advanced-unit-cli-commands.md)
    - [Task 19.3: Developer - Source Integration Commands](./task-19.3-developer-source-integration-commands.md)


## Task Description
Implement advanced Unit CLI commands for link management and source integration, including DefaultCLI 0.3.0.4 as dependency-free base component with requirement-v0.1.2.2 format compliance.

## Context
Building on Task 18 Unit Terminal Identity (uni-t) system, implement comprehensive CLI commands for managing unit links, listing connections, and integrating source references using GitTextIOR format for complete traceability.

## Intention
Provide complete CLI toolset for unit management enabling link creation, listing, source integration, and definition management with dependency-free DefaultCLI base component architecture.

## Steps
1. Create DefaultCLI 0.3.0.4 as dependency-free base component
2. Implement Unit build dependency on DefaultCLI
3. Add link management methods to DefaultUnit (following CLI method naming convention v0.1.2.2):
   - `link(uuid: string, filename: string)` - Create new links to existing units
   - `list(uuid: string)` - List all LD links to specific UUID
4. Add source integration methods to DefaultUnit (following CLI method naming convention v0.1.2.2):
   - `from(filename: string, startPos: string, endPos: string)` - Create unit from file text
   - `definition(uuid: string, filename: string, startPos: string, endPos: string)` - Add definition source
5. Enhance UnitCLI with advanced commands:
   - `unit link <uuid> <filename>`
   - `unit list <uuid>`
   - `unit from <filename> <start:line,column> <end:line,column>`
   - `unit definition <uuid> <filename> <start:line,column> <end:line,column>`
6. Update usage display following requirement-v0.1.2.2 format and structure
7. Integrate GitTextIOR for source reference formatting

## Requirements
- DefaultCLI 0.3.0.4 must be dependency-free base component
- Unit must include DefaultCLI as build dependency
- All CLI method names must match shell command names exactly (requirement-v0.1.2.2-cli-method-naming-convention)
- No CLI mapping layer required - direct method invocation using command name
- All CLI commands must use HTML bracket parameter format
- Usage response must follow requirement-v0.1.2.2 format and structure
- Link management must work with existing central storage and LD links system
- Source integration must use GitTextIOR format for origin and definition references
- Position parameters must use `start:line,column` and `end:line,column` format
- File text extraction must populate unit name from source content
- All commands must integrate with Unit Terminal Identity (uni-t) system
- Occam's Razor principle: Simplest solution with minimal complexity
- TypeScript Stranger 2.2 compliance for advanced TypeScript patterns

## Acceptance Criteria
- [ ] DefaultCLI 0.3.0.4 created as dependency-free base component
- [ ] Unit component includes DefaultCLI as build dependency
- [ ] `unit link <uuid> <filename>` command creates new LD links to existing units
- [ ] `unit list <uuid>` command lists all LD links pointing to specific UUID
- [ ] `unit from <filename> <start:line,column> <end:line,column>` creates unit with extracted name and origin
- [ ] `unit definition <uuid> <filename> <start:line,column> <end:line,column>` adds definition source to existing unit
- [ ] Usage display follows requirement-v0.1.2.2 format and structure
- [ ] All commands integrate with GitTextIOR for source reference formatting
- [ ] Link management works with central storage and existing LD links system
- [ ] Source integration populates terminal identity attributes correctly
- [ ] CLI parameter parsing handles HTML bracket format properly
- [ ] All commands maintain Web4 architectural principles

## Task 19 Features (Updated)

### **CLI Method Naming Convention (v0.1.2.2):**
- `unit link` → `link()` method
- `unit list` → `list()` method  
- `unit from` → `from()` method
- `unit definition` → `definition()` method

**Benefits:**
- No DefaultCLI mapping layer required
- Direct method invocation: `component[command](...args)`
- Occam's Razor: Simplest solution with minimal complexity
- TypeScript Stranger 2.2 compliance

## Example Commands

### **Link Management Commands:**

```bash
# Create new link to existing unit
unit link a1b2c3d4-e5f6-7890-abcd-ef1234567890 auth-validator
# Result: Creates auth-validator.unit → existing unit scenario

# List all links to specific unit
unit list a1b2c3d4-e5f6-7890-abcd-ef1234567890
# Result: 
# LD Links for Unit a1b2c3d4-e5f6-7890-abcd-ef1234567890:
#   - /workspace/temp/auth-validator.unit
#   - /workspace/components/Auth/validator.unit
#   - /workspace/test/unit-test.unit


### **Source Integration Commands:**

```bash
# Create unit from file text (extracts name from content)
unit from components/Auth/UserValidator.ts 42:15 67:23
# Result: Creates unit with name extracted from lines 42-67, origin set to GitTextIOR format

# Add definition source to existing unit  
unit definition a1b2c3d4-e5f6-7890-abcd-ef1234567890 components/Auth/UserValidator.ts 1250 1890
# Result: Adds definition reference using character positions 1250-1890


### **Usage Format (following User CLI format structure):**

```bash
unit

Web4 Unit CLI Tool v0.3.0.4 - Atomic Execution Elements

Usage:
  unit create <name> [description]                # Create unit
  unit link <uuid> <filename>                     # Create link to existing unit
  unit list <uuid>                                # List all links to unit
  unit from <filename> <start:line,column> <end:line,column>  # Create unit from source
  unit definition <uuid> <filename> <start:line,column> <end:line,column>  # Add definition
  unit execute <name> <input>                     # Execute unit
  unit info                                       # Show unit info
  unit help                                       # Show this help

Commands:
  create       Create new unit with name and optional description
  link         Create new LD link to existing unit in different location
  list         List all LD links pointing to specific unit UUID
  from         Create unit from file text with extracted name and origin
  definition   Add definition source reference to existing unit
  execute      Execute unit with input data
  info         Display current unit information and scenario
  help         Show this help message

Parameters:
  <name>        Unit name for identification (required for create)
  <uuid>        Unit UUID for link operations (8+ characters accepted)
  <filename>    File name for links or source references
  <start:line,column>  Start position in file (line:column format)
  <end:line,column>    End position in file (line:column format)
  <description> Optional description for unit creation
  <input>       JSON input data for unit execution

Examples:
  unit create test-unit "Test description"        # Create unit
  unit link a1b2c3d4-e5f6 auth-validator         # Create link to existing unit
  unit list a1b2c3d4-e5f6                        # List all links to unit
  unit from UserValidator.ts 42:15 67:23         # Create from source
  unit definition a1b2c3d4-e5f6 UserValidator.ts 1250 1890  # Add definition
  unit execute test-unit '{"data": "test"}'      # Execute unit
  unit info                                      # Show details

Web4 Integration:
  Unit operates as atomic Web4 element with terminal identification (uni-t).
  All units use central UUID storage with LD links tracking and source traceability.
  GitTextIOR format enables complete source reference with ior:git:text:giturl.


## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-2015] TRON Requirements - Advanced CLI Commands
  ```quote
  - [ ] add a method to create new links to the same unit in different places. eg: unit link <uuid> <filename>. parameters in html brackets and method name "link". add it to DefaultUnit implementation. use DefaultCLI to map the shell command cli to "unit link <uuid> <filename>" and add it to the usage. add another method "unit list <uuid>"  the same way and then list all ln links to the uuid. for the usage response on no parameters use the same format and structure as requirement-v0.1.2.2. the DefaultCLI 0.3.0.4 therefore must build itself dependency free as a base component. unit must include DefaultCLI as a build dependency. add another method "unit from  <filename> <start:line,column> <end:line,column> to create a unit with the name from the text in the file as origin and another one "unit definition <uuid> <filename> <start:line,column> <end:line,column>" to add the definition source from a file text.
  
  - [ ] Issue: Need advanced CLI commands for link management and source integration
  - [ ] Resolution: Create Task 19 with DefaultCLI base component and advanced command implementation
  - [ ] Example: `unit link <uuid> <filename>`, `unit from <filename> <start:line,column> <end:line,column>`

- [ ] [2025-09-06-UTC-2020] TRON Decision - CLI Method Naming Convention
  ```quote
  if the method 
  addDefinition(uuid: string, filename: string, startPos: string, endPos: string)

  is called
  definition(uuid: string, filename: string, startPos: string, endPos: string)


  DefaultCLI needs no mapping and its better for ocams razor and tsranger 2.2.
  make this a global web4 requirement wit requiremen-v0.1.2.2 and use this pattern in general. update the task accordingly
  
  - [ ] Issue: CLI method names should match shell command names exactly to eliminate mapping
  - [ ] Resolution: Create global Web4 requirement v0.1.2.2-cli-method-naming-convention
  - [ ] Pattern: `unit definition` → `definition()` method (not `addDefinition()`)
  - [ ] Benefit: DefaultCLI needs no mapping, follows Occam's Razor and TypeScript Stranger 2.2
  - [ ] Application: Global Web4 requirement for all components

- [ ] [2025-09-06-UTC-2025] TRON Correction - Usage Format and Method Naming
  ```quote
  add this text to the task spec:
  '
  Task 19 Features (Updated):

  unit link → link() method
  unit list → list() method
  unit from → from() method
  unit definition → definition() method
  ‚
  wrong
  Usage Format (requirement-v0.1.2.2 compliance):

  how it should be:
  run it
  look at it
  and do not assume shit!!!🤦🏻‍♂️ 

  then fix it accordingly 

  thats the reason why we plan now upfront
  
  - [ ] Issue: Assumed wrong usage format instead of checking actual requirement-v0.1.2.2
  - [ ] Resolution: Check actual User CLI format and apply proper structure (Usage, Commands, Parameters, Examples, Web4 Integration)
  - [ ] Learning: Always verify actual format instead of making assumptions
  - [ ] Method Naming: Add Task 19 Features section with direct method naming pattern

- [ ] [2025-09-06-UTC-2035] TRON QA Feedback - Absolute Links Requirement
  ```quote
  nearly perfect 

    "model": {
      "uuid": "7bde3977-8867-44e7-90d5-a0dc149fbc56",
      "name": "ONCE",
      "origin": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/../scrum.pmo/sprints/sprint-20/Web4TLA.Specification.dialogue.md#L2039:130-2039:134",
      "definition": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/../scrum.pmo/sprints/sprint-20/Web4TLA.Specification.dialogue.md#L2035:1-2041:120",


  the iors MUST be ABSOLUTE links to really work later!

  fix it and obviously add my qa feedback to the task
  
  - [ ] Issue: GitTextIOR URLs contain relative paths (../scrum.pmo/...) instead of absolute paths
  - [ ] Resolution: Fix GitTextIOR implementation to generate absolute GitHub URLs without relative path components
  - [x] Example: Should be `https://github.com/.../scrum.pmo/sprints/sprint-20/Web4TLA.Specification.dialogue.md#L2039:130-2039:134`
  - [x] Impact: Absolute links required for proper functionality in distributed environments
  - [x] Resolution: Fixed GitTextIOR implementation to use absolute paths, added `unit origin <uuid>` command for dual links display

- [ ] [2025-09-06-UTC-2100] TRON QA Feedback - Unit Instantiation Issue  
  ```quote
  i am back testing the unit.

  run
  unit
  with non parameters.

  it will create a unit and warn about missing information 
  and then
  print the usage.

  this is not correct. a unit will only be created when 
  unit create …
  was called 

  check if the unit ended up in the index.
  if not, its good. otherwise each call is creating garbage.

  a call with no parameters should just show the usage and not instanciate a unit.
  a unit will be instancieated only as a consequence of a command.

  add this to the unit tasks qa feedback and pdca
  
  - [x] Issue: `unit` with no parameters creates unit instance and shows warning (incorrect behavior)
  - [x] Issue: Unit should only be instantiated as consequence of commands, not for usage display
  - [x] Resolution: Fixed UnitCLI to use lazy instantiation - DefaultUnit created only when commands require it
  - [x] Validation: Unit UUID 34daeb25-c69f-48c6-a36f-3d5a9fff47f0 did NOT end up in central storage (good)
  - [x] Example: `unit` → show usage only (no unit created), `unit create name` → create unit instance
  - [x] Fix Applied: UnitCLI constructor sets this.unit = null, getOrCreateUnit() for command-based instantiation

## Dependencies
- Builds on Task 18 Unit Terminal Identity (uni-t) system
- Requires GitTextIOR implementation for source reference formatting
- DefaultCLI must be created as dependency-free base component
- Unit component must include DefaultCLI as build dependency