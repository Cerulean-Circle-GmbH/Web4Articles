[Back to Planning Sprint 7](./planning.md)

# Task 2: Architect — src.v2.5 Structure and Migration Plan

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5], [requirement:uuid:a4b5c6d7-e8f9-405e-7f80-91a2b3c4d5e6]
- Down: [Task 2.1](./task-2.1-architect-srcv2-structure.md)

## Description
Propose the directory structure and migration approach for implementing v2 in `src.v2` without impacting v1. Define module boundaries, file naming, and a toggle strategy to run either v1 or v2 from the same shell wrapper using environment variables.

## Acceptance Criteria
- A tree layout for `src.v2` including `layer2/Model`, `layer4/Controller`, `layer5/View`, `io/TerminalIO`, and an entry `layer4/TSRanger.ts`.
- A routing plan for `src/sh/tsranger` to execute v2 when `TSRANGER_V2=1`.