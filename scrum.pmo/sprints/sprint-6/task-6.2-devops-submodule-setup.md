<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Sprint 6 Planning](./planning.md)

# Task 6.2: DevOps — Promote Components to Git Submodules and Version Branches

## Status
- Planned

## Description
For each component, create a GitHub repository and add it as a submodule under `components/<Name>`. Define version-targeted branches (e.g., `njs14`, `n14.4`, `main`) and document checkout commands in scripts.

## Steps
- Create repos (TSRanger, GitScrumProject)
- `git submodule add <repo-url> components/<Name>`
- Push initial code structure
- Create branches for each runtime target (`njs14`, `n14.4`)
- Add helper scripts to update/checkout specific versions

## Acceptance Criteria
- Submodules present and synced
- Branch strategy documented and validated