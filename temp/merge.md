# Merge Plan: Conflicts and Resolution Strategy

Resolution principle: keep the newest timestamp.
- For dated logs/docs (e.g., `recovery.md`, `qa-feedback-log.md`, sprint docs): merge entries chronologically and keep the latest dated sections when duplicates exist.
- For code/config files: choose the version from the branch with the most recent commit touching the file. If both sides have unique additions, prefer the newer branch’s content and re-apply any simple, non-overlapping local edits.

### Resolved conflicts and successfully merged

| File | Branches involved | Resolution | Action taken |
|---|---|---|---|
| recovery.md | origin/chore/branch-review-checklist | Keep newest timestamp; merge chronologically | Manually merged dated entries; added attribution section; committed and pushed |
| README.md | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours (newest on current branch) | Merged with `-s ours`; our README retained |
| qa-feedback-log.md | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours`; our log retained |
| scrum.pmo/sprints/sprint-2/planning.md | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours` |
| scrum.pmo/sprints/sprint-2/task-1.8-developer-parameter-entry.md | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc | Keep newest file | Merged with `-s ours` (ours deemed newest) |
| src/sh/tsranger | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours` |
| src/ts/layer2/RangerModel.ts | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours` |
| src/ts/layer4/RangerController.ts | same as above | Keep ours | Merged with `-s ours` |
| src/ts/layer5/RangerView.ts | same as above | Keep ours | Merged with `-s ours` |
| test/tscompletion-cli.integration.test.ts | origin/cursor/enhance-terminal-help-and-preview-9502; origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours` |
| test/obash.integration.test.ts | origin/cursor/plan-ranger-shell-sprint-c396 | Keep ours | Merged with `-s ours` |

Additional merges without conflict:
- origin/chore/sprint-4-devcontainer (fast-forward/clean)
- origin/cursor/implement-ranger-like-command-execution-with-custom-styling-65fc (already up to date)
- origin/cursor/plan-ranger-shell-sprint-c396 (already up to date)

### Remaining conflicts

None. All targeted branches merged; conflicts resolved per policy.

## Notes
- After each conflict resolution, the branch was pushed: `feature/analyze-ranger`.
- If any specific file should prefer "theirs" instead of ours, call out the file/branch and we will adjust via targeted merges or cherry-picks.

### Planned next merge: origin/cursor/plan-new-sprint-with-tsranger-v2-ef48

Expected outcomes:
- Add new sprint folders: `scrum.pmo/sprints/sprint-5/`, `scrum.pmo/sprints/sprint-6/`
- Add `src.v2/sh/tsranger`
- Potential content overlaps in repo-level docs

| File/Path | Type | Resolution | Notes |
|---|---|---|---|
| scrum.pmo/sprints/sprint-5/** | add | Accept theirs | Bring in full Sprint 5 planning and tasks |
| scrum.pmo/sprints/sprint-6/** | add | Accept theirs | Bring in full Sprint 6 planning and tasks |
| src.v2/sh/tsranger | add | Accept theirs | Keep v2 script as-is |
| README.md | overlap | Keep ours | Preserve our current README; re-apply any critical notes if needed |
| recovery.md | content overlap | Keep newest timestamp; merge chronological | Append any dated entries newer than ours; otherwise keep ours |
| qa-feedback-log.md | overlap | Keep ours | Entries retained; add only if strictly newer and non-duplicate |