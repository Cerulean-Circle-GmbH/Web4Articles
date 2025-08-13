### Branch Review

- Reference branch: {{reference_branch}}

- Do not touch branches:
{{#each protected_branches}}
  - {{this}}
{{/each}}

- Merged into {{reference_branch}}:
{{#each merged}}
  - [x] {{this}}
{{/each}}

- Not merged into {{reference_branch}}:
{{#each not_merged}}
  - [ ] {{this}}
{{/each}}