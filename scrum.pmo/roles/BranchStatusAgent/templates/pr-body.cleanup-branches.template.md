<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Cleanup Branches

This PR adds or updates the branch status checklist and proposes cleanup actions.

- Reference branch: {{reference_branch}}
- Protected branches:
{{#each protected_branches}}
  - {{this}}
{{/each}}

## Summary
- Merged branches: {{merged_count}}
- Not merged branches: {{not_merged_count}}

## Notes
- Please review “Not merged” items and confirm desired actions (keep, continue work, or archive).
- Protected branches are excluded from any deletion.

Links:
- Checklist: {{checklist_path}}
- Recovery note (if any): {{recovery_path}}