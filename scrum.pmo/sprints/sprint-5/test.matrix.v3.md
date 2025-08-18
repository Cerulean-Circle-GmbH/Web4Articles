# Test Matrix v3 - TSRanger v2.0 Behavior Documentation

## Overview
This test matrix documents the actual behavior of TSRanger v2.0 after reverting to pre-test.matrix.md state (commit 2345bfe).

## Test Date: 2025-08-17

## Key Findings

### Navigation Mode ([down] sequences)
- Navigation with arrow keys moves through classes without showing methods
- Each [down] moves to the next class in the list
- Prompt line shows only the selected class name

### Tab Behavior ([tab] after navigation)
- [tab] acts as a selection/advancement key
- Transitions from class navigation to method selection mode
- Populates the Methods column with the selected class's methods

## Test Results

### Single [down] Navigation
| Input | Selected Class | Methods Shown | Parameters Shown |
|-------|----------------|---------------|------------------|
| [down] | OOSH | No | No |
| [down][down] | OOSH | No | No |
| [down][down][down] | ParameterParser | No | No |
| [down][down][down][down] | TSsh | No | No |
| [down][down][down][down][down] | DefaultCLI | No | No |
| [down][down][down][down][down][down] | GitScrumProject | No | No |

### [down] + [tab] Combinations
| Input | Navigation → Selection | Methods Column | Parameters Column | Notes |
|-------|------------------------|----------------|-------------------|--------|
| [down][tab] | OOSH → Logger | log | msg, level | Tab changes selection to Logger |
| [down][down][tab] | OOSH → OOSH | start, dispatch, help, create | - | Tab activates OOSH methods |
| [down][down][down][tab] | ParameterParser → ParameterParser | parse | - | Tab activates ParameterParser |
| [down][down][down][down][tab] | TSsh → TSsh | start, dispatch, help, installCompletion | - | Tab activates TSsh methods |
| [down][down][down][down][down][tab] | DefaultCLI → DefaultCLI | start | - | Tab activates DefaultCLI |
| [down][down][down][down][down][down][tab] | GitScrumProject → GitScrumProject | start, create, createProject, createTemplateRepo, linkSource, overlayRun, releasePlan | - | Tab shows all GitScrumProject methods |

## Behavior Summary

### Navigation Mode
1. Arrow keys ([down], [up], [left], [right]) are for navigation only
2. No methods are displayed during navigation
3. Prompt line shows only the class name
4. Focus remains in Classes column

### Advancement Mode ([tab])
1. [tab] advances from class selection to method browsing
2. Methods column populates with the selected class's methods
3. If the class has parameters, they appear in the Params column
4. The prompt line continues to show the selected class

### Key Differences from v1
- v1: Shows "[Classes] (5)" indicating it processed "[down]5" as a position
- v2: Properly navigates through classes with each [down] press
- v2: Clear separation between navigation and selection modes

## Test Command Used
```bash
components/TSRanger/v2.0/sh/tsranger test "[sequence]"
```

## Reverted State
- Commit: 2345bfe (Revert "Revert "Revert "Revert "fix: Navigation should clear filter mode, not set filters"""")
- Files reverted:
  - components/TSRanger/v2.0/src/ts/layer4/RangerController.ts
  - components/TSRanger/v2.0/src/ts/layer5/RangerView.ts

## Recommendations
1. This behavior appears correct and intuitive
2. Navigation mode clearly separated from advancement mode
3. [tab] consistently acts as a selection/advancement key
4. The prompt line behavior is predictable and consistent

## Additional Test Cases from PDCAs and QA Feedback

### Filter Mode Tests
| Input | Expected Behavior | QA Feedback | Notes |
|-------|-------------------|-------------|--------|
| g | Filter Classes to GitScrumProject | "g" filters correctly | Basic filter working |
| g[tab] | GitScrumProject start | "does not update to method anymore" | **BUG**: Should show first method |
| g[tab][left] | GitScrumProject (no method) | "prompt still having 'g:' wrongly" | **BUG**: Filter residue |
| g[right] | GitScrumProject → Methods column | Should behave like [tab] | Navigation to methods |
| g[right][down] | GitScrumProject → next method | Complex navigation | Method selection |
| g[right][down][left] | GitScrumProject (no filter) | "no filter should be set on class" | **BUG**: Filter not cleared |
| g[right][down][right][left][tab] | Should show method name | "should have method name and no filter" | Complex sequence |

### Navigation + Tab Tests
| Input | Expected Behavior | QA Feedback | Notes |
|-------|-------------------|-------------|--------|
| [down][up] | Logger (no method) | "should never have a method" | Navigation only |
| t[tab] | TSsh start | Should show method with cursor | Filter + advancement |
| t[tab][down] | TSsh dispatch | Method navigation | Working correctly |
| t[tab][down][left] | TSsh (no method) | "must remove the method again" | Retreat behavior |
| [tab] | Logger log | "shall add the method log to Logger" | Direct advancement |
| [right] | Logger log | "same on [right]" | Should match [tab] |
| [tab][left] | Logger (no method) | Retreat from advancement | Working correctly |

### Complex Navigation Sequences
| Input | Expected Behavior | QA Feedback | Notes |
|-------|-------------------|-------------|--------|
| g[down] | Navigate to next class after GitScrumProject | "down to GitScrumProject [tab] sets filter" | **BUG**: Sets unwanted filter |
| [down]×5[tab] | GitScrumProject start | "does not add method in prompt" | **BUG**: Navigation state interferes |
| [down]×5[down] | GitScrumProject → next method | "does not add method" | **BUG**: No method shown |

### Filter Operations
| Input | Expected Behavior | QA Feedback | Notes |
|-------|-------------------|-------------|--------|
| g[backspace] | Clear filter, show all classes | Filter clearing | Should work |
| g[tab]c | GitScrumProject create (filter methods by 'c') | Method filtering | Should filter methods |
| g[tab][backspace]×5 | Remove method chars, then class chars | Progressive deletion | Token-aware backspace |

### Cursor Position Tests
| Input | Expected Behavior | Cursor Position | Notes |
|-------|-------------------|-----------------|--------|
| [tab] | Logger log | Logger [l]og | Cursor on first method char |
| g | GitScrumProject | [G]itScrumProject | Cursor on first class char |
| g[tab] | GitScrumProject start | GitScrumProject [s]tart | Cursor on first method char |
| t[tab][down][left] | TSsh | [T]Ssh | Cursor returns to class |

### Key Bugs Identified from QA
1. **Filter Advancement Bug**: `g[tab]` doesn't show method anymore
2. **Filter Residue Bug**: `g[tab][left]` leaves "g:" in prompt
3. **Navigation State Bug**: `[down]×5[tab]` doesn't add method
4. **Filter Clear Bug**: `g[right][down][left]` doesn't clear filter
5. **Navigation Filter Bug**: `g[down]` sets unwanted filter

## Architectural Issues from PDCAs
1. **DRY Violations**: Multiple prompt update paths in View, Controller, and Model
2. **OOP Violations**: Poor encapsulation with direct state manipulation
3. **Mixed Responsibilities**: Display logic scattered across components
4. **Condition Logic Flaw**: `current.trim().length === 0` prevents advancement after filters

## Test Command Used
```bash
components/TSRanger/v2.0/sh/tsranger test "[sequence]"
```

## Next Steps
- Use this behavior as the baseline for Sprint 5 Task 3 implementation
- Fix identified bugs before implementing test matrix
- Ensure any test matrix implementation maintains this clear navigation/advancement separation
- Address architectural issues to prevent future bugs