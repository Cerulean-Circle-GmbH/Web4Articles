[Back to Planning Sprint 5](./planning.md)

# Task 2.1 — Architect: Module Boundaries and File Layout in `src.v2`

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Proposed Structure
```
src.v2/
  ts/
    io/
      TerminalIO.ts           # interface + NodeProcessIO + DeterministicTestIO
    layer2/
      RangerModel.ts
    layer4/
      RangerController.ts
      TSRanger.ts             # entrypoint
    layer5/
      RangerView.ts
```

## Module Boundaries
- `io`: isolates process/stdin/stdout and terminal sizing; enables deterministic tests.
- `layer2`: pure data/state, no IO or ANSI.
- `layer4`: control flow and key handling; imports `TSCompletion` and `io`.
- `layer5`: pure rendering to strings given `Model` and `IO` width/height; styles applied after layout.

## Acceptance Criteria
- Structure and dependencies documented; import paths resolved; no circular references.

## tsconfig Guidance
- Keep v1 and v2 compiled by the same config; prefer source execution with ts-node in dev.
- Optional: add path alias `@srcv2/*` -> `src.v2/*` for implementation sprint (not required now).

## Routing Plan (Spec)
- `src/sh/tsranger` detects `TSRANGER_V2=1` and invokes `node --loader ts-node/esm src.v2/ts/layer4/TSRanger.ts test "..."` in test mode; otherwise uses v1 path.
- No changes required to tests; only set the env switch.