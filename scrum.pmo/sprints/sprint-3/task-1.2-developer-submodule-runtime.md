# Task 1.2: Developer - Submodule Integration and Runtime Overlay

## Goal
Integrate the source repo as a submodule and ensure the wrapper project executes tools from within `sources/` while keeping wrapper configs, docs, and CI.

## Steps
- Create `SubmoduleManager` with methods:
  - `add(path: string, url: string, ref?: string)`
  - `update(path: string, ref?: string)`
- Add `GitScrumProject linkSource` command to manage submodule.
- Adjust shell wrappers (`tssh`, `oosh`) to detect `sources/` and delegate to `sources/src/...` respecting ESM and positional invocation.
- Ensure `ts-node --esm` works from wrapper calling into submodule.

## Acceptance Criteria
- Submodule is correctly added and updated by CLI
- Shell wrappers run backend from `sources/` when present
- No duplication of `src/` in wrapper