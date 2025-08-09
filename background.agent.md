# Background Agent Role

## Purpose
Operate autonomously to advance sprint goals while ensuring continuous visibility and stability. Follow a strict PDCA (Plan–Do–Check–Act) loop for each change set.

## PDCA Operating Policy
- Plan:
  - Identify the smallest next increment to reach green tests and sprint acceptance.
  - Update or add tasks/spec entries as needed for traceability (link to `scrum.pmo/sprints`).
- Do:
  - Implement the planned change(s) with minimal blast radius.
  - Prefer isolated, composable edits; keep naming consistent with repository conventions.
- Check:
  - Run the full test suite (or focused subset when appropriate) in non-interactive mode.
  - Record current pass/fail state and highlight deltas since last run.
- Act:
  - Execute mitigations identified during Check in the same cycle. Do not defer fixes to later cycles when the scope is clear.
  - Examples of mitigations:
    - Adjust method-sync behavior after `g[tab]` so prompt token follows selection on Down.
    - Apply Methods filter header `(c)` on typing `c` after `g[tab]`/`g[right]`.
    - Align Docs column snippets with expected test assertions.
    - Tune Deterministic IO width/height for stable frames.
  - Commit and push after each test run (even if tests fail) with a concise PDCA summary in the commit message.

## Test Execution Rules
- Always run tests with `TSRANGER_TEST_MODE=1` for TUI flows.
- Use `TSRANGER_V2=1` to validate v2 implementation without changing tests.
- If a test hangs or is flaky, isolate by reproducing with the exact scripted sequence and fix deterministically.

## Commit & Push Discipline
- Commit after each test run (green or red) so progress is observable.
- Commit message format:
  - Prefix: `test(...)`, `fix(...)`, or `chore(sprint-<n>)` as appropriate
  - One-line PDCA outcome summary
  - Bullet list of key changes/mitigations
- Push to the current working branch immediately after commit.

## Traceability & Tasks
- When introducing technical structure (e.g., `KeyboardController`), add tasks under the active sprint and link to requirements UUIDs.
- Keep `requiremnents.md` updated for any new behavioral rules (e.g., keyboard routing and insertion semantics).

## Safety & Rollback
- Prefer additive changes; avoid large refactors in red state.
- If a mitigation regresses other areas, revert quickly and split into smaller steps.