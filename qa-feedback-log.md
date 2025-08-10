# QA Feedback Log (2025-08-06)

- 2025-08-04 — sprint-1/task-1.0-architect-tssh-spec.md:
  - Issue: PlantUML mixed sequence and component/package elements in one diagram; confusing and invalid.
  - Resolution: Split into two PUML files and reference both in artifacts:
    - docs/puml/tssh-architecture.puml (Sequence/Flow)
    - docs/puml/tssh-architecture-structure.puml (Component/Package)
  - Outcome: Clearer onboarding and maintainability.

- 2025-08-03 — sprint-0/task-5.2-developer-implementation.md:
  - Issue: Completion script failed across directories due to TS_NODE_PROJECT path handling.
  - Gap: Automated tests did not simulate real shell usage; bug escaped CI.
  - Finding: After suppressing Node warnings, shell still showed no completions.
  - Action Items: Fix shell/backend so completions appear; add an end-to-end shell completion test covering env and cwd.

- Multiple sprint tasks/templates:
  - QA review pending placeholders remain; collect and append concrete feedback after execution.

*Update this file as new QA feedback is received or audits are performed.*

- 2025-08-08 — sprint-2/task-1.6-developer-refactor-tsranger.md:
  - Issue: Classes extracted but placed in incorrect layers (model should be in `layer2`, controller in `layer4`, view in `layer5`).
  - Resolution: Move `RangerModel` to `src/ts/layer2/`, `RangerController` to remain in `src/ts/layer4/`, and `RangerView` to `src/ts/layer5/`; update imports accordingly.
  - Outcome: Code aligns with project layering principles without behavior change; tests remain green.

- 2025-08-10T09:33:46Z — Project Retro Scheduling:
  > not bad. add  qa questions. what topic was the elephant in the room, that became an obvious obstacle but was not chatted about. which elephant in the room was discovered and named as a major obstacle. where solutions provided or described by qa. where where the solution approaches documented.
  > 
  > the existing questions in the interview file are perfect, but they shall be in the retro instruction file, that every agent should read. the instruction file shall not repeat the questions rephrased but have them as the single source of truth for each agent. the interview file shall be a prompt as short as possible just telling the agent what to read to understand. it needs to make clear that the agent has to commit his answer to the branch and the location unambiguously. the agent needs to make sure he can switch to that branch without losing uncommitted parts in his current branch or state. add this to the project qa feedback and rewrite both files.
  - Spelling-corrected summary (post-quote): Add QA questions on "elephant in the room" obstacles, solutions, and documentation references. Consolidate all interview questions in `retro-instructions.md` as the source of truth; keep `agent-interview.md` a minimal prompt that directs agents to read instructions and commit answers (ensuring safe branch switch) to the specified retro folder/branch.
