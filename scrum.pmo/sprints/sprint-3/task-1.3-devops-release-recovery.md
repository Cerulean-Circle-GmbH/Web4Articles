# Task 1.3: DevOps/Developer - Release & Recovery Automation (Both Repos)

## Goal
Provide concise, auditable release and recovery processes for the wrapper repo and the source repo, with automation via CLI and GitHub Actions.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Implement `ReleaseManager`:
  - `plan(repoType: 'wrapper'|'source')` prints steps
  - `tagAndRelease(repoType, version, notes)` performs tagging and creates GH release (dry-run by default)
- Implement `RecoveryManager` to summarize state and next steps across both repos.
- Add `.github/workflows/ci.yml` template for scaffolded repos (lint, typecheck, test).
- Add `.github/workflows/release.yml` template using tags to publish release.
- Update `recovery.md` to include dual-repo recovery hooks and checklists.

## Artifacts
- Code: [src/ts/layer4/TSCompletion.ts](../../../src/ts/layer4/TSCompletion.ts) (if leveraged by release steps)
- Docs: `.github/workflows/ci.yml` and `.github/workflows/release.yml` (generated into new repo)
- Docs: [recovery.md](../../../recovery.md) with updated dual-repo hooks

## Acceptance Criteria
- One-command dry-run release plan for both repos
- GH Actions templates are generated into new wrapper repo
- Recovery log updates include submodule status and integrity checks
- This task references all created artifact file paths

---

[Back to Planning](./planning.md)