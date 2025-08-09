[Back to Planning Sprint 5](./planning.md)

# Task 5.3 — Developer: View (`layer5/RangerView.ts`)

## Status
- Planned

## Traceability
- Up: [requirement:uuid:2c3d4e5f-6071-4b8c-9d0e-1f2a3b4c5d6e], [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b], [requirement:uuid:1b2c3d4e-5f60-4a7b-8c9d-0e1f2a3b4c5d]

## Description
Render frames deterministically based on `TerminalIO.columns/rows` and the model:
- Grid of four columns with padding-before-styling
- Prompt line with PS1-derived prompt, inverse cursor
- Footer with blue background/white bold
- Docs column wrapping rules

## Acceptance Criteria
- Rendering visually/parsing-behavior matches v1 tests for all scripted sequences.