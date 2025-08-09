[Back to Planning Sprint 5](./planning.md)

# Task 1.1 — Architect: MVC, IO Abstractions, and State Model

## Status
- Planned

## Traceability
- Up: [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b], [requirement:uuid:3d4e5f60-7182-4c9d-0e1f-2a3b4c5d6e7f], [requirement:uuid:4e5f6071-8293-4d0e-1f2a-3b4c5d6e7f80], [requirement:uuid:5f607182-93a4-4e1f-2a3b-4c5d6e7f8091], [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Deliverables
- Interface definitions for:
  - `RangerModelV2`: lists, filters, selection, params, docs, prompt buffer, cursor index, flags (e.g., `suppressMethodFilter`).
  - `RangerViewV2`: pure renderer from `Model` to text frames; no direct process I/O.
  - `RangerControllerV2`: input handler state machine that mutates `Model` and requests renders.
  - `TerminalIO`: abstraction for stdin/stdout, width/height, resize events; provide a `DeterministicTestIO` adapter for tests.
- State machine specs:
  - Navigation across columns; selection updates; column change rules.
  - Prompt edit mode: token index detection, cursor movement, backspace semantics at token boundaries.
  - Param entry mode: buffer commit, advancement, exit conditions.
- Rendering spec:
  - Grid layout with column widths; padding-before-styling rule; color codes per column titles.
  - Preview line structure: `prompt` + `command buffer` with inverse cursor.
  - Footer: content, colors, width fill, bottom anchoring via top padding.

## Acceptance Criteria
- All interfaces and state diagrams are documented and unambiguous.
- Includes pseudocode for key handlers: Up/Down/Left/Right/Tab/Enter/Space/Backspace/Esc.
- Specifies behavior for resize re-render.
- Clearly separates IO from rendering to enable deterministic tests.