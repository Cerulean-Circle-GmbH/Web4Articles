[Back to Planning](./planning.md) | [Back to Task 3](./task-3.md)

# Task 3.3 — Developer: Prompt colors (user cyan, root red, path yellow)

[subtask:uuid:e3a1c2b4-5d67-4f89-9abc-0123def45678]

## Status
- [x] Planned
- [x] In Progress
 - [x] QA Review
 - [x] Done

## Traceability
- up
  - [Task 3: Command prompt from $PS1 or hostname user@pwd](./task-3.md)
- related requirements
  - i want color in the prompt. the user name is cyan. if the user is root, the username is red. the current patth is yellow. (see `requiremnents.md`)

## Task Description
Render the prompt with colors: username cyan (red if root), current path (pwd base) yellow. Keep the rest default. Ensure colors do not break width calculations.

## Steps
1. Extend `RangerView.prompt()` to colorize components with ANSI sequences.
2. Detect "root" by checking `process.getuid?.() === 0` (fallback to username === 'root').
3. Use cyan (36) for normal username, red (31) for root, yellow (33) for path; avoid coloring host.
4. Truncate final composed preview to terminal width.

## Acceptance Criteria
- Prompt shows colored username and path as specified; root user displays red username.
- No misalignment or overflow occurs due to color codes.

## QA Audit & User Feedback
- [ ] QA review pending.


