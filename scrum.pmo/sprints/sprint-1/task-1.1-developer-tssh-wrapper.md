<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 1.1: Developer - Implement tssh shell wrapper

## Goal
Create a plain shell script `src/sh/tssh` that acts as a wrapper for the TypeScript backend `TSsh.ts`.

## Steps
- Create `src/sh/tssh` as a shell script (not embedded in TypeScript).
- In the script, determine the project root and unit path by splitting the absolute path of `$0` at the project name (`Web4Articles`).
  - Print both the absolute project path and the relative unit path for verification.
- Forward all arguments to the TypeScript backend (`TSsh.ts`) using `ts-node --esm`.
- Ensure the script is executable and robust for different invocation locations.

## Acceptance Criteria
- Running `tssh` prints the project path, unit path, and arguments.
- The script is ESM-compliant and separated from TypeScript logic.
- The script is documented and committed.
