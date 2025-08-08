# See also:
- [Tech Stack](../../../docs/tech-stack.md#typescript-shells--cli-execution)
 [Architect Spec](task-1.1-architect-tssh-spec.md)

[Back to Main Task](./task-1-tssh-wrapper.md)

# Task 1.5: Tester - Add and Run Completion Test Cases for oosh and tssh

## Naming Conventions

## Status
## Goal
Test the Bash completion for `tssh`, ensuring it is robust, user-friendly, and supports advanced interactive UX:
  - [ ] refinement
  - [ ] creating test cases
## Status
**OOSH** is a full bash replacement, with all navigation and scripting features of ranger/nushell, delegating TypeScript/ESM logic to tssh. See [Tech Stack](../../docs/tech-stack.md#typescript-shells--cli-execution).

Ensure that completion for `TSsh` and its methods works as expected, and that shell default file completion does not occur when a method is available.

## Context
Completion logic must be robust and consistent across both oosh and tssh. This ensures a seamless developer experience and prevents shell fallback behavior.

## Intention
Guarantee that tab completion for `TSsh` and its methods (e.g., `installCompletion`) works identically in both oosh and tssh, and that only valid completions are shown. Shell-style options and unsupported arguments are never suggested. Invalid/unsupported input yields silence (no suggestions, no errors).

## Steps
  1. `oosh TSsh installCompletion`
  2. `oosh TSs[Tab]`
  3. `oosh TSsh in[Tab]`

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

## QA Audit & User Feedback

## Subtasks


[Back to Main Task](./task-1-tssh-wrapper.md)
