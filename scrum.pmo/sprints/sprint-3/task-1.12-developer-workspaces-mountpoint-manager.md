[Back to Planning](./planning.md)

# Task 1.12: Developer - Workspaces MountPoint Manager (symlink org/repo)

## Goal
Extend `GitScrumProject` to manage a GitHub workspaces mountpoint which is a symbolic link pointing to a user-specific location, with structure `gitOrganisation/repo` under the mountpoint.

Provide positional CLI commands:
- `GitScrumProject createWorkspaceMountPoint <mountLink> <targetDir>`
- `GitScrumProject updateWorkspaceMountPoint <mountLink> <newTargetDir>`
- `GitScrumProject safeRemoveWorkspaceMountPoint <mountLink>`

Where:
- `<mountLink>` is the symlink location (e.g., `workspacesMountPoint/2cuGitHub`).
- `<targetDir>` is the real directory to link to (e.g., `/Users/Shared/Workspaces/2cuGitHub`).

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Implement filesystem-safe helpers:
  - Validate `<targetDir>` exists and is writable.
  - Create parent dirs for `<mountLink>` as needed.
  - If `<mountLink>` exists:
    - If symlink pointing elsewhere, replace on `updateWorkspaceMountPoint`.
    - If directory or file, abort with clear error and remediation instructions unless `--force` provided.
  - Use `fs.symlinkSync(targetDir, mountLink, 'dir')` on POSIX.
- Add optional flag support via env only (positional rule): `GSP_FORCE=1` for force replace.
- Add utility to validate nested structure `gitOrganisation/repo` exists or gets created as directories under the real target when scaffolding repos.

## Artifacts
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/GitScrumProject.ts` (new CLI branches)
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/WorkspaceMountPoint.ts` (new helper)

## Acceptance Criteria
- CLI can create, update, and safe-remove the symlink mountpoint.
- Errors are non-destructive with clear guidance; `GSP_FORCE=1` allows replacement.
- New repos created by `createTemplateRepo` optionally utilize the mountpoint to place `org/repo` under it.

---

[Back to Planning](./planning.md)




