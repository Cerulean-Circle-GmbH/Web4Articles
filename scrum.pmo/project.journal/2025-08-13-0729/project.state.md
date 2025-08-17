[Back to Project Journal](../) | [Journal Overview](../../project.journal.overview.md)

# Project State — 2025-08-13-0729 UTC UTC

**Status:** Recovery snapshot created

## GitHub Quick Links
- **Repo**: [Cerulean-Circle-GmbH/Web4Articles](https://github.com/Cerulean-Circle-GmbH/Web4Articles)
- **Branches**: [main](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/main) · [release/dev](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/dev) · [release/testing](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/testing) · [release/production](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/production)
- **PRs**: [Open PRs](https://github.com/Cerulean-Circle-GmbH/Web4Articles/pulls) · [All branches](https://github.com/Cerulean-Circle-GmbH/Web4Articles/branches)

## Project status (ScrumMaster)
- **Role**: ScrumMaster (autonomous), coordinating Developers/Testers and enforcing DRY, strict ESM TS, and radical OOP
- **Branch**: [release/dev](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/dev)

## Environment
- Docker: n/a
- Node: v20.4.0; npm 9.7.2
- PlantUML/Graphviz: n/a
- Devcontainer: n/a

## Tests
- Not run in recovery
- Action: Run full suite after merges to verify [main](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/main) and [release/dev](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/dev)

## Branching and CI/CD
- Primary branches: [main](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/main) (prod), [release/production](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/production) (mirror), [release/testing](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/testing), [release/dev](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/release/dev)
- Automation: CI guardrails updated; auto-PR on conflicts and roles changes
- Status:
  - OntologyAgent role imported to release/dev
  - CI updated to auto-PR on failures and roles changes (see [merge report](../../merge-report-sprint-9.md))
- Recommendations:
  - Monitor unresolved PRs via branch-overview.md
  - Run tests with tsranger in non-interactive mode

## Sprints Overview
- Existing: sprint-0 to sprint-7 on [main](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/main) (with links to planning.md)
- Discovered/Merged: sprint-7 from fix/v2.5 (with links to planning.md)
- Missing: n/a
- Created: n/a (with links if created)
- Upcoming: sprint-8 planning TBD

## Recent Activity
- See [handover.backend.agent.md](../../handover.backend.agent.md)
- QA log updates: [qa-feedback-log.md](../../qa-feedback-log.md)
- Recovery log: [recovery.md](../../recovery.md)

## Risks/Blockers
- Merge drift on role docs
- Doc link hygiene regressions

## Next Steps
- Open PR to main after validation
- Run full test suite and update status

[Back to Project Journal](../) | [Journal Overview](../../project.journal.overview.md)