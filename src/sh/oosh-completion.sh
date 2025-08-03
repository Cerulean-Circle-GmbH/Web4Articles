

# Minimal pass-through: call TSCompletion backend and output result
DIR="$(cd "$(dirname "$0")/../.." && pwd)"
exec ts-node "$DIR/src/ts/layer4/TSCompletion.ts" "$@"
