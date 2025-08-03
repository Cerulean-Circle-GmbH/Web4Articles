
# OOSH Bash Completion Script (robust, project-root aware)
# Usage: source this file in your .bashrc or terminal session
# Enables tab completion for the oosh CLI using a TypeScript completion backend

_oosh_completion() {
  local cur prev
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # Resolve the script directory (where this script lives)
  local SCRIPT_PATH
  SCRIPT_PATH="$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || realpath "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")"
  local SCRIPT_DIR
  SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd)"

  # Find project root (Web4Articles)
  find_project_root() {
    local dir="$SCRIPT_DIR"
    while [[ "$dir" != "/" ]]; do
      if [[ -f "$dir/package.json" && -d "$dir/src/ts/layer4" ]]; then
        echo "$dir"
        return 0
      fi
      dir="$(dirname "$dir")"
    done
    return 1
  }

  local PROJECT_ROOT
  PROJECT_ROOT="$(find_project_root)"
  if [[ -z "$PROJECT_ROOT" ]]; then
    return 1
  fi

  export PATH="$PROJECT_ROOT/node_modules/.bin:$PATH"
  local completions
  completions=$(NODE_NO_WARNINGS=1 ts-node "$PROJECT_ROOT/src/ts/layer4/TSCompletion.ts" "${COMP_WORDS[@]:1}")
  COMPREPLY=( $(compgen -W "$completions" -- "$cur") )
}

complete -F _oosh_completion oosh
