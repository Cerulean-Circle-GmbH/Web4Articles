[Back to Role](../process.md)

# Release Integration PR — ${TS}

## Summary

- Integrates role/process changes from `${SOURCE_BRANCH}` into `release/dev`
- Preserves canonical assets and adds journal entry `${TS}`

## Highlights

- Role imports: `${ROLE_PATHS}`
- 3-way merged process docs: `${PROCESS_FILES}`
- Journal: `scrum.pmo/project.journal/${TS}/`

## Checks

- [ ] Backlinks present in all changed markdown
- [ ] No deletions under protected paths
- [ ] Branch overview updated with unresolved PRs and merged-into-release/dev

