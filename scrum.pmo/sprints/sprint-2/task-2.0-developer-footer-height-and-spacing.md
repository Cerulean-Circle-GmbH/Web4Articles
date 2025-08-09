[Back to Planning](./planning.md)

# Task 2.0: Developer — Footer height, spacing, and empty lines around command preview

[requirement:uuid:7f6e1b84-3c19-4d7a-9a56-5f4a7c9b2d31]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Make the help/footer line use the full terminal width and remain anchored at the bottom even when terminal height changes. Add one empty line between command line and help line, and always keep an empty line above the command line.

## Context
`requiremnents.md` specifies spacing requirements for readability while navigating.

## Intention
Improve UX by consistent layout: list area, blank line, command preview (with prompt), blank line, footer.

## Steps
- Detect terminal `rows` on each render and place footer at the last line.
- Insert a blank line above and below the command preview line.
- Ensure drawing does not overflow terminal height.

## Requirements
- Footer occupies bottom line and full width.
- One empty line between preview and footer; one empty line above preview.

## Acceptance Criteria
- Resizing terminal maintains footer at bottom and spacing is preserved.
- Scripted test mode shows correct spacing.

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic subtask for this sprint).

