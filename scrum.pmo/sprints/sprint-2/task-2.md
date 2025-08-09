[Back to Planning Sprint 2](./planning.md)

# Task 2: Footer height/spacing and colorized command preview
[task:uuid:81a2b3c4-d5e6-4718-9823-5c6d7e8f9012]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31](./requiremnents.md)
- down
  - [Task 2.1: Developer — Footer height, spacing, and empty lines around command preview](./task-2.1-developer-footer-height-and-spacing.md)
  - [Task 2.2: Developer — Blue/White Key Usage Footer and Colorized Command Preview](./task-2.2-developer-footer-and-color-preview.md)

## Task Description
Improve TSRanger UI layout and readability:
- Footer/help line should span full terminal width and remain anchored at the last line, adapting to terminal height changes.
- Ensure one empty line between the command preview and the footer, and one empty line above the command preview.
- Render a colorized command preview line reflecting current class, method, and parameter values.

## Context
Derived from user requirements in `requiremnents.md` about footer height/spacing and readability. Colorized preview complements the layout improvements for better clarity while navigating.

## Intention
Provide a stable, legible layout regardless of terminal size, and make the execution preview immediately understandable through color cues.

## Steps
- Compute terminal rows/columns on each render and place footer on the bottom line.
- Insert blank lines around the preview as specified without overflowing terminal height.
- Implement and/or refine colorized preview for tokens and current input buffer.
- Verify behavior via scripted test mode and manual resize checks.

## Requirements
- Footer always at last line, full width; no overlap with content.
- Exactly one empty line above preview and one empty line between preview and footer.
- Colorized preview reflects current selection and input buffer without truncation artifacts (truncate to width if needed).

## Acceptance Criteria
- Scripted test mode demonstrates correct spacing and colorized preview.
- Manual resize preserves footer position and spacing.
- No regressions in navigation or execution.

## QA Audit & User Feedback
- [ ] QA review pending.


