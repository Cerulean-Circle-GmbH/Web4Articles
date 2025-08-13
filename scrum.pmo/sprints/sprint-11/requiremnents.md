[Back to Sprints](../sprints.overview.md)

# Sprint 11 — TypeScript Tooling for Reliable Recovery and CI

## Goal

Design and plan a suite of small, semantically optimized TypeScript tools (strict ESM, radical OOP) that replace brittle shell one-liners in recovery, journaling, and CI flows. Tools should integrate with `TSRanger` and `TSsh` orchestration.

## Task List

- [ ] TS PR Reporter: list open PRs to `release/dev` as MD tasks with links and authors
- [ ] Journal Generator: render `project.state.md` from template with variables; ensure backlinks
- [ ] Branch Overview Renderer: render `branch-overview.md` including unresolved PRs section
- [ ] Protected-Path Diff Scanner: detect deletions under protected paths and fail/report
- [ ] Backlink/Cross-link Validator: verify backlinks and internal links; autofix backlink
- [ ] Role Importer: import `scrum.pmo/roles/<RoleName>` from source branch safely (A/M only)
- [ ] Versioned-Units Guard: detect shared unit names across `src/` and `src.v2*` versions
- [ ] Test Runner Wrapper: run non-interactive sequences; summarize for journal
- [ ] Integrate tools with CI: replace inline shell in workflows with tools
- [ ] Update recovery-process.md to call tools (no shell one-liners)
- [ ] Read all retro answers and reflect lessons in tool UX (determinism, DRY, links)
- [ ] Align with Sprint 2/5/6/7 lessons: UX parity, zero test changes, versioning discipline, v2.5 structure

### Acceptance tests (PO-ready)

- [ ] PR Reporter outputs at least one PR task when a dummy test PR is open to `release/dev`; otherwise prints the “No open PRs” checked item
- [ ] Journal Generator correctly replaces all placeholders and preserves first-line backlinks
- [ ] Branch Overview Renderer injects the PR list block and keeps other sections intact
- [ ] Protected-Path Diff Scanner flags a synthetic deletion under `scrum.pmo/project.journal/**` and exits non-zero
- [ ] Backlink Validator reports a missing backlink on a synthetic markdown file and autofixes it when `--fix` is provided
- [ ] Role Importer dry-run shows an A/M-only plan; apply mode commits files without deleting any existing content on target
- [ ] Versioned-Units Guard reports duplicates across `src/` and `src.v2*/` when a synthetic duplicate is added
- [ ] Test Runner Wrapper runs a short non-interactive sequence and produces a JSON/MD summary compatible with journal injection

## Details

### Reading list (required context)

- Recovery process: [`scrum.pmo/roles/ScrumMaster/recovery-process.md`](../../roles/ScrumMaster/recovery-process.md)
- Retro instructions and answers:  
  - [`scrum.pmo/project.journal/2025-08-10-1030/retro/01.retro-instructions.what.md`](../../project.journal/2025-08-10-1030/retro/01.retro-instructions.what.md)  
  - [`answer.ReleaseIntegrator-1.md`](../../project.journal/2025-08-10-1030/retro/answer.ReleaseIntegrator-1.md)  
  - [`answer.agent-SprintRanger-01.md`](../../project.journal/2025-08-10-1030/retro/answer.agent-SprintRanger-01.md)  
  - [`answer.agent-SprintRanger-02.md`](../../project.journal/2025-08-10-1030/retro/answer.agent-SprintRanger-02.md)  
  - [`answer.OntologyWeaver.md`](../../project.journal/2025-08-10-1030/retro/answer.OntologyWeaver.md)  
  - [`answer.ResearchArchitect.md`](../../project.journal/2025-08-10-1030/retro/answer.ResearchArchitect.md)  
  - [`answer.PromptlineConductor.md`](../../project.journal/2025-08-10-1030/retro/answer.PromptlineConductor.md)  
  - [`answer.BackendMaestro-1.md`](../../project.journal/2025-08-10-1030/retro/answer.BackendMaestro-1.md)  
  - [`answer.DevContainer-Cartographer-1.md`](../../project.journal/2025-08-10-1030/retro/answer.DevContainer-Cartographer-1.md)  
  - [`answer.DevcontainerCartographer.md`](../../project.journal/2025-08-10-1030/retro/answer.DevcontainerCartographer.md)  
  - [`answer.TSRanger-Developer.md`](../../project.journal/2025-08-10-1030/retro/answer.TSRanger-Developer.md)  
  - [`answer.gpt-5.md`](../../project.journal/2025-08-10-1030/retro/answer.gpt-5.md)  
  - [`answer.retro-agent.md`](../../project.journal/2025-08-10-1030/retro/answer.retro-agent.md)
- CI guardrails:  
  - `.github/workflows/feature-to-dev.yml`  
  - `.github/workflows/roles-auto-pr.yml`  
  - `.github/workflows/eod-merge.yml`  
  - `.github/workflows/quality-checks.yml`

### Requirements (use cases)

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

### Non-functional

- Strict ESM TypeScript; no functions outside classes; layered architecture  
- Deterministic CLI contracts; JSON/MD outputs  
- CI-friendly, non-interactive; idempotent  
- Unit tests with Vitest; fixtures for edge cases  
- Documentation with examples and backlinks

### Acceptance criteria

- Tools run locally and in CI  
- Reproduce journal + branch overview without shell one-liners  
- Detect and fail on protected-path deletions  
- Backlink validator passes on repo after autofix

## QA Action Request

### original QA Prompt

you just again experienced a fiddeling shell syntax error. update scrum.pmo/project.journal/2025-08-10-1030/retro/answer.ReleaseIntegrator-1.md with this experience with detailed examples and argue why it will make sense to create TS tooling like GitScrumProject used by TSRanger and TSsh with lots of small semantically optimized usecases fro your complex job. create and plan a sprint 11 where you plan these tools. add a requirement.md in the sprint 11 first with all the usecases you already experienced or can imagine. then use the PO planning process to plan such a sprint. read all retro answers at first to see how this sprint 11 has to be much better than sprint 2 and 5 implementing versioning correcly like in sprint 6 and 7. add all these requirements at first and create in the requirements a well md linked reading list so that you can step by step work of this complex prompt of mine. finally also create scrum.pmo/sprints/sprints.overview.md for easy navigation.

### Shell fiddling error experience
> you just again experienced a fiddeling shell syntax error.

### Update retro answer with detailed examples
> update scrum.pmo/project.journal/2025-08-10-1030/retro/answer.ReleaseIntegrator-1.md with this experience with detailed examples

### Argue for TS tooling and GitScrumProject usage
> and argue why it will make sense to create TS tooling like GitScrumProject used by TSRanger and TSsh with lots of small semantically optimized usecases fro your complex job.

### Create and plan Sprint 11
> create and plan a sprint 11 where you plan these tools.

### Add requirements first with all use cases
> add a requirement.md in the sprint 11 first with all the usecases you already experienced or can imagine.

### Use PO planning process for the sprint
> then use the PO planning process to plan such a sprint.

### Read all retro answers and improve over prior sprints
> read all retro answers at first to see how this sprint 11 has to be much better than sprint 2 and 5 implementing versioning correcly like in sprint 6 and 7.

### Add a well-linked reading list
> add all these requirements at first and create in the requirements a well md linked reading list so that you can step by step work of this complex prompt of mine.

### Create sprints overview for navigation
> finally also create scrum.pmo/sprints/sprints.overview.md for easy navigation.

