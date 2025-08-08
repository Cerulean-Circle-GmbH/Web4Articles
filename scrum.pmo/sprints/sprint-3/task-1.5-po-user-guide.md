# Task 1.5: PO - User Guide and Acceptance

## Goal
Document how to use the templating tool to create a new wrapper repo with a `sources/` submodule and how to release and recover both repos.

## Content
- Overview of dual-repo pattern and benefits
- Step-by-step usage examples:
  - `GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> sources`
  - `GitScrumProject linkSource sources <sourceRepoUrl> main`
  - `GitScrumProject releasePlan wrapper`
- FAQ and troubleshooting (submodule detached HEAD, auth issues, CI secrets)

## Acceptance Criteria
- PO validates guide for clarity and completeness
- Examples match implemented CLI behavior