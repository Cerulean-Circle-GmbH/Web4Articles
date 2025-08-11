[Back to Planning Sprint 5](./planning.md)

# Task 6 — Tester: Validate TS Ranger v2 with Existing Tests

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5], [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Description
Run the current `test/tsranger.*.test.ts` against v2 using `TSRANGER_V2=1` to ensure parity. No test file changes are allowed.

## Acceptance Criteria
- CI/local run with `TSRANGER_V2=1` passes all existing tsranger tests.
- Document any environment variables needed (terminal size, PS1) and ensure they match current tests.