#!/bin/sh
echo "🧹 Cleaning ALL artifacts (local + global)..."
echo "⚠️  WARNING: This will delete the global node_modules at project root!"

# DRY: Source shared project root discovery library
# @pdca 2025-11-05-UTC-2226.pdca.md - DRY shell libraries
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-project-root.sh"

GLOBAL_NODE_MODULES="$PROJECT_ROOT/node_modules"
echo "🎯 Project root: $PROJECT_ROOT"
echo "🎯 Will delete: $GLOBAL_NODE_MODULES"

# Clean local artifacts (safe - relative to current component)
rm -rf dist
rm -rf node_modules

# Clean global node_modules (now SAFE - verified project root)
rm -rf "$GLOBAL_NODE_MODULES"
echo "✅ Global cleanup complete. Run npm install at project root to restore."

