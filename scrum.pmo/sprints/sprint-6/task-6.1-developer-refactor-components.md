<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Sprint 6 Planning](./planning.md)

# Task 6.1: Developer — Refactor into Component Folders

## Status
- Planned

## Description
Create `components/` with one folder per component:
- `components/TSRanger/` — current TSRanger sources and scripts
- `components/GitScrumProject/` — CLI project scaffolding component

Wire root scripts to delegate into components. Do not change logic; move files and update imports as needed.

## Steps
- Create folders and README placeholders
- Move sources incrementally (per PR)
- Update build/test/scripts to target component paths

## Acceptance Criteria
- Code compiles and tests pass from componentized layout
- No cross-component imports