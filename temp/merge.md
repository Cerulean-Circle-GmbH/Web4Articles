# Merge Plan: Conflicts and Resolution Strategy

Resolution principle: keep the newest timestamp.
- For dated logs/docs (e.g., `recovery.md`, `qa-feedback-log.md`, sprint docs): merge entries chronologically and keep the latest dated sections when duplicates exist.
- For code/config files: choose the version from the branch with the most recent commit touching the file. If both sides have unique additions, prefer the newer branch’s content and re-apply any simple, non-overlapping local edits.

## Conflicts overview

| File | Branches with conflicts | Conflict type | Resolution rule | Planned action |
|---|---|---|---|---|
| recovery.md | chore/branch-review-checklist; cursor/enhance-terminal-help-and-preview-9502; cursor/execute-role-from-readme-and-add-to-project-4f37; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-new-sprint-with-tsranger-v2-ef48; cursor/plan-ranger-shell-sprint-c396 | content overlap in dated sections | Keep newest timestamp; merge chronologically | Merge all entries sorted by date; retain later 2025-08-10 entries; include both summaries with attribution notes |
| README.md | cursor/enhance-terminal-help-and-preview-9502; cursor/plan-ranger-shell-sprint-c396 | content overlap | Choose newer branch version | Take content from the newest branch among these, re-apply local README constraints if needed |
| qa-feedback-log.md | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | content overlap in log entries | Keep newest timestamp | Merge entries by timestamp; dedupe identical items; keep latest feedback notes |
| scrum.pmo/sprints/sprint-2/planning.md | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | content overlap | Choose newer | Take newest branch version; ensure links still resolve |
| scrum.pmo/sprints/sprint-2/task-1.8-developer-parameter-entry.md | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc | add/add (new file in both) | Choose newer | Keep the file version from the most recently updated branch; verify references |
| src/sh/tsranger | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | add/add (shell wrapper) | Choose newer | Keep the newer script; re-apply env flags from current branch if missing |
| src/ts/layer2/RangerModel.ts | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | add/add (refactor vs features) | Choose newer; re-apply safe deltas | Use newest version; re-apply any non-overlapping local improvements (naming, flags) |
| src/ts/layer4/RangerController.ts | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | add/add | Choose newer; re-apply safe deltas | Prefer newest; ensure test mode/env flags preserved; re-run tests |
| src/ts/layer5/RangerView.ts | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | add/add | Choose newer; re-apply safe deltas | Prefer newest; ensure footer/spacing rules; confirm with tests |
| test/tscompletion-cli.integration.test.ts | cursor/enhance-terminal-help-and-preview-9502; cursor/implement-ranger-like-command-execution-with-custom-styling-65fc; cursor/plan-ranger-shell-sprint-c396 | content overlap | Choose newer | Keep newest; update assertions if API changed |
| test/obash.integration.test.ts | cursor/plan-ranger-shell-sprint-c396 | add/add | Choose newer | Prefer newest; verify obash behavior tests pass |

## Notes
- After each conflict resolution, run the full test suite and fix any regressions.
- When in doubt about code paths, prefer the branch with the later committer timestamp for the specific file.