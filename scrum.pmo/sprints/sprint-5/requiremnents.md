# Sprint 5 Requirements

- [ ] TS Ranger v2 must preserve Sprint 2 UX layout and spacing rules  
  [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b]
  > Four columns (Classes, Methods, Params, Docs), exactly one blank line above the preview and one between preview and footer; blue background with white, bold footer text that fills the terminal width and stays anchored at the bottom.

- [ ] Prompt rendering and colors derived from `$PS1` with fallbacks  
  [requirement:uuid:1b2c3d4e-5f60-4a7b-8c9d-0e1f2a3b4c5d]
  > Support `\u`, `\h`, `\w` in `$PS1`; color `user` cyan and `root` red; working directory yellow; no newlines; fallback `[host] user@pwd` when `$PS1` is absent.

- [ ] Selected-row alignment across columns  
  [requirement:uuid:2c3d4e5f-6071-4b8c-9d0e-1f2a3b4c5d6e]
  > Selected row must not shift or truncate; style after sizing (pad cells before applying ANSI styles). Applies to all columns.

- [ ] Prompt-line editing with cursor and token-aware backspace  
  [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f]
  > Maintain a cursor within the prompt; inverse-cursor rendering; Backspace at token boundaries must not merge tokens; method token typing reflects into Methods filter.

- [ ] Right Arrow and Tab semantics with method filter suppression  
  [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80]
  > When editing an empty token, Right/Tab navigates to next column; with a prefix, Right/Tab completes the token. After auto-inserting the first method, suppress method filter until the user types; cursor lands at method start. No auto-completion from an empty prompt with Right.

- [ ] Methods navigation keeps prompt synchronized without forcing filters  
  [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091]
  > While navigating Methods with Up/Down during prompt edit, update the prompt to `Class method` and keep the cursor at the start of the method token; allow choosing a different method; do not constrain the Methods list via filter unless the user types.

- [ ] Docs column replaces Preview and surfaces JSDoc via TSCompletion  
  [requirement:uuid:60718293-a4b5-4f2a-3b4c-5d6e7f8091a2]
  > Show Class/Method/Param documentation based on current selection; wrap text to column width; leverage TSCompletion to extract JSDoc; provide deterministic content for tests (no ANSI or non-determinism).

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