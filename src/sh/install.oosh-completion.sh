#!/bin/bash
# install.oosh-completion.sh: Register oosh-completion.sh as a completion function for oosh
# Usage: source install.oosh-completion.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPLETION_SCRIPT="$SCRIPT_DIR/oosh-completion.sh"


# Register the completion function for oosh using a Bash function
_oosh_completion() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    # Pass all words except the command itself to the backend
    local args=("${COMP_WORDS[@]:1}")
    # Call the completion backend and collect completions
    COMPREPLY=( $(compgen -W "$(NODE_NO_WARNINGS=1 ts-node "../ts/layer4/TSCompletion.ts" "${args[@]}")" -- "$cur") )
    compopt -o default
}

complete -F _oosh_completion oosh

echo "[oosh-completion] Bash function completion installed for 'oosh'. Type 'oosh [Tab]' to test."
