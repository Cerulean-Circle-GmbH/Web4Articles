[Back to Planning Sprint 7](./planning.md)

# Task 2.1 — Architect: Module Boundaries and File Layout for TSRanger v2.5

## Status
- In Progress (Additional requirements discovered)

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Proposed Structure
```
components/
  TSRanger/                   # Component directory (git submodule)
    v2.5/                     # Version folder
      src/
        ts/
          io/
            TerminalIO.ts     # interface + NodeProcessIO + DeterministicTestIO
          layer2/
            RangerModel.ts
          layer4/
            RangerController.ts
            TSRanger.ts       # entrypoint
          layer5/
            RangerView.ts
```

## Module Boundaries
- `io`: isolates process/stdin/stdout and terminal sizing; enables deterministic tests.
- `layer2`: pure data/state, no IO or ANSI.
- `layer4`: control flow and key handling; imports `TSCompletion` and `io`.
- `layer5`: pure rendering to strings given `Model` and `IO` width/height; styles applied after layout.

## Version Management
- TSRanger component is a git submodule at `components/TSRanger/`
- Version v2.5 exists as a folder within the component: `components/TSRanger/v2.5/`
- Multiple versions can coexist: v2.5, v3.0, etc.
- Each version has its own `src/ts/` directory structure

## Acceptance Criteria
- Structure and dependencies documented; import paths resolved; no circular references.
- Version folder `v2.5` exists between component and src directories.
- Path structure follows: `components/TSRanger/v2.5/src/ts/`

## tsconfig Guidance
- Keep v1 and v2.5 compiled by the same config; prefer source execution with ts-node in dev.
- Optional: add path alias for TSRanger component paths for implementation sprint (not required now).

## Routing Plan (Spec)
- `src/sh/tsranger` detects `TSRANGER_V2=1` and invokes `node --loader ts-node/esm components/TSRanger/v2.5/src/ts/layer4/TSRanger.ts test "..."` in test mode; otherwise uses v1 path.
- No changes required to tests; only set the env switch.

## Implementation (Completed)
The folder structure has been implemented using git mv for traceability:

### Git Commands Used
```bash
# Created component directory structure
mkdir -p components/TSRanger/v2.5

# Moved entire src.v2.5 to correct location preserving history
git mv src.v2.5 components/TSRanger/v2.5/src

# This moved all files with git history:
# src.v2.5/ts/io/TerminalIO.ts → components/TSRanger/v2.5/src/ts/io/TerminalIO.ts
# src.v2.5/ts/layer2/RangerModel.ts → components/TSRanger/v2.5/src/ts/layer2/RangerModel.ts
# src.v2.5/ts/layer4/RangerController.ts → components/TSRanger/v2.5/src/ts/layer4/RangerController.ts
# src.v2.5/ts/layer4/TSRanger.ts → components/TSRanger/v2.5/src/ts/layer4/TSRanger.ts
# src.v2.5/ts/layer5/RangerView.ts → components/TSRanger/v2.5/src/ts/layer5/RangerView.ts
```

### Verification
```bash
# Verify git history preserved
git log --follow components/TSRanger/v2.5/src/ts/layer4/TSRanger.ts

# Check all renames
git status --porcelain | grep "^R"
```

### Result
The v2.5 structure is correct but additional requirements discovered:
- Current src/ folder is v1.0 and needs to be moved to components/TSRanger/v1.0/
- Each version needs both src/ and test/ folders
- Other versions (v2, v3.n14.4, v3.njs14) may need organization

## Additional Requirements (Discovered via QA)
Not specified in original task but necessary for complete implementation:
1. **Version 1.0**: Move current src/ and test/ to components/TSRanger/v1.0/
2. **Test Folders**: Each version needs parallel test/ folder structure
3. **All Versions**: Organize all floating versions in the project
4. **Complete Structure**: 
   ```
   components/
     TSRanger/
       v1.0/
         src/
         test/
       v2.5/
         src/     ✅ (already done)
         test/    ⚠️ (needs creation)
       [other versions as discovered]
   ```