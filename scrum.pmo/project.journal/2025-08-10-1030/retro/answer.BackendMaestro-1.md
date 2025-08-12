<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Journal Entry](../)

# Retrospective — BackendMaestro-1

- [x] Read by QA
- [ ] implemented all measures

## 1. Role Description After Recovery (as ScrumMaster)
- I act as Backend Maestro: own TUI backend behavior, tests, and recovery.
- [Detailed](./answer.BackendMaestro-1.md#typo:Settiles) Role Description:
  - Recovery: execute README recovery, enforce non-interactive tests via tsranger test.
  - TUI: prompt editing (cursor, backspace), Tab/Right policies, filter sync.
  - Testing: add scripted cases, avoid hangs.

## 2. Achievements
- Implemented prompt-line editing and non-interactive test mode.
- Added tests in test/tsranger.promptline.behavior.test.ts; fixed regressions.
- Updated QA feedback in scrum.pmo/sprints/sprint-2/task-7.md.

## 3. Recurring Problems
- Interactive hangs; fixed by TSRANGER_TEST_MODE.
- Right/Tab ambiguity; clarified policies.
- Method sync after navigation pending refinement.

## 4. QA Feedback Review
- Helpful: enforce tsranger test; specify exact cursor positions.
- Confusing: ambiguous expected method order; resolved with tolerant assertions.

## 5. Process Improvements (Actionable)
- README recovery: add check to load handover.backend.agent.md when present and start backend agent.
- Test determinism: always set PS1 and columns/lines.
- Branching: dedicate retro/* and handover/* flows.

## 6. QA “Elephant in the Room” Analysis
- Method list ordering and prompt rendering coupling; needs explicit spec in view.

## 7. Detailed Struggle Examples (tree-style)

```text
$ tree -L 2 -I 'node_modules|dist' src/ts/layer4 src/ts/layer5 test src/sh
src/sh
├── tsranger                 # test entrypoint uses non-interactive mode
└── tssh                     
src/ts/layer4
├── Completion.ts
├── RangerController.ts      # input handling, prompt buffer, filters
├── TSCompletion.ts          # completion provider glue
└── TSRanger.ts              # app wiring, run() entry
src/ts/layer5
└── RangerView.ts            # prompt/grid rendering
test
├── tsranger.promptline.behavior.test.ts
└── tsranger.cursor.test.ts
```

- Right/Tab inconsistent completion state
  - Symptom: `t[tab]` vs `t[right]` produced different visual states (`T[S[sh` vs `TSsh [s]tart`).
  - Files involved: `src/ts/layer4/RangerController.ts`, `src/ts/layer5/RangerView.ts`.
  - Fix: unify Tab/Right branches to one completion path; move cursor to start of suggested method; ensure view renders `[s]tart` correctly.

- Backspace merged tokens and desynced filters
  - Symptom: backspacing over space joined class and method; filters not updated.
  - Files involved: `RangerController.ts` (backspace logic), `RangerModel` token/filters, `RangerView.ts` prompt rendering.
  - Fix: guard for space-before-cursor → delete at-cursor to keep token boundary; re-derive filters; never auto-apply method filter when `suppressMethodFilter` is true.

- `g[tab][down]` did not sync selected method into command line
  - Symptom: grid moved, prompt stayed on `start` or only first letter changed; two downs failed.
  - Files involved: `RangerController.ts` (Up/Down handlers), `RangerView.ts` (full token rendering).
  - Fix: on Up/Down in Methods column, write `selectedMethod` into prompt buffer and place cursor at method start; keep `suppressMethodFilter=true` while navigating.

- Non-interactive tests hanging
  - Symptom: `vitest` sessions waited for TTY input.
  - Files involved: `src/sh/tsranger` (test entry), `TSRanger.ts` (`run()` early test-mode path), `test/tsranger.*.test.ts`.
  - Fix: enforce `tsranger test "<keys>"`; add `TSRANGER_TEST_MODE`/`TSRANGER_TEST_INPUT` fast path that bypasses TTY setup.

- Accidental completion to `Logger` on Right from empty prompt
  - Symptom: `[right]` navigated and completed to `Logger` instead of just moving column.
  - Files involved: `RangerController.ts`.
  - Fix: when current token is empty, treat Tab/Right as column navigation (`changeColumn(1)`) and avoid completion.

## 8. What the layer folders meant (my mental model)

- layer1 — Foundations and OS bridges
  - Purpose: low-level utilities and shell/OS glue used everywhere.
  - Examples: `src/ts/layer1/Logger.ts`, `OOSH.ts`, `ParameterParser.ts`, `TSsh.ts`.

- layer2 — State and core models (app domain wiring)
  - Purpose: app state containers and defaults; data that controllers mutate and views render.
  - Examples: `RangerModel.ts`, `DefaultCLI.ts`, `GitScrumProject.ts`.

- layer3 — High-level composition (CLI surface)
  - Purpose: cohesive CLI API surface and completion/project coordination without raw input handling.
  - Examples: `CLI.ts`, `Completion.ts`, `Project.ts`.

- layer4 — Controllers and orchestration
  - Purpose: translate key events into state transitions; run loops; boundary with completion provider.
  - Examples: `RangerController.ts`, `TSCompletion.ts`, `TSRanger.ts`.
  - In practice: where prompt buffer, cursor index, filters, and column navigation live.

- layer5 — Views
  - Purpose: render terminal UI from model state; no business logic.
  - Example: `RangerView.ts` builds prompt string and grid and positions cursor.

- Flow I used (happy path)
  1. `TSRanger.run()` (layer4) decides test-vs-interactive; feeds scripted keys.
  2. Keys → `RangerController` (layer4) mutate `RangerModel` (layer2).
  3. `RangerView` (layer5) renders prompt/grid from `RangerModel`.
  4. `TSCompletion` (layer4) provides candidates; `RangerController` applies them.

## 9. Perspective on the test chain mismatch (tssh → TSRanger → RangerController → RangerView)

- Your point is valid: several of my fixes initially targeted code paths that the tests never executed. The real chain during `tsranger test "<keys>"` is:
  - `src/sh/tsranger` → spawns Node entry with test mode env
  - `src/ts/layer4/TSRanger.ts` → `run()` fast-path for test mode
  - `src/ts/layer4/RangerController.ts` → handles scripted key events and updates `RangerModel`
  - `src/ts/layer5/RangerView.ts` → renders prompt and grid to stdout (what tests assert)

- Where I went wrong at times
  - Adjusted `TSCompletion` and unrelated completion heuristics when tests asserted only prompt rendering; completion wasn’t consulted for those specific scripted paths.
  - Tweaked low-level helpers (e.g., layer1) not on the execution path for test mode.
  - Modified view styling expecting behavior changes, while behavior lived in `RangerController`.

- Concrete example symptoms vs. effective fix locus
  - Symptom: `g[tab][down]` prompt not syncing to selected method.
    - Ineffective: changing list ordering in completion provider.
    - Effective: updating `RangerController` Up/Down handlers to write `selectedMethod` into `promptBuffer` and set `promptCursorIndex` accordingly; keeping `suppressMethodFilter` true while navigating; ensuring `RangerView` reads the full token.
  - Symptom: `t[tab]` vs `t[right]` differing visuals.
    - Ineffective: adjusting ANSI styling in view only.
    - Effective: unifying Tab/Right logic in `RangerController` and then letting the view reflect `[s]tart` with correct cursor.

- My takeaways to prevent this
  - Codify the test entry contract: a short doc and a guard test proving `tsranger test` hits `TSRanger.run` test-path, not the interactive path.
  - Trace the active code path in tests: optional `TRACE_EXEC_PATH=1` env to print a one-line breadcrumb (`tsranger→TSRanger.run(test)→RangerController→RangerView`).
  - Add coverage focus: ensure statements in `RangerController` branches for Tab/Right/Backspace/Up/Down are covered by the scripted suite.
  - Prefer minimal, targeted edits to files proven (by trace/coverage) to be executed by the failing test.
  - Use “contract tests” for `RangerView` output with explicit cursor markers so behavior vs. styling don’t get conflated.


