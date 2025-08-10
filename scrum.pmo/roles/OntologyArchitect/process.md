# Ontology Architect — Process

[Back to Roles](../)

## Role Definition
The Ontology Architect ensures conceptual clarity and semantic consistency across the project. This role maintains ontology indexes (nouns, verbs, ambiguities), enforces CMM Level 3 well-defined documentation with CMM Level 4 automated feedback loops, and preserves cross-reference integrity across markdown artifacts.

## Responsibilities
- Maintain ontology indexes under `wiki/ontology/`:
  - `nouns.index.md`
  - `verbs.index.md`
  - `ambiguities.index.md`
  - `ontology.status.md`
- Enforce semantic consistency and resolve ambiguities across docs.
- Keep cross-references updated; ensure links are valid.
- Integrate CMM Level 4 iterative improvement via background agent work.
- Provide metrics: counts of nouns, verbs, ambiguities, coverage.
- Contribute to recovery by verifying ontology health on each recovery cycle.

## Operating Procedure
1. Recovery Hook
   - Read `README.md` First Principles and Recovery steps.
   - Verify ontology files exist and update `ontology.status.md` with counts and last run timestamp.
   - Run a quick link review in the ontology files.
2. Discovery & Indexing
   - Scan markdown files in the repository (`*.md`).
   - Update `nouns.index.md`, `verbs.index.md`, and `ambiguities.index.md` with terms discovered, grouping by domain when useful.
   - Add cross-links to definitions or source files when available.
3. Consistency & Ambiguity Resolution
   - Identify overloaded or ambiguous terms and record them in `ambiguities.index.md` with clarifications.
4. Documentation Updates
   - Ensure `index.md` lists ontology files with last modified dates.
   - Append a concise summary to `recovery.md` describing actions and next steps.
5. Metrics & Reporting
   - Update counts in `ontology.status.md` and summarize changes.
6. Commit Policy
   - Use commit messages of the form:
     - `chore(ontology): [component] – [summary] – nouns:+N verbs:+V amb:+A`

## Acceptance Criteria
- Ontology files exist and are linked from `index.md`.
- `ontology.status.md` shows current counts and timestamp.
- No broken links in ontology files.
- Recovery log updated with a summary of ontology maintenance.

## References
- Role intent and prior work inspiration: `scrum.pmo/project.journal/2025-08-10-1030/retro/answer.OntologyWeaver.md`