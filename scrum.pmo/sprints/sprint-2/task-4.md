<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 4: Replace Preview with Documentation Column and Extend TSCompletion for Docstrings

[task:uuid:3c9a7b42-8f1e-4f23-ae6d-9c5e0b7a12d3]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done

## Traceability
- up
  - [requirement:uuid:c0f7a2d4-3e9b-4a51-8c6d-1f2e3a4b5c6d](./requiremnents.md)
- down
  - [Task 4.1 — Architect: Documentation Column and Docstring Extraction Spec](./task-4.1-architect-docs-spec.md)
  - [Task 4.2 — Developer: Extend TSCompletion to expose TypeScript JSDoc for Class/Method/Params](./task-4.2-developer-tscompletion-docs.md)
  - [Task 4.3 — Developer: Replace Preview with `Docs` column (render selected element docs)](./task-4.3-developer-docs-column.md)
  - [Task 4.4 — Tester: Scripted navigation checks for Docs rendering](./task-4.4-tester-e2e-docs.md)
  - [Task 4.5 — PO: Update user guide for Docs column behavior](./task-4.5-po-user-guide-update.md)

## Task Description
Refactor the TS Ranger TUI: remove the current `Preview` column and introduce a `Docs` column that renders documentation for the currently selected element (Class, Method, or Parameter). Enhance `TSCompletion` to return associated TypeScript documentation comments (JSDoc/TSdoc) for these elements so that the controller/view can display them.

## Context
- Maintain ESM-only constraints and no external TUI dependencies.
- Preserve the command preview line (below grid) and footer behavior from Task 2/3.

## Intention
Improve discoverability by showing contextual documentation inline during navigation.

## Steps
1. Architect the data flow and responsibilities for doc extraction and rendering (Task 4.1).
2. Extend `TSCompletion` with synchronous APIs to fetch docs for class, method, and parameter tokens (Task 4.2).
3. Replace the grid’s 4th column with `Docs` and render wrapped text (respecting width/height) (Task 4.3).
4. Add scripted tests validating docs appear when selecting items and do not break layout (Task 4.4).
5. Update the user guide to document the new column and how docs are sourced (Task 4.5).

## Requirements
- Docs column shows the best-available docstring for the selected entity; empty string if none.
- No horizontal overflow; text wraps within the column width.
- Grid remains 4 columns; bottom preview and footer spacing unchanged.

## Acceptance Criteria
- Navigating Classes/Methods/Params updates the `Docs` column with contextual text.
- `TSCompletion` exposes doc info via new methods (e.g., `getClassDoc`, `getMethodDoc`, `getParamDoc`).
- Scripted tests pass, and existing suites remain green.

## QA Audit & User Feedback
- [ ] QA review pending.


