[Back to Role](../process.md)

# Release Integration Checklist

- [ ] Start on `release/dev`; create `cursor/release-integration-YYYY-MM-DD-HHMM`
- [ ] Create journal folder and `project.state.md`/`branch-overview.md`
- [ ] Import add/modify-only role/process changes from source branch
- [ ] Three-way merge for `process.md` conflicts
- [ ] Update `branch-overview.md` with unresolved PRs and merged-into-release/dev
- [ ] Commit and push after each step
- [ ] Open PR to `release/dev`; link journal and diffs
- [ ] Run non-interactive test snapshot; attach summary

