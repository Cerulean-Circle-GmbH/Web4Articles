<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Planning Sprint 5](./planning.md)

# Task 5.6 — DevOps: Shell wrapper toggle in `src/sh/tsranger`

## Status
- Planned

## Traceability
- Up: [requirement:uuid:718293a4-b5c6-4f3b-4c5d-6e7f8091a2b3]

## Description
Modify `src/sh/tsranger` to route to v2 entry when `TSRANGER_V2=1` while preserving the existing CLI/testing interface.

## Acceptance Criteria
- `src/sh/tsranger test "..."` executes v2 when `TSRANGER_V2=1`; executes v1 otherwise.
- No change to test command syntax.