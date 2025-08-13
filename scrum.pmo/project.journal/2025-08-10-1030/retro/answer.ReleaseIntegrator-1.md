[Back to Retro Instructions](./01.retro-instructions.what.md)

# ReleaseIntegrator-1 Retrospective — 2025-08-10

- [ ] Read by QA
- [ ] implemented all measures

## 1. Role Description After Recovery (as ScrumMaster)

After recovering from `README.md`, I operate as a ScrumMaster specialized in safe branch integration. I coordinate merges, protect canonical docs (journals, templates, QA logs, workflows), and ensure cross-references and backlinks remain intact. I prefer partial, low-risk merges and follow with PRs for contested changes.

### [Detailed](./answer.ReleaseIntegrator-1.md#typo:Settiles) Role Description
- Responsibilities: plan partial merges, preserve protected paths, enforce backlink/cross-link hygiene, and document branch state in project journals.
- Guardrails: never delete journals/templates/QA logs/workflows without explicit decision; prefer rebase-before-push; keep merges auditable.
- Handoffs: DevOps (branch policies/CI checks), Developer (conflict fixes), PO (docs updates), Tester (post-merge validation).

## 2. Achievements
- Journal recovery:
  - Restored missing project journals to `main` and `release/dev` with explicit branch links:
    - [`scrum.pmo/project.journal/2025-08-10-1030/project.state.md`](../2025-08-10-1030/project.state.md)
    - [`scrum.pmo/project.journal/2025-08-10-0854/project.state.md`](../2025-08-10-0854/project.state.md)
- Process sync to `main` (pre-QA approved):
  - [`README.md`](../../../../README.md)
  - Role processes under `scrum.pmo/roles/*/process.md` and [`scrum.pmo/roles/ScrumMaster/recovery-process.md`](../../roles/ScrumMaster/recovery-process.md)
- Partial safe merge of `origin/feature/analyze-ranger` into `release/dev` (A/M only; no deletions; protected paths excluded).
  - Added components READMEs and architecture docs; maintained workflows and journals.

## 3. Recurring Problems
### 3.1 Journal drift and accidental deletions
- Description: feature branch removed journal files; downstream branches missed state snapshots.
- Examples: deletions of `project.state.md` under `scrum.pmo/project.journal/**` in feature branch.
- Root cause: large-scale refactor with broad deletes; missing CI guard for canonical paths.
- Proposed fix: CI rule to block deletions under `scrum.pmo/project.journal/**`, templates, and QA logs.

### 3.2 Protected workflow removal
- Description: feature branch removed `.github/workflows/**` automations.
- Examples: `auto-merge-release-dev.yml`, `eod-merge.yml`, `quality-checks.yml` dropped.
- Root cause: restructuring without path protection and PR checks.
- Proposed fix: codeowners + CI protection for workflows; require approvals.

### 3.3 Cross-link/backlink inconsistencies
- Description: newly added docs missed first-line backlinks or proper relative links.
- Examples: several `docs/**` and `scrum.pmo/**` pages lacked top backlink.
- Root cause: manual merges without post-pass checks.
- Proposed fix: pre-commit/backlink linter; post-merge doc hygiene sweep.

## 4. QA Feedback Review
- Helpful:
  - Clear directive to import non-conflicting files first and protect journals/workflows.
  - Instruction to enrich journals with explicit branch links for recoverability.
- Confusing:
  - Mixed requests across branches (main vs release/dev) required careful confirmation before pushes.

## 5. Process Improvements (Actionable)
- CI protections:
  - Block deletions under `.github/workflows/**`, `scrum.pmo/project.journal/**`, `scrum.pmo/templates/**`, `qa-feedback-log.md`.
  - Backlink/cross-link linter for changed `.md` files.
- PR discipline:
  - Rebase-before-push; open PRs for deletions; partial merges first; conflict fixes in follow-ups.
- Journal policy:
  - Every new retro or branch-work session must add/update `project.state.md` with explicit branch links and cross-linked artifacts.
- Where to document: `scrum.pmo/roles/DevOps/process.md`, `scrum.pmo/roles/ScrumMaster/process.md`, `README.md`.

## 6. QA “Elephant in the Room” Analysis
- Undiscussed-but-blocking: large feature merges deleting canonical assets (workflows/journals) without safeguards.
- Named obstacle: lack of CI/branch rules allowed risky deletions and link drift.
- Solutions provided: adopt protected-path policy, partial merge strategy, and link hygiene checks; enrich journals with branch links for recovery.

## 7. Robustness of Shell Fiddling (safety practices)

Observed during integration and recovery, shell operations were kept robust by:

- Prefer read-only listings before write ops
  - Use `git diff --name-status`, `git ls-tree`, `git log --name-status` to plan changes.
- Restricting scope of bulk ops
  - Filtered paths (e.g., exclude `.github/workflows/**`, `scrum.pmo/project.journal/**`, templates, QA logs) for partial merges.
- Idempotent, low-risk edits
  - Insert first-line backlinks only when missing; no destructive replacements.
- Staged-and-reviewable steps
  - `git checkout <branch> -- <files>` to import, then `git add` + `git commit` with clear messages.
- Avoid brittle shell modes in shared sessions
  - Refrained from `set -euo pipefail` in interactive shells; used plain, concatenated commands.
- Dry-run equivalents
  - Listing files to change and head/tail previews before `git checkout`/`git add`.

Recommended guardrails going forward:
- Wrap “dangerous” helpers in scripts under `tools/` with dry-run flags and protected-path defaults.
- Provide `make plan-merge` and `make apply-merge PLAN=<file>` to separate computation from execution.
- Add CI job to reject PRs that attempt deletions under protected paths.

## 8. Recovery Process and Experiences

What worked well:
- Recover-from-README default gave a reliable starting point; no guesswork.
- Immediate journal creation (`project.state.md`) with explicit branch links made later recovery trivial.
- Backlink/cross-link hygiene after each batch prevented navigation rot.
- Partial merge strategy (A/M only, protected-path filter) enabled progress without regressions.

What broke and how we fixed it:
- Missing journals on some branches → restored from source branches; enriched Branch section with remote links for reproducibility.
- Feature branch deletions of workflows/journals → avoided importing deletions; proposed CI protections.
- Link drift post-merge → added pre-commit spellcheck + cross-ref checks to role processes; ran automated backlink insertion.

Quick recovery checklist (applied):
- Read README Optimized Recovery; verify env/tools.
- Scan `scrum.pmo/` and `qa-feedback-log.md`; aggregate gaps.
- Ensure `scrum.pmo/project.journal/<date>/project.state.md` exists with:
  - Explicit branch link(s)
  - Cross-linked artifacts (files/PRs)
- Enforce first-line backlinks in changed markdown.
- Prefer non-interactive test modes; record status in journal.

Improvements to bake in:
- CI: protected-path deletions blocked; backlinks/link checks required.
- Templates: journal `project.state.md` with Branch link placeholder; role process pre-commit checks required.


## 6.1 Tree snapshots for “crazy” situations (diagnostics)

When the repo gets into surprising states, capture a focused tree snapshot that matches the suspected context. These examples helped triage real-world issues:

- New version introduced but v1 and v2 mixed
  ```bash
  # Show only top-level versions and expected sub-trees
  tree -a -L 2 -I 'node_modules|.git' \
    | sed -n '/^\./,/^$/p'
  ```
  Expected (no cross-pollination):
  ```text
  Web4Articles/
    src/
    src.v2/
    test/
    test.v2/
  ```

- v2 references v1 units (illegal cross-version import)
  ```bash
  # Find any imports that jump out of v2 into src/
  grep -R "from '../../..*/src/ts" src.v2/ts || true
  # Confirm structure around offenders
  tree -a -L 3 src.v2/ts
  ```

- Missing first-line backlinks after mass edit
  ```bash
  git ls-files '*.md' \
    | xargs -I{} sh -c 'head -n1 "{}" | grep -q "^\[" || echo MISSING:{}'
  ```

- Journal directory missing project.state.md
  ```bash
  # Any journal folder without a project.state.md
  for d in scrum.pmo/project.journal/*; do [ -d "$d" ] || continue; \
    [ -f "$d/project.state.md" ] || echo "MISSING:$d"; done
  ```

- Feature branch deletes protected assets (workflows/journals)
  ```bash
  git diff --name-status release/dev..origin/feature/analyze-ranger \
    | egrep '^(D\s+)\.(github/workflows/|scrum\.pmo/project\.journal/|scrum\.pmo/templates/|qa-feedback-log\.md)'
  ```

- Link hygiene in a subtree (docs or scrum.pmo)
  ```bash
  git ls-files 'docs/**/*.md' 'scrum.pmo/**/*.md' \
    | xargs -I{} sh -c 'head -n1 "{}" | grep -q "^\[" || echo NO-BACKLINK:{}'
  ```

- Version scoping sanity (no shared units)
  ```bash
  # Units must live only once per version scope
  comm -12 \
    <(git ls-files 'src/**/*.ts' | sed 's#.*/##' | sort -u) \
    <(git ls-files 'src.v2/**/*.ts' | sed 's#.*/##' | sort -u) \
    | sed 's/^/DUPLICATE-UNIT-NAMES:/'
  ```

## 9. Case Study — Finding and Merging OntologyAgent Role (end-to-end)

This captures the exact, reproducible sequence used to locate, verify, and merge the missing `OntologyAgent` role into `release/dev` without conflicts.

### 9.1 Detect where the role exists and why it’s missing

```bash
# Always start fresh
git fetch --all

# Confirm the commit exists and which branch contains it
git cat-file -t 1f68fde42078fbdec30ccc57ce1aa295f693e037   # expect: commit
git branch -r --contains 1f68fde42078fbdec30ccc57ce1aa295f693e037

# Inspect the commit header and files it added
git show --no-patch --pretty=fuller 1f68fde42078fbdec30ccc57ce1aa295f693e037 | sed -n '1,20p'
git show --name-status --oneline 1f68fde42078fbdec30ccc57ce1aa295f693e037 | tail -n +2

# Prove it was never merged into release/dev
git branch -r --merged origin/release/dev | grep origin/feature/ontology-agent || echo "NOT MERGED"

# Optional: show history of the role file on the feature branch
git log --pretty=oneline --name-status origin/feature/ontology-agent -- \
  scrum.pmo/roles/OntologyAgent/process.md | head -n 20
```

Expected files added by the commit:

- `scrum.pmo/roles/OntologyAgent/process.md`
- `scrum.pmo/roles/OntologyAgent/quick-reference.md`
- `scrum.pmo/roles/OntologyAgent/templates/{README.md, ambiguity-resolution.md, cmm-level4-integration.md, index-update-template.md, ontology-assessment.md}`

### 9.2 Safe import into release/dev (add-only, no deletions)

```bash
# Ensure we are on release/dev
git checkout release/dev
git pull --ff-only origin release/dev

# Import the role folder as a non-conflicting addition
git checkout origin/feature/ontology-agent -- scrum.pmo/roles/OntologyAgent

# Stage and commit clearly
git add scrum.pmo/roles/OntologyAgent
git commit -m "docs(roles): import OntologyAgent role from feature/ontology-agent (commit 1f68fde)"
git push origin release/dev
```

### 9.3 Verify presence with tree and cross-checks

```bash
# Directory structure overview (requires `tree`; if missing, use find)
tree -a scrum.pmo/roles/OntologyAgent || find scrum.pmo/roles/OntologyAgent -type f | sort

# Show the files tracked on the current branch
git ls-tree -r --name-only HEAD | grep '^scrum\.pmo/roles/OntologyAgent/' | sort

# Sanity: render short preview of the process doc
sed -n '1,40p' scrum.pmo/roles/OntologyAgent/process.md
```

### 9.4 Journal and status updates (for recoverability)

- Link the imported role in the journal and status pages:
  - [`OntologyAgent/process.md`](../../roles/OntologyAgent/process.md)
- Ensure `branch-overview.md` (generated per journal) lists unresolved PRs into `release/dev` as tasks:
  - `- [ ] [#123 Title](https://github.com/Cerulean-Circle-GmbH/Web4Articles/pull/123)` when action is required
  - `- [x] No open PRs targeting release/dev` when clean

### 9.5 Prevention guardrails configured

- CI now fails on feature→dev auto-merge errors and auto-opens a PR to `release/dev` on failure.
- Role-path changes under `scrum.pmo/roles/**` automatically open a PR to `release/dev`.
