[Back to Planning](./planning.md)

# Task 2.2 — Developer: Blue/White Key Usage Footer and Colorized Command Preview

[subtask:uuid:a3c4d5e6-f781-492a-b345-7e8f9012bc3d]

## Status
- [ ] Planned
- [ ] In Progress
  - [x] implementing
- [ ] QA Review
- [ ] Done

## Goal
Render a key usage line at the bottom with a blue background and white text, and render the final shell-like command above it using distinct colors for tokens.

## Details
- Footer (key usage line): background blue, white bold text. Must stick to the bottom of the TUI. Truncate to terminal width.
- Command preview (above footer):
  - `tssh`: green
  - Class: cyan
  - Method: yellow
  - Parameter values: magenta
  - Current parameter buffer (when entering): magenta + underline
- Keep four-column layout; do not remove the existing Preview column.

## Acceptance Criteria
- Footer line is visibly blue with white text and shows: `←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit`.
- Colorized command preview reflects current selection and entered parameter values (including the active input buffer underlined).
- Works correctly with different terminal widths and heights without throwing.

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic task for this sprint).