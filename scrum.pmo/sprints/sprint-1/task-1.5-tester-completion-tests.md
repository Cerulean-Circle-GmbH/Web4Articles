[Back to Planning](./planning.md)


[Back to Main Task](./task-1-tssh-wrapper.md)

# Task 1.5: Tester - Add and Run Completion Test Cases for oosh and tssh

## Naming Conventions
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md`
- This file: `task-1.5-tester-completion-tests.md`

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Task Description
Add and execute test cases for tab completion in both `oosh` and `tssh` CLI tools. Ensure that completion for `TSsh` and its methods works as expected, and that shell default file completion does not occur when a method is available.

## Context
Completion logic must be robust and consistent across both oosh and tssh. This ensures a seamless developer experience and prevents shell fallback behavior.

## Intention
Guarantee that tab completion for `TSsh` and its methods (e.g., `installCompletion`) works identically in both oosh and tssh, and that only valid completions are shown. Shell-style options and unsupported arguments are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).

## Steps
- Add automated and/or manual test cases for the following scenarios:
  1. `oosh TSsh installCompletion`
  2. `oosh TSs[Tab]`
  3. `oosh TSsh in[Tab]`
- In each case, verify that `installCompletion` is suggested and not the default file completion of the shell.
- Repeat the same tests for the `tssh` shell script.
- Document all test results and any issues found.

## Requirements
 The following test cases must be covered:

 ```
 oosh TSsh installCompletion
 ```

 ```
 oosh TSs[Tab]
 ```

 ```
 oosh TSsh in[Tab]
 ```

 In these cases, `installCompletion` is expected, not the default file completion of the shell.

 The same cases must be tested on the `tssh` shell script as on `oosh`.

## Acceptance Criteria
- All specified test cases are implemented and executed for both oosh and tssh.
- `installCompletion` is suggested as a completion in all relevant cases.
- No shell fallback file completion occurs when a method is available. No shell-style options or unsupported arguments are ever suggested. Invalid/unsupported input yields silence (no suggestions, no errors).
- Test results are documented in this file.

## QA Audit & User Feedback
- [ ] QA review pending.
- [ ] Feedback to be collected after subtask completion.

## Subtasks
- None (atomic subtask for this sprint).

---

[Back to Main Task](./task-1-tssh-wrapper.md)
