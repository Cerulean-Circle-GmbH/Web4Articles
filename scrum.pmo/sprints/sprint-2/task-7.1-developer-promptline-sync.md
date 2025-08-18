[Back to Sprint 2 Planning](./planning.md)

# Task 7.1 — Developer: Prompt-line sync and navigation fixes
[task:uuid:8a7f1a4c-8f6a-4a2c-9d9c-8e9a25c8c7c3]
[subtask:uuid:9f8b5f96-2e6a-4c61-8b8d-3d3c2c4d6f71]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Fix and harden prompt-line editing behavior in `RangerController` and rendering in `RangerView` so that navigation and completion states remain synchronized with the grid selections and filters.

## Context
- Observed issues during scripted inputs:
  - `g[tab][down]` and `g[tab][down][down]`: prompt method token not syncing to selected method; second down not applied.
  - `g[tab]c` and `g[right]c`: method filter not set to `c`, visual cursor misplaced.
  - `t[tab]` vs `t[right]`: inconsistent behavior and rendering.
  - Backspace over boundaries merging tokens and desynchronizing filters.

## Intention
Deliver consistent, shell-like editing semantics with precise cursor placement and decoupled suggestion vs. filter state.

## Steps
- Unify Tab/Right handling into one completion path; treat empty tokens as column navigation only.
- On Up/Down in Methods column, write `selectedMethod` into `promptBuffer` and set `promptCursorIndex` to method start; keep `suppressMethodFilter=true` until typing begins.
- When typing at beginning of an auto-suggested method token, replace suggestion with typed char(s) and set `suppressMethodFilter=false`.
- Backspace: prevent token merge when at a space-before-cursor; re-derive filters after each edit.
- Ensure `RangerView` renders `[s]tart`-style cursor annotation deterministically (no partial token output).

## Requirements
- Changes restricted to `src/ts/layer4/RangerController.ts`, `src/ts/layer5/RangerView.ts`, and `src/ts/layer2/RangerModel.ts` as needed.
- Maintain non-interactive test mode path.

## Acceptance Criteria
- `tsranger test "t[tab]"` and `tsranger test "t[right]"` render the same command: `TSsh [s]tart`.
- `tsranger test "g[tab][down]"` updates command to `GitScrumProject [d]ispatch` (cursor at first letter) or the actual second method; view and model in sync.
- `tsranger test "g[tab][down][down]"` applies two downs without hang and updates prompt accordingly.
- `tsranger test "g[tab]c"` and `"g[right]c"` show `GitScrumProject c[r]eate` and Methods filter `(c)`.
- Backspace over method/class boundaries does not merge tokens; filters re-computed correctly.

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
