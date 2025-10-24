<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

### Branch Review

- Reference branch: {{reference_branch}}

- Do not touch branches:
{{#each protected_branches}}
  - {{this}}
{{/each}}

- Unmerged into {{reference_branch}}:
{{#each not_merged_main}}
  - [ ] {{this}}
{{/each}}

- Unmerged into release/dev:
{{#each not_merged_release_dev}}
  - [ ] {{this}}
{{/each}}

- Merged into {{reference_branch}}:
{{#each merged_main}}
  - [x] {{this}}
{{/each}}