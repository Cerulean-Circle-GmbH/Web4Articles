[Back to Sprint 5 Planning](./planning.md) | [Back to Task 6](./task-6-tester-validate-v2-with-existing-tests.md)

# Task 6.7: Tester — Navigation Prompt Consistency Validation
[subtask:uuid:h8i9j0k1-l2m3-4567-8901-234567hijklm]

## Naming Conventions
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-6.7-tester-navigation-prompt-validation.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Create comprehensive validation tests for navigation prompt consistency to ensure PromptStateManager implementation fixes all prompt update issues.

## Context
TRON discovered that "prompt line is not always updated as expected after each navigation." Need systematic testing to validate PromptStateManager fixes all prompt consistency issues.

**TRON QA Finding:**
> "prompt line is not always updated as expected after each navigation"

## Intention
Create test suite that:
- Validates prompt updates after every navigation operation
- Tests long navigation chains for consistency
- Ensures prompt accuracy across all scenarios
- Validates PromptStateManager implementation

## Steps
1. **Design navigation prompt validation tests**
2. **Implement single navigation operation tests**
3. **Create long navigation chain tests**
4. **Add multi-column navigation validation**
5. **Implement prompt accuracy verification**
6. **Document navigation test scenarios**

## Requirements
- **Comprehensive Coverage:** All navigation operations tested for prompt updates
- **Consistency Validation:** Prompt updates consistently after every operation
- **Long Chain Testing:** Extended navigation sequences maintain accuracy
- **Multi-Column Testing:** Navigation across all columns validated
- **Performance Testing:** No degradation in navigation performance

## Acceptance Criteria
- [ ] **AC1:** Prompt updates correctly after every navigation operation ([up]/[down]/[left]/[right])
- [ ] **AC2:** Long navigation chains maintain prompt accuracy throughout
- [ ] **AC3:** Multi-column navigation prompt consistency validated
- [ ] **AC4:** No missing or incorrect prompt displays after any operation
- [ ] **AC5:** Prompt accuracy verification across all scenarios
- [ ] **AC6:** Navigation performance regression testing
- [ ] **AC7:** All tests pass with PromptStateManager implementation
- [ ] **AC8:** Test documentation clear for maintenance

## Test Scenarios
**Navigation Prompt Consistency Tests:**
```typescript
describe('Navigation Prompt Consistency Validation', () => {
  it('Prompt updates after every navigation operation', () => {
    const operations = ['down', 'up', 'left', 'right'];
    
    operations.forEach(operation => {
      const out = runScripted(operation);
      const promptLine = getPromptLine(out);
      
      expect(promptLine).toBeTruthy();
      expect(promptLine.trim()).not.toBe('');
    });
  });

  it('Long navigation chains maintain prompt consistency', () => {
    const longChain = '[down][down][up][right][left][down]';
    const out = runScripted(longChain);
    const promptLine = getPromptLine(out);
    
    expect(promptLine).toBeTruthy();
    expect(promptLine).not.toMatch(/undefined|null|error/i);
  });

  it('Multi-column navigation maintains prompt accuracy', () => {
    const multiColumn = '[right][down][right][down][left][up]';
    const out = runScripted(multiColumn);
    const promptLine = getPromptLine(out);
    
    expect(promptLine).toBeTruthy();
    expect(getSelectedColumn(out)).toBeDefined();
  });
});
```

**Edge Cases and Stress Testing:**
- Rapid navigation sequences
- Boundary navigation (top/bottom of lists)
- Column transition navigation
- Navigation with filter states

## QA Audit & User Feedback
- [ ] [2025-08-19T09:25:00Z] TRON prompt inconsistency discovery
  - [x] Issue: Prompt not always updated after navigation
  - [ ] Resolution: Comprehensive navigation prompt validation
  - [ ] Example: All navigation operations maintain prompt consistency
- [ ] [UTC timestamp] PromptStateManager validation testing
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example

## Subtasks
None (atomic subtask for this sprint).
