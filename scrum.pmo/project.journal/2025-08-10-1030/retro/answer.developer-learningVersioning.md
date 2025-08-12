[Back to Retro Instructions](./retro-instructions.md)

# [Developer learning Versioning](./answer.developer-learningVersioning.md#typo:Settiles_Scribe) — Retrospective (2025-08-10)

## 1. Role Description After Recovery (as ScrumMaster)
### [Detailed](./answer.developer-learningVersioning.md#typo:Settiles) Role Description
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


