[Back to Sprints](../sprints.overview.md)

# Sprint 11 — TypeScript Tooling for Reliable Recovery and CI

## Goal

Design and plan a suite of small, semantically optimized TypeScript tools (strict ESM, radical OOP) that replace brittle shell one-liners in recovery, journaling, and CI flows. Tools should integrate with `TSRanger` and `TSsh` orchestration.

## Reading list (required context)

- Recovery process: [`scrum.pmo/roles/ScrumMaster/recovery-process.md`](../roles/ScrumMaster/recovery-process.md)
- Retro instructions and answers:  
  - [`scrum.pmo/project.journal/2025-08-10-1030/retro/01.retro-instructions.what.md`](../project.journal/2025-08-10-1030/retro/01.retro-instructions.what.md)  
  - [`answer.ReleaseIntegrator-1.md`](../project.journal/2025-08-10-1030/retro/answer.ReleaseIntegrator-1.md)  
  - [`answer.agent-SprintRanger-01.md`](../project.journal/2025-08-10-1030/retro/answer.agent-SprintRanger-01.md)  
  - [`answer.agent-SprintRanger-02.md`](../project.journal/2025-08-10-1030/retro/answer.agent-SprintRanger-02.md)  
  - [`answer.OntologyWeaver.md`](../project.journal/2025-08-10-1030/retro/answer.OntologyWeaver.md)  
  - [`answer.ResearchArchitect.md`](../project.journal/2025-08-10-1030/retro/answer.ResearchArchitect.md)
- CI guardrails:  
  - `.github/workflows/feature-to-dev.yml`  
  - `.github/workflows/roles-auto-pr.yml`  
  - `.github/workflows/eod-merge.yml`  
  - `.github/workflows/quality-checks.yml`

## Requirements (use cases)

- PR listing to release/dev as MD task list  
  - Input: base branch (default `release/dev`)  
  - Output: `- [ ] [#123 Title](url) from `feature/x` by @user` or `- [x] No open PRs...`
- Journal generator  
  - Inputs: timestamp, env snapshot, status fields  
  - Output: `project.state.md` rendered from template (strict placeholders), backlinks intact
- Branch overview renderer  
  - Inputs: timestamp, PR list file, merged/unmerged branch sets  
  - Output: `branch-overview.md` including unresolved PRs section
- Protected-path diff scanner  
  - Input: base..head range  
  - Output: report on deletes under `.github/workflows/**`, `scrum.pmo/project.journal/**`, templates, QA logs
- Backlink/cross-link validator  
  - Input: file set  
  - Output: warnings/errors; autofix mode adds backlink when missing
- Role importer  
  - Inputs: source branch, role path (e.g., `scrum.pmo/roles/OntologyAgent`)  
  - Output: safe import (A/M only) commit plan; optional apply
- Versioned-units guard  
  - Input: repo tree  
  - Output: duplicates across `src/` and `src.v2*/` names; suggests moves
- Test runner wrapper  
  - Input: sequence (non-interactive)  
  - Output: summarized status for journal injection

## Non-functional

- Strict ESM TypeScript; no functions outside classes; layered architecture  
- Deterministic CLI contracts; JSON/MD outputs  
- CI-friendly, non-interactive; idempotent  
- Unit tests with Vitest; fixtures for edge cases  
- Documentation with examples and backlinks

## Acceptance criteria

- Tools run locally and in CI  
- Reproduce journal + branch overview without shell one-liners  
- Detect and fail on protected-path deletions  
- Backlink validator passes on repo after autofix

