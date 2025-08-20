[Back to Planning](./planning.md)

# Task 1.15: Tester - E2E: Projects Submodule add/update/safeRemove

## Goal
Provide non-interactive E2E tests for adding a project from the workspaces mountpoint into `projects/` as a submodule, updating (commit+push), and safe removal.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Tests
- Set `GSP_MOUNTPOINT` to a temp dir containing a fake `<org>/<repo>` git repo.
- Run `addProjectSubmodule <org> <repo> <name>` and assert entries in `.gitmodules`, working tree location under `projects/`.
- Make a change inside the submodule, run `updateProjectSubmodule <name>`, assert commit and push (use local bare repo remote).
- Run `safeRemoveProjectSubmodule <name>` and assert `.gitmodules` and `.git/config` entries are gone but files remain.

## Acceptance Criteria
- Tests pass under `tsranger test` without interaction.
- Git metadata is correct before/after operations; no content loss on safe remove.

---

[Back to Planning](./planning.md)




