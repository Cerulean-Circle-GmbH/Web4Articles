# Agent Retro — SprintRanger-01

## Repository origin
- Web4Articles on GitHub

## Branch and scope
- Retro branch: `retro/2025-08-10-agent-retro`
- Working sprint: Sprint 7 (v2.5 of TS Ranger)

## What went well
- v2 architecture implemented in `src.v2` with clear IO/Model/View/Controller boundaries.
- Toggle `TSRANGER_V2=1` integrated; tests run non-interactively; majority green.
- PDCA loop documented and enforced (commit and push each run; mitigations applied in Act).

## What didn’t go well / issues encountered
- Initial spec-only phrasing caused scope confusion; corrected to include implementation and testing.
- Prompt-line g[tab] flows required multiple adjustments (method sync and header filter) to match tests.
- Docs snippet expectation required aligning content and deterministic frame handling.

## What we learned
- Separate IO from rendering for determinism (`TerminalIO` with `DeterministicTestIO`).
- Keep class/method filters stable across prompt recompute; avoid unnecessary resets.
- Mirror QA/PDCA logs into sprint-local files to maintain clear traceability.

## Action items
- Finalize KeyboardController abstraction and integrate to simplify key handling.
- Keep PDCA entries per sprint under `scrum.pmo/sprints/sprint-7/qa.md`.
- Ensure tests assert against final frames only when appropriate (`TS_RANGER_TEST_FINAL_ONLY=1`).

## Evidence and links
- v2 sources: `src.v2/ts/**` (IO/Model/View/Controller/TSRanger)
- Toggle wrapper: `src/sh/tsranger`
- Sprint 7 planning and tasks: `scrum.pmo/sprints/sprint-7/`
- PDCA logs: `/scrum.pmo/sprints/sprint-7/qa.md`
- Background agent policy: `/background.agent.md`

## Notes
- If another agent file exists, increment the agent role number accordingly to keep uniqueness.