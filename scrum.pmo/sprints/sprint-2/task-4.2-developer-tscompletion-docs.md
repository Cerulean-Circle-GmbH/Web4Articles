<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md) | [Back to Task 4](./task-4.md)

# Task 4.2 — Developer: Extend TSCompletion to expose TypeScript JSDoc for Class/Method/Params

[subtask:uuid:9b2c1d34-5e76-4f89-9a01-23b4c5d6e7f8]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done

## Traceability
- up
  - [task:uuid:3c9a7b42-8f1e-4f23-ae6d-9c5e0b7a12d3](./task-4.md)

## Goal
Add synchronous methods to `TSCompletion` to return docstrings for classes, methods, and method parameters.

## Steps
1. Parse TypeScript sources using minimal AST (ts.TypeChecker preferred if available via project context) or simple regex fallbacks on comment blocks preceding declarations.
2. Implement:
   - `getClassDoc(className: string): string`
   - `getMethodDoc(className: string, methodName: string): string`
   - `getParamDoc(className: string, methodName: string, paramName: string): string`
3. Keep methods synchronous and cache results for performance.
4. Handle missing docs gracefully with empty strings.

## Acceptance Criteria
- Methods return human-readable doc text without comment delimiters.
- No changes to existing completion APIs; only additions.

## QA Audit & User Feedback
- [ ] QA review pending.


