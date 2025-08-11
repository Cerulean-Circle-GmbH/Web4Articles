<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Docs](../)

# 2025-08-03 (DevContainer & Task File Migration)

**Issue:** DevContainer requirements and ts-completion-sprint0 task were misplaced in the project root and sprints/iteration-0.

**Action:**
- Migrated devcontainer requirements to `scrum.pmo/sprints/sprint-0/task-6-devcontainer-requirements.md`.
- Updated sprint-0 planning to include Task 6.
- Removed misplaced files: `devcontainer.md`, `sprints/iteration-0/ts-completion-sprint0.md`.

**Prevention:**
- All requirements and sprint tasks must be placed in the correct sprint planning/task structure.
- Migration actions and mistakes must be logged here for traceability and continuous improvement.
# 2025-08-03 (Stale Folder Cleanup)

**Issue:** Empty folders for Architect, Developer, DevOps, and Tester remained in `src/` after process documentation migration.

**Action:**
- Removed empty folders: `src/architect`, `src/developer`, `src/devops`, `src/tester`.
- Verified all process documentation is now only in `scrum.pmo/roles/<Role>/process.md`.

**Prevention:**
- After any migration or file move, always check for and remove empty folders.
- Document all such cleanups in this log for traceability.
# 2025-08-03 (Update)

**Issue:** Process documentation for Developer, DevOps, and Tester roles was duplicated in both `src/<role>/process.md` and `scrum.pmo/roles/<Role>/process.md`.

**Action:**
- Merged all content from `src/developer/process.md`, `src/devops/process.md`, and `src/tester/process.md` into their respective files in `scrum.pmo/roles/`.
- Deleted the files in `src/` to prevent future confusion.
- Added a note to each canonical file to clarify the correct location for all process documentation.

**Prevention:**
- All process documentation must reside in the appropriate `scrum.pmo/roles/<Role>/process.md` file.
- Never place process docs in `src/` or other code directories.
- Migration actions and mistakes must be logged here for traceability and continuous improvement.
# Process Documentation Migration Log

## 2025-08-03

**Issue:** Architect process documentation was duplicated in both `src/architect/process.md` and `scrum.pmo/roles/Architect/process.md`.

**Action:**
- Merged all content from `src/architect/process.md` into `scrum.pmo/roles/Architect/process.md`.
- Deleted the file in `src/architect/process.md` to prevent future confusion.
- Added a note to the canonical file to clarify the correct location for all architect process documentation.

**Prevention:**
- All process documentation must reside in the appropriate `scrum.pmo/roles/<Role>/process.md` file.
- Never place process docs in `src/` or other code directories.
- Migration actions and mistakes must be logged here for traceability and continuous improvement.
