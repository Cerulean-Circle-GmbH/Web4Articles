[Back to Sprint 5 Planning](./planning.md) | [Back to Task 7](./task-7-emergency-filter-bug-fix.md)

# Task 7.2: Tester — Filter Corruption Test Cases
[subtask:uuid:b2c3d4e5-f6g7-8901-2345-678901bcdefg]

## Naming Conventions
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-7.2-tester-filter-corruption-tests.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Create comprehensive test cases for filter corruption scenarios to prevent regression. Develop tests that validate the [t][backspace][g] → "g" fix and ensure multi-step filter operations work correctly.

## Context
TRON discovered critical filter corruption through manual testing. Need automated test coverage to prevent regression and validate FilterStateEngine implementation.

**TRON QA Finding:** 
> "typing [t][backspace][g] results wrongly in a 'tg' filter and prompt while 'g' would be naturally right"

## Intention
Create test suite that:
- Validates filter corruption fix works correctly
- Prevents regression of filter corruption bugs
- Tests all multi-step filter operation scenarios
- Ensures filter state remains consistent

## Steps
1. **Create filter corruption test cases** for TRON-discovered scenarios
2. **Implement multi-step filter operation tests**
3. **Add edge case testing** for complex filter sequences
4. **Create state consistency validation tests**
5. **Add performance regression tests**
6. **Document test scenarios** for future reference

## Requirements
- **Regression Prevention:** Tests must prevent filter corruption regression
- **Comprehensive Coverage:** All multi-step filter scenarios tested
- **Edge Case Coverage:** Complex filter sequences validated
- **Performance Validation:** No degradation in filter performance
- **Documentation:** Clear test scenarios for maintenance

## Acceptance Criteria
- [ ] **AC1:** Filter corruption test case for [t][backspace][g] → "g" scenario
- [ ] **AC2:** Multi-step filter operation tests (multiple backspace+type sequences)
- [ ] **AC3:** Edge case tests for complex filter sequences
- [ ] **AC4:** State consistency validation after all operations
- [ ] **AC5:** Performance regression tests for filter operations
- [ ] **AC6:** Application usability tests (no restart required)
- [ ] **AC7:** Test documentation for future maintenance
- [ ] **AC8:** All tests pass with FilterStateEngine implementation

## Test Case Examples
```typescript
describe('🚨 CRITICAL: Filter Corruption Prevention', () => {
  it('CRITICAL: [t][backspace][g] should result in "g" filter, not "tg"', () => {
    const out = runScripted('t[backspace]g');
    const filterState = extractFilterState(out);
    
    expect(filterState).toBe('g');
    expect(filterState).not.toBe('tg');
    
    const promptLine = getPromptLine(out);
    expect(promptLine).toMatch(/g$/);
    expect(promptLine).not.toMatch(/tg/);
  });

  it('Multiple backspace+type sequences should not accumulate', () => {
    const out = runScripted('a[backspace]b[backspace]c');
    const filterState = extractFilterState(out);
    
    expect(filterState).toBe('c');
    expect(filterState).not.toMatch(/[ab]/);
  });
});
```

## QA Audit & User Feedback
- [ ] [2025-08-19T09:25:00Z] TRON discovery validation
  - [x] Issue: Filter corruption in multi-step operations
  - [ ] Resolution: Comprehensive test coverage implementation
  - [ ] Example: [t][backspace][g] test case validation
- [ ] [UTC timestamp] Test execution feedback pending
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example

## Subtasks
None (atomic subtask for this sprint).
