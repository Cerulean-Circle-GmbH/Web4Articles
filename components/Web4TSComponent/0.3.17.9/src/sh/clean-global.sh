#!/bin/sh
echo "🧹 Cleaning ALL artifacts (local + global)..."
echo "⚠️  WARNING: This will delete the global node_modules at project root!"

# Calculate absolute path to global node_modules BEFORE deleting local symlink
# Script runs from component root, so ../../.. goes to project root
GLOBAL_NODE_MODULES="$(cd ../../.. && pwd)/node_modules"

rm -rf dist
rm -rf node_modules
rm -rf "$GLOBAL_NODE_MODULES"
echo "✅ Global cleanup complete. Run npm install at project root to restore."

