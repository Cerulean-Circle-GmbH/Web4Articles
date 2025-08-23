[Back to Sprint 6 Planning](./planning.md)

# Task 2: Developer — Migrate Code and Tests to v2/src and v2/test

## Status
- Planned

## Description
Move src.v2 → v2/src and test.v2 → v2/test. Update imports to intra-version paths. Ensure wrapper and tsconfig resolve v2/src.

## Steps
- Create v2/src and v2/test
- Move files, fix imports
- Update wrapper to point to v2/src entry
- Update tsconfig baseUrl/paths for v2

## Acceptance Criteria
- v2 builds and tests pass using v2/src and v2/test only.
