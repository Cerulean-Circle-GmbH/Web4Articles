<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Planning Sprint 5](./planning.md)

# Task 5.7 — Developer: Non-interactive smoke run validation

## Status
- Planned

## Description
Verify end-to-end flow in non-interactive mode using the wrapper:
- `TSRANGER_V2=1 TSRANGER_TEST_MODE=1 src/sh/tsranger test "g[tab][down][down]"`
- Confirm no crash, prompt updates, and footer presence.

## Acceptance Criteria
- Smoke sequence produces output with Docs and expected headers; exit code 0.