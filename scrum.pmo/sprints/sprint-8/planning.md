# Sprint 8 Planning

## PR
- Title: analyze ranger

## Sprint Goal
Analyze and formalize TSRanger TUI behavior from README and code, derive comprehensive key input test cases, and produce concrete requirements.

## Deliverables
- `ranger.tui.behavior.md`: Detailed behavior of Python ranger TUI (authoritative)
- `ranger.requirements.md`: Functional/non-functional requirements and acceptance criteria for ranger
- `ranger.keyinput.testcases.md`: Derived key input test cases for ranger
- `tsranger.tui.behavior.analyzed.md`: Current TSRanger behavior (for contrast)

## Task List (Sprint 8)
- [ ] Task 1.0: Architect — Ranger (Python) TUI Behavior Spec (`ranger.tui.behavior.md`)
- [ ] Task 1.1: PO — Ranger Requirements (`ranger.requirements.md`)
- [ ] Task 1.2: Tester — Ranger Key Input Test Cases (`ranger.keyinput.testcases.md`)
- [ ] Task 1.3: ScrumMaster — Clarify naming to disambiguate ranger vs tsranger across docs
- [ ] Task 1.4: Developer — Map differences to potential TSRanger parity plan (no code change)

## Notes
- Sources: `README.md` (§TSRanger), `src/ts/layer2-5/*`, tests under `test/tsranger.*.test.ts`.
- No runtime regressions expected; this sprint is primarily analysis/spec/testing.