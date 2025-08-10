[Back to Planning Sprint 5](./planning.md)

# Task 5.9 — Developer: Integrate KeyboardController into RangerController

## Status
- Planned

## Traceability
- Up: [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f]

## Description
Inject `KeyboardController` into `RangerController` and refactor the internal key handling to consume semantic actions. Keep public behavior unchanged.

## Acceptance Criteria
- `RangerController` consumes actions from `KeyboardController.toAction(key)` and uses `KeyboardController.parse` for test mode.
- All existing tests still pass with `TSRANGER_V2=1`.

## QA Feedback (Verbatim)

### 2025-08-09T00:10:00Z
> v2 wrapper without test args renders once and exits; it is not interactive yet.

## Actions
- Integrate stdin loop to keep the app running interactively; exit on `q`/Esc/Ctrl-C.