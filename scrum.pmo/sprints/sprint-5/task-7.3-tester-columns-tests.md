[Back to Planning Sprint 5](./planning.md)

# Task 7.3 — Tester: Column Navigation/Filter Tests

## Status
- Planned

## Traceability
- Up: [requirement:uuid:b5c6d7e8-f9a0-41b2-83c4-d5e6f7a8091b]

## Description
Add tests to validate the column-based architecture behavior:
- Common filter behavior across columns (prefix filtering, reset)
- Navigation consistency (Up/Down within a column; Left/Right across columns)
- Prompt sync rules remain intact

## Acceptance Criteria
- New tests under `test/tsranger.columns.*.test.ts`
- Tests pass under `TSRANGER_V2=1`