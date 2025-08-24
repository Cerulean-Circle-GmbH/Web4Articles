# Sprint 5 Requirements

- [x] TS Ranger v2 must preserve Sprint 2 UX layout and spacing rules  
  [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b]
  > Four columns (Classes, Methods, Params, Docs), exactly one blank line above the preview and one between preview and footer; blue background with white, bold footer text that fills the terminal width and positioned 2 lines up from the bottom.

- [x] Prompt line positioned at top with clean separation from column indicators
  [requirement:uuid:a1b2c3d4-5e6f-4789-0abc-def123456789]
  > Clean prompt line at top of screen showing [hostname] user@path format, completely separated from column background indicators below it.

- [x] Column-colored background indicator line below prompt  
  [requirement:uuid:b2c3d4e5-6f70-4890-1bcd-ef2345678901]
  > Empty colored line below prompt line showing column backgrounds (Classes: cyan, Methods: yellow, Params: magenta, Docs: blue) with active column highlighted, providing visual column separation without interfering with prompt display.

- [x] Navigation vs Advancement mode distinction
  [requirement:uuid:c3d4e5f6-7080-4901-2cde-f3456789abcd]
  > Navigation ([down][up]) shows ONLY selected class in prompt line with cursor at first character. Advancement ([tab][right]) shows class + method with cursor at method position. Clear behavioral separation between selection navigation and command advancement.

- [x] Complete advancement and retreat navigation system
  [requirement:uuid:d4e5f6g7-8091-5012-3def-g4567890bcde]
  > Advancement: [tab] and [right] work identically to add first method to selected class (Logger → Logger log) with cursor positioned at [l]og. Retreat: [left] removes method and repositions cursor at first character of class name (Logger log → Logger with cursor at [L]ogger). Navigation: [down]/[up] shows only class without methods.

- [ ] **EMERGENCY: Critical filter corruption bug fix**  
  [requirement:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def]
  ([Task 7](./task-7-emergency-filter-bug-fix.md))
  > **CRITICAL BUG:** Typing [t][backspace][g] currently results in "tg" filter instead of "g". Filter state corruption causes application to become unusable requiring restart. Must implement immutable filter operations to prevent state corruption and ensure atomic filter updates with rollback capability.

- [ ] Prompt rendering and colors derived from `$PS1` with fallbacks  
  [requirement:uuid:1b2c3d4e-5f60-4a7b-8c9d-0e1f2a3b4c5d]
  > Support `\u`, `\h`, `\w` in `$PS1`; color `user` cyan and `root` red; working directory yellow; no newlines; fallback `[host] user@pwd` when `$PS1` is absent.

- [ ] Selected-row alignment across columns  
  [requirement:uuid:2c3d4e5f-6071-4b8c-9d0e-1f2a3b4c5d6e]
  > Selected row must not shift or truncate; style after sizing (pad cells before applying ANSI styles). Applies to all columns.

- [ ] **QA Enhancement: Consistent prompt update architecture**
  [requirement:uuid:a2b3c4d5-e6f7-8901-2345-6789abcdef01]
  ([Task 5.10](./task-5.10-developer-prompt-update-architecture.md))
  > Prompt line must update consistently after every navigation operation. Centralized PromptStateManager with single responsibility for all prompt operations. No missing or incorrect prompt displays after any operation sequence.

- [ ] Prompt-line editing with cursor and token-aware backspace  
  [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f]
  > Maintain a cursor within the prompt; inverse-cursor rendering; Backspace at token boundaries must not merge tokens; method token typing reflects into Methods filter.

- [ ] Right Arrow and Tab semantics with method filter suppression  
  [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80]
  > When editing an empty token, Right/Tab navigates to next column; with a prefix, Right/Tab completes the token. After auto-inserting the first method, suppress method filter until the user types; cursor lands at method start. No auto-completion from an empty prompt with Right.

- [ ] **QA Enhancement: DRY/OOP compliance for paired key operations**
  [requirement:uuid:b3c4d5e6-f7g8-9012-3456-789abcdef012]
  ([Task 5.11](./task-5.11-developer-dry-oop-paired-keys.md))
  > Tab and Right keys must produce identical results in all scenarios. Left and ShiftTab keys must produce identical results in all scenarios. Zero code duplication between paired operations using shared methods with radical OOP compliance.

- [ ] Methods navigation keeps prompt synchronized without forcing filters  
  [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091]
  > While navigating Methods with Up/Down during prompt edit, update the prompt to `Class method` and keep the cursor at the start of the method token; allow choosing a different method; do not constrain the Methods list via filter unless the user types.

- [ ] Docs column replaces Preview and surfaces JSDoc via TSCompletion  
  [requirement:uuid:60718293-a4b5-4f2a-3b4c-5d6e7f8091a2]
  > Show Class/Method/Param documentation based on current selection; wrap text to column width; leverage TSCompletion to extract JSDoc; provide deterministic content for tests (no ANSI or non-determinism).

- [ ] **QA Enhancement: Comprehensive Matrix v4 test coverage**
  [requirement:uuid:c4d5e6f7-g8h9-0123-4567-89abcdef0123]
  ([Task 6.5](./task-6.5-tester-matrix-v4-enhancement.md))
  > All TRON QA findings must have corresponding test cases. Matrix v4 updated with multi-step filter operations, navigation stress testing, and state recovery scenarios. Comprehensive test coverage prevents regressions.

- [ ] Non-interactive test mode with deterministic rendering  
  [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]
  > Honor `TSRANGER_TEST_MODE=1` and `TSRANGER_TEST_INPUT` to drive scripted sequences; disable interactive waits; stable width-dependent rendering; test wrapper `src/sh/tsranger test "..."` must route to v2 via configuration without changing test inputs.

- [ ] Execution bridge parity with v1  
  [requirement:uuid:8293a4b5-c6d7-4f4c-5d6e-7f8091a2b3c4]
  > Resolve `Class.method(params...)` against layer1/layer2 modules; call static methods; run `help` when method not found; log execution result; maintain behavior used by tests.

- [ ] Zero test changes policy  
  [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]
  > All current `test/tsranger.*.test.ts` must pass unchanged against v2. Any differences must be addressed in the spec, not test edits.

- [ ] Backlinks and traceability  
  [requirement:uuid:a4b5c6d7-e8f9-405e-7f80-91a2b3c4d5e6]
  > All tasks start with a backlink to planning; each task lists traceability Up to requirement UUIDs and Down to subtasks per Sprint 2 process rules.

- [ ] Keyboard input routing and insertion semantics  
  [requirement:uuid:b5c6d7e8-f9a0-41b2-83c4-d5e6f7a8091b]
  > Printable input must always be applied to the correct token based on the selected column and cursor position: Classes column edits the class token; Methods column edits the method token at its start offset (`len(class)+1`), replacing suggestions as needed; Params column enters param-entry mode and appends the buffer as the next token in `Class Method Param...`. Backspace respects token boundaries; tokens are separated by single spaces; filters reflect typed prefixes only for the active column.

- [ ] **FUTURE EPIC: 3 Degrees of Freedom Architecture**
  [requirement:uuid:d5e6f7g8-h9i0-1234-5678-9abcdef01234]
  ([Task 8](./task-8-epic-3-degrees-freedom.md))
  > Implement revolutionary 3 Degrees of Freedom architecture with clean separation of COLUMNS (navigation) + PROMPT (display) + FILTER (search) concerns. Complete architecture migration with ColumnNavigator interfaces, TSRangerOrchestrator coordination, and immutable state operations for long-term maintainability and bug prevention.