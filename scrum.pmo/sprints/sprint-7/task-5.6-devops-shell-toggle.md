[Back to Planning Sprint 7](./planning.md)

# Task 5.6 — DevOps: Shell wrapper toggle in `src/sh/tsranger`

## Status
- Planned

## Traceability
- Up: [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Description
Modify `src/sh/tsranger` to route to TSRanger component v2.5 when `TSRANGER_V2=1` while preserving the existing CLI/testing interface.

## Acceptance Criteria
- `src/sh/tsranger test "..."` executes `components/TSRanger/v2.5/src/ts/layer4/TSRanger.ts` when `TSRANGER_V2=1`
- Falls back to v1 path when env var not set
- No change to test command syntax