<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

# Web4Articles AI-GPL Addendum (Draft – Do Your Research)

This document extends the GNU Affero General Public License v3.0 (AGPL-3.0) for the Web4Articles project to address AI-assisted usage and to clarify that certain process artifacts are treated as source code.

- Canonical AGPLv3 text: see `LICENSE` in this repository.
- This addendum is provided as a research draft (DYR). It is not legal advice. Consult a qualified attorney before relying on or publishing this text.

## 1. Relationship to AGPLv3

- This Addendum ("AI-GPL") supplements and does not replace AGPLv3.
- In case of conflict, the most restrictive copyleft interpretation consistent with AGPLv3 applies, unless you hold a separate dual-license agreement with the copyright holders.

## 2. Scope of “Source Code” and “Covered Work”

- For the purposes of this project, the following are considered part of the "preferred form for making modifications" and thus are "Source Code" under AGPLv3:
  - All TypeScript, shell scripts, configuration, documentation, and example files in this repository.
  - All `scrum.pmo` roles, processes, templates, SOPs, sprint plans, task definitions, and other process artifacts. These are treated as programmatic assets that directly govern and produce the project’s behavior.

## 3. AI-Assisted Usage Triggers Copyleft

- If you use any portion of this repository (including `scrum.pmo` files) to train, prompt, instruct, or otherwise direct an AI system or agent to produce outputs that replicate, implement, or substantially derive from this project, those outputs are a "Covered Work" under AI-GPL and must be licensed under AGPLv3 plus this AI-GPL Addendum, unless you have obtained a dual-license.
- "Substantially derive" includes outputs that encode or implement the same design, processes, roles, or logic such that the outputs are reasonably substitutable for the originals.

## 4. Network Use and Service Provision

- If a network service or AI agent exposes functionality that is materially based on this repository (including process artifacts), the complete corresponding source of the modified work, including prompts, policies, and orchestration logic, must be made available under AGPLv3 plus this Addendum to the users of that service.

## 5. Dual Licensing

- Commercial dual-licensing is available. Contact the maintainers for terms that allow proprietary use without the copyleft obligations of this Addendum.

## 6. Attribution and Backlinks

- All files in this repository must include a license header or frontmatter linking to:
  - AGPLv3: `./LICENSE`
  - AI-GPL Addendum (this file): `./AI-GPL.md`

## 7. Compatibility and SPDX

- SPDX: use `AGPL-3.0-only` or `AGPL-3.0-or-later` for the base license. The AI-GPL Addendum has no official SPDX identifier; note it as `AI-GPL-Addendum` in headers.

## 8. No Warranty

- As with AGPLv3, this Addendum is provided “AS IS”, without warranty of any kind.

---

By contributing to or using this repository, you agree to comply with AGPLv3 and this AI-GPL Addendum, unless a separate dual-license has been executed.