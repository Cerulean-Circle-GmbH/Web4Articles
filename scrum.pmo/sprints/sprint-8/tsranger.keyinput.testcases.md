[Back to Planning](./planning.md)

# TSRanger Key Input Test Cases (Derived)

These cases use the scripted input format: tokens like `[down][right][tab]abc[left][q]`.

## Core navigation
- Case: `[down]` — Moves selection down in current column.
  - Expect: Selected index increments within bounds; dependent lists update when in Classes/Methods.
- Case: `[up]` — Moves selection up in current column.
- Case: `[right]` — Moves to next column.
- Case: `[left]` — Moves to previous column.

## Prompt-line editing and completion
- Case: `t` — Filters Classes to prefix `t`; prompt shows `t` with cursor; Classes include `TSsh`, `TestClass`.
- Case: `t[right]` — Completes class to `TSsh`, sets method token to `start` if available; cursor positions at beginning of method token.
- Case: `t[tab]` — Same as above; completion path via Tab.
- Case: `t[tab][backspace]` — Removes first method char, keeps class token intact; Methods filter reflects remaining prefix.
- Case: `t[tab][backspace]×N` — Repeated backspace erases method token first, then reduces class token; Classes filter updates accordingly.
- Case: `g[tab]` — Completes to `GitScrumProject`; auto-suggests `start` in prompt but suppresses Methods filter; selection context at Methods.
- Case: `g[tab][down]` — Navigating Methods syncs prompt method token with selection; cursor at start of method token.
- Case: `g[tab]c` — Typing at method start replaces token; Methods filter is `c`; prompt shows `GitScrumProject c…` with suggestion.
- Case: `[right]` from empty prompt — Only moves to Methods column; no auto-injected class like `Logger`.

## Enter behavior and parameter entry
- Precondition: Select a method with ≥1 parameter.
- Case: `[right][right][right][enter]` — From Preview, starts parameter entry when params pending.
  - Expect: Param entry active; cursor visible on preview token; navigation keys ignored.
- Case: `abc[space]` in param entry — Commits `abc` to parameter 1, advances to next param; preview shows `abc`.
- Case: `xyz[enter]` in param entry — Commits `xyz` and advances; when last param committed, command executes, param entry ends.
- Case: `[down]` during param entry — Ignored; selection indices do not change.
- Case: `[backspace]` during param entry — Edits current buffer; preview reflects deletion.

## Quit and exit
- Case: `q` — Exits.
- Case: `[esc]` — Exits.
- Case: `[ctrl-c]` (simulated as `\u0003`) — Exits.
- Case: Alt+q — With `TSRANGER_ALTQ_EXIT=1`, `[esc]q` exits.

## Edge and robustness
- Case: `[down]×6[tab]` — Does not crash; continues to render.
- Case: Rapid edits: `te[tab]w[left][left][backspace]` — Cursor and buffers maintain integrity; no token merge at boundaries.

## References
- Implementation: `RangerController`, `RangerView`, `RangerModel`.
- Existing tests exercising related paths: `test/tsranger.promptline.behavior.test.ts`, `test/tsranger.cursor.test.ts`, `test/tsranger.prompt.test.ts`.