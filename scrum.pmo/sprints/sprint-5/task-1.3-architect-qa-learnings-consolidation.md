[Back to Planning Sprint 5](./planning.md)

# Task 1.3 — Architect: Consolidate QA Learnings into Normative Behaviors

## Status
- Planned

## Traceability
- Up: [requirement:uuid:2c3d4e5f-6071-4b8c-9d0e-1f2a3b4c5d6e], [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f], [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80], [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091]

## Normative Behaviors
- Selected-row alignment: pad before styling across all columns.
- Prompt cursor rendering: inverse video on the current character; stable placement after completion or typing.
- Token-aware Backspace: do not merge tokens across spaces; delete forward char when at a boundary.
- Right/Tab rules: navigate on empty token; complete on non-empty prefix. Never auto-complete from truly empty prompt on Right.
- Method filter suppression: after class completion that injects first method, keep Methods filter empty until user types.
- Methods navigation while editing: Up/Down updates method token in prompt; cursor at method start index.

## Examples Referring to Existing Tests
- `"g[tab]"`, `"[down][down][right]"`, `"t[tab]"`, `"t[tab][backspace]"`, `"[down][down][tab]"` — define expected prompt string, cursor index, selected column/index, and filters after each sequence.

## Acceptance Criteria
- Each example includes pre/post state tables and ties to an existing test assertion.

## Examples (Pre/Post State)

### Sequence: `t`
- Pre: prompt `""`, filters `['', '', '', '']`, column 0, indices [0,0,0,0]
- Post: prompt `"t"`, filters `["t", '', '', '']`, Classes show `TSsh`, `TestClass`; inverse cursor present.

### Sequence: `t[right]`
- Post: prompt shows `TSsh start` (if `start` exists); cursor index at method start; selectedColumn becomes 1 (Methods); `suppressMethodFilter=true`.

### Sequence: `t[tab]`
- Mirrors `right` completion when a prefix exists.

### Sequence: `t[tab][backspace]`
- Post: Class token `TSsh` preserved; Methods filter becomes `tart`; tokens do not merge.

### Sequence: `g[tab]`
- Post: Class completes to `GitScrumProject`; prompt inserts `start`; Methods filter remains empty (suppressed) until user types; cursor at method start.

### Sequence: `g[tab][down]` and `g[tab][down][down]`
- Post: Prompt method token updates to the newly selected method each time; no hang; cursor stays at method start.

### Sequence: `[down][down][right]`
- Post: Navigates to Methods; prompt does not insert unrelated classes (e.g., `Logger`).

### Sequence: `[right]` from empty prompt
- Post: Moves to Methods column; no auto-completion is performed.