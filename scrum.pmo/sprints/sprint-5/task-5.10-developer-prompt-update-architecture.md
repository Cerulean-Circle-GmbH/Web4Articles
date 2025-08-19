[Back to Sprint 5 Planning](./planning.md) | [Back to Task 5](./task-5-developer-implement-v2.md)

# Task 5.10: Developer — Prompt Update Architecture Fix
[subtask:uuid:d4e5f6g7-h8i9-0123-4567-890123defghi]

## Naming Conventions
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-5.10-developer-prompt-update-architecture.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Implement centralized PromptStateManager to fix prompt update inconsistencies. Ensure prompt line updates consistently after every navigation operation.

## Context
TRON discovered that "prompt line is not always updated as expected after each navigation." Current prompt logic is mixed between display and business logic causing inconsistent updates.

**TRON QA Finding:**
> "prompt line is not always updated as expected after each navigation"

## Intention
Create PromptStateManager that:
- Centralizes all prompt update logic
- Ensures consistent prompt updates after every operation
- Separates prompt logic from display rendering
- Provides single source of truth for prompt state

## Steps
1. **Design PromptStateManager interface** with centralized updates
2. **Implement prompt update methods** for all operation types
3. **Add state validation** for prompt consistency
4. **Integrate with navigation operations**
5. **Replace scattered prompt logic** with centralized calls
6. **Add comprehensive testing** for prompt updates

## Requirements
- **Centralized Updates:** All prompt updates go through PromptStateManager
- **Consistent Behavior:** Prompt updates after every navigation operation
- **State Validation:** Ensure prompt state consistency
- **Performance:** No degradation in prompt update speed
- **Backward Compatibility:** Maintain existing prompt functionality

## Acceptance Criteria
- [ ] **AC1:** PromptStateManager implemented with centralized update logic
- [ ] **AC2:** Prompt updates correctly after every navigation operation ([up]/[down]/[left]/[right])
- [ ] **AC3:** Long navigation chains maintain prompt accuracy throughout
- [ ] **AC4:** No missing or incorrect prompt displays after any operation
- [ ] **AC5:** Prompt behavior predictable and consistent across all scenarios
- [ ] **AC6:** State validation ensures prompt consistency
- [ ] **AC7:** All existing prompt functionality preserved
- [ ] **AC8:** Comprehensive test coverage for prompt behavior

## Technical Implementation
```typescript
class PromptStateManager {
  private state: PromptState;
  
  // Single responsibility for all prompt updates
  updatePrompt(update: PromptUpdate): PromptResult {
    const newState = this.applyUpdate(this.state, update);
    
    if (!this.validatePromptState(newState)) {
      throw new PromptStateError("Invalid prompt state transition");
    }
    
    this.state = newState;
    return new PromptResult(newState);
  }
  
  // Navigation always updates prompt correctly
  updateForNavigation(navigation: NavigationResult): PromptResult {
    return this.updatePrompt({
      type: 'NAVIGATION',
      selectedClass: navigation.selectedClass,
      selectedMethod: navigation.selectedMethod,
      cursorPosition: 0
    });
  }
}
```

## QA Audit & User Feedback
- [ ] [2025-08-19T09:25:00Z] TRON discovery validation
  - [x] Issue: Prompt update inconsistencies after navigation
  - [ ] Resolution: PromptStateManager centralized updates
  - [ ] Example: Consistent prompt updates after all operations
- [ ] [UTC timestamp] Implementation validation feedback
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example

## Subtasks
None (atomic subtask for this sprint).
