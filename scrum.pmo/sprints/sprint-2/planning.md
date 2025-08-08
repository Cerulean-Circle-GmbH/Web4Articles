# Sprint 2 Planning

## Sprint Goal
Deliver a ranger-like interactive shell (TS Ranger) that leverages `TSCompletion` and the existing CLI pattern to navigate and execute TypeScript classes and methods with discoverable completions and minimal keystrokes.

## Task List (Sprint 2)

- [ ] [Task 1: Architect - TS Ranger shell specification](./task-1.0-architect-ranger-spec.md)
  **Priority:** 1
- [ ] [Task 2: Developer - Interactive TUI shell (core navigation)](./task-1.1-developer-ranger-tui.md)
  **Priority:** 1
- [ ] [Task 3: Developer - Integrate `TSCompletion` for live suggestions](./task-1.2-developer-completion-integration.md)
  **Priority:** 2
- [ ] [Task 4: Developer - Command execution bridge to `DefaultCLI`](./task-1.3-developer-execution-bridge.md)
  **Priority:** 2
- [ ] [Task 5: Tester - E2E keyboard navigation and execution tests](./task-1.4-tester-e2e-tests.md)
  **Priority:** 3
- [ ] [Task 6: PO - User guide and demo scenarios](./task-1.5-po-user-guide.md)
  **Priority:** 3
- [ ] [Task 7: Developer - Refactor TSRanger to one class per TS file](./task-1.6-developer-refactor-tsranger.md)
  **Priority:** 2
- [ ] [Task 8: Developer - Blue/White footer, blank spacer, and colorized command preview](./task-1.7-developer-footer-and-color-preview.md)
  **Priority:** 2
- [ ] [Task 9: Developer - Sequential parameter entry and auto-execute](./task-1.8-developer-parameter-entry.md)
  **Priority:** 1

---

**Process Update (2025-08-08):**
Introduced Sprint 2 to deliver a ranger-like interactive shell on top of the current CLI/TSCompletion foundation. Tasks are sequenced to avoid blockers: specification first, core TUI, completion integration, execution bridge, tests, then documentation. Footer must remain anchored to the last terminal line (with a blank spacer above), the command preview is above that spacer, and the layout re-renders on terminal resize to use as many lines as available.

---

For daily status updates and next planned steps, see `sprint-0/daily.md`.