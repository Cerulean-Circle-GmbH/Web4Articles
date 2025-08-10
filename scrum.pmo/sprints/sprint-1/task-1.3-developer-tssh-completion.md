[Back to Planning](./planning.md)

# Task 1.3: Developer - Implement Bash completion for tssh

## Progress (2025-08-06)
- Confirmed `TSsh.installCompletion()` writes `_tssh_completion` into `~/.local/share/bash-completion/completions/` using external script content located at `src/sh/tssh-completion.sh`.
- Standardized all runtime calls to `TSCompletion.ts` via `node --loader ts-node/esm` and ensured `TS_NODE_PROJECT` is set.
- `src/sh/obash` added for developer convenience: opens a project-scoped Bash with PATH and tssh completion initialized.

## Next Steps
- Add dedicated tests for `tssh` completion registration using the installed `_tssh_completion` file if needed.
