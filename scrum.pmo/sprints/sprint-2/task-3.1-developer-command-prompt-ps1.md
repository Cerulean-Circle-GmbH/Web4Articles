<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md) | [Back to Task 3](./task-3.md)

# Task 3.1: Developer — Command prompt for preview using $PS1 (hostname user@pwd)

[subtask:uuid:c5e6f708-19a2-4b3c-c567-9012bc3d4e5f]

## Status
- [x] Planned
- [x] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93](./requiremnents.md)
  - [Task 3: Command prompt from $PS1 or hostname user@pwd](./task-3.md)

## Task Description
Let the command preview render with a prompt prefix. Prefer reading `$PS1`; if undefined, synthesize `[hostname] user@pwd`.

## Context
Align the preview with shell ergonomics as requested in `requiremnents.md`.

## Intention
Increase familiarity by mirroring common bash prompts in the preview line.

## Steps
- Read `process.env.PS1`; if present, use a sanitized one-line version.
- Else build `[hostname] user@pwd` using os APIs and cwd.
- Ensure prompt is included before the preview command tokens.

## Requirements
- Prompt present for all previews.
- No control sequences from PS1 should break layout (strip unsupported sequences).

## Acceptance Criteria
- Preview shows a prompt on every render.
- Works in scripted test mode.

## QA Audit & User Feedback
- [ ] QA review pending.



