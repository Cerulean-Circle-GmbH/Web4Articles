[Back to Planning](./planning.md)

# Task 1.9: Developer - LFS Detection, Migration, and Initial Push

## Goal
Automate detection of large binaries, configure Git LFS, migrate history for selected patterns, and push to the new remote.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Steps
- Detect files larger than threshold (default 90MB) and log them.
- Ensure `git-lfs` is installed; run `git lfs install`.
- Track patterns: `*.mp4, *.mov, *.zip, *.pdf, *.docx, *.pptx, *.xlsx` (configurable).
- Commit `.gitattributes` if modified.
- Run `git lfs migrate import --include="<patterns>" --include-ref=refs/heads/main`.
- Attempt push over HTTPS; if HTTP 400 or similar occurs, rely on Task 1.10 fallback.

## Artifacts
- Code: `components/GitScrumProject/v1.0/src/ts/layer2/GitScrumProject.ts` (implementation inside `createTemplateRepo`).
- Docs: `.gitattributes` (in the new repo).

## Acceptance Criteria
- Large binaries are tracked by LFS in the initial commit history.
- `.gitattributes` contains the expected patterns.
- Initial push of main branch succeeds or hands off cleanly to SSH fallback task.

---

[Back to Planning](./planning.md)



