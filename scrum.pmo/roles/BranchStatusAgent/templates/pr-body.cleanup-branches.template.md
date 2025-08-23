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