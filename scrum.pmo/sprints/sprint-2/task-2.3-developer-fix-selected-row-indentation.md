<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 2.3: Developer — Fix selected row indentation across columns in TSRanger

[subtask:uuid:b4d5e6f7-0891-4a2b-b456-8f9012bc3d4e]

[requirement:uuid:a2f4c3d0-9b8a-4f1e-8c3b-5e7a2f9d6c1b](./requiremnents.md)

## Status
- [x] Planned
- [x] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:a2f4c3d0-9b8a-4f1e-8c3b-5e7a2f9d6c1b](./requiremnents.md)
  - [task:uuid:81a2b3c4-d5e6-4718-9823-5c6d7e8f9012](./task-2.md)

## Task Description
The selected row in each column is misaligned (indentation off). The output shows the selected item overwriting the column title area (e.g., `GitScrumProjectoverlayRun`). Fix rendering so the selected item always aligns in its column width, with proper spacing before/after.

## Context
See `requiremnents.md` example and compare desired vs actual. Reproduce with scripted test mode.

## Intention
Ensure consistent column rendering: header row, then items, with selection highlighting not affecting alignment or adjacent columns.

## Steps
- Reproduce with: `src/sh/tsranger test "[down][down][right][tab]abc[left][q]"` and
  `src/sh/tsranger test "[down][down][down][down][down]"`
- Adjust `RangerView` to pad items within `colWidth`, and ensure selection styling does not remove spacing.
- Verify each column's selected row keeps its column boundary and spacing.

## Requirements
- Selected item must never spill into adjacent column labels.
- Selection inverse/bold/color must not change the visible width.

## Acceptance Criteria
- The provided sequences render exactly as shown in the desired example in `requiremnents.md`.
- No truncation or overlap in any of the 4 columns when selected row changes.
- Scripted test mode runs and exits leaving the final screen state intact.

## QA Audit & User Feedback
- [ ] QA review pending.

