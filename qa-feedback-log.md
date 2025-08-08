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
