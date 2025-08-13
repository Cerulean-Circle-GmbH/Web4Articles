# BranchStatusAgent — Process

## Purpose
Maintain accurate, auditable visibility into repository branches, enforce protection policies, and drive safe consolidation via small PRs.

## Responsibilities
- Generate and maintain branch status in `scrum.pmo/project.journal/<date>/branches.checklist.md`.
- Classify branches by merge status relative to `main` and maintain a "Do not touch" section for protected lines (`origin/main`, `origin/retro/...`).
- Propose cleanup (close/archive) for stale branches; open PRs with concise scope and clear titles.
- Prefer merge pulls for shared branches; avoid rebases on shared history.
- Cross-link status to role docs (`OntologyAgent`, `ResearchAgent`) via `index.md` anchors.

## Inputs
- `git branch -r --merged origin/main`
- `git branch -r --no-merged origin/main`
- `git branch -r --format='%(refname:short)'`
- `index.md` for discovery of related role/process docs

## Outputs
- Branch checklist MD with protected list, unmerged-to-main and unmerged-to-release/dev sections, and merged-to-main list
- Recovery and retro notes referencing checklist and policies
- PRs for cleanup named like: `cleanup branches`

## Workflow
1. Fetch and enumerate branches.
2. Compute merged/not-merged relative to `origin/main`.
3. Update journal checklist. Include protected branches at top, then sections: Unmerged into main, Unmerged into release/dev, Merged into main.
4. Commit on a feature/chore branch and push; open PR.
5. Coordinate with QA for deletions/archives.

## Commands (templates)
```bash
# Update remotes
git fetch --all --prune

# Merged vs not merged
git branch -r --merged origin/main | sed 's#^#  - [x] #'
git branch -r --no-merged origin/main | sed 's#^#  - [ ] #'

# Group remote branches by family
git branch -r --format='%(refname:short)' | sed 's#^origin/##' |
  awk -F'/' '{print $1"/"$2}' | sort | uniq -c | sort -nr

# Indented tree
git branch -r --format='%(refname:short)' | sed 's#^origin/##' | sort |
  awk 'BEGIN{FS="/"} {indent=""; for(i=1;i<NF;i++){indent=indent"  "}; print indent "- " $NF"  ("$0")"}'

# Protected marker for checklist
printf "\n- **Do not touch branches**:\n  - origin/main\n  - origin/retro/2025-08-10-agent-retro\n"
```

## Policy
- `pull.rebase=false` for shared branches.
- No force pushes to protected branches.
- Checklist is canonical during cleanup; deviations require justification.

## PDCA Requirement (Shared)
- Use the shared PDCA template at `scrum.pmo/roles/_shared/PDCA/template.md`.
- After each QA/user prompt or significant branch hygiene action, create a UTC-named PDCA entry under `scrum.pmo/roles/BranchStatusAgent/PDCA/`.
- In Check, include concrete evidence (git branch lists, tree, links to checklist) and a verbatim QA quote.
- Plan must include bold-labelled subsections (Objective, Scope, Targets, Inputs, Acceptance Criteria, Assumptions, Constraints, Options, Rationale, Risks/Mitigations).

## Recovery → PDCA → Commit & Push (Enforced)
- After recovery or any QA prompt: perform recovery, write PDCA (UTC, QA quote, Actions with artifact links), then commit and push immediately.

## Linking Policy (GitHub-first dual-linking)
- Provide GitHub web link followed by relative path link for referenced files.
- Example:
  - `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/<branch>/scrum.pmo/roles/BranchStatusAgent/process.md): [scrum.pmo/roles/BranchStatusAgent/process.md](../../scrum.pmo/roles/BranchStatusAgent/process.md)`