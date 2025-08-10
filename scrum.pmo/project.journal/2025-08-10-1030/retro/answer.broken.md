[Back to Journal Entry](../)

# Project Retrospective — GPT-5

## 1. Role Description After Recovery (as ScrumMaster)
### [Detailed](Settiles) Role Description
- Ensure recovery from `README.md` is executed cleanly (strict TS, ESM, Radical OOP, no Jest).
- Maintain SCRUM cadence and enforce PO cross-reference checklist in `scrum.pmo/roles/PO/process.md`.
- Orchestrate Sprint 2 delivery (TSRanger): prompt model, docs column, footer/prompt spacing/colors, tab behavior, cursor rendering.

## 2. Achievements
- Implemented TSRanger MVC wiring: `src/ts/layer4/TSRanger.ts`, `RangerModel`, `RangerView`, `RangerController`.
- Prompt-line editing model and cursor: `RangerController.ts`, `RangerView.ts`.
- Footer anchoring and prompt spacing/colors: `RangerView.ts`.
- Docs column from JSDoc via `TSCompletion`: `src/ts/layer4/TSCompletion.ts`; tests in `test/tsranger.docs.test.ts`.
- Behavior tests: `test/tsranger.promptline.behavior.test.ts`, `test/tsranger.tab.test.ts`, `test/tsranger.cursor.test.ts`, `test/tsranger.prompt.test.ts`.
- Commits: `0701eb9`, `ee305e7`, `590185c`.

## 3. Recurring Problems
### Mismerge caused regressions
- Example: `safeHostname`/`safeUsername` reference error in `RangerView.ts`.
- Root cause: accepting wrong side of merge.
- Fix: re-read files, re-apply edits, add tests guarding prompt rendering.

### Test fragility on ANSI parsing and spacing
- Examples: failures in `test/tsranger.prompt.test.ts` for blank-line and color detection.
- Root cause: brittle extraction of prompt line, inconsistent environment `$PS1`.
- Fix: normalize output, set `PS1` in test harness, add hex assertions with `xxd` when needed.

### Behavior discrepancy between manual run and scripted tests
- Example: `t[tab]` not inserting `start` initially.
- Root cause: controller path not applied before; stale branch.
- Fix: finalize controller behavior; add `test/tsranger.promptline.behavior.test.ts` covering `t`, `t[right]`, `t[tab]`.

## 4. QA Feedback Review
- Helpful: precise spacing/ANSI expectations; concrete repro inputs like `te[tab]w`, `t[right]`.
- Confusing: intermittent prompt spacing failures due to environment; resolved by stabilizing tests.
- Improve: ask QA to include expected final buffer and cursor index.

## 5. Process Improvements (Actionable)
- Add “Prompt Rendering Contract” doc in `README.md` testing section; codify one blank line rule and ANSI requirements.
- Mandate `PS1` normalization for scripted TTY tests.
- Require behavior tests on navigation/completion before release.
- Enforce PO Cross-Reference Checklist on every task update.

## 6. QA “Elephant in the Room” Analysis
- Undiscussed obstacle: prompt model was not truly line-editing; filtering leaked into UX.
- Named obstacle: mismatch between manual runs and tests.
- Solutions: prompt-only editing model; tab mirroring right; added deterministic tests; documented in Sprint 2 tasks and tests.

