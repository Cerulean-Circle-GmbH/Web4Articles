# Project Retrospective — BranchStatus Agent 2

[Back to Instructions](./01.retro-instructions.what.md)

Repository: [Web4Articles](https://github.com/Cerulean-Circle-GmbH/Web4Articles)
Retro branch: `retro/2025-08-10-agent-retro`

Context update: Merged `origin/feature/ontology-agent` into this branch. The merge added Ontology and Research Agent artifacts and updated `index.md` with GitHub-linked entries.

## 1. Role Description After Recovery (as ScrumMaster)
As ScrumMaster and BranchStatus Agent, I own the branch topology, visibility, and safe integration policy.
- Maintain a single source of truth for branch status at `scrum.pmo/project.journal/2025-08-10-1030/branches.checklist.md`.
- Classify by merge status relative to `main`, with a dedicated “Do not touch branches” section for protected lines (`origin/main`, `origin/retro/...`).
- Drive small, auditable PRs (e.g., “cleanup branches”), and enforce merge (not rebase) for shared lines.
- Integrate cross-role docs (OntologyAgent, ResearchAgent) to enrich traceability and discovery from the index.

### Detailed Role Description (Updated)
- Inputs:
  - Git topology: merged vs. not-merged remotes, prefixes by function (e.g., `feature/`, `cursor/`, `release/`, `retro/`).
  - Discovery anchors from `index.md` to cross-link status to role docs and PDCA logs.
- Outputs:
  - `branches.checklist.md` with protected policy and checkmarks.
  - Recovery and retro notes referencing index entries and role processes.
- Guardrails:
  - Preserve protected branches; no force pushes; shared branches use merge.
- Cadence: At least per retro and whenever branch hygiene activities occur.

## 2. Achievements (Updated after ontology merge)
- Merged `origin/feature/ontology-agent` into `retro/2025-08-10-agent-retro`.
- Maintained branch status in:
  - `scrum.pmo/project.journal/2025-08-10-1030/branches.checklist.md` (with “Do not touch branches”).
- Cross-linked understanding via new/updated docs from `index.md`:
  - Ontology: `Documentation/Ontology.md/{nouns.index.md, verbs.index.md, ambiguities.index.md, ontology.status.md}`
  - Roles: `scrum.pmo/roles/OntologyAgent/process.md`, `scrum.pmo/roles/ResearchAgent/process.md`
  - PDCA logs for OntologyAgent and ResearchAgent
- Reconfirmed classical pull behavior: `pull.rebase=false`.

Evidence (commands and files):
```bash
# Merge performed (already completed):
$ git merge --no-ff origin/feature/ontology-agent -m "merge: bring origin/feature/ontology-agent into retro/2025-08-10-agent-retro"

# Checklist file:
/workspace/scrum.pmo/project.journal/2025-08-10-1030/branches.checklist.md

# Newly added/updated docs (excerpt from index.md):
/workspace/index.md
/workspace/Documentation/Ontology.md/ontology.status.md
/workspace/scrum.pmo/roles/OntologyAgent/process.md
/workspace/scrum.pmo/roles/ResearchAgent/process.md
```

## 3. Recurring Problems
### 3.1 Documentation drift between checklist and remote state
- Description: Manual lists can drift after merges and parallel pushes.
- Examples: New branches under `feature/` and `cursor/` families appear frequently; checklist misses them.
- Root cause: Manual upkeep; concurrent edits; lack of automation.
- Proposed fix: Generate checklist via scripted commands and commit as part of hygiene PRs.

### 3.2 Risky rebase on shared branches (reiterated)
- Description: Rebase introduced conflict markers in journal files earlier.
- Root cause: `pull.rebase` defaults; collaboration without PR gates.
- Fix: Enforce merge pulls for shared lines; configure tooling and CI accordingly.

### 3.3 Cross-role discoverability gaps
- Description: Branch hygiene work benefits from Ontology/Research artifacts but links were implicit.
- Fix: From `index.md`, link role docs in retro notes and checklists for quick navigation.

## 4. QA Feedback Review
- Helpful: Explicit “Do not touch” section clarified protected lines and review scope.
- Confusing: None.
- Suggestion: Add a small note in `index.md` or README that references the branch checklist location and protection policy.

## 5. Process Improvements (Actionable)
- Automation: Script to regenerate checklist and attach as PR artifact.
- Policy: Protected branches listed at top of the checklist; make this link visible from README and `index.md`.
- Integration: Add Ontology/Research references to branch hygiene PR bodies for context.

### Tree-like command examples (detailed)
```bash
# 1) Remote branches grouped by prefix (family tree)
$ git branch -r --format='%(refname:short)' |
  sed 's#^origin/##' |
  awk -F'/' '{print $1"/"$2}' |
  sort | uniq -c | sort -nr
# Example output (conceptual):
#    12 cursor/*
#     6 feature/*
#     3 release/*
#     2 retro/*
#     2 feat/*
#     1 chore/*

# 2) Full remote branch tree (indented)
$ git branch -r --format='%(refname:short)' |
  sed 's#^origin/##' | sort |
  awk 'BEGIN{FS="/"} {indent=""; for(i=1;i<NF;i++){indent=indent"  "}; print indent "- " $NF"  ("$0")"}'
# Shows a tree-like list with the full path in parentheses.

# 3) Merged vs not merged relative to main (checklist-ready)
$ git branch -r --merged origin/main | sed 's#^#  - [x] #'
$ git branch -r --no-merged origin/main | sed 's#^#  - [ ] #'

# 4) Protected (do-not-touch) marker injection for checklist
$ printf "\n- **Do not touch branches**:\n  - origin/main\n  - origin/retro/2025-08-10-agent-retro\n"

# 5) Ontology docs tree for quick navigation (post-merge)
$ find Documentation/Ontology.md -maxdepth 1 -type f | sort
# Expected key files:
# Documentation/Ontology.md/nouns.index.md
# Documentation/Ontology.md/verbs.index.md
# Documentation/Ontology.md/ambiguities.index.md
# Documentation/Ontology.md/ontology.status.md
```

## 6. QA “Elephant in the Room” Analysis
- Elephant: Manual branch documentation does not scale with active feature/agent families.
- Discovery: After merging ontology-agent, index growth highlighted the need for scripted generation and cross-links.
- Solution: Automate checklist regeneration; surface protected policy; reference Ontology/Research role docs in the checklist/PRs for durable discoverability.