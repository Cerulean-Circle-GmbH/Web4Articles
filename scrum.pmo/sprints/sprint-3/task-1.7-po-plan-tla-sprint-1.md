[Back to Planning](./planning.md)

# Task 1.7: PO — Plan Sprint 1 for TLA.scrum.pmo (wrapper project)

## Goal
Define Sprint 1 for the new wrapper project `TLA.scrum.pmo` that is created from the TLA repository as a template with `sources/` submodule pointing to the TLA reference repo.

## Context
- Source repository: [Cerulean-Circle-GmbH/TLA](https://github.com/Cerulean-Circle-GmbH/TLA)
- Wrapper repository name: `TLA.scrum.pmo`

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] drafting
- [ ] QA Review
- [ ] Done

## Sprint 1 Planning (for TLA.scrum.pmo)
- Sprint Goal: Establish the wrapper repo baseline with Scrum structure, docs, CI, and submodule linkage to `sources/`.

### Draft Task List
- [ ] Architect: Confirm wrapper structure and `sources/` submodule path
- [ ] Developer: Run `GitScrumProject createTemplateRepo <org> TLA.scrum.pmo https://github.com/Cerulean-Circle-GmbH/TLA sources`
- [ ] Developer: Link/verify submodule with `GitScrumProject linkSource sources https://github.com/Cerulean-Circle-GmbH/TLA main`
- [ ] DevOps: Add CI workflow and recovery boilerplate into wrapper
- [ ] Tester: Smoke-check overlay run from wrapper into sources (no code changes)
- [ ] PO: Draft README and user guide for the dual-repo setup

## Acceptance Criteria
- Wrapper repo `TLA.scrum.pmo` created and pushed with `sources/` submodule
- CI and recovery docs present
- README describes dual-repo pattern and how to run
- All referenced artifact links are valid

---

[Back to Planning](./planning.md)

