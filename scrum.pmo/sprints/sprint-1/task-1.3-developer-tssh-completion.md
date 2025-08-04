# Task 1.3: Developer - Implement Bash completion for tssh

## Goal
Add a method `installCompletion()` to `TSsh.ts` that writes a Bash completion script for `tssh`.

## Steps
- Implement `installCompletion()` in `TSsh.ts`.
- The method writes a Bash completion script to `~/.local/share/bash-completion/completions/_tssh_completion`.
- The script must register Bash completion for `tssh` using a Bash function, modeled after `install.oosh-completion.sh`.
- Ensure the completion script is robust, user-friendly, and only ever suggests valid, existing arguments. Shell-style options and unsupported input are never suggested; invalid/unsupported input yields silence (no suggestions, no errors).

## Acceptance Criteria
- Running the completion install method creates a working Bash completion script for `tssh`.
- Completion is robust, user-friendly, and documented.
