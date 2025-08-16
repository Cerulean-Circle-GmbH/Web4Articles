[Back to Planning](./planning.md)

# Task 1.10: Developer - HTTPS→SSH Push Fallback and Remote Wiring

## Goal
Implement robust remote wiring and fallback from HTTPS to SSH when large pushes fail (e.g., HTTP 400) after LFS migration.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- After initial HTTPS push attempt, detect failures and switch remote:
  - `git remote set-url origin git@github.com:<org>/<repo>.git`
  - Verify `ssh -T git@github.com` succeeds.
  - Retry `git push -u origin main`.
- Ensure LFS objects are uploaded first and verify with `git lfs ls-files`.
- Log remote URLs before/after for audit.

## Artifacts
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/GitScrumProject.ts`

## Acceptance Criteria
- On push failure over HTTPS, CLI switches to SSH and completes push.
- Output contains clear audit logs of remote change and SSH verification.

---

[Back to Planning](./planning.md)




