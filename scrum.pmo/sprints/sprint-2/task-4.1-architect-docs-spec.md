<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md) | [Back to Task 4](./task-4.md)

# Task 4.1 — Architect: Documentation Column and Docstring Extraction Spec

[subtask:uuid:7a1b9c83-2a4e-4bb1-b2af-2abf6a2e4d71]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:3c9a7b42-8f1e-4f23-ae6d-9c5e0b7a12d3](./task-4.md)

## Goal
Define the architecture to replace the `Preview` grid column with a `Docs` column fed by enhanced `TSCompletion` doc APIs.

## Scope
- `TSCompletion` additions: `getClassDoc(name)`, `getMethodDoc(className, methodName)`, `getParamDoc(className, methodName, paramName)`.
- `RangerView` changes: `Docs` column with text wrapping; keep bottom command preview unchanged.
- `RangerController` updates: fetch docs on selection change and pass to view.

## Acceptance Criteria
- Clear API signatures and responsibilities documented.
- No ambiguity for the developer tasks (4.2/4.3).

## QA Audit & User Feedback
- [ ] QA review pending.


