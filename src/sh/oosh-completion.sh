# OOSH Bash Completion Script
# Usage: source this file in your .bashrc or terminal session
# Enables tab completion for the oosh CLI using a TypeScript completion backend

_oosh_completion() {
  local cur prev
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # Call the TypeScript completion backend
  # Find the git root directory
  GIT_ROOT="$(git -C "$(dirname -- "$BASH_SOURCE")" rev-parse --show-toplevel)"

  # Add local node_modules/.bin to PATH for ts-node, etc.
  export PATH="$GIT_ROOT/node_modules/.bin:$PATH"

  # Call the TypeScript completion backend using absolute path from git root
  local completions
  completions=$(NODE_NO_WARNINGS=1 ts-node "$GIT_ROOT/src/ts/layer4/TSCompletion.ts" "${COMP_WORDS[@]:1}")
  COMPREPLY=( $(compgen -W "$completions" -- "$cur") )
}

complete -F _oosh_completion oosh
