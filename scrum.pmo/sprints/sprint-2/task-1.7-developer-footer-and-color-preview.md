# Task 1.7 — Developer: Blue/White Key Usage Footer and Colorized Command Preview

## Goal
Render a key usage line at the bottom with a blue background and white text, and render the final shell-like command above it using distinct colors for tokens.

## Details
- Footer (key usage line): background blue, white bold text. Must stick to the very last terminal line at all times. Truncate to terminal width.
- Insert a single blank spacer line directly above the footer.
- Command preview must appear directly above the blank spacer line.
- Command preview token colors:
  - `tssh`: green
  - Class: cyan
  - Method: yellow
  - Parameter values: magenta
  - Current parameter buffer (when entering): magenta + underline
- Keep four-column layout; do not remove the existing Preview column.
- Re-render on terminal resize so the footer remains on the last line and the layout uses as many rows as available.

## Acceptance Criteria
- Footer line is visibly blue with white text and shows: `←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit`.
- An empty spacER line is present immediately above the footer; the command preview is rendered above that spacer.
- Colorized command preview reflects current selection and entered parameter values (including the active input buffer underlined).
- Works correctly with different terminal widths and heights without throwing, and footer stays anchored to the last line on resize.