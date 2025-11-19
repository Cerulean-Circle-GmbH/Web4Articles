#!/usr/bin/env sh
# Shared component start logic (DRY principle)
# Usage: . lib-component-start.sh "ComponentName" "dist/ts/layer5/ComponentCLI.js"
# @pdca 2025-01-XX-UTC-optimize-shell-scripts-eliminate-dry.pdca.md
# Path Authority: Uses lib-project-root.sh for path discovery (not hardcoded paths)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-project-root.sh"

COMPONENT_NAME="$1"
CLI_FILE="$2"

if [ -z "$COMPONENT_NAME" ] || [ -z "$CLI_FILE" ]; then
    echo "❌ Error: lib-component-start.sh requires COMPONENT_NAME and CLI_FILE parameters"
    exit 1
fi

echo "🚀 Starting $COMPONENT_NAME (normal)..."

# Check if rebuild is needed
if [ ! -f "$CLI_FILE" ] || find src -name "*.ts" -newer "$CLI_FILE" 2>/dev/null | grep -q .; then
    echo "🔧 Source files updated, rebuilding..."
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    # Path Authority: Use PROJECT_ROOT from lib-project-root.sh, not hardcoded ../../..
    if [ ! -L "node_modules" ] || [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        echo "📦 Dependencies already installed"
    fi
    
    # Verify dependencies are actually installed
    if ! ./src/sh/verify-deps.sh; then
        echo "⚠️  Dependencies missing, installing..."
        ./src/sh/install-deps.sh
    fi
    
    # Build TypeScript
    echo "🔨 Building TypeScript..."
    npx tsc
else
    echo "✅ Component is up to date, skipping build"
    
    # Still verify dependencies (package.json may have changed)
    if ! ./src/sh/verify-deps.sh; then
        echo "⚠️  Dependencies missing, installing..."
        ./src/sh/install-deps.sh
    fi
fi

# Run component
npm run component

