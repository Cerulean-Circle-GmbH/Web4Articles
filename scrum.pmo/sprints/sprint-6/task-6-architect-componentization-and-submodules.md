[Back to Sprint 6 Planning](./planning.md)

# Task 6: Architect — Componentization & Submodules Plan

## Status
- Planned
- Done

## Goal
Define a component-oriented structure where each major unit (e.g., `TSRanger`, `GitScrumProject`) is developed in its own folder and promoted to a dedicated GitHub repository as a submodule. Versions are maintained as dedicated branches per component (e.g., `njs14`, `n14.4`, `main`).

## Component boundaries
- `TSRanger`: TUI model/view/controller, completion adapter, shell wrappers, tests
- `GitScrumProject`: project scaffolding CLI (+ its internal DefaultCLI), docs
- Shared minimal contracts (types) are duplicated per component to avoid cross-component imports

## Target structure
```
components/
  TSRanger/
    (submodule)  # repo: <org>/TSRanger
  GitScrumProject/
    (submodule)  # repo: <org>/GitScrumProject
```

Root repository retains:
- Integration glue (scripts that orchestrate running components)
- Cross-component docs and sprint planning
- Aggregated E2E tests that shell out to component CLIs

## Submodule strategy
- One GitHub repo per component
- Add submodule at `components/<Name>`
- Pin to specific commit in root for deterministic builds

Example commands (to be executed in DevOps task):
```
git submodule add git@github.com:<ORG>/TSRanger.git components/TSRanger
git submodule add git@github.com:<ORG>/GitScrumProject.git components/GitScrumProject

git submodule init
git submodule update --remote --recursive
```

## Versioning model (runtime-targeted branches)
- `main`: latest supported Node (e.g., 18/20/22)
- `n14.4`: Node 14.21.3 compatible via ES2020 ESM (or ES2015 backport if needed)
- `njs14`: ES2015 ESM with .js specifiers (Node 14 strict)

Branch policy per component repo:
- Features land on `main`
- Backports are maintained by cherry-pick into `n14.4` and `njs14`
- Tag releases across branches as needed (e.g., `v0.3.0-njs14`)

## Integration guidelines
- Root wrappers accept an env toggle (e.g., `TSRANGER_V2=1`) and delegate into component binaries
- Add scripts to checkout a specific version branch in all submodules:
```
# tools/submodules/checkout-branch
for m in components/*; do (cd "$m" && git fetch && git checkout "${1:-main}" && git pull); done
```
- CI matrix: run integration tests against `main`, optionally `njs14`/`n14.4`

## Migration plan (high-level)
1) Create repos and add submodules (DevOps)
2) Move code into `components/<Name>` maintaining history where possible (filter-repo or fresh start)
3) Wire root scripts/tests to use component entry points
4) Establish versioned branches per component and CI jobs

## Acceptance Criteria
- Clear plan for folders, repos, and branches
- Minimal coupling across components (no cross-component imports)
- Root repo retains orchestration, docs, and integration tests only
- Submodule add/checkout/update commands validated locally

## References
- docs/architecture/components.md (this plan, detailed)