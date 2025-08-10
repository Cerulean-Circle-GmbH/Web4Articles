[Back to Planning Sprint 5](./planning.md)

# Task 5.4 — Developer: Controller (`layer4/RangerController.ts`)

## Status
- Planned

## Traceability
- Up: [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f], [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80], [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091]

## Description
Implement key handling per Task 1.1 pseudocode, including:
- Prompt editing with token-aware backspace and cursor movement
- Up/Down navigation syncing method token without forcing filters
- Right/Tab completion behavior and suppression rules
- Param entry workflow; non-interactive script execution loop

## Acceptance Criteria
- Drives the model/view to produce outputs matching existing tests.
- Non-interactive test loop obeys `TSRANGER_TEST_MODE`, `TSRANGER_TEST_INPUT`, `TS_RANGER_TEST_FINAL_ONLY`.

## QA Feedback (Verbatim)

### 2025-08-09T00:10:00Z
> v2 wrapper without test args renders once and exits; it is not interactive yet.

### Actions
- Wire stdin raw key-read loop to feed the controller, gated behind interactive mode (no `TSRANGER_TEST_MODE`).