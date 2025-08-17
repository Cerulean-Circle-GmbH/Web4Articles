[Back to Sprints](../sprints.overview.md)

# Sprint 11 Planning — TS Tooling for Recovery/CI

## Sprint Goal

Replace brittle shell one-liners with small, testable ESM TypeScript tools integrated with `TSRanger`/`TSsh` for journaling, PR reporting, protected-path scanning, and link hygiene.

## Scope

- Implement minimal viable tools for: PR listing, journal generation, branch overview, backlink validator, protected-path scanner.
- Integrate into CI workflows and recovery process.

## Stories

1. PR Reporter Tool  
   - As a ScrumMaster, I need a TS tool to list open PRs to `release/dev` as a Markdown task list.
2. Journal Generator  
   - As a ScrumMaster, I need a TS tool to render `project.state.md` from a template with variables.
3. Branch Overview Renderer  
   - As a ScrumMaster, I need a TS tool to render `branch-overview.md` including unresolved PRs.
4. Protected-Path Diff Scanner  
   - As a DevOps, I need a TS tool to detect deletions under protected paths.
5. Backlink/Cross-link Validator  
   - As a PO, I need a TS tool to verify backlinks and internal links and optionally autofix backlinks.

## Definition of Done

- Tools run locally and in CI; JSON/MD output stable  
- Unit tests passing with Vitest  
- Workflows call tools instead of inline shell logic  
- Recovery doc updated to use the tools  
- Journal entries reproducible with one command

## References

- Requirements: [`requiremnents.md`](./requiremnents.md)  
- Retro answers: see links in requirements reading list

