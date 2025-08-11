<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 1.3 — Developer: Integrate TSCompletion for Live Suggestions

[subtask:uuid:3c5e7f91-b2c3-4d5e-8f01-2a3b4c5d6e7f]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:0e2f5b1a-3c7d-4f91-9ab2-7d3a6e8c5f90](./task-1.md)

## Goal
Wire `TSCompletion` into TS Ranger to populate and filter Classes, Methods, and Params columns. Support default value resolution in Params.

## Steps
1. Use `TSCompletion.getClasses()` to populate the Classes column on startup.
2. On class selection, call `TSCompletion.getClassMethods(class)` for Methods.
3. On method selection, call `TSCompletion.getMethodParameters(class, method)` for Params.
4. When the Params column is active and the user types a token, call `TSCompletion.getMethodParameters(class, method, token)` to fetch default value suggestions (e.g., `project` → `Web4Scrum`).
5. Implement in-column filtering using simple prefix match over current list; do not mutate the source list.
6. Keep calls synchronous within the render loop; `TSCompletion` is synchronous.

## Acceptance Criteria
- Filtering the Classes column narrows to prefixes, same for Methods/Params.
- Enter on Params with a token that maps to a default value replaces the token with the suggested default.
- Behavior matches existing tests in `test/TSCompletion.test.ts` and `test/tscompletion-cli.integration.test.ts` for defaults and prefixes.

## QA Audit & User Feedback
- [ ] QA review pending.