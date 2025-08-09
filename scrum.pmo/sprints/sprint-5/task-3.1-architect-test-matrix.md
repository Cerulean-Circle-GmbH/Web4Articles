[Back to Planning Sprint 5](./planning.md)

# Task 3.1 — Architect: Map existing `test/tsranger.*.test.ts` to v2 behaviors

## Status
- Planned

## Traceability
- Up: [requirement:uuid:93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5]

## Test Files and Key Sequences (to be fully populated)
- `test/tsranger.promptline.behavior.test.ts`
  - Sequences: `g[tab]`, `[down][down][right]`, `t[tab]`, `t[tab][backspace]`
- `test/tsranger.cursor.test.ts`
  - Sequences: `te[tab]w`, cursor placement checks
- `test/tsranger.prompt.test.ts`
  - Sequences: `[down][down][tab]`, `[down][down][right]`
- `test/tsranger.docs.test.ts`
  - Verify Docs column shows JSDoc for selection
- `test/tsranger.tab.test.ts`
  - Tab behavior parity with Right when appropriate
- `test/tsranger.model.test.ts`
  - Model filtering/selection invariants

## Acceptance Criteria
- Each listed test references the exact states and outputs expected from v2, ensuring unchanged assertions will pass.