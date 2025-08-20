[Back to Sprint 5 Planning](./planning.md) | [Back to Task 7](./task-7-emergency-filter-bug-fix.md)

# Task 7.3: Developer — Filter Logic Replacement
[subtask:uuid:c3d4e5f6-g7h8-9012-3456-789012cdefgh]

## Naming Conventions
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-7.3-developer-filter-logic-replacement.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Task Description
Replace scattered filter logic throughout TSRanger codebase with centralized FilterStateEngine. Remove duplicate filter update paths that cause state corruption and ensure single source of truth for filter management.

## Context
Current filter logic is scattered across RangerModel, RangerController, and RangerView causing multiple disconnected update paths. Need to replace all filter operations with centralized FilterStateEngine calls.

**From Architect Analysis:** Filter corruption occurs due to scattered filter logic in multiple classes. Solution requires replacing all filter operations with centralized engine calls.

## Intention
Replace all filter logic with FilterStateEngine:
- Remove scattered filter update logic
- Replace with centralized FilterStateEngine calls
- Ensure single source of truth for filter state
- Eliminate all possibilities for state corruption

## Steps
1. **Identify all filter update locations** in current codebase
2. **Replace RangerModel filter logic** with FilterStateEngine calls
3. **Replace RangerController filter operations** with engine calls
4. **Replace RangerView filter display logic** with engine queries
5. **Remove duplicate filter update methods**
6. **Validate all filter operations use centralized engine**

## Requirements
- **Centralized Logic:** All filter operations must use FilterStateEngine
- **No Duplication:** Remove all scattered filter update logic
- **Backward Compatibility:** Maintain existing filter functionality
- **Performance:** No degradation in filter operation performance
- **Testing:** All existing filter tests must continue to pass

## Acceptance Criteria
- [ ] **AC1:** All filter operations replaced with FilterStateEngine calls
- [ ] **AC2:** RangerModel filter logic removed and replaced
- [ ] **AC3:** RangerController filter operations use centralized engine
- [ ] **AC4:** RangerView filter display queries centralized engine
- [ ] **AC5:** No duplicate filter update methods remain
- [ ] **AC6:** All existing filter functionality preserved
- [ ] **AC7:** Existing filter tests continue to pass
- [ ] **AC8:** No filter state corruption possible

## Implementation Locations
**Current Filter Logic Locations:**
- `RangerModel`: `filters[]`, `deriveFiltersFromPrompt()`
- `RangerController`: `clearClassFilter()`, filter update logic
- `RangerView`: `buildColoredCommand()` filter display logic

**Replacement Strategy:**
```typescript
// BEFORE: Scattered filter logic
this.model.filters[0] = newFilter;
this.model.deriveFiltersFromPrompt();

// AFTER: Centralized FilterStateEngine
const result = this.filterEngine.addCharacter(char);
this.model.updateFromFilterResult(result);
```

## QA Audit & User Feedback
- [ ] [UTC timestamp] Filter logic replacement review pending
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example
- [ ] [UTC timestamp] Integration testing feedback
  - [ ] Issue
  - [ ] Resolution
  - [ ] Example

## Subtasks
None (atomic subtask for this sprint).
