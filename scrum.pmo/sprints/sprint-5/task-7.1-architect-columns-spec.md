[Back to Planning Sprint 5](./planning.md)

# Task 7.1 — Architect: Column/Filter Interfaces Spec + PUML + SVGs

## Status
- Planned

## Traceability
- Up: [requirement:uuid:b5c6d7e8-f9a0-41b2-83c4-d5e6f7a8091b], [requirement:uuid:9a1f2b3c-4d5e-4f60-8a9b-0c1d2e3f4a5b]

## Description
Produce a detailed specification for a column-based architecture:
- Interfaces:
  - `RangerColumn` (data provider, filter application, selection, render hook)
  - `RangerFilter` (prefix-based with apply/reset/read capabilities)
- Contracts for concrete columns: Classes, Methods, Params, Docs
- Interaction model with controller (navigation, filter editing, prompt sync)

## Artifacts
- PUML diagrams under `docs/puml/tsranger-v2-columns-sequence.puml` and `docs/puml/tsranger-v2-columns-structure.puml`
- Rendered SVGs: `docs/tsranger-v2-columns-sequence.svg`, `docs/tsranger-v2-columns-structure.svg`

## Acceptance Criteria
- Spec and diagrams reviewed and approved
- Diagrams compile and SVGs are checked in under `docs/`