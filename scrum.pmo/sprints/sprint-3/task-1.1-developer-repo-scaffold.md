# Task 1.1: Developer - Scaffold New Repo via CLI and GitHub

## Goal
Implement `GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> <submodulePath>` to create a GitHub repository and scaffold from current template with submodule linkage.

## Steps
- Implement `GitHubApi` adapter using `gh` CLI (preferred) with fall back to `@octokit/rest` ESM if `gh` is unavailable.
- Implement `SubmoduleManager` to add and configure submodules.
- Extend `GitScrumProject` with `createTemplateRepo` logic:
  - Create GH repo (respect `GITHUB_VISIBILITY`, default private)
  - Clone current project to temp dir, remove `.git`, re-init, set remote
  - Add submodule at `<submodulePath>` pointing to `<sourceRepoUrl>`
  - Generate CI workflow, recovery boilerplate, and README additions
  - Initial commit and push

## Acceptance Criteria
- Running the command creates a new remote repo and pushes initial scaffold
- `.gitmodules` contains the submodule entry
- CI file and recovery docs present in the new repo
- Command is positional and ESM-compliant