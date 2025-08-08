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