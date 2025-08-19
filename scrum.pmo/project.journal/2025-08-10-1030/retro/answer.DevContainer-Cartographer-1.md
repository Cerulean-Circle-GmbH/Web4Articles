<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

# Agent Retrospective — DevContainer-Cartographer-1

Repository: `Web4Articles`
Branch: `retro/2025-08-10-agent-retro`
Date: 2025-08-10

Note: The referenced instructions file `01.retro-instructions.what.md` was not found in the repository. Proceeding with a standard retrospective structure while preserving headings commonly used in our retros.

## What was the goal?
- Provide a reproducible DevContainer for the project and validate via CI.
- Keep documentation and sprint planning consistent and traceable.

## What happened (observations)?
- Implemented `.devcontainer` with Node 18, Graphviz, and PlantUML.
- Added CI validation workflow to build DevContainer and run tests + PlantUML checks.
- Encountered CI build tagging issues (`undefined:latest`, `:latest:latest`).
- Local test run shows 4 failing tests in `test/tsranger.promptline.behavior.test.ts`, unrelated to containerization.

## What went well?
- DevContainer config created with minimal, clear setup.
- CI pipeline established to validate environment parity.
- Documentation updated in `README.md`; added PUML scripts.
- Added local diagnostic script to build and validate container: `src/sh/validate-devcontainer`.

## What did not go well (impediments)?
- CI action initially produced invalid tags, causing builds to fail.
- Missing `01.retro-instructions.what.md` meant retro prompts were not discoverable.
- Local environment lacks Docker/Graphviz/PlantUML, preventing local container validation.

## Root causes (brief)
- Action default tagging behavior combined with provided tag created `:latest:latest`.
- Missing retro instruction file likely due to repo structure drift.
- Environment dependency gaps outside of container.

## Decisions and changes made
- Set explicit `imageName` and `imageTag` in workflow; added buildx GHA cache; disabled push.
- Added npm scripts for PUML checks; documented usage in `README.md`.
- Created `src/sh/validate-devcontainer` to diagnose/build/run validations locally.

## Evidence and links
- Branch: `feat/sprint-4-devcontainer-planning-pr`
- DevContainer files:
  - `.devcontainer/devcontainer.json`
  - `.devcontainer/Dockerfile`
- CI workflow: `.github/workflows/devcontainer-validate.yml`
- Scripts: `src/sh/validate-devcontainer`
- Docs: `README.md` (DevContainer usage)
- QA log: `qa.md`

## Metrics / status
- Tests: 53 passed, 4 failed, 1 skipped (local run at 2025-08-10) — failures in `test/tsranger.promptline.behavior.test.ts`.
- CI: DevContainer Validate workflow adjusted; next run expected to pass build and execute checks.

## Action items (concrete)
1. Verify CI run passes after `imageTag` fix; if not, pin `devcontainers/ci` version or adjust inputs further.
2. Investigate and fix TSRanger prompt-line behavior to resolve 4 failing tests.
3. Add `01.retro-instructions.what.md` to repo under `scrum.pmo/project.journal/_templates/` (or proper location) and link from retro folders.
4. Consider adding a Make target `make validate-devcontainer` calling the new script for developer convenience.

## Risks
- CI variability due to external action changes.
- Delays in addressing non-container test failures could block DevContainer sign-off.

## Next iteration improvements
- Pin action versions and base images for deterministic CI.
- Expand DevContainer to include optional `gh` tooling if required by future tasks.