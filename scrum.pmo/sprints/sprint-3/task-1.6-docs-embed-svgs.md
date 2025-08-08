# Task 1.6: Docs - Embed Generated SVG Diagrams in Markdown

## Goal
Ensure all relevant markdown documents embed the generated SVG diagrams rendered from PUML files, with correct relative paths, and that diagrams are visible in the repository and any static site renderers used.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Identify target markdown files to embed diagrams:
  - `scrum.pmo/sprints/sprint-3/task-1.0-architect-gitscrumproject-spec.md`
  - `docs/` sections where architecture is described (update as needed)
- Embed SVGs using markdown image syntax with relative paths:
  - `src/puml/GitScrumProject_CLI_Architecture.svg`
  - `src/puml/GitScrumProject_TemplateAndRelease.svg`
- Verify rendering in GitHub and local markdown preview.

## Artifacts
- Embedded references to:
  - `src/puml/GitScrumProject_CLI_Architecture.svg`
  - `src/puml/GitScrumProject_TemplateAndRelease.svg`

## Acceptance Criteria
- All referenced PUMLs have corresponding SVGs in `src/puml/` and are embedded in the relevant markdown files.
- Links and images render correctly in GitHub UI.
- This task references all created artifact file paths.

---

[Back to Planning](./planning.md)

