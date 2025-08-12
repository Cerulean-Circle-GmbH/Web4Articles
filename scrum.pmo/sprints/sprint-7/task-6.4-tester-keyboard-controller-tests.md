[Back to Planning Sprint 5](./planning.md)

# Task 6.4 — Tester: KeyboardController unit tests for key mapping and sequences

## Status
- Planned

## Traceability
- Up: [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f]

## Description
Add tests to verify `KeyboardController`:
- Maps ANSI sequences (arrows), Tab, Enter, Space, Backspace, Esc, printable chars, and `q` to actions
- Parses test script tokens like `[down][right]abc[left]`

## Acceptance Criteria
- New test file under `test/keyboard.controller.test.ts`
- All tests pass alongside existing suite with `TSRANGER_V2=1`