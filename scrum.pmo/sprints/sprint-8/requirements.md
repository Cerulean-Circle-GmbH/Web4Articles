[Back to Planning](./planning.md)

# Requirements — TSRanger TUI (Sprint 5)

## Functional Requirements
- FR1: The TUI displays four columns (Classes, Methods, Params, Docs) and a footer with key usage.
- FR2: Up/Down moves selection in the current column; Left/Right changes columns, bounded 0–3.
- FR3: Typing when not in prompt editing updates the active column filter; Backspace removes last filter character.
- FR4: Prompt editing is active by default, shows a shell-like prompt from `$PS1` or fallback, and renders an inverse cursor at the logical position.
- FR5: Completion behavior:
  - FR5.1: Tab/Right on a non-empty Class token completes to the first matching class; if class has a `start` method, method token is set to `start`, selected column becomes Methods, method filter is suppressed.
  - FR5.2: Tab/Right on a non-empty Method token completes to the first matching method for the selected class; selected column becomes Params; method filter remains suppressed while navigating.
  - FR5.3: Tab/Right on an empty token advances to the next column without auto-completion.
- FR6: While navigating Methods with Up/Down and prompt editing active, the prompt’s method token mirrors the selected method; cursor at start of method token; method filter suppressed.
- FR7: Enter behavior:
  - FR7.1: In columns 0–2, Enter advances to the next column.
  - FR7.2: In column 3, Enter starts parameter entry if parameters are pending; otherwise executes the command.
- FR8: Parameter entry mode:
  - FR8.1: Only printable, Backspace, Space, and Enter are processed; navigation keys are ignored.
  - FR8.2: Space/Enter commit the current buffer to the current parameter and advance; when all parameters are filled, execute and end param entry.
  - FR8.3: Preview line includes committed params and, if active, the in-progress buffer as the next token.
- FR9: Quit keys: q, Esc, and Ctrl-C exit cleanly; optional Alt+q/Alt+Q exits if `TSRANGER_ALTQ_EXIT` is true.

## Non-Functional Requirements
- NFR1: Rendering keeps exactly one blank line above the preview and one between preview and footer; footer is always in the last terminal line.
- NFR2: ANSI colors: Classes cyan, Methods yellow, Params magenta, Docs blue; prompt uses cyan/red for user and yellow for path; footer blue background with white bold text.
- NFR3: No crashes on rapid key sequences or long navigation; graceful handling in non-interactive test mode.
- NFR4: ESM-only runtime; TUI entry via `node --loader ts-node/esm` or `npm run tsranger`.

## Acceptance Criteria
- AC1: Behavior in `behavior.ranger.tui.md` matches the running TUI and existing tests.
- AC2: All cases listed in `tsranger.keyinput.testcases.md` are either covered by existing tests or a plan exists to implement them.
- AC3: Non-interactive scripted runs render a final frame where the prompt, filters, and footer conform to spec (spacing, colors, and cursor presence).
- AC4: Parameter entry sequences reflect FR8 and do not allow navigation until completion.
- AC5: Quit sequences terminate without leaving terminal in raw mode.

## Traceability
- Sources: `README.md` (§TSRanger), `RangerModel`, `RangerController`, `RangerView`.
- Tests: `test/tsranger.*.test.ts`.