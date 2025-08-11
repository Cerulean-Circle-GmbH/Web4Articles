<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

# Sprint 10 Plan

## Goal
Establish an explicit AI-GPL addendum to AGPLv3, enforce license headers and backlinks across the repository with TypeScript tooling, and integrate automated checks into CI for new files.

## User Stories
- As a maintainer, I want a clear AI-GPL addendum so legal terms for AI use and process artifacts are unambiguous.
- As a developer, I want a tool that adds and updates license headers format-aware for .ts/.md/.puml/etc., so all files carry copyleft backlinks.
- As a CI gatekeeper, I want an automated check that fails PRs missing headers, so new files comply.
- As a product owner, I want `scrum.pmo` artifacts treated as source under AI-GPL, so AI usage remains copyleft unless dual-licensed.

## Scope & Deliverables
- `AI-GPL.md` drafted with DYR notes, backlinks to AGPLv3.
- `LicenseTool` TypeScript CLI (ESM, OOP) with `check` and `apply` methods.
- Comment-aware headers for: ts, tsx, js, jsx, md, puml, plantuml, sh, yml, yaml.
- GitHub Action workflow to run header check on push/PR.
- Minimal unit tests for header insertion.

## Tasks
1. Draft `AI-GPL.md` addendum with copyleft clarifications and backlinks.
2. Implement `LicenseTool` with file discovery, comment-style mapping, header builder, check/apply flows.
3. Add vitest tests for key formats (.ts, .md, .puml).
4. Create `.github/workflows/license-headers.yml` to enforce on CI.
5. Run repo-wide `apply` and commit changes.
6. Update contributor docs with usage instructions.

## Acceptance Criteria
- `AI-GPL.md` exists; links to `LICENSE` and vice versa via headers.
- Running `node --loader ts-node/esm src/ts/layer1/TSsh.ts LicenseTool check` on a clean repo returns success.
- New files without headers cause CI failure.
- Headers include: SPDX line, copyright, copyleft/backlinks, AI-GPL note for `scrum.pmo`.

## Definition of Done
- CI green on main with header check enabled.
- Tools documented in README or `scrum.pmo` notes.
- All tracked file types in repo have headers applied.