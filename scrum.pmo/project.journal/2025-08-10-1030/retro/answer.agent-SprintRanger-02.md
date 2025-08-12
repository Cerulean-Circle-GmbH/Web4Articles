# Agent Retro — SprintRanger-02

[Back to Retro Instructions](./01.retro-instructions.what.md)

## Repository origin
- Web4Articles on GitHub

## Branch and scope
- Retro branch: `retro/2025-08-10-agent-retro`
- Working sprint: Sprint 5 (TS Ranger v2, column-based refactor tasks added)

## What went well
- v2 implementation under `src.v2` with clean MVC and IO abstraction (`TerminalIO`), enabling deterministic tests.
- PDCA loop with immediate mitigations and commit/push after each run improved visibility and velocity.
- Prompt-line behaviors (tab/right/cursor/edit) reached parity with tests.

## What didn’t go well / issues encountered
- Early ambiguity (spec-only vs. implement) slowed kick-off; we corrected the sprint intent.
- g[tab] method sync/filter behavior required multiple refinements to match nuanced UX.
- Retro instructions file was not present in this retro directory; we proceeded with inferred sections and evidence.

## What we learned
- Separate IO from rendering; stabilize test frames (final-only) to avoid flaky assertions.
- Maintain sprint-local QA/PDCA logs for traceability and quick diagnosis.
- Column-based design will simplify controller logic and make navigation/filtering consistent.

## Action items
- Architect: Column/Filter interfaces with PUML + SVG diagrams (Task 7.1).
- Developer: Implement `RangerColumn`, `RangerFilter`, and concrete columns (Task 7.2).
- Tester: Add column navigation/filter tests (Task 7.3).
- Finalize `KeyboardController` abstraction and integration.

## Evidence and links
- v2 sources: `src.v2/ts/**`
- Toggle wrapper: `src/sh/tsranger` (uses `TSRANGER_V2=1`)
- Sprint 5 planning: `scrum.pmo/sprints/sprint-5/planning.md`
- Column refactor tasks: `scrum.pmo/sprints/sprint-5/task-7*.md`
- PDCA: `scrum.pmo/sprints/sprint-5/qa.md` and `/workspace/qa.md`
- Background agent policy: `background.agent.md`

## Notes
- This is a second agent entry to preserve the original `answer.agent-SprintRanger-01.md`.