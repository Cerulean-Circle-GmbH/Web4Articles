[Back to Planning](./planning.md)

# Task 1.6 — PO: User Guide and Demo Scenarios

[subtask:uuid:6f809123-e5f6-4061-9234-5c6d7e8f9012]

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] drafting
- [ ] QA Review
- [ ] Done

## Goal
Document how to run and use the TS Ranger shell, with copy-pasteable examples.

## Contents
- Quickstart:
  - Prereq: Node 18+, repo cloned, dev deps installed
  - Run: `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`
- Concepts: Columns, filters, preview, execution
- Keyboard reference: arrows, enter, backspace, esc/q
- Examples:
  - Navigate to `GitScrumProject` → `create` → type `project` → select `Web4Scrum` → execute
  - `TSsh` → `installCompletion` to install completion
- Troubleshooting: ESM loader, TTY issues, logging via `LOG_LEVEL`

## Acceptance Criteria
- A single page guide under `docs/tsranger-user-guide.md` with screenshots or ASCII diagrams
- Linked from `README.md` (optional short blurb)

## QA Audit & User Feedback
- [ ] QA review pending.

## Subtasks
- None (atomic task for this sprint).