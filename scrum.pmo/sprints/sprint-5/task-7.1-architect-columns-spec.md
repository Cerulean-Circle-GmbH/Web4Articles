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

## Detailed Specification (Outline)
- RangerFilter
  - Methods: `apply(prefix: string)`, `reset()`, `current(): string`
  - Behavior: prefix match (case-insensitive), single source of truth for header `(prefix)`
- RangerColumn<T>
  - Properties: `items: T[]`, `filter: RangerFilter`, `selectedIndex: number`
  - Methods: `setItems(T[])`, `applyFilter(prefix: string)`, `clearFilter()`, `moveSelection(delta: number)`, `getVisible(): T[]`
  - Hooks: `onSelect?(item: T)`: optional prompt-sync behavior
- Concrete Columns
  - ClassColumn: provides class names from TSCompletion
  - MethodColumn: methods for selected class; filter reflects typed method token
  - ParamColumn: parameter names; no prompt token editing
  - DocsColumn: read-only text wrapping; no filter
- Controller Integration
  - Left/Right switches current column; Up/Down uses column.moveSelection
  - Typing routes to active column.filter; prompt sync per column rules

## PUML Diagrams (placeholders)
- Sequence: `docs/puml/tsranger-v2-columns-sequence.puml`
- Structure: `docs/puml/tsranger-v2-columns-structure.puml`

## SVG Generation
- Use PlantUML to render:
  - `tsranger-v2-columns-sequence.svg`
  - `tsranger-v2-columns-structure.svg`
- Place SVGs in `docs/`