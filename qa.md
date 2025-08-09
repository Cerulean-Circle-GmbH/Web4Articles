# QA Report — DevContainer and Test Status (2025-08-09)

Branch: `feat/sprint-4-devcontainer-planning-pr`

## Summary
- Added `.devcontainer` with Node 18, Graphviz, and PlantUML CLI.
- Introduced CI workflow to build the devcontainer and validate tests/PUML.
- Observed CI build issues due to image tagging; fixed in workflow.
- Test suite exhibits 4 failures unrelated to containerization.

## Issues Observed

### 1) DevContainer CI Build Failures
- Symptom (first run):
  - Error indicated tag was `undefined:latest` when building via `devcontainers/ci`.
  - Root cause: Missing explicit `imageName` caused the action to construct an undefined tag.
  - Fix: Updated `/.github/workflows/devcontainer-validate.yml` to set `imageName` and use the npm script for PlantUML checks.

- Symptom (second run):
  - Error showed `web4articles-devcontainer:latest:latest` during `docker buildx build`.
  - Root cause: Provided `:latest` in `imageName` while the action appends its own `:latest`.
  - Fix: Removed the `:latest` suffix from `imageName` to avoid double-tagging.

- Current status:
  - Workflow updated with `imageName: web4articles-devcontainer` and `push: never`.
  - Awaiting CI re-run to confirm green build.

### 2) Local Environment Prerequisites Missing
- On the local runner (non-container), the following are not present:
  - `docker` (no engine)
  - `dot` (Graphviz)
  - `plantuml`
- Mitigation: Rely on the devcontainer for a standardized environment; CI workflow builds/runs inside the devcontainer.

### 3) Test Suite Failures (Unrelated to Containerization)
- File: `test/tsranger.promptline.behavior.test.ts`
- Failures: 4 tests failing, representative errors:
  - `g[tab][down] syncs prompt method token with selected method` → expected false to be true
  - `g[tab][down][down] keeps syncing to the next method (no hang, prompt updates)` → expected false to be true
  - `g[tab]c sets method filter to c with cursor on r of create` → expected false to be true
  - `g[right]c sets method filter to c similarly` → expected false to be true
- Notes:
  - Indicates prompt/method token sync and methods filter state are not matching expectations when navigating with down/right and partial input `c`.
  - Other suites pass, so scope is focused on prompt-line behavior.

## Files/Changes of Interest
- `/.devcontainer/devcontainer.json` — devcontainer config
- `/.devcontainer/Dockerfile` — Node 18, Graphviz, PlantUML CLI wrapper
- `/.github/workflows/devcontainer-validate.yml` — devcontainer CI with `imageName` fix and `npm run puml:check`
- `/package.json` — added `puml:check` and `puml:render` scripts
- `/README.md` — DevContainer usage instructions

## Recommendations / Next Steps
- CI:
  - Verify the updated workflow builds the devcontainer and runs tests + `puml:check` successfully.
- DevContainer validation (Sprint 4 Tasks 1.3/1.4):
  - In-container, run: `npm test` and `npm run puml:check`.
  - Document outcomes in Sprint 4 subtasks and attach logs if needed.
- Test Failures (non-container scope):
  - Investigate prompt-line sync between selected method and prompt token, and ensure methods filter `c` is reflected in both header and prompt cursor location.
  - Update implementation and/or tests accordingly.

## Traceability
- Sprint 4 tasks impacted: `scrum.pmo/sprints/sprint-4/task-1.md`, `task-1.1-architect-devcontainer-spec.md`, `task-1.2-devops-create-devcontainer-files.md`, `task-1.3-devops-plantuml-graphviz.md`, `task-1.4-tester-validate-in-container.md`.