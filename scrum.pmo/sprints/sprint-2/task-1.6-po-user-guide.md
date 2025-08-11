<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 1.6 — PO: User Guide and Demo Scenarios

[subtask:uuid:6f809123-e5f6-4061-9234-5c6d7e8f9012]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [task:uuid:0e2f5b1a-3c7d-4f91-9ab2-7d3a6e8c5f90](./task-1.md)

## Goal
Document how to run and use the TS Ranger shell, with copy-pasteable examples.

## Contents
- Quickstart:
  - Prereq: Node 18+, repo cloned, dev deps installed
  - Run: `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`
- Concepts: Columns, filters, preview, execution
- Keyboard reference: arrows, enter, backspace, esc/q
- Examples:
  - Navigate to `GitScrumProject` → `create` → type `project` → select `Web4Scrum` → execute
  - `TSsh` → `installCompletion` to install completion
- Troubleshooting: ESM loader, TTY issues, logging via `LOG_LEVEL`

## Acceptance Criteria
- A single page guide under `docs/tsranger-user-guide.md` with screenshots or ASCII diagrams
- Linked from `README.md` (optional short blurb)

## QA Audit & User Feedback
- [ ] QA review pending.