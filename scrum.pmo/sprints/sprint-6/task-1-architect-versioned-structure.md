[Back to Sprint 6 Planning](./planning.md)

# Task 1: Architect — Versioned Folder Structure and Dependency Strategy

## Status
- Planned

## Description
Define a top-level versioned layout: vN/src and vN/test. For v2, migrate src.v2 → v2/src and test.v2 → v2/test. Establish path alias/baseUrl so all imports resolve relative to v2/src.

## Deliverables
- Directory scheme: v2/src, v2/test
- tsconfig updates: baseUrl and paths for v2/src (e.g., @v2/* → v2/src/*)
- Wrapper routing: TSRANGER_V2=1 executes v2/src entry
- CI updates to run both v1 and v2 suites when requested

## Acceptance Criteria
- No cross-version imports
- Build/tests pass for v2 using only v2/src and v2/test
