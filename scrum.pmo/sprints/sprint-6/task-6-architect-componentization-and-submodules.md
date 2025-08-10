[Back to Sprint 6 Planning](./planning.md)

# Task 6: Architect — Componentization & Submodules Plan

## Status
- Planned

## Goal
Define a component-oriented structure where each major unit (e.g., `TSRanger`, `GitScrumProject`) is developed in its own folder and promoted to a dedicated GitHub repository as a submodule. Versions are maintained as dedicated branches per component (e.g., `njs14`, `n14.4`, `main`).

## Deliverables
- Component map: `components/TSRanger`, `components/GitScrumProject`, …
- Submodule strategy: one repository per component, added as submodule at `components/<Name>`
- Versioning model: runtime-targeted branches (e.g., `njs14`, `n14.4`, `main`)
- Integration guidelines: how root scripts reference component entry points

## Acceptance Criteria
- Clear plan for folders, repos, and branches
- Minimal coupling across components (no cross-component imports)
- Root repo retains orchestration, docs, and integration tests only