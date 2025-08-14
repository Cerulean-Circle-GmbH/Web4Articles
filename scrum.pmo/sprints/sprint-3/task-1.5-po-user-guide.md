[Back to Planning](./planning.md)

# Task 1.5: PO - User Guide and Acceptance

## Goal
Document how to use the templating tool to create a new wrapper repo with a `sources/` submodule and how to release and recover both repos.

## Status
- [x] Planned
- [x] In Progress
  - [x] drafting
  - [x] review
- [ ] QA Review
- [x] Done

## Content
- Overview of dual-repo pattern and benefits
- Step-by-step usage examples:
  - `GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> sources`
  - `GitScrumProject linkSource sources <sourceRepoUrl> main`
  - `GitScrumProject releasePlan wrapper`
- FAQ and troubleshooting (submodule detached HEAD, auth issues, CI secrets)

## Artifacts
- Docs: [docs/user-guide/GitScrumProject.md](../../../docs/user-guide/GitScrumProject.md) - Comprehensive user guide created
- Embedded Diagrams:
  - [components/GitScrumProject/v1.0/src/svg/GitScrumProject_CLI_Architecture.svg](../../../components/GitScrumProject/v1.0/src/svg/GitScrumProject_CLI_Architecture.svg)
  - [components/GitScrumProject/v1.0/src/svg/GitScrumProject_TemplateAndRelease.svg](../../../components/GitScrumProject/v1.0/src/svg/GitScrumProject_TemplateAndRelease.svg)

## Acceptance Criteria
- PO validates guide for clarity and completeness
- Examples match implemented CLI behavior
- This task references all created artifact file paths

---

[Back to Planning](./planning.md)