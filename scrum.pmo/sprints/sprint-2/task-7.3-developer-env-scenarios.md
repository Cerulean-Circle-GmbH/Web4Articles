[Back to Sprint 2 Planning](./planning.md)

# Task 7.3 — Developer: Scenario-driven ENV configuration
[task:uuid:1a0a6b0d-3d2b-4e1d-9e60-61e8a0a1d0f2]
[subtask:uuid:5c9b1b6a-1b7b-4c0e-8f2b-37d1a8f0f6c3]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Introduce a declarative “scenario” configuration loader that applies a validated set of environment variables and runtime parameters before `TSRanger.run()` proceeds.

## Context
ENV sprawl (`TSRANGER_TEST_MODE`, `COLUMNS`, `LINES`, etc.) risks non-determinism and security drift.

## Intention
Provide reproducible runtime contexts by selecting `TSRANGER_SCENARIO=<name>` and applying an allowlisted environment map from `config/scenarios/<name>.json`.

## Steps
- Add `src/ts/layer1/Scenario.ts` to load and validate scenario JSON against `config/scenarios/schema.json`.
- Wire scenario apply at the very start of `TSRanger.run()` when `TSRANGER_SCENARIO` is set (behind opt-in flag).
- Create `config/scenarios/ci.vitest.json` and `config/scenarios/tui.noninteractive.json`.
- Document usage in `README.md` and reference in sprint-2 tasks.

## Requirements
- JSON Schema validation; reject unknown keys.
- Allowlist-only env application with clear precedence rules.

## Acceptance Criteria
- Running tests with `TSRANGER_SCENARIO=ci.vitest` sets `COLUMNS`, `LINES`, `PS1`, and `TSRANGER_TEST_MODE` deterministically.
- Non-interactive runs consume `TSRANGER_TEST_INPUT` from `tui.noninteractive` when provided.
- Docs updated and linked.

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
