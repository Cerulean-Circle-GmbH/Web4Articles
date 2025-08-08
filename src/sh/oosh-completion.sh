# Bash completion function for oosh
# Usage: source this file and register with: complete -C oosh-completion.sh oosh
DIR="$(cd "$(dirname "$0")/../.." && pwd)"
# Bash completion function for oosh
# Usage: source this file and register with: complete -C oosh-completion.sh oosh
#echo "iARGS: ${args[@]}" 
DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Minimal completion backend: strip command name, empty strings, output completions one per line
args=("$@")
if [ "${args[0]:-}" = "oosh" ]; then
  args=("${args[@]:1}")
fi
while [ "${#args[@]}" -gt 0 ] && [ "${args[0]}" = "" ]; do
  args=("${args[@]:1}")
done
COMPREPLY=$(NODE_NO_WARNINGS=1 node --loader ts-node/esm "$DIR/src/ts/layer4/TSCompletion.ts" "${args[@]}")
#echo "$COMPLETIONS"

# If executed directly (not sourced), emulate shell completion or print backend output
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  if [[ -n "${COMP_WORDS:-}" && -n "${COMP_CWORD:-}" ]]; then
    # Simulate Bash completion environment using COMP_WORDS/COMP_CWORD
    IFS=' ' read -r -a _words <<< "${COMP_WORDS}"
    # Drop the command name
    _args=("${_words[@]:1}")
    NODE_NO_WARNINGS=1 node --loader ts-node/esm "$DIR/src/ts/layer4/TSCompletion.ts" "${_args[@]}"
  else
    # Print completions for provided positional args
    if [[ ${#args[@]} -eq 2 ]]; then
      # Prefer parameter completion after exact method by adding empty third arg
      NODE_NO_WARNINGS=1 node --loader ts-node/esm "$DIR/src/ts/layer4/TSCompletion.ts" "${args[@]}" ""
    else
      NODE_NO_WARNINGS=1 node --loader ts-node/esm "$DIR/src/ts/layer4/TSCompletion.ts" "${args[@]}"
    fi
  fi
fi
