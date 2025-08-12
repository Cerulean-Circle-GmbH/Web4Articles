[Back to Planning Sprint 5](./planning.md)

# Task 3.1 — Architect: Map existing `test/tsranger.*.test.ts` to v2 behaviors

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Test Matrix

- tsranger.promptline.behavior.test.ts
  - Sequences and expectations:
    - `t`: Classes filtered to `TSsh`, `TestClass`; inverse cursor present on prompt line.
    - `t[right]`: prompt shows `TSsh start`; cursor at start of `start` token; `selectedColumn=1`; method filter suppressed.
    - `t[tab]`: same as `t[right]` with completion semantics.
    - `t[tab][backspace]`: Class token intact; Methods filter becomes `tart`.
    - `t[tab][backspace]×6`: Methods filter cleared, Classes filter remains `TSsh`.
    - `t[tab][backspace]×7`: Classes filter reduces to `TSs`.
    - `g[tab]`: Class `GitScrumProject`; method auto-inserted; Methods filter suppressed.
    - `g[tab][down]`: prompt method token updates to next method (e.g., `dispatch`/`create`).
    - `g[tab][down][down]`: prompt method token keeps updating; no hang.
    - `[down]×6[tab]`: no crash; continues navigation.
    - `[down][down][right]`: moves to Methods; prompt does not inject unrelated classes.
    - `g[tab]c`: Methods filter becomes `c`; prompt shows `GitScrumProject c` with suggestion towards `create`.
    - `g[right]c`: Methods filter becomes `c` via navigation + typing.
    - `[right]` from empty: moves to Methods; no auto-completion to `Logger`.

- tsranger.cursor.test.ts
  - `te[tab]w`: inverse cursor present; prompt includes `TSsh` eventually; Classes filtered by `t` include `TSsh`, `TestClass`.

- tsranger.prompt.test.ts
  - Spacing: one blank line above prompt; one blank line before footer; colors present (user cyan/red, path yellow).

- tsranger.docs.test.ts
  - `Te`: docs column contains TestClass doc snippet (e.g., "TS Ranger").
  - `Te[right][down]`: docs column updates to method doc (e.g., "Combines the provided parameters" or "Says hello").

- tsranger.tab.test.ts
  - `[tab]` behaves like `[right]` for navigation to Methods column when appropriate.

- tsranger.model.test.ts
  - Non-TTY model invariants: filtering and method/param updates; preview building begins with `GitScrumProject create` when present.

## Acceptance Criteria
- v2 must satisfy all above behaviors without modifying tests; any deviation must be addressed in the implementation via adherence to this spec.