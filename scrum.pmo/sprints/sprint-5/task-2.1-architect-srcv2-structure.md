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