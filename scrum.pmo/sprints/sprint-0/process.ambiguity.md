[Back to Planning](./planning.md)

- [x] MAIN vs SUBTASK naming and numbering
  - Ambiguity: Early tasks used mixed numbering (`Task 8` vs `task-1.7`).
  - Resolution: Adopt MAIN `task-N` and SUBTASK `task-N.M` (M starts at 1). Only MAIN tasks may be in refinement.

- [x] UUID usage across tasks
  - Ambiguity: Only requirements had UUIDs.
  - Resolution: Add `[task:uuid:<uuidv4>]` to MAIN tasks and `[subtask:uuid:<uuidv4>]` to SUBTASKS. Keep `[requirement:uuid:<uuidv4>]` linkage bidirectional.

- [x] Backlinks and navigation
  - Ambiguity: Some files lacked consistent backlinks or had duplicates.
  - Resolution: First line must contain a backlink. Never duplicate.

- [x] Artifact embedding policies
  - Ambiguity: PUML/SVG presence and embedding inconsistent.
  - Resolution: Render and embed SVGs in tasks; Architect process documents rendering steps.

- [x] Environment verification
  - Ambiguity: Local tooling prerequisites were implicit.
  - Resolution: Add DevOps checks (Docker/devcontainer, Node engines, PlantUML/Graphviz, gh) and plan a devcontainer sprint.

- [ ] Ongoing audit before Sprint 0 acceptance
  - Action: Re-verify Sprint 0 tasks conform to these items; update lagging files before acceptance.

