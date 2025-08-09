[Back to Planning Sprint 5](./planning.md)

# Task 5.8 — Developer: KeyboardController abstraction (`layer4/KeyboardController.ts`)

## Status
- Planned

## Traceability
- Up: [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f]

## Description
Create a `KeyboardController` that translates raw key sequences into semantic actions for `RangerController`:
- Actions: `MoveUp`, `MoveDown`, `MoveLeft`, `MoveRight`, `Tab`, `Enter`, `Space`, `Backspace`, `Esc`, `Quit`, `Printable(ch)`
- Provide a method `parse(script: string): string[]` (reusable test script parser) and `toAction(key: string): Action`.
- Keep mapping centralized to simplify testing and allow re-use in other TUIs.

## Acceptance Criteria
- New file `src.v2/ts/layer4/KeyboardController.ts` exports action enum/types and functions.
- Unit-tested by mapping representative keys and script tokens.