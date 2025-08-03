

# Minimal pass-through: call TSCompletion backend and output result
DIR="$(cd "$(dirname "$0")/../.." && pwd)"


# If the last argument is a known parameter name, add an empty string to trigger value completion
if [ "$#" -ge 3 ]; then
  PARAMS=$(ts-node "$DIR/src/ts/layer4/TSCompletion.ts" "$1" "$2")
  # Split PARAMS into lines and compare
  IFS=' ' read -r -a param_array <<< "$PARAMS"
  for param in "${param_array[@]}"; do
    if [ "$param" = "${@: -1}" ]; then
      echo "[oosh-completion.sh] value completion branch: $@ <empty>" 1>&2
      exec ts-node "$DIR/src/ts/layer4/TSCompletion.ts" "$@" ""
    fi
  done
fi

exec ts-node "$DIR/src/ts/layer4/TSCompletion.ts" "$@"
