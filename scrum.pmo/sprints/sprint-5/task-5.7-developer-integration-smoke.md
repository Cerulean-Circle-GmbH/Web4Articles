[Back to Planning Sprint 5](./planning.md)

# Task 5.7 — Developer: Non-interactive smoke run validation

## Status
- Planned

## Description
Verify end-to-end flow in non-interactive mode using the wrapper:
- `TSRANGER_V2=1 TSRANGER_TEST_MODE=1 src/sh/tsranger test "g[tab][down][down]"`
- Confirm no crash, prompt updates, and footer presence.

## Acceptance Criteria
- Smoke sequence produces output with Docs and expected headers; exit code 0.