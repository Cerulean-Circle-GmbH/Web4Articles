[Back to Planning](./planning.md)

# Task 1.13: Tester - E2E: Workspaces MountPoint flows

## Goal
Provide non-interactive end-to-end tests for managing a symlink-based workspaces mountpoint and integrating it into repo scaffolding.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Tests
- Create a temp directory as the real target; run `createWorkspaceMountPoint` to point the symlink to it; assert symlink exists and resolves correctly.
- Run `updateWorkspaceMountPoint` to repoint; verify change.
- Run `safeRemoveWorkspaceMountPoint`; verify symlink removed and target untouched.
- Integrate with `createTemplateRepo` dry-run mode to ensure created repos can be placed under `<mountLink>/<org>/<repo>`.

## Acceptance Criteria
- All tests are non-interactive and run under `tsranger test` without hanging.
- Symlink operations are validated and leave no residue on failure.

---

[Back to Planning](./planning.md)




