[Back to Planning Sprint 2](./planning.md)

# Task 3: Command prompt from $PS1 or hostname user@pwd

[task:uuid:82c3d4e5-f6a7-48b9-a012-3b4c5d6e7f90]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:3c2b5a8e-9d1f-4a2f-8b6e-7c1d5f2a4b93](./requiremnents.md)
- down
  - [Task 3.1: Developer — Command prompt for preview using $PS1 (hostname user@pwd)](./task-3.1-developer-command-prompt-ps1.md)

## Task Description
Add a shell-like command prompt to the preview line in TSRanger. Prefer reading `$PS1`; if undefined or unusable, synthesize `[hostname] user@pwd`.

## Context
Aligned with Sprint 0 requirements on UX familiarity and readability. Mirrors bash prompt patterns to improve discoverability.

## Intention
Increase familiarity and clarity of the preview line by prefacing the command with a recognizable prompt.

## Steps
- Read `process.env.PS1`; sanitize to a one-line prompt.
- If `PS1` is not available, compute `[hostname] user@pwd` via Node APIs.
- Prepend the prompt to the command preview line without breaking layout; truncate to terminal width.
- Verify behavior in scripted test mode and manual runs.

## Requirements
- Prompt is always present in the preview.
- Control sequences from `$PS1` do not corrupt layout.
- Works with different terminal sizes and environments.

## Acceptance Criteria
- Preview line displays a prompt before the command in all cases.
- Tests (scripted mode/manual) confirm behavior with/without `$PS1` set.

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example



