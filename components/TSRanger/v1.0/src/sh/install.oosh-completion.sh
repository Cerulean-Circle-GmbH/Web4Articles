# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

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
