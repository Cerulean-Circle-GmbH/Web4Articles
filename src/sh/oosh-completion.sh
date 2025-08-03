# OOSH Bash Completion Script
# Usage: source this file in your .bashrc or terminal session
# Enables tab completion for the oosh CLI using a TypeScript completion backend

_oosh_completion() {
  local cur prev
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # Call the TypeScript completion backend
  local completions
  completions=$(TS_NODE_PROJECT="$(cd "$(dirname -- "$BASH_SOURCE")/../.." && pwd)/tsconfig.json" ts-node ../ts/layer4/TSCompletion.ts "${COMP_WORDS[@]:1}")
  COMPREPLY=( $(compgen -W "$completions" -- "$cur") )
}

complete -F _oosh_completion oosh
