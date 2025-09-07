[Back to Planning Sprint 20](./planning.md)

# Task 18: Unit Terminal Identity (uni-t) - Name, Origin, and Definition Attributes
[task:uuid:r9s0t1u2-v3w4-5678-rstu-v90123456789]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-18.1-developer-unit-model-enhancement.md`)
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
- Add `[task:uuid:r9s0t1u2-v3w4-5678-rstu-v90123456789]` to this task.
- Source: Unit Essential Features Analysis - Terminal Identity Requirements
- up
  - [Unit Essential Features PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1800-unit-essential-features-preparation.pdca.md)
- down
  - [Task 18.1: Developer - Unit Model Enhancement with Name, Origin, Definition](./task-18.1-developer-unit-model-enhancement.md)
  - [Task 18.2: Developer - Git Format URL Source References](./task-18.2-developer-git-format-url-references.md)
  - [Task 18.3: Developer - Backward Compatibility and CLI Warnings](./task-18.3-developer-backward-compatibility-warnings.md)

## Task Description
Implement Unit Terminal Identity (uni-t) system enabling anything to be a unit with unique terminal identification. Add name, origin, and definition attributes to UnitModel with git format URL source references including line numbers and column positions.

## Context
From TRON Decision: "anything can be a unit, that should be unique and terminally identified (uni-t)". This fundamental enhancement enables complete traceability from any unit back to its source definition, establishing the foundation for comprehensive Web4 component identification and source tracking.

## Intention
Enable any element in the Web4 ecosystem to be uniquely identified as a unit with complete traceability to its source code definition, establishing terminal identification (uni-t) as the foundation for all Web4 component operations.

## Steps
1. Create Web4 compliant interface files (one interface per file):
   - `IOR.interface.ts` - Base IOR interface (if not already exists)
   - `GitTextIOR.interface.ts` - Specialized IOR interface for git text references (extends IOR)
   - `GitPositioning.interface.ts` - URL anchor positioning specialization (line/column and character ranges)
   - `GitTextIORScenario.interface.ts` - Scenario format specialization for GitTextIOR hibernation
2. Create implementation class:
   - `GitTextIOR.ts` - Specialized IOR implementation class extending base IOR (not DefaultGitTextIOR)
3. Enhance UnitModel interface with name, origin, and definition attributes
4. Implement git format URL source references with IOR text format: `ior:git:text:giturl`
5. Add origin reference with line/column positioning (#L42:15-67:23)
6. Add definition attribute with character positioning (#L1250-1890)
7. Implement backward compatibility for existing scenarios missing these attributes
8. Add CLI warnings for missing name, origin, or definition information
9. Plan migration strategy for next build version requiring complete model information
10. Update Unit creation and initialization to handle new attributes
11. Validate git format URL references and source tracking

## Requirements
- Base IOR interface must provide foundation for all interoperable object references
- GitTextIOR implementation must extend IOR for specialized git text reference handling
- GitPositioning interface must handle URL anchor positioning specializations (line/column ranges, character ranges)
- GitTextIORScenario interface must provide proper hibernation format for GitTextIOR instances
- UnitModel must include name, origin, and definition attributes using GitTextIOR format
- Origin reference must use IOR text format: `ior:git:text:giturl` with line/column positioning (#L42:15-67:23)
- Definition attribute must use IOR text format: `ior:git:text:giturl` with character positioning (#L1250-1890)
- Backward compatibility must accept files with missing information but warn in CLI
- Next build version must require migration method for missing model information
- Git format URL references must be properly validated and trackable through GitTextIOR
- CLI must provide clear warnings for incomplete unit model information
- Source traceability must be maintained from unit to original definition via GitTextIOR

## Acceptance Criteria
- [ ] Base IOR interface created as foundation for all interoperable object references
- [ ] GitTextIOR implementation class extends IOR for specialized git text reference handling
- [ ] GitPositioning interface handles URL anchor positioning specializations (line/column and character ranges)
- [ ] GitTextIORScenario interface provides proper hibernation format for GitTextIOR instances
- [ ] UnitModel interface enhanced with name, origin, and definition attributes using GitTextIOR format
- [ ] Origin reference uses IOR text format with line/column positioning (#L42:15-67:23)
- [ ] Definition attribute uses IOR text format with character positioning (#L1250-1890)
- [ ] Backward compatibility accepts existing scenarios with missing attributes
- [ ] CLI warns when name, origin, or definition information is missing
- [ ] Migration strategy planned for next build version requirements
- [ ] Unit creation and initialization handle new GitTextIOR attributes correctly
- [ ] Git format URL references are validated and trackable through GitTextIOR
- [ ] Complete source traceability from unit to definition established via GitTextIOR
- [ ] Terminal identification (uni-t) system functional for any Web4 element
- [ ] All interfaces follow "one interface per file" Web4 principle

## Example Scenario

### **Unit Terminal Identity (uni-t) Example:**

```json
{
  "ior": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "component": "Unit",
    "version": "0.3.0.4"
  },
  "owner": "{\"user\":\"developer\",\"hostname\":\"workstation\",\"uuid\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"timestamp\":\"2025-09-06T18:15:00.000Z\",\"component\":\"Unit\",\"version\":\"0.3.0.4\"}",
  "model": {
    "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "UserAuthenticationValidator",
    "origin": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/Auth/src/validators/UserValidator.ts#L42:15-67:23",
    "definition": "ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/Auth/src/validators/UserValidator.ts#L1250-1890",
    "indexPath": "/workspace/scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
    "symlinkPaths": ["/workspace/temp/UserAuthenticationValidator.unit"],
    "namedLinks": [
      {
        "location": "../scenarios/index/a/1/b/2/c/a1b2c3d4-e5f6-7890-abcd-ef1234567890.scenario.json",
        "filename": "UserAuthenticationValidator.unit"
      }
    ],
    "executionCapabilities": ["transform", "validate", "process", "UserAuthenticationValidator"],
    "storageCapabilities": ["scenarios", "ld-links"],
    "createdAt": "2025-09-06T18:15:00.000Z",
    "updatedAt": "2025-09-06T18:15:00.000Z"
  }
}
```

### **Git Format URL Reference Examples:**

**Origin Reference (Line-based with IOR format):**
- `origin`: `"ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/Auth/src/validators/UserValidator.ts#L42:15-67:23"`
- **IOR Format**: `ior:git:text:` prefix + GitHub URL with line/column positioning
- **Meaning**: File `UserValidator.ts`, from line 42 column 15 to line 67 column 23
- **Traceability**: Points to exact location where this unit was declared/instantiated

**Definition Reference (Character-based with IOR format):**
- `definition`: `"ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/Auth/src/validators/UserValidator.ts#L1250-1890"`
- **IOR Format**: `ior:git:text:` prefix + GitHub URL with character positioning
- **Meaning**: File `UserValidator.ts`, from character position 1250 to character position 1890
- **Traceability**: Points to complete definition/implementation of this unit

### **Backward Compatibility Example:**

**Existing Unit (Missing Attributes):**
```json
{
  "model": {
    "uuid": "old-unit-uuid",
    "indexPath": "...",
    "symlinkPaths": [...],
    "executionCapabilities": [...],
    "storageCapabilities": [...]
    // Missing: name, origin, definition
  }
}
```

**CLI Warning Output:**
```
⚠️  Warning: Unit 'old-unit-uuid' missing terminal identity information:
   - name: not specified
   - origin: not specified  
   - definition: not specified
   
   Next build version will require migration method for missing model info.
   Please update unit with complete terminal identity (uni-t) attributes.
```

## QA Audit & User Feedback
- [ ] [2025-09-06-UTC-1805] TRON Decision Implementation
  ```quote
  1 - [ ] anything can be a unit, that should be unique and terminally identified (uni-t). so we need to be able to give a unit a name and an origin. the origin is a reference to the sources file as url with line number and column start and end in git format. add this to the unit model. also add a definition attribute, with the same url source format with start and end characters urls in git format. on read and initialize accept files with missing infos about it but warn in the cli. in the next build version we will not accept missing scenario model infos without migration method.
  ```
  - [ ] Issue: Unit needs terminal identification (uni-t) with name, origin, and definition
  - [ ] Resolution: Enhance UnitModel with git format URL source references and traceability
  - [ ] Example: Unit "UserAuthenticationValidator" with origin (L42:15-67:23) and definition (char 1250-1890)

- [ ] [2025-09-06-UTC-1820] TRON Enhancement - Git Text IOR Implementation
  ```quote
  very good. create extra class and interface in the unit layers for handling these urls. have IOR as the interface and GitTextIOR as the implementation class with ior text format: „ior:git:text:[giturl](http://github.com:port/…)" rhe brackets are placeholders no md text format. to be used innthe origin attribute.
  ```

- [ ] [2025-09-06-UTC-1830] TRON Correction - GitTextIOR Architecture
  ```quote
  excellent. as it is already a specialized IOR. its not DefaultIOR nor DefaultGitTextIOR but  GitTextIOR extends IOR. fix that and the the spec is good and accepted.
  ```
  - [ ] Issue: Need specialized interface and class for handling git URL references
  - [ ] Resolution: Create base IOR interface and specialized GitTextIOR implementation (extends IOR) as implementation class
  - [ ] Architecture: GitTextIOR extends IOR (not DefaultGitTextIOR)
  - [ ] Implementation Class: GitTextIOR.ts (not DefaultGitTextIOR.ts)
  - [ ] Format: `ior:git:text:giturl` with GitHub URL format
  - [ ] Example: `ior:git:text:http://github.com:port/user/repo/blob/branch/file.ts#L42:15-67:23`
  - [ ] Usage: GitTextIOR to be used in origin attribute for precise source tracking
  - [ ] Web4 Compliance: Separate interface files (IOR.interface.ts, GitTextIOR.interface.ts, GitPositioning.interface.ts, GitTextIORScenario.interface.ts)
  - [ ] Resolution: Create four separate interface files following "one interface per file" principle

## Dependencies
- Must be implemented before continuing with any other planned tasks
- Blocks all other Sprint 20 tasks until terminal identification system is complete
- Foundation for all future Web4 component identification and traceability