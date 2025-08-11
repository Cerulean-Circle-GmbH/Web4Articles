<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 7: Refactor typing model to prompt-line editing with cursor and shell-like completion

[task:uuid:79d6c5b4-a3d2-4f1a-9b8c-6a5d4e3f2a1b]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing
  - [x] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:a7b6c5d4-e3f2-1a0b-9c8d-7e6f5a4b3c2d](./requiremnents.md)

## Task Description
Refactor TS Ranger input so that typing happens only in the prompt line with a visible cursor. Behavior mirrors a shell: typed tokens filter Classes/Methods as today, current token is completed behind the cursor on [tab], and the grid selection stays synchronized with the prompt tokens.

## Steps
1. Introduce a prompt editor state in `RangerModel` (cursor index, buffer, tokenization).
2. Render cursor in the prompt preview (inverse or underline).
3. Update controller to route printable keys to the prompt editor; left/right move the cursor; [tab] applies completion for current token; [enter] behaves as select/next.
4. Keep parameter-entry mode unchanged.
5. Add scripted tests for typing, cursor movement, [tab] completion, and grid sync.

## Acceptance Criteria
- Prompt line reflects a cursor and edits; [tab] completes the current token.
- Grid selection follows the prompt tokens; typing filters as before.

## QA Audit & User Feedback
- [ ] QA review pending.
  - [x] Feedback: Verify cursor rendering and prompt editing using: `tsranger test "te[tab]w"`. Ensure inverse cursor is visible at the correct position after completion and typing.
  - [x] Feedback: After typing `t`, only `TSsh` and `TestClass` shall be listed, with `TSsh` selected and methods highlighted (yellow). The prompt line must show `TSsh` with the cursor on `S` (no `tssh` prefix). After `[tab]`, show `TSsh start` with the cursor on the `s` in `start`.
  - [x] Feedback: `tsranger test "t[right]"` must reflect the same prompt-line update as `[tab]` completion: `TSsh start` with cursor on `s`.
  - [x] Feedback: Refactor Backspace behavior in prompt editing so token boundaries are preserved (do not merge tokens). Maintain both the prompt line and grid filters correctly. Add cases for streaming sequences: `g[tab]`, `[down][down][down][down][down][down][tab]`, `t[tab]`, and `t[tab][backspace]`.
  - [x] Feedback: After `[tab]` or `[right]` on a class token, write the first method into the prompt and position the cursor on its first character, but do not set the Methods filter yet. The Methods column must still allow choosing a different method without being constrained by a pre-applied filter. Only user typing should set the Methods filter.
  - [x] Feedback: After `g[tab][down]` and `g[tab][down][down]`, the prompt command must stay synchronized with the selected method while navigating the Methods column. Navigation should not hang, and multiple downs must update the prompt accordingly.
  - [x] Feedback: All automated tests must use non-interactive mode via `tsranger test "<keys>"` with `TSRANGER_TEST_MODE=1`. Interactive mode is forbidden in tests to prevent hangs.
  - [x] Feedback: Pressing `[right]` from an empty prompt must not auto-complete or inject unrelated classes (e.g., `Logger`). It should only move the selection to the next column. Auto-completion is allowed only when a token prefix exists or when explicitly pressing `[tab]`.
  - [x] Feedback: `[down][down][tab]` and `[down][down][right]` must navigate from Classes to Methods without auto-completing the prompt and must work reliably (no no-op). Methods list should reflect the selected class.
  - [x] Feedback: After `g[tab]c` or `g[right]c`, the Methods filter must be set to `c`. The prompt may suggest `create`, but the typed filter remains `c` and the cursor logically sits on the next character (rendered inverse on the method token).

### Test Evidence
- Scripted tests added and passing:
  - `test/tsranger.promptline.behavior.test.ts`
  - `test/tsranger.cursor.test.ts`
  - `test/tsranger.prompt.test.ts`



