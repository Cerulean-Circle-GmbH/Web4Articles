[Back to Planning](./planning.md)

# Ranger TUI Behavior (Analyzed)

This document describes the current behavior of the TSRanger TUI as implemented in `RangerModel`, `RangerView`, and `RangerController`, and summarized in `README.md`.

## Layout
- Four columns: `Classes` (cyan), `Methods` (yellow), `Params` (magenta), `Docs` (blue).
- The grid fills the terminal, reserving exactly 3 lines above the footer:
  - One blank line
  - The colorized command preview line (prompt + command buffer with cursor)
  - One blank line
- The footer (blue background, white bold text) is pinned to the bottom line and shows key usage/help.

## Navigation and Selection
- Selected column index: 0=Classes, 1=Methods, 2=Params, 3=Docs/Preview.
- Up/Down arrows move the selection within the current column.
- Left/Right arrows change the selected column.
- When selection changes in Classes, the Methods and Params lists are recomputed. When selection changes in Methods, Params are recomputed.

## Filters (type-to-filter in columns)
- Typing printable characters when NOT in prompt-edit mode appends to the active column filter; Backspace removes the last character.
- Filters are prefix-based, case-insensitive, and applied independently to Classes, Methods, and Params.

## Prompt-line editing and completion
- Prompt editing is active by default (`promptEditActive = true`).
- The prompt line begins with a colored shell-like prompt derived from `$PS1`; fallback: `[host] user@pwd` (user cyan/red if root, path yellow).
- The editable command buffer mirrors tokens: `<Class> <Method> <Params...>`.
- A visible inverse cursor is rendered at the logical cursor position.
- Token rules:
  - Cursor left/right within buffer adjusts `promptCursorIndex`.
  - Backspace at token boundaries preserves token separation to avoid accidental merges.
  - When typing at the start of the method token, the typed character replaces the method token rather than prefixing an existing suggestion.
- Completion and navigation interplay:
  - Tab or Right on a non-empty token performs shell-like completion.
    - In Class token: completes to the first matching class. If the completed class has a `start` method, the method token is set to `start` and the selection context moves to Methods; method filter is temporarily suppressed (navigation without filtering).
    - In Method token: completes to the first matching method for the selected class; moves selection context to Params; method filter is suppressed while navigating.
  - Right or Tab on an empty token advances to the next column (no completion).
  - While navigating Methods with Up/Down and prompt editing active, the prompt method token stays in sync with the selected method; the cursor is positioned at the beginning of the method token; method filter remains suppressed during this navigation.

## Enter behavior
- In columns 0–2: Enter advances to the next column (drill-down).
- In column 3 (Docs/Preview):
  - If method has parameters and not all are filled, Enter starts parameter entry mode.
  - If no parameters or all filled, executes the previewed command immediately.

## Parameter entry mode
- Active only from Preview by pressing Enter when parameters are pending.
- While active:
  - Only typing of printable characters, Backspace, Space, and Enter are processed.
  - Space and Enter commit the current buffer to the current parameter and advance to the next parameter.
  - Backspace edits the in-progress buffer.
  - Navigation keys (arrows, Tab, Left/Right) are ignored until param entry finishes.
  - When all parameters are filled, the command executes immediately and param entry mode ends.
- Command preview shows already-entered parameter values; while typing, the current buffer is shown as the next token.

## Quit keys
- q or Esc exits and cleans up raw mode.
- Ctrl-C exits.
- Optional: If `TSRANGER_ALTQ_EXIT` is set to 1/true, Alt+q/Alt+Q (often as ESC followed by q/Q) exits.

## Footer help text
- Shows: `←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit`.

## Docs rendering
- `Docs` column shows context-aware docstring: class, method, or parameter doc depending on selection.
- Text wraps to column width; long words are hard-sliced.

## Execution bridge
- On execute, dynamically imports class modules from `layer1` or `layer2`, resolves class, and invokes method with provided params; if async, awaits.
- Logs success and errors via `Logger`.