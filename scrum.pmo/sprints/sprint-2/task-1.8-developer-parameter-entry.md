[Back to Planning](./planning.md)

# Task 1.8 — Developer: Sequential Parameter Entry and Auto-Execute

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [x] Done

## Goal
Change parameter logic to sequential entry: the ranger selects parameters in order, while the user types values on the last line. Values are separated by spaces; pressing Enter progresses to the next parameter. When all parameter values are specified, execute the TypeScript method with the given parameters.

## Steps
1. Extend model with state for `paramValues[]`, `paramEntryActive`, `paramEntryIndex`, and `paramEntryBuffer`.
2. On Preview Enter:
   - If parameters exist and not all filled, enter parameter-entry mode.
   - In parameter-entry mode: printable keys append to buffer; Space or Enter commits the buffer to the current parameter and advances.
   - When the last parameter is committed, execute immediately.
3. Show the current buffer appended to the command preview line for visual feedback.
4. Disable navigation keys while in parameter-entry mode; allow `q`/`Esc` to quit.
5. Reset parameter-entry state when class/method changes.

## Acceptance Criteria
- Space/Enter commits a typed value to the current parameter and advances to the next.
- After the final parameter is entered, the selected method executes in-process with the provided values.
- The command preview line shows progressively filled parameter values and the current input buffer.

## QA Audit & User Feedback
- [ ] QA review pending.