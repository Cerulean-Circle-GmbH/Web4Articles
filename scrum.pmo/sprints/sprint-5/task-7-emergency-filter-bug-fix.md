[Back to Sprint 5 Planning](./planning.md)

# Task 7: Emergency — TSRanger Critical Filter Bug Fix
[task:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def]

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-7.1-developer-filter-state-engine.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Add `[task:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def]` to this task.
- If the task is requirement-driven, add `[requirement:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def]` and backlink to `requiremnents.md`.
```
  - up
    - [requirement:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def](./requiremnents.md)
```
- In `requiremnents.md`, append the same UUID and a link back to this task (`([task-7](./task-7-emergency-filter-bug-fix.md))`).
- For each subtask, add `[subtask:uuid:<uuidv4>]`.
- add 
```
  - down
    - [Task 7.1: Developer — FilterStateEngine Implementation](./task-7.1-developer-filter-state-engine.md)
    - [Task 7.2: Tester — Filter Corruption Test Cases](./task-7.2-tester-filter-corruption-tests.md)
    - [Task 7.3: Developer — Filter Logic Replacement](./task-7.3-developer-filter-logic-replacement.md)
```

## Task Description
**EMERGENCY PRIORITY:** Fix critical filter corruption bug that makes TSRanger unusable. When users type `[t][backspace][g]`, the filter incorrectly shows "tg" instead of "g", and the application state becomes corrupted requiring restart.

## Context
TRON discovered through manual testing that multi-step filter operations corrupt filter state. This is a blocking bug that affects core user workflow and must be fixed immediately before any other development work can proceed.

**User Story:**
> As a TSRanger user, when I type and backspace filter characters, I want the filter to show only the remaining characters, not accumulate deleted characters, so that I can filter effectively without the application becoming unusable.

## Intention
Implement immutable filter operations that prevent state corruption through atomic updates with rollback capability. Replace scattered filter logic with centralized FilterStateEngine that ensures consistent state management.

## Steps
1. **FilterStateEngine Implementation** (Task 7.1): Create immutable filter operations
2. **Test Case Development** (Task 7.2): Comprehensive test coverage for filter corruption scenarios
3. **Filter Logic Replacement** (Task 7.3): Replace existing scattered filter logic with centralized engine

## Requirements
- Include `[requirement:uuid:f1a2b3c4-d5e6-7f89-0abc-123456789def]` backlink to `requiremnents.md`.
- Ensure bidirectional links: task → requirements and requirements → task.
- **CRITICAL:** Filter corruption must be completely eliminated
- **ATOMIC:** All filter operations must be atomic and reversible
- **CENTRALIZED:** Single source of truth for filter state management
- **TESTED:** Comprehensive test coverage prevents regression

## Acceptance Criteria
- [ ] **AC1:** Typing `[t][backspace][g]` results in filter showing "g" not "tg"
- [ ] **AC2:** Multiple backspace+type sequences don't accumulate deleted characters  
- [ ] **AC3:** Filter state remains consistent and usable after all operations
- [ ] **AC4:** Application doesn't require restart after filter corruption scenarios
- [ ] **AC5:** All existing filter functionality preserved and working
- [ ] **AC6:** FilterStateEngine implemented with immutable operations
- [ ] **AC7:** Comprehensive test coverage for multi-step filter operations
- [ ] **AC8:** Filter logic centralized and scattered logic eliminated

## QA Audit & User Feedback
- [ ] [2025-08-19T09:25:00Z] TRON QA discovery - Critical filter corruption bug
  - [x] Issue: "[t][backspace][g] results wrongly in a 'tg' filter and prompt while 'g' would be naturally right"
  - [ ] Resolution: FilterStateEngine with immutable operations
  - [ ] Validation: Manual testing confirms filter corruption eliminated
- [ ] [UTC timestamp] Post-implementation validation feedback pending
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example

## Subtasks
- [Task 7.1: Developer — FilterStateEngine Implementation](./task-7.1-developer-filter-state-engine.md)
- [Task 7.2: Tester — Filter Corruption Test Cases](./task-7.2-tester-filter-corruption-tests.md)
- [Task 7.3: Developer — Filter Logic Replacement](./task-7.3-developer-filter-logic-replacement.md)
