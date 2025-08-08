# Task 1.0 — Architect: TS Ranger Shell Specification

## Goal
Design a ranger-like, keyboard-first interactive shell (TS Ranger) that lists discoverable targets from TypeScript classes and methods, powered by `TSCompletion`. The shell must integrate with the existing `DefaultCLI` to execute selected actions.

## Scope
- Navigation model inspired by `ranger`/`fzf`: left/right to change columns (Classes → Methods → Params → Preview), up/down to move, enter to select/execute.
- Non-intrusive: runs as `node --loader ts-node/esm src/ts/layer4/TSRanger.ts` or through a wrapper `tssh TSranger start` (positional args only).
- Uses `TSCompletion` APIs for discovery and filtering.
- Executes via `DefaultCLI` with positional args only.
- No external frameworks beyond devDeps already allowed. Pure TypeScript ESM.

## UX
- Columns:
  - Classes: `TSCompletion.getClasses()`
  - Methods: `TSCompletion.getClassMethods(class)`
  - Params: `TSCompletion.getMethodParameters(class, method)`
  - Preview: shows command to execute (e.g., `tssh <Class> <Method> <Params...>`) with live updates
- Keyboard:
  - Up/Down: move selection
  - Left/Right: move between columns
  - Type to filter the active column
  - Enter: if on Params column with all required args resolved, executes; otherwise drill down
  - Backspace: clear filter
  - Esc/q: quit without changes

## Architecture
- New `src/ts/layer4/TSRanger.ts` exporting class `TSRanger` with `start()` static entry.
- Decouple rendering (terminal drawing) from data/completion:
  - `RangerModel`: selection state, filters, and lists
  - `RangerView`: minimal terminal renderer using ANSI escape codes
  - `RangerController`: input handling, lifecycle, and execution bridging
- Bridge execution via `DefaultCLI` by spawning `node --loader ts-node/esm src/ts/layer2/DefaultCLI.ts <Class> <Method> ...` or directly importing and invoking in-process, preserving positional-args-only contract.

## Non-Goals
- Mouse support
- Persisted layouts
- External plugin system

## Acceptance Criteria
- Startable via `node --loader ts-node/esm src/ts/layer4/TSRanger.ts`.
- Shows four columns and supports navigation and filtering as defined.
- Lists are populated from `TSCompletion` only.
- Enter on a selected method with parameters prompts/focuses Params column; when resolved, executes command via `DefaultCLI` bridge.
- Preview always reflects the exact command to be executed.
- Zero CommonJS. ESM only. Works under `vitest` environment for non-interactive parts.

## Deliverables
- `src/ts/layer4/TSRanger.ts` with `start()`
- Minimal unit tests for model/filtering (non-TTY)
- E2E smoke test that renders and quits (skipped in CI if TTY unavailable)
- Docs and demo in PO task