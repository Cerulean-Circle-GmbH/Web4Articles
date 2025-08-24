# Project Retrospective — BranchStatus Agent 1

[Back to Instructions](./01.retro-instructions.what.md)

Repository: [Web4Articles](https://github.com/Cerulean-Circle-GmbH/Web4Articles)
Retro branch: `retro/2025-08-10-agent-retro`

## 1. Role Description After Recovery (as ScrumMaster)
As ScrumMaster and BranchStatus Agent, I ensure branch hygiene, visibility, and safe consolidation. After recovery from `README.md`, my responsibilities are:
- Maintain an authoritative, human-readable branch status in `scrum.pmo/project.journal/.../branches.checklist.md`.
- Classify branches by merge status relative to `main`, and maintain a “Do not touch” set for protected lines.
- Propose closing, archiving, or rebasing stale branches and surface conflicts early.
- Keep PRs small and auditable, ensuring merge (non-rebase) pulls on collaborators unless explicitly coordinated.

### Detailed Role Description
- Inputs: `git branch -r --merged origin/main`, `git branch -r --no-merged origin/main`, repo topology, PRs.
- Outputs: Markdown checklists, PRs named clearly (e.g., “cleanup branches”), and recovery notes in `recovery.md`.
- Guardrails: Preserve protected branches; avoid force pushes; prefer merge over rebase for shared branches.
- Cadence: On every sprint retro or recovery event; additionally on request.

## 2. Achievements
- Generated branch checklist with merge state:
  - `scrum.pmo/project.journal/2025-08-10-1030/branches.checklist.md`
- Created PR branch: `chore/branch-review-checklist` (PR to be titled “cleanup branches”).
- Updated checklist with a “Do not touch branches” section: `origin/main`, `origin/retro/2025-08-10-agent-retro`.
- Aborted rebase and set classic merge behavior for pulls.

Evidence (commands and files):
```bash
# listing
$ git branch -r --merged origin/main
$ git branch -r --no-merged origin/main

# checklist file
/workspace/scrum.pmo/project.journal/2025-08-10-1030/branches.checklist.md
```

## 3. Recurring Problems
### 3.1 Accidental rebase on shared branches
- Description: Rebase started during push/pull race, causing conflicts in journal files.
- Examples: conflict markers in `branches.checklist.md`.
- Suspected root causes: `pull.rebase` defaults in environment; concurrent remote updates.
- Proposed fix: Set `pull.rebase=false`; prefer merge for shared branches; use PRs.

### 3.2 Inconsistent naming and protection of long-lived branches
- Description: Protected branches were mixed into general checklists.
- Examples: `origin/main` and `origin/retro/2025-08-10-agent-retro`.
- Fix: Add explicit “Do not touch” section and keep them out of merge-status lists.

## 4. QA Feedback Review
- Helpful: Request to separate protected branches clarified policy and reduced risk.
- Confusing: None in this cycle.
- Suggestion: When asking for structural changes, specify exact target file path and section name (done here).

## 5. Process Improvements (Actionable)
- Add a `Protected Branches` policy to README linking to the journal checklist.
- Automate checklist generation as a script to avoid typos and conflict markers.
- Enforce `git config pull.rebase=false` in devcontainer and CI templates.

Checklist generation snippet (tree-like output examples):
```bash
# High-level remote branch tree
$ git ls-remote --heads origin | awk '{print $2}' | sed 's#refs/heads/##' | sort | awk '
BEGIN {FS="/"}
{
  indent="";
  for (i=1;i<NF;i++){indent=indent"  "}
  printf("%s- %s\n", indent, $NF)
}'

# Merged vs not merged (compact)
$ git branch -r --merged origin/main | sed 's#^#  [x] #'
$ git branch -r --no-merged origin/main | sed 's#^#  [ ] #'
```

## 6. QA “Elephant in the Room” Analysis
- Elephant: Branch documentation drift vs. actual remote state leads to risky cleanups.
- Discovery: During rebase conflict; journal diverged from remote after concurrent edits.
- Solution: Automate updates and codify merge-only policy for shared branches; protect retro and main explicitly.