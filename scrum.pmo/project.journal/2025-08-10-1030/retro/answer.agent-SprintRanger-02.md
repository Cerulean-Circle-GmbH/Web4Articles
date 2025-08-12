# Agent Retro — SprintRanger-02

[Back to Retro Instructions](./01.retro-instructions.what.md)

## Repository origin
- Web4Articles on GitHub

## Branch and scope
- Retro branch: `retro/2025-08-10-agent-retro`
- Working sprint: Sprint 5 (TS Ranger v2, column-based refactor tasks added)

## What went well
- v2 implementation under `src.v2` with clean MVC and IO abstraction (`TerminalIO`), enabling deterministic tests.
- PDCA loop with immediate mitigations and commit/push after each run improved visibility and velocity.
- Prompt-line behaviors (tab/right/cursor/edit) reached parity with tests.

## What didn’t go well / issues encountered
- Early ambiguity (spec-only vs. implement) slowed kick-off; we corrected the sprint intent.
- g[tab] method sync/filter behavior required multiple refinements to match nuanced UX.
- Retro instructions file was not present in this retro directory; we proceeded with inferred sections and evidence.

## What we learned
- Separate IO from rendering; stabilize test frames (final-only) to avoid flaky assertions.
- Maintain sprint-local QA/PDCA logs for traceability and quick diagnosis.
- Column-based design will simplify controller logic and make navigation/filtering consistent.

## Action items
- Architect: Column/Filter interfaces with PUML + SVG diagrams (Task 7.1).
- Developer: Implement `RangerColumn`, `RangerFilter`, and concrete columns (Task 7.2).
- Tester: Add column navigation/filter tests (Task 7.3).
- Finalize `KeyboardController` abstraction and integration.

## Evidence and links
- v2 sources: `src.v2/ts/**`
- Toggle wrapper: `src/sh/tsranger` (uses `TSRANGER_V2=1`)
- Sprint 5 planning: `scrum.pmo/sprints/sprint-5/planning.md`
- Column refactor tasks: `scrum.pmo/sprints/sprint-5/task-7*.md`
- PDCA: `scrum.pmo/sprints/sprint-5/qa.md` and `/workspace/qa.md`
- Background agent policy: `background.agent.md`

## Notes
- This is a second agent entry to preserve the original `answer.agent-SprintRanger-01.md`.

## Refactor Plan and Rationale (with tree examples)

Below is the target structure for a column-based TSRanger v2. This layout simplifies responsibilities, isolates concerns, and makes navigation/filter behavior reusable.

```text
src.v2/
  ts/
    interfaces/
      RangerFilter.ts           # apply(prefix), reset(), current(); single source of filter truth
      RangerColumn.ts           # setItems, applyFilter, clearFilter, moveSelection, getVisible, onSelect?
    columns/
      RangerClassColumn.ts      # lists classes via TSCompletion.getClasses(); onSelect -> sync prompt class
      RangerMethodColumn.ts     # lists methods for selected class; filter reflects typed method token
      RangerParamColumn.ts      # lists params for selected class+method; no prompt token editing
      RangerDocsColumn.ts       # wraps text for selected item; read-only column (no filter)
    layer2/
      RangerModel.ts            # holds selection state and prompt; delegates data to columns
    layer4/
      KeyboardController.ts     # raw key -> semantic actions; reusable parser for test scripts
      RangerController.ts       # wires columns, updates model, coordinates prompt sync
      TSRanger.ts               # entrypoint; chooses IO, instantiates controller
    layer5/
      RangerView.ts             # renders a 4-column grid using column.getVisible() and headers (with (filter))
    io/
      TerminalIO.ts             # NodeProcessIO + DeterministicTestIO for test-mode final frames
```

Why this change (lessons learned):
- Columns are conceptually the same control with different data sources. Unifying them cuts duplication and makes behavior consistent.
- Filters must be first-class, single-source-of-truth objects so headers reliably show `(prefix)` and tests remain deterministic.
- Controller logic shrinks: it consumes actions, forwards to the active column (`applyFilter`, `moveSelection`), and keeps prompt-in-sync on column `onSelect`.
- Testing is easier: columns can be unit-tested in isolation; controller/view integration remains stable.

Before (implicit coupling inside controller/model):

```text
src/ts/
  layer4/
    RangerController.ts   # mixes: key parsing, selection logic, filtering logic, prompt sync, data fetch
  layer5/
    RangerView.ts         # partially responsible for suggesting/mirroring tokens
```

After (explicit composition; clear boundaries):

```text
src.v2/ts/
  interfaces/             # contracts for columns/filters
  columns/                # pluggable columns for each domain (classes/methods/params/docs)
  layer4/                 # controller consumes actions + columns; keyboard parsing isolated
  layer5/                 # view renders columns; zero business logic
  io/                     # IO and test-mode frame handling
```

Example flows (tree + steps):

```text
Flow: g[tab][down]
1) KeyboardController -> Action.Tab
2) Controller completes ClassColumn to GitScrumProject; MethodColumn selected = start; suppress method filter
3) View renders headers: [Classes] (GitScrumProject), [Methods]
4) Down -> MethodColumn.moveSelection(+1) => 'create'
5) MethodColumn.onSelect('create') -> Controller syncs prompt: "GitScrumProject create"; cursor at method start
```

```text
Flow: g[tab]c
1) Tab: ClassColumn selects GitScrumProject; MethodColumn suggests start; suppress filter
2) typing 'c' -> MethodColumn.applyFilter('c'); header shows [Methods] (c)
3) View shows filtered methods: create, createProject, createTemplateRepo
```

Refactor acceptance hooks in code (sketch):

```ts
// RangerColumn<T>
export interface RangerColumn<T> {
  items: T[];
  filter: RangerFilter;
  selectedIndex: number;
  setItems(items: T[]): void;
  applyFilter(prefix: string): void;
  clearFilter(): void;
  moveSelection(delta: number): void;
  getVisible(): T[];
  onSelect?(item: T): void; // e.g., sync prompt on method selection
}
```

## Layer Responsibilities (what the layers mean)

- interfaces/
  - Defines stable contracts (`RangerColumn`, `RangerFilter`) that decouple controller/view from data specifics. Enables mocking and unit testing of behavior without UI/IO dependencies.

- columns/
  - Implements concrete column logic (Classes/Methods/Params/Docs) behind the common interfaces. Each column owns its data sourcing, filter application, selection rules, and optional `onSelect` prompt-sync hook.

- layer2/ (Model)
  - Holds application state: selected column/indexes, filters, prompt buffer/cursor, and param entry state. Emits derived views of state (e.g., `buildCommandParts`) but does not perform IO or rendering.

- layer4/ (Controller)
  - Orchestrates behavior. Consumes semantic key actions (via `KeyboardController`), delegates to the active column for filtering/selection, updates the model, and triggers prompt sync rules. Contains no rendering and no low-level IO.

- layer5/ (View)
  - Pure rendering. Given the model and columns’ `getVisible()` output, renders a deterministic 4-column grid with headers showing `(filter)` and a colorized prompt/footer. Contains no business logic.

- io/
  - IO boundary. `NodeProcessIO` bridges to real terminal; `DeterministicTestIO` guarantees stable width/height and final-frame capture for tests. No business rules here—only input/output mechanics.

## Units and UCP (Unit Change Policy)

- What are “Units”?
  - Cohesive, versioned building blocks (files, modules, or small packages) that deliver a single responsibility and can be evolved independently. In this repo, a unit is typically a TypeScript module or a minimal set of modules under a versioned root (e.g., `src.v2/ts/layer4/TSRanger.ts`).
  - Units carry clear boundaries and contracts (interfaces), making them testable in isolation and safe to compose.

- UCP — Unit Change Policy (intent)
  - Versioned-units policy: do not share files across versions; never import from old-version paths inside new-version units.
  - Routing over importing: select the correct version at the boundary (wrapper/entry), never at runtime by falling back to older modules.
  - Traceability: documentation/tasks must explicitly link the versioned unit path to eliminate ambiguity.
  - CI/Pre-commit enforcement: grep for cross-version imports (e.g., `../../../src/ts` inside `src.v2`) and block them.

- Why UCP matters
  - Prevents “version bleed” where behavior mixes across versions and makes tests flaky/non-deterministic.
  - Keeps refactors incremental: you can introduce a new unit version without destabilizing the existing one.
  - Enables reliable routing (e.g., `TSRANGER_V2=1`) and consistent test execution.

- Practical application in this sprint
  - v2 units live under `src.v2/ts/**`; wrappers route via env toggle. No v2 file imports from `src/ts/**` implementation modules.
  - Documentation and PDCA logs reference exact v2 paths to make review and audits straightforward.
