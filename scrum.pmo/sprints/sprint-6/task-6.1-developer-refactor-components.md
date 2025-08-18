[Back to Sprint 6 Planning](./planning.md)

# Task 6.1: Developer — Refactor into Component Folders

## Status
- Planned

## Description
Create `components/` with one folder per component:
- `components/TSRanger/` — current TSRanger sources and scripts
- `components/GitScrumProject/` — CLI project scaffolding component

Wire root scripts to delegate into components. Do not change logic; move files and update imports as needed.

## Steps
- Create folders and README placeholders
- Move sources incrementally (per PR)
- Update build/test/scripts to target component paths

## Acceptance Criteria
- Code compiles and tests pass from componentized layout
- No cross-component imports