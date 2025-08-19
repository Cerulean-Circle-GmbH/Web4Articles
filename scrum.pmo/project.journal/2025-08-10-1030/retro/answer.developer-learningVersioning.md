[Back to Retro Instructions](/scrum.pmo/project.journal/2025-08-10-1030/retro/retro-instructions.md)

# [Developer learning Versioning](/scrum.pmo/project.journal/2025-08-10-1030/retro/answer.developer-learningVersioning.md#typo:Settiles_Scribe) — Retrospective (2025-08-10)

## 1. Role Description After Recovery (as ScrumMaster)
### [Detailed](/scrum.pmo/project.journal/2025-08-10-1030/retro/answer.developer-learningVersioning.md#typo:Settiles) Role Description
As ScrumMaster, I ensure recovery from `README.md` initializes first principles and project guardrails (ESM-only, deterministic tests, versioned units, backlinks/traceability). I coordinate roles, keep the board updated, and enforce commit/push after each step.

## 2. Achievements
- Established Versioned Units policy and global first principles; added verbatim QA capture rules. Files: `docs/versioned-units.md`, `docs/first-principles.md`, role `process.md` updates.
- Created v2 wrapper to launch `src.v2/ts/layer4/TSRanger.ts`. File: `src.v2/sh/tsranger`.
- Organized Sprint 6 refactor plan for top-level `v2/src` and `v2/test`. Files: `scrum.pmo/sprints/sprint-6/*`.
- Migrated Sprint 5 QA feedback into `scrum.pmo/sprints/sprint-5/qa.md` and linked tasks with actions.

## 3. Recurring Problems
### 3.1 Context drift (folders as contexts)
- Examples: QA notes spread between root and sprint folders; versioned code referencing older src.
- Root cause: Weakly enforced context boundaries.
- Fix: Versioned-units policy; move QA to sprint-local `qa.md`.

### 3.2 Non-interactive vs interactive ambiguity
- Examples: v2 wrapper exits; tests assume scripted mode.
- Root cause: Missing stdin loop.
- Fix: Plan KeyboardController and stdin integration (tasks 5.8/5.9).

## 4. QA Feedback Review
- Helpful: Verbatim constraints (quote with UTC), never share files across versions, folders-as-context guidance.
- Confusing: Multiple QA file locations; resolved by sprint-local `qa.md` and global `qa.md` for PDCA index.

## 5. Process Improvements (Actionable)
- Enforce commit/push after each step; embed in background agent PDCA.
- Add “Occam’s Razor” to first principles: prefer simplest working method.
- Strengthen DevOps process to favor agent-native edits, use shell only if necessary.

## 6. QA “Elephant in the Room” Analysis
- The elephant: cross-version coupling and context leakage. Solution: strict versioned units and context discipline; wrapper toggles; sprint-scoped QA logs.



## 7. Source/Version Folder Evolution (tree examples)

### A. Before v2 introduction
```text
Web4Articles/
  src/
    ts/
      layer1/
      layer2/
      layer3/
      layer4/
      layer5/
    sh/
  test/
```

### B. Introducing v2 (parallel implementation)
```text
Web4Articles/
  src/                      # v1 remains
  src.v2/                   # v2 scaffolding appears (parallel to v1)
    ts/
      io/
      layer2/
      layer4/
      layer5/
    sh/
      tsranger              # v2 wrapper (directly launches v2 entry)
  test/                     # tests still target v1 by default
  test.v2/                  # (scaffold) version-scoped tests for v2 (toggle-driven)
```

### C. Planned refactor to version-rooted layout (Sprint 6 proposal)
```text
Web4Articles/
  v2/
    src/                    # moved from src.v2/ts → v2/src
      io/
      layer2/
      layer4/
      layer5/
    test/                   # moved from test.v2 → v2/test
    sh/
      tsranger              # launches v2/src entry
  src/                      # legacy v1 remains isolated
  test/                     # legacy v1 tests remain
```

Notes:
- No shared files across versions; migrate units into the active version.
- Wrapper routes by version; tests use env toggles to select v2.
- All imports inside a version resolve relative to that version’s `src/`.


## 8. What the Layers Mean (understanding)

- Layer 1 (Foundations): Low-level primitives and utilities used everywhere. In v1 this includes `Logger`, `OOSH`, `ParameterParser`, `TSsh`. No dependency on higher layers.
- Layer 2 (Domain/Models): Core domain logic and state. Examples: `GitScrumProject` (business operations), `RangerModel` (TUI state). Minimal UI/IO; no process coupling.
- Layer 3 (Contracts/Interfaces): Public interfaces and coordination contracts. Examples: `CLI`, `Completion`, `Project`. Higher layers depend on these abstractions.
- Layer 4 (Orchestration/Controllers/Entry): Control flow and integration. Examples: `RangerController`, `TSCompletion` (bridge), `TSRanger` (entry). Executes commands by resolving to Layer 1/2 modules; no rendering responsibilities.
- Layer 5 (Presentation/View): Pure rendering given model state and terminal dimensions. Example: `RangerView` formats grid, prompt, footer; applies styles after layout; no business logic.
- IO (v2): `io/TerminalIO` abstracts terminal width/height, resize, and output. Enables deterministic, non-interactive tests and separates environment concerns from View/Controller.

Dependency direction: higher layers may depend on lower ones (e.g., 4 → 2/1, 5 → 2/IO), never the reverse. Tests map to layers: prompt spacing/colors (Layer 5), prompt-line behaviors (Layer 4 + Layer 2), docs column (Layer 5 + TSCompletion bridge), tab/arrow semantics (Layer 4), model invariants (Layer 2).

## 9. What I understand from UCP (Use Case Points)

- Purpose: UCP estimates software size/effort from functional scope (use cases) adjusted by technical and environmental factors.
- Core formula: UCP = (UAW + UUCW) × TCF × ECF, then effort = UCP × PF
  - UAW (Unadjusted Actor Weight): sum of actors by complexity weights
    - Simple (API/system) = 1, Average (text protocol/CLI) = 2, Complex (GUI/human) = 3
  - UUCW (Unadjusted Use Case Weight): sum of use cases by transaction count
    - Simple (≤3 tx) = 5, Average (4–7) = 10, Complex (≥8) = 15
  - TCF (Technical Complexity Factor): 13 factors (0–5) with weights; TCF = 0.6 + 0.01 × Σ(Ti × Wi)
  - ECF (Environmental Complexity Factor): 8 factors (0–5) with weights; ECF = 1.4 + (−0.03) × Σ(Ei × Wi)
  - PF (Productivity Factor): team/productivity constant (e.g., 20 person-hours/UCP), calibrated from history
- Application to this repo (example):
  - Actors: shell user (Complex, GUI-like TUI=3), CI runner (Simple=1), developer (Average=2)
  - Use cases: “Navigate and execute TS Ranger command” (Complex), “Install completion” (Average), “Docs lookup” (Simple)
  - Technical/environmental: determinism, ESM, CI automation, versioned units, team experience
  - Outcome: quantify sprint scope for v2 TUI (navigation, docs, execution) and compare estimate vs. actual commit/test cycles to calibrate PF

## 10. UCP in Web4 (Units, Components, Packages)

> ok. i understand from it the 1969 componentn definition.
> we use it in Web4. 
> UCP abreviates Unit,Components, Packages.
> everything is a unit, unless its a component.
> packages are components that are not composed from fundametal units but from components.
> 
> thats why we called the files, units. add a section to reflect on this.

Reflection and mapping (repo-specific):
- Unit: the fundamental file-level artifact (one class/interface per `.ts` file). Our “files as units” convention aligns with this.
- Component: a cohesive module composed of units. Example: the TS Ranger TUI feature composed of `RangerModel` (unit), `RangerView` (unit), `RangerController` (unit), and `TSRanger` entry (unit).
- Package: a higher-level component-of-components. Example: the entire `v2/src` TUI stack (multiple components) or a distributable CLI bundle that aggregates multiple components.
- Version boundaries: units/components/packages are version-scoped (e.g., `src.v2` or planned `v2/src`). No cross-version sharing; migrate the necessary units/components per version.
- Testing lens: unit tests (file-level invariants), component tests (feature behavior across units), package tests (end-to-end via wrapper and environment toggles).

## 11. Proposed Sprint 2 Backport Tasks (template-style)

- [ ] Task 8 — Versioning & Context Discipline
  - [ ] Task 8.1 — Architect: Backport Versioned Units Policy to Sprint 2
    - Describe Units (files), Components (composed of units), Packages (composed of components)
    - Forbid cross-version imports; folders are contexts
    - Add compliant/non-compliant examples
  - [ ] Task 8.2 — Developer: Remove cross-version imports and migrate units
    - Grep `src.v2` for `../../../src/ts` references; migrate required units into v2; update imports
    - Ensure tests run with `TSRANGER_V2=1` without referencing v1 modules

## 12. Build a New Version from Scratch vs. Incremental Migration

- Starting fresh (new version folder) is preferable when:
  - Cross-version coupling is pervasive and costly to unpick
  - Architectural boundaries (L1..L5, IO) changed significantly
  - Test parity can be maintained via env toggles and deterministic outputs
- Incremental migration suits cases where:
  - Existing structure already matches the layered model
  - Only isolated units need migration to remove cross-version references
- For this repo:
  - v2 is already isolated under `src.v2`; wrapper toggles exist
  - A clean `v2/src` + `v2/test` move (Sprint 6 plan) will keep history coherent and reduce coupling
  - Therefore, creating a new version folder and migrating units there is the safer path than retrofitting v1, while preserving test parity via toggles


