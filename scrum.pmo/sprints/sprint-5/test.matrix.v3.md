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

## Next Steps
- Use this behavior as the baseline for Sprint 5 Task 3 implementation
- Ensure any test matrix implementation maintains this clear navigation/advancement separation
- Document any deviations from this behavior as potential bugs