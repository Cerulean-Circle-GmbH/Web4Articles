<!--
SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
Copyright (c) 2025 The Web4Articles Authors
Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
Backlinks: /LICENSE , /AI-GPL.md
Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
-->

[Back to Planning](./planning.md)

# Task 1.3: Developer - Implement Bash completion for tssh

## Progress (2025-08-06)
- Confirmed `TSsh.installCompletion()` writes `_tssh_completion` into `~/.local/share/bash-completion/completions/` using external script content located at `src/sh/tssh-completion.sh`.
- Standardized all runtime calls to `TSCompletion.ts` via `node --loader ts-node/esm` and ensured `TS_NODE_PROJECT` is set.
- `src/sh/obash` added for developer convenience: opens a project-scoped Bash with PATH and tssh completion initialized.

## Next Steps
- Add dedicated tests for `tssh` completion registration using the installed `_tssh_completion` file if needed.
