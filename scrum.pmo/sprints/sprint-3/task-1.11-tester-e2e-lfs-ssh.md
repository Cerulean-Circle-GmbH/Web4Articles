[Back to Planning](./planning.md)

# Task 1.11: Tester - E2E: Large Files with LFS and SSH Fallback

## Goal
Provide end-to-end test coverage for repository creation with large files requiring LFS migration and fallback to SSH for pushing.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Tests
- Simulate local repo with >90MB files and run `createTemplateRepo` in dry-run mode to verify steps ordering and logs.
- Mock `gh` and `git` to assert:
  - LFS patterns tracked and `.gitattributes` committed
  - LFS migrate executed
  - HTTPS push attempted then remote switched to SSH and push retried
- Verify final remote is SSH and branch tracking is set.

## Acceptance Criteria
- Non-interactive tests pass under `tsranger test`.
- Coverage includes failure path for HTTPS and success via SSH.

---

[Back to Planning](./planning.md)


