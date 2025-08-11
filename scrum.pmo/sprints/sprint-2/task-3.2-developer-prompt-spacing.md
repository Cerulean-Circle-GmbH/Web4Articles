<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md) | [Back to Task 3](./task-3.md)

# Task 3.2 — Developer: Prompt spacing (exactly one empty line above command)

[subtask:uuid:d2e7c5a1-6b4f-4c3a-98fa-217b6d24f3a1]

## Status
- [x] Planned
- [x] In Progress
 - [x] QA Review
 - [x] Done

## Traceability
- up
  - [Task 3: Command prompt from $PS1 or hostname user@pwd](./task-3.md)
- related requirements
  - the prompt shall be always only one empty line above the command line. (see `requiremnents.md`)

## Task Description
Ensure the preview area renders with exactly one blank line above the command line (prompt + command), regardless of terminal resizing or content changes.

## Steps
1. Validate current rendering places one blank line above the preview.
2. Add/adjust scripted test cases to assert a single blank line above the preview line.
3. Re-render on resize maintaining the spacing invariant.

## Acceptance Criteria
- In scripted mode, output shows exactly one blank line above the preview line.
- Resizing the terminal preserves spacing (one blank line above preview) and the footer remains the last line.

## QA Audit & User Feedback
- [ ] QA review pending.


