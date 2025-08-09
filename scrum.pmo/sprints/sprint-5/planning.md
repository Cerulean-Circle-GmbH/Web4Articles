# Sprint 5 Planning

## Sprint Goal
Deliver a complete architect specification for TS Ranger v2 under `src.v2`, consolidating Sprint 2 learnings, QA feedback, and existing tests. No implementation in this sprint. Ensure the spec enables reusing current tests unchanged to validate v2.

## Task List (Sprint 5)

> Note: MAIN tasks are numbered 1..N and SUBTASKS use 1.M. Only MAIN tasks may be in refinement; SUBTASKS are role-specific and skip refinement.

- [ ] [Task 1: Architect — TS Ranger v2 End-to-End Specification](./task-1.md)
  **Priority:** 1
  - [ ] [Task 1.1 — Architect: MVC, IO Abstractions, and State Model](./task-1.1-architect-tsranger-v2-spec.md)
  - [ ] [Task 1.2 — Architect: Test-Binding Spec to Reuse Existing Tests](./task-1.2-architect-test-binding-spec.md)
  - [ ] [Task 1.3 — Architect: Consolidate QA Learnings into Normative Behaviors](./task-1.3-architect-qa-learnings-consolidation.md)
  - [ ] [Task 1.4 — Architect: Docs Column, TSCompletion Integration, and Execution Bridge](./task-1.4-architect-execution-and-docs-spec.md)

- [ ] [Task 2: Architect — src.v2 Structure and Migration Plan](./task-2.md)
  **Priority:** 2
  - [ ] [Task 2.1 — Architect: Module Boundaries and File Layout in `src.v2`](./task-2.1-architect-srcv2-structure.md)

- [ ] [Task 3: Architect — Acceptance Criteria and Test Matrix Mapping](./task-3.md)
  **Priority:** 2
  - [ ] [Task 3.1 — Architect: Map existing `test/tsranger.*.test.ts` to v2 behaviors](./task-3.1-architect-test-matrix.md)

---

**Process Notes (2025-08-09):**
- This sprint delivers specifications only; implementation is deferred to the next sprint. Specs must be sufficient for Developers/Testers to implement and validate v2 with zero changes to the current tests.
- Maintain backlinks and traceability with UUID requirements in `requiremnents.md` per PO/ScrumMaster process.