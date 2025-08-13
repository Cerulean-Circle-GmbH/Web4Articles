# Sprint 7 Planning

## Sprint Goal
Deliver TS Ranger v2.5 under `src.v2.5`, building upon Sprint 5's v2 implementation and Sprint 6's versioned folder structure. Implement a component-based directory organization that supports better modularity and maintainability.

## Extended Sprint Intent
Building on Sprint 5's TSRanger v2 and Sprint 6's versioned folder refactoring, Sprint 7 delivers TSRanger v2.5 with a refined component-based architecture under `src.v2.5`. This sprint focuses on:
- The same behaviors and outputs that current tests assert (zero test changes)
- Clear separation of IO vs rendering via a `TerminalIO` abstraction for determinism
- A simple toggle (`TSRANGER_V2=1`) to run v2.5 end-to-end from the existing shell wrapper and tests
- Execution bridge parity and robust error handling
- Component-based directory structure for better organization

## Task List (Sprint 7)

> Note: MAIN tasks are numbered 1..N and SUBTASKS use 1.M. Only MAIN tasks may be in refinement; SUBTASKS are role-specific and skip refinement.

- [x] [Task 1: Architect — TS Ranger v2.5 End-to-End Specification](./task-1.md)
  **Priority:** 1
  - [x] [Task 1.1 — Architect: MVC, IO Abstractions, and State Model](./task-1.1-architect-tsranger-v2-spec.md)
  - [x] [Task 1.2 — Architect: Test-Binding Spec to Reuse Existing Tests](./task-1.2-architect-test-binding-spec.md)
  - [x] [Task 1.3 — Architect: Consolidate QA Learnings into Normative Behaviors](./task-1.3-architect-qa-learnings-consolidation.md)
  - [x] [Task 1.4 — Architect: Docs Column, TSCompletion Integration, and Execution Bridge](./task-1.4-architect-execution-and-docs-spec.md)

- [x] [Task 2: Architect — src.v2.5 Structure and Migration Plan](./task-2.md)
  **Priority:** 2
  - [x] [Task 2.1 — Architect: Module Boundaries and File Layout in `src.v2.5`](./task-2.1-architect-srcv2-structure.md)

- [x] [Task 3: Architect — Acceptance Criteria and Test Matrix Mapping](./task-3.md)
  **Priority:** 2
  - [x] [Task 3.1 — Architect: Map existing `test/tsranger.*.test.ts` to v2 behaviors](./task-3.1-architect-test-matrix.md)

- [ ] [Task 4: Architect — PUML Diagrams and SVG Artifacts for TS Ranger v2](./task-4.md)
  **Priority:** 2
  - [ ] [Task 4.1 — Architect: Sequence/Flow Diagram (PUML)](./task-4.1-architect-puml-sequence.md)
  - [ ] [Task 4.2 — Architect: Structure/Component Diagram (PUML)](./task-4.2-architect-puml-structure.md)
  - [ ] [Task 4.3 — Architect: Render SVGs and Link in Docs](./task-4.3-architect-svg-render.md)

- [ ] [Task 5: Developer — Implement TS Ranger v2 in `src.v2`](./task-5-developer-implement-v2.md)
  **Priority:** 1
  - [ ] [Task 5.1 — Developer: IO Abstraction (`TerminalIO`, NodeProcessIO, DeterministicTestIO`)](./task-5.1-developer-io-terminalio.md)
  - [ ] [Task 5.2 — Developer: Model (`layer2/RangerModel.ts`)](./task-5.2-developer-model.md)
  - [ ] [Task 5.3 — Developer: View (`layer5/RangerView.ts`)](./task-5.3-developer-view.md)
  - [ ] [Task 5.4 — Developer: Controller (`layer4/RangerController.ts`)](./task-5.4-developer-controller.md)
  - [ ] [Task 5.5 — Developer: Entry (`layer4/TSRanger.ts`) and routing](./task-5.5-developer-entry-routing.md)
  - [ ] [Task 5.6 — DevOps: Shell wrapper toggle in `src/sh/tsranger`](./task-5.6-devops-shell-toggle.md)
  - [ ] [Task 5.7 — Developer: Non-interactive smoke run validation](./task-5.7-developer-integration-smoke.md)
  - [ ] [Task 5.8 — Developer: KeyboardController abstraction (`layer4/KeyboardController.ts`)](./task-5.8-developer-keyboard-controller.md)
  - [ ] [Task 5.9 — Developer: Integrate KeyboardController into RangerController](./task-5.9-developer-integrate-keyboard-controller.md)

- [ ] [Task 6: Tester — Run existing tests against v2 via toggle](./task-6-tester-validate-v2-with-existing-tests.md)
  **Priority:** 1
  - [ ] [Task 6.1 — Tester: Execute suite with `TSRANGER_V2=1`](./task-6.1-tester-run-with-toggle.md)
  - [ ] [Task 6.2 — Tester: Triage any diffs; file fix tasks; re-run](./task-6.2-tester-triage-and-fix-loop.md)
  - [ ] [Task 6.3 — Tester: Final green report and sign-off](./task-6.3-tester-final-green-report.md)
  - [ ] [Task 6.4 — Tester: KeyboardController unit tests for key mapping and sequences](./task-6.4-tester-keyboard-controller-tests.md)

---

**Process Notes (2025-08-09):**
- Maintain backlinks and traceability with UUID requirements in `requiremnents.md` per PO/ScrumMaster process.

## QA Feedback (Verbatim)

### 2025-08-09T00:00:00Z
> create a tsranger shell script like in /Users/Shared/Workspaces/2cuGitHub/Web4Articles/src
> to make it easy to start /Users/Shared/Workspaces/2cuGitHub/Web4Articles/src.v2/ts/layer4/TSRanger.ts