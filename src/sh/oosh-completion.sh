# Bash completion function for oosh
# Usage: source this file and register with: complete -C oosh-completion.sh oosh
DIR="$(cd "$(dirname "$0")/../.." && pwd)"
# Bash completion function for oosh
# Usage: source this file and register with: complete -C oosh-completion.sh oosh
#echo "iARGS: ${args[@]}" 
DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# Minimal completion backend: strip command name, empty strings, output completions one per line
args=("$@")
if [ "${args[0]}" = "oosh" ]; then
  args=("${args[@]:1}")
fi
while [ "${#args[@]}" -gt 0 ] && [ "${args[0]}" = "" ]; do
  args=("${args[@]:1}")
done
COMPREPLY=$(NODE_NO_WARNINGS=1 ts-node "$DIR/src/ts/layer4/TSCompletion.ts" "${args[@]}")
#echo "$COMPLETIONS"
