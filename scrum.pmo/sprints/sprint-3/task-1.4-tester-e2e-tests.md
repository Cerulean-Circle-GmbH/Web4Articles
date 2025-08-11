<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 1.4: Tester - E2E and Unit Tests

## Goal
Ensure the templating tool works end-to-end, including GitHub repo creation, submodule setup, overlay execution, and release planning.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Tests
- Unit tests for `SubmoduleManager`, `ReleaseManager`, and `GitHubApi` adapter (mocked `gh`).
- Integration test (dry-run) for `createTemplateRepo` using a temporary local git server or mocked `gh` commands.
- Verify shell wrappers delegate into `sources/` when present.

## Acceptance Criteria
- All new tests pass in CI
- Coverage added for critical paths
- This task references all created artifact file paths

---

[Back to Planning](./planning.md)