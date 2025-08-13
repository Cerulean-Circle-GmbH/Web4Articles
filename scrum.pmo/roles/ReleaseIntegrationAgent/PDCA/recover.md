# Recovery Handover — ReleaseIntegrationAgent

Purpose: handover everything needed to restart recovery cleanly, with lessons learned and exact next steps.

Context snapshot (2025-08-13 UTC):
- Working branch: `release/dev`
- Latest journal created: `scrum.pmo/project.journal/2025-08-13-1102/{project.state.md, branch-overview.md}` (BranchStatusAgent format)
- New role: `scrum.pmo/roles/ReleaseIntegrationAgent/` with process and templates
- CI updated: auto-PR for roles changes, hourly roles scan, EOD docs generator, PDCA placeholder check
- Imported: `scrum.pmo/roles/OntologyAgent/{process.md, templates/**, PDCA/**}` into `release/dev`

What I did (high level):
- Recovered from README and created a journal with BranchStatusAgent-style branch overview
- Hardened CI: feature→dev fails fast + auto-PR; roles auto-PR on push; hourly scan for unmerged role changes; PDCA placeholder guard
- Investigated why `origin/feature/ontology-agent` wasn’t merged; imported role files and PDCA cycles safely (add/modify-only)
- Authored ReleaseIntegrationAgent role and multiple PDCA entries; manually corrected template-variable leaks

What broke (precise):
- Shell interruptions: long concatenated commands sometimes returned to prompt mid-run with partial side effects
- Inline Node `-e` one-liners failed under zsh quoting (Unexpected token ')')
- BSD vs GNU `sed` semantics (`-i` flags) caused substitutions to error or silently skip
- `rg` not guaranteed; pipelines failing when unavailable
- PDCA generator script left `${VARS}` placeholders unreplaced

What I learned (actionable):
- Prefer deterministic TS CLIs over shell pipelines for non-trivial logic (rendering/HTTP/templating)
- Keep commands atomic; avoid multi-step chains with `&&` for stateful operations
- Always generate journals via one, reliable path (BranchStatusAgent tool or TS renderer), not ad‑hoc sed
- Guard with CI: fail on placeholder tokens; fail on protected-path deletions; open PRs automatically for roles

Next recovery — do this exactly:
1) Ensure clean base
   - `git fetch --all`
   - `git checkout release/dev && git pull --ff-only origin release/dev`
2) Create recovery branch and journal
   - `BR="cursor/recovery-$(date -u +%Y-%m-%d-%H%M)"; git checkout -b "$BR"`
   - `TS=$(date -u +%Y-%m-%d-%H%M); mkdir -p scrum.pmo/project.journal/$TS && cp scrum.pmo/templates/project.state.template.md scrum.pmo/project.journal/$TS/project.state.md`
   - Generate branch overview with BranchStatusAgent’s favorite tool:
     - `bash scrum.pmo/roles/BranchStatusAgent/tools/branch_overview_favorite.sh scrum.pmo/project.journal/$TS/branch-overview.md`
   - Edit placeholders in `project.state.md` by hand if needed; avoid sed loops
   - `git add scrum.pmo/project.journal/$TS && git commit -m "docs(journal): recovery $TS (favorite overview)"`
3) Integrate ontology-agent branch safely (if still pending)
   - Import add/modify-only from `origin/feature/ontology-agent` for `scrum.pmo/roles/OntologyAgent/**`
   - Three-way merge only for `process.md` if present (no deletions accepted without explicit approval)
   - `git commit` with clear message and push
4) Open a PR to `release/dev` if auto-merge fails
   - Use the prefilled PR body template in `scrum.pmo/roles/ReleaseIntegrationAgent/templates/pr-body.release-integration.md`
5) Write a PDCA entry
   - If tooling misbehaves, write it manually like this file; include dual-links in Act
6) Commit and push after each modifying step (never batch many edits)

Outstanding items:
- Curated PR from `origin/feature/ontology-agent` to `release/dev` excluding destructive deletions
- Implement Sprint 11 TS tools (strict ESM, no one-liners):
  - PR Reporter (to release/dev) → replaces curl/jq
  - Journal Generator → template rendering with typed inputs
  - Branch Overview Renderer → JSON→MD; matches BranchStatusAgent output
  - Protected-Path Scanner → block deletions in CI
- Add background‑agent link enrichment for `cursor/*` branches in overviews

Why this agent is terminated now:
- PDCA tooling repeatedly failed (shell interruptions, quoting, missing deps). To preserve integrity, we stop here and restart with a clean recovery using the instructions above. Until TS tools land, author PDCA and minor renders manually, not via brittle chains.

Minimal references to resume quickly:
- Journal (latest): `scrum.pmo/project.journal/2025-08-13-1102/`
- ReleaseIntegrationAgent process: `scrum.pmo/roles/ReleaseIntegrationAgent/process.md`
- BranchStatusAgent tool (favorite overview): `scrum.pmo/roles/BranchStatusAgent/tools/branch_overview_favorite.sh`
- CI guardrails: `.github/workflows/quality-checks.yml` (PDCA placeholders), `feature-to-dev.yml`, `roles-auto-pr.yml`, `roles-pr-scan.yml`, `eod-merge.yml`

CI/CD, DevOps, and Branchflow understanding (current project):
- Branches
  - `main`: production; protected
  - `release/dev`: integration branch; continuous PR target for features and roles
  - `retro/*`, `feature/*`, `cursor/*`: working branches; merged via PR into `release/dev` (or `main` when appropriate)
- Automations added
  - Feature-to-dev auto-merge with PR fallback: `.github/workflows/feature-to-dev.yml`
    - On push to non-main/non-release branches, attempt merge into `release/dev`
    - If push/merge fails (protection/conflicts), auto-open a PR to `release/dev` and add an issue
  - Roles change auto-PR: `.github/workflows/roles-auto-pr.yml`
    - On any change under `scrum.pmo/roles/**` in a feature branch, open/maintain a PR to `release/dev`
  - Hourly roles PR scan: `.github/workflows/roles-pr-scan.yml`
    - Hourly diff against `release/dev`; if `scrum.pmo/roles/**` differs, open a PR to `release/dev`
  - EOD documentation generator: `.github/workflows/eod-merge.yml`
    - Nightly create a journal folder with `project.state.md` and `branch-overview.md` including:
      - Unmerged→main; merged→main; merged→release/dev; unresolved PRs→`release/dev`
  - Quality checks: `.github/workflows/quality-checks.yml`
    - Spell check with typo tracking, cross-link validation, ontology, license, backlinks
    - PDCA placeholder guard: fail if `${...}` remains in `scrum.pmo/roles/**/PDCA/*.md`
- Policy
  - Protected paths: no deletions imported for `.github/workflows/**`, `scrum.pmo/project.journal/**`, `scrum.pmo/templates/**`, `qa-feedback-log.md`
  - Add/modify-only for role imports unless explicitly approved
  - Commit-and-push after each modifying step; PRs for destructive operations

End of handover. Kill this agent. On restart, follow “Next recovery — do this exactly”.
