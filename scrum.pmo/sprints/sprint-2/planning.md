# Sprint 2 Planning

## Sprint Goal
Deliver a ranger-like interactive shell (TS Ranger) that leverages `TSCompletion` and the existing CLI pattern to navigate and execute TypeScript classes and methods with discoverable completions and minimal keystrokes.

## Task List (Sprint 2)

> Note: MAIN tasks are numbered 1..N and SUBTASKS use 1.M. Only MAIN tasks may be in refinement; SUBTASKS are role-specific and skip refinement.

- [x] [Task 1: Architect - TS Ranger shell specification](./task-1.md)  
  SUBTASKS:
  - [x] [Task 1.1 — Architect: TS Ranger Shell Specification (role-specific)](./task-1.1-architect-ranger-spec.md)
  - [x] [Task 1.2: Developer - Interactive TUI shell (core navigation)](./task-1.2-developer-ranger-tui.md)
  - [x] [Task 1.3: Developer - Integrate `TSCompletion` for live suggestions](./task-1.3-developer-completion-integration.md)
  - [x] [Task 1.4: Developer - Command execution bridge to `DefaultCLI`](./task-1.4-developer-execution-bridge.md)
  - [ ] [Task 1.5: Tester - E2E keyboard navigation and execution tests](./task-1.5-tester-e2e-tests.md)
  - [ ] [Task 1.6: PO - User guide and demo scenarios](./task-1.6-po-user-guide.md)
  - [x] [Task 1.7: Developer - Refactor TSRanger to one class per TS file](./task-1.7-developer-refactor-tsranger.md)
  **Priority:** 1
- [x] [Task 1.1: Developer - Interactive TUI shell (core navigation)](./task-1.1-developer-ranger-tui.md)  
  **Priority:** 1
- [x] [Task 1.2: Developer - Integrate `TSCompletion` for live suggestions](./task-1.2-developer-completion-integration.md)  
  **Priority:** 2
- [x] [Task 1.3: Developer - Command execution bridge to `DefaultCLI`](./task-1.3-developer-execution-bridge.md)  
  **Priority:** 2
- [ ] [Task 1.4: Tester - E2E keyboard navigation and execution tests](./task-1.4-tester-e2e-tests.md)  
  **Priority:** 3
- [ ] [Task 1.5: PO - User guide and demo scenarios](./task-1.5-po-user-guide.md)  
  **Priority:** 3
- [x] [Task 1.6: Developer - Refactor TSRanger to one class per TS file](./task-1.6-developer-refactor-tsranger.md)  
  **Priority:** 2
- [ ] [Task 2: Footer height/spacing and colorized command preview](./task-2.md)  
  SUBTASKS:
  - [ ] [Task 2.1: Developer - Footer height/spacing adjustments](./task-2.1-developer-footer-height-and-spacing.md)
  - [ ] [Task 2.2: Developer - Blue/White footer and colorized command preview](./task-2.2-developer-footer-and-color-preview.md)
  - [ ] [Task 2.3: Developer - Fix selected row indentation across columns](./task-2.3-developer-fix-selected-row-indentation.md)
  **Priority:** 2
- [ ] [Task 3: Command prompt from $PS1 or hostname/user/pwd](./task-3.1-developer-command-prompt-ps1.md)  
  SUBTASKS:
  - [ ] [Task 3.1: Developer - Command prompt from $PS1 or hostname/user/pwd](./task-3.1-developer-command-prompt-ps1.md)
  **Priority:** 2

---

**Process Update (2025-08-08):**
- Introduced Sprint 2 to deliver a ranger-like interactive shell on top of the current CLI/TSCompletion foundation. Tasks are sequenced to avoid blockers: specification first, core TUI, completion integration, execution bridge, tests, then documentation.
- Requirements in `requiremnents.md` are linked bidirectionally with tasks for traceability per PO process.

---

For daily status updates and next planned steps, see [sprint-0/daily.md](../sprint-0/daily.md).