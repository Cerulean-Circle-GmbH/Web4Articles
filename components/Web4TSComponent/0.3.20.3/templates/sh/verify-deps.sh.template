#!/usr/bin/env sh
# Verify all dependencies from package.json are installed
# Returns 0 if all deps present, 1 if any missing
# @pdca 2025-01-XX-UTC-optimize-shell-scripts-eliminate-dry.pdca.md

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-project-root.sh"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Check if global node_modules exists
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "❌ Global node_modules not found at $PROJECT_ROOT/node_modules"
    exit 1
fi

# Extract dependencies from package.json
DEPS=$(node -e "
const pkg = require('./package.json');
const deps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
console.log(Object.keys(deps).join(' '));
")

MISSING=0
for DEP in $DEPS; do
    if [ ! -d "$PROJECT_ROOT/node_modules/$DEP" ]; then
        echo "⚠️  Missing dependency: $DEP"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    exit 1
fi

exit 0

