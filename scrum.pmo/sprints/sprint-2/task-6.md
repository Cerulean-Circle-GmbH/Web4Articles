[Back to Planning](./planning.md)

# Task 6: Make [Tab] behave like Right Arrow in TS Ranger

[task:uuid:68c7b5a4-3d2e-4f1a-9b8c-7a6d5e4f3a2b]

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:f1a2b3c4-5d6e-7f89-a0b1-c2d3e4f5a6b7](./requiremnents.md)

## Task Description
Map the [Tab] key to the same behavior as Right Arrow: move to the next column while preserving selection and filters.

## Steps
1. Update input handling in `RangerController` to treat `\t` as right.
2. Ensure behavior is disabled during parameter entry mode.
3. Add a scripted test to press [tab] and assert the selected column advances.

## Acceptance Criteria
- Pressing [tab] has the same effect as Right Arrow in normal navigation.

## QA Audit & User Feedback
- [ ] QA review pending.
  - [x] Feedback: "tsranger test \"te[tab]w\"" confirms [Tab] completion is intuitive and should mirror right-arrow behavior when not editing.


