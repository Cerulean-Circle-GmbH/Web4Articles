# Task 1.2: Developer - Submodule Integration and Runtime Overlay

## Goal
Integrate the source repo as a submodule and ensure the wrapper project executes tools from within `sources/` while keeping wrapper configs, docs, and CI.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Create `SubmoduleManager` with methods:
  - `add(path: string, url: string, ref?: string)`
  - `update(path: string, ref?: string)`
- Add `GitScrumProject linkSource` command to manage submodule.
- Adjust shell wrappers (`tssh`, `oosh`) to detect `sources/` and delegate to `sources/src/...` respecting ESM and positional invocation.
- Ensure `ts-node --esm` works from wrapper calling into submodule.

## Artifacts
- Code: `src/ts/layer2/GitScrumProject.ts`
- Code: `src/ts/layer4/TSRanger.ts` (delegation pattern reference)
- Docs: `.gitmodules` in the new wrapper repo

## Acceptance Criteria
- Submodule is correctly added and updated by CLI
- Shell wrappers run backend from `sources/` when present
- No duplication of `src/` in wrapper
- This task references all created artifact file paths