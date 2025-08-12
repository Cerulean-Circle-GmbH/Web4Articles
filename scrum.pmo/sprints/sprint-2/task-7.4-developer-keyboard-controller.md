[Back to Sprint 2 Planning](./planning.md)

# Task 7.4 — Developer: KeyboardController extraction and delegation
[task:uuid:a5a2ca9d-0b5e-44f1-a8c4-1b0d4f9b3e2e]
[subtask:uuid:f1d3a1c9-2b47-4d56-9a8a-63bf79e2d4c1]

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
Extract a dedicated `KeyboardController` in `src/ts/layer4/KeyboardController.ts` responsible for parsing key events and producing normalized editing actions, while `RangerController` focuses on high-level state transitions and column navigation.

## Context
Prompt-line editing logic (Tab/Right/Backspace/Up/Down, token boundaries, cursor index) is interwoven with selection and filter logic in `RangerController`, making testing and reasoning difficult.

## Intention
Separate responsibilities so prompt editing can be unit-tested independently and integrated predictably with model/view updates.

## Steps
- Define `KeyEvent` and `KeyEffect` types (insert, delete, moveCursor, completeToken, changeColumn, acceptSuggestion).
- Implement `KeyboardController.handleKey(event, model): KeyEffect[]` to translate raw keys into actions given current prompt state.
- Update `RangerController` to delegate to `KeyboardController` and then apply returned effects to `RangerModel` (including `suppressMethodFilter` rules).
- Ensure Tab/Right unify through `KeyboardController`; treat empty token as column navigation.
- Write focused unit tests for `KeyboardController` covering: `t[tab]`, `t[right]`, `g[tab]c`, `g[right]c`, `g[tab][down]`, `g[tab][down][down]`, boundary backspaces.
- Keep end-to-end scripted tests unchanged; they must still pass.

## Requirements
- New file: `src/ts/layer4/KeyboardController.ts` with strict typing.
- Unit tests in `test/keyboardcontroller.behavior.test.ts` using `tsranger test` flows where integration is needed.
- No interactive listeners; maintain non-interactive test mode.

## Acceptance Criteria
- All existing scripted tests remain green.
- New unit tests assert normalized effects per key sequence and prompt buffer/cursor outcomes.
- Delegation from `RangerController` is in place without duplicating logic.
- Code coverage includes Tab/Right/Backspace/Up/Down branches in `KeyboardController`.

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
