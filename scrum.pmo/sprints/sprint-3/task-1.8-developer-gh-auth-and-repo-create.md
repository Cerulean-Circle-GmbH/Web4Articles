[Back to Planning](./planning.md)

# Task 1.8: Developer - GitHub Auth & Org Repo Creation (CLI)

## Goal
Extend `GitScrumProject` to authenticate with GitHub and create a new repository under a specified organization using positional CLI:

`GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> <submodulePath>`

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Add lightweight `GitHubApi` adapter that first tries `gh auth status` and `gh repo create <org>/<name> --<visibility>`; fallback to Octokit if `gh` is missing.
- Require non-interactive mode: read token from `GH_TOKEN` env if `gh auth status` fails.
- Initialize local git repo if needed; set default branch `main`.
- Set `origin` to `https://github.com/<org>/<name>.git` by default.
- Commit initial scaffold prior to push (after submodule add; see Task 1.9).

## Artifacts
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/GitScrumProject.ts`
- New: `components/GitScrumProject/v1.0/src/ts/layer2/GitHubApi.ts` (adapter)

## Acceptance Criteria
- Running `createTemplateRepo` creates the org repo and wires `origin`.
- Non-interactive auth supported via `GH_TOKEN`; uses `gh` when available.
- Default branch is `main`.
- Positional-only CLI respected.

---

[Back to Planning](./planning.md)


