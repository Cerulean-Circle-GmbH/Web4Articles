[Back to Planning Sprint 7](./planning.md)

# Task 2.1 — Architect: Module Boundaries and File Layout for TSRanger v2.5

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Proposed Structure
```
components/
  TSRanger/                   # Git submodule (checkout branch/tag v2.5)
    src/
      ts/
        io/
          TerminalIO.ts       # interface + NodeProcessIO + DeterministicTestIO
        layer2/
          RangerModel.ts
        layer4/
          RangerController.ts
          TSRanger.ts         # entrypoint
        layer5/
          RangerView.ts
```

Note: The version (v2.5) is managed via git branch/tag in the TSRanger submodule, not as a folder name.

## Module Boundaries
- `io`: isolates process/stdin/stdout and terminal sizing; enables deterministic tests.
- `layer2`: pure data/state, no IO or ANSI.
- `layer4`: control flow and key handling; imports `TSCompletion` and `io`.
- `layer5`: pure rendering to strings given `Model` and `IO` width/height; styles applied after layout.

## Version Management
- TSRanger component is a git submodule at `components/TSRanger/`
- Version v2.5 exists as a git branch or tag in the TSRanger repository
- Developers checkout the appropriate version: `cd components/TSRanger && git checkout v2.5`
- CI/CD can test multiple versions by checking out different branches/tags

## Acceptance Criteria
- Structure and dependencies documented; import paths resolved; no circular references.
- Git submodule checked out to v2.5 branch/tag.
- Path structure follows: components/TSRanger/src/ts/

## tsconfig Guidance
- Keep v1 and v2.5 compiled by the same config; prefer source execution with ts-node in dev.
- Optional: add path alias for TSRanger component paths for implementation sprint (not required now).

## Routing Plan (Spec)
- `src/sh/tsranger` detects `TSRANGER_V2=1` and invokes `node --loader ts-node/esm components/TSRanger/src/ts/layer4/TSRanger.ts test "..."` in test mode; otherwise uses v1 path.
- TSRanger submodule must be checked out to v2.5 branch/tag for this to work correctly.
- No changes required to tests; only set the env switch.