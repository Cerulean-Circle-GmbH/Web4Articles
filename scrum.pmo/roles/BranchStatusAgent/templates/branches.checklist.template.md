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