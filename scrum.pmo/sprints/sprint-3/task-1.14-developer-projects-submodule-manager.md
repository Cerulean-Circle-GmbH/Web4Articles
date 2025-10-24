<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Planning](./planning.md)

# Task 1.14: Developer - Projects Submodule Manager (mountpoint → projects/)

## Goal
Extend `GitScrumProject` to checkout a repository from the workspaces mountpoint into `projects/` as a git submodule, and provide methods to manage the submodule lifecycle.

Positional CLI:
- `GitScrumProject addProjectSubmodule <org> <repo> [targetName]`
- `GitScrumProject updateProjectSubmodule <targetName>` (stage+commit+push changes within submodule)
- `GitScrumProject safeRemoveProjectSubmodule <targetName>` (remove submodule wiring without deleting contents)

Behavior:
- Resolve real path via mountpoint: `<mountLink>/<org>/<repo>` (mountpoint discovered via env `GSP_MOUNTPOINT` or default `workspacesMountPoint/2cuGitHub`).
- For `addProjectSubmodule`:
  - Ensure `projects/` exists; create `projects/<targetName||repo>`.
  - Add submodule using the local path if available; otherwise fallback to `git@github.com:<org>/<repo>.git`.
- For `updateProjectSubmodule`:
  - Enter submodule dir, commit staged changes if any with a conventional message, and push to its `origin`.
- For `safeRemoveProjectSubmodule`:
  - Deinit submodule, remove from `.gitmodules` and `.git/config`, keep working tree content intact.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Implement helper `ProjectsSubmoduleManager.ts` with operations: `add`, `update`, `safeRemove`.
- Wire new methods into `GitScrumProject` CLI dispatch.
- Ensure commands are ESM and positional only; flags via env (`GSP_MOUNTPOINT`, `GSP_FORCE`).

## Artifacts
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/GitScrumProject.ts`
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/ProjectsSubmoduleManager.ts`

## Acceptance Criteria
- Submodule can be added from mountpoint or GitHub fallback into `projects/`.
- Updates commit and push changes within submodule.
- Safe remove leaves contents and cleans git metadata.

---

[Back to Planning](./planning.md)




