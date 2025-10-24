<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Planning Sprint 5](./planning.md)

# Task 5.1 — Developer: IO Abstraction (`TerminalIO`, NodeProcessIO, DeterministicTestIO)

## Status
- Planned

## Traceability
- Up: [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Description
Implement IO interfaces and adapters in `src.v2/ts/io/`:
- `TerminalIO` interface
- `NodeProcessIO` using process stdin/stdout, columns/rows, resize
- `DeterministicTestIO` using fixed dimensions and capturing output

## Acceptance Criteria
- IO layer compiles and can be imported by controller/view.
- DeterministicTestIO honors env `TSRANGER_TEST_COLUMNS/ROWS` (or defaults) and accumulates a final frame.