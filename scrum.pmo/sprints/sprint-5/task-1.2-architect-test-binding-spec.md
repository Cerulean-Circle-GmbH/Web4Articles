[Back to Planning Sprint 5](./planning.md)

# Task 1.2 — Architect: Test-Binding Spec to Reuse Existing Tests

## Status
- Planned

## Traceability
- Up: [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3], [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Description
Define how the current tests under `test/tsranger.*.test.ts` invoke v2 without changing test files, including the non-interactive mode contract and environment variables.

## Binding Requirements
- `src/sh/tsranger test "<keys>"` must execute v2 when an environment switch is set (e.g., `TSRANGER_V2=1`) while preserving the same CLI syntax used by tests.
- `TSRANGER_TEST_MODE=1`, `TSRANGER_TEST_INPUT`, and `TS_RANGER_TEST_FINAL_ONLY=1` are honored identically.
- Terminal width/height are controllable for tests; IO abstraction provides fixed dimensions and frame capture.
- ANSI usage: tests expect colors in prompt/footer but assertions read textual layout; ensure deterministic output.

## Acceptance Criteria
- A clear routing proposal that requires only setting an environment variable in CI/local to run v2 against existing tests.
- A mapping table of each test file to the v2 components they validate (see Task 3.1).

## Specification

### Invocation Contract
- Tests call: `src/sh/tsranger test "<keys>"` with env:
  - `TSRANGER_TEST_MODE=1`
  - `TSRANGER_TEST_INPUT="<keys>"`
  - `TS_RANGER_TEST_FINAL_ONLY=1`
  - `PS1='\\u@\\h \\w$'`

### Version Toggle
- Add environment switch `TSRANGER_V2=1` to route the shell wrapper or the TS entry to `src.v2/ts/layer4/TSRanger.ts`.
- CLI syntax remains unchanged; no positional args added.

### IO Determinism
- Respect fixed terminal size via one of:
  - Env: `TSRANGER_TEST_COLUMNS`/`TSRANGER_TEST_ROWS` consumed by `DeterministicTestIO`.
  - Or use `COLUMNS`/`LINES` if already provided.
- Capture only the final frame when `TS_RANGER_TEST_FINAL_ONLY=1`.

### ANSI and Output Stability
- Keep ANSI for prompt/footer colors; tests primarily strip or pattern-match.
- Ensure grid + prompt spacing is stable independent of OS.

### Acceptance Evidence
- Show a matrix linking test files to expected states (see Task 3.1). No edits to `test/*.ts` are required; only set `TSRANGER_V2=1` in CI/local to validate v2.