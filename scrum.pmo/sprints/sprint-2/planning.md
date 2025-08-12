[Back to Sprints](../)

# Sprint 2 Planning

## Sprint Goal
Deliver a ranger-like interactive shell (TS Ranger) that leverages `TSCompletion` and the existing CLI pattern to navigate and execute TypeScript classes and methods with discoverable completions and minimal keystrokes.

## Task List (Sprint 2)

> Note: MAIN tasks are numbered 1..N and SUBTASKS use 1.M. Only MAIN tasks may be in refinement; SUBTASKS are role-specific and skip refinement.

- [x] [Task 1: Architect - TS Ranger shell specification](./task-1.md)  
  **Priority:** 1
  - [x] [Task 1.1: Architect — TS Ranger Shell Specification (role-specific)](./task-1.1-architect-ranger-spec.md)
  - [x] [Task 1.2: Developer - Interactive TUI shell (core navigation)](./task-1.2-developer-ranger-tui.md)
  - [x] [Task 1.3: Developer - Integrate `TSCompletion` for live suggestions](./task-1.3-developer-completion-integration.md)
  - [x] [Task 1.4: Developer - Command execution bridge to `DefaultCLI`](./task-1.4-developer-execution-bridge.md)
  - [ ] [Task 1.5: Tester - E2E keyboard navigation and execution tests](./task-1.5-tester-e2e-tests.md)
  - [ ] [Task 1.6: PO - User guide and demo scenarios](./task-1.6-po-user-guide.md)
  - [x] [Task 1.7: Developer - Refactor TSRanger to one class per TS file](./task-1.7-developer-refactor-tsranger.md)
  
- [x] [Task 2: Footer height/spacing and colorized command preview](./task-2.md)  
  **Priority:** 2
  - [x] [Task 2.1: Developer - Footer height/spacing adjustments](./task-2.1-developer-footer-height-and-spacing.md)
  - [x] [Task 2.2: Developer - Blue/White footer and colorized command preview](./task-2.2-developer-footer-and-color-preview.md)
  - [x] [Task 2.3: Developer - Fix selected row indentation across columns](./task-2.3-developer-fix-selected-row-indentation.md)
  
- [x] [Task 3: Command prompt from $PS1 or hostname/user/pwd](./task-3.md)  
  **Priority:** 2
  - [x] [Task 3.1: Developer - Command prompt from $PS1 or hostname/user/pwd](./task-3.1-developer-command-prompt-ps1.md)
  - [x] [Task 3.2: Developer - Prompt spacing (exactly one empty line above command)](./task-3.2-developer-prompt-spacing.md)
  - [x] [Task 3.3: Developer - Prompt colors (user cyan, root red, path yellow)](./task-3.3-developer-prompt-colors.md)

- [x] [Task 4: Replace Preview with Documentation Column and Extend TSCompletion for Docstrings](./task-4.md)  
  **Priority:** 2
  - [x] [Task 4.1 — Architect: Documentation Column and Docstring Extraction Spec](./task-4.1-architect-docs-spec.md)
  - [x] [Task 4.2 — Developer: Extend TSCompletion to expose TypeScript JSDoc for Class/Method/Params](./task-4.2-developer-tscompletion-docs.md)
  - [x] [Task 4.3 — Developer: Replace Preview with Docs column (selected element docstring)](./task-4.3-developer-docs-column.md)
  - [x] [Task 4.4 — Tester: E2E scripted checks for Docs column](./task-4.4-tester-e2e-docs.md)
  - [x] [Task 4.5 — PO: Update user guide for Docs column](./task-4.5-po-user-guide-update.md)

- [x] [Task 5: Document Classes for TSCompletion and Add Ranger Doc Rendering Tests](./task-5.md)  
  **Priority:** 2
  - [x] [Task 5.1 — Developer: Enrich class JSDoc across layer1/layer2 targets](./task-5.1-developer-enrich-jsdoc.md)
  - [x] [Task 5.2 — Tester: Add scripted tests asserting Docs column shows JSDoc for TestClass](./task-5.2-tester-docs-column-tests.md)

- [ ] [Task 6: Make [Tab] behave like Right Arrow in TS Ranger](./task-6.md)  
  **Priority:** 3

- [ ] [Task 7: Refactor typing model to prompt-line editing with cursor and shell-like completion](./task-7.md)  
  **Priority:** 3
  - [ ] [Task 7.1 — Developer: Prompt-line sync and navigation fixes](./task-7.1-developer-promptline-sync.md)
  - [ ] [Task 7.2 — Tester: Scripted non-interactive coverage and contracts](./task-7.2-tester-scripted-noninteractive.md)
  - [ ] [Task 7.3 — Developer: Scenario-driven ENV configuration](./task-7.3-developer-env-scenarios.md)
  - [ ] [Task 7.4 — Developer: KeyboardController extraction and delegation](./task-7.4-developer-keyboard-controller.md)

---

**Process Update (2025-08-08):**
- Introduced Sprint 2 to deliver a ranger-like interactive shell on top of the current CLI/TSCompletion foundation. Tasks are sequenced to avoid blockers: specification first, core TUI, completion integration, execution bridge, tests, then documentation.
- Requirements in `requiremnents.md` are linked bidirectionally with tasks for traceability per PO process.

---

For daily status updates and next planned steps, see [sprint-0/daily.md](../sprint-0/daily.md).
