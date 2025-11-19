#!/usr/bin/env sh
# Smart build - only rebuild if needed, unless forced
# Flags: verbose (default from package.json), silent, force
# Usage: ./build.sh [verbose|silent] [force]
#        ./build.sh force [verbose|silent]

# Parse flags (support any order)
VERBOSE=false
FORCE=false
for arg in "$@"; do
    case "$arg" in
        verbose) VERBOSE=true ;;
        silent) VERBOSE=false ;;
        force) FORCE=true ;;
    esac
done

if [ "$FORCE" = "true" ]; then
    if [ "$VERBOSE" = "true" ]; then
        echo "🔧 Force building ONCE..."
    fi
    # Clean everything
    ./src/sh/clean.sh
    # Install dependencies and create symlink
    ./src/sh/install-deps.sh
    # Build TypeScript
    if [ "$VERBOSE" = "true" ]; then
        echo "🔨 Building TypeScript..."
    fi
    npx tsc --traceResolution --extendedDiagnostics
elif [ ! -f "dist/ts/layer5/ONCECLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/ONCECLI.js" 2>/dev/null | grep -q .; then
    if [ "$VERBOSE" = "true" ]; then
        echo "🔧 Smart building ONCE (changes detected)..."
    else
        echo "✅ Building ONCE..." >&2
    fi
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    # Path Authority: Use lib-project-root.sh for path discovery
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
    . "$SCRIPT_DIR/lib-project-root.sh"
    
    if [ ! -L "node_modules" ] || [ ! -d "$PROJECT_ROOT/node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        if [ "$VERBOSE" = "true" ]; then
            echo "📦 Dependencies already installed"
        fi
    fi
    
    # Verify dependencies are actually installed
    if ! ./src/sh/verify-deps.sh; then
        if [ "$VERBOSE" = "true" ]; then
            echo "⚠️  Dependencies missing, installing..."
        fi
        ./src/sh/install-deps.sh
    fi
    
    # Build TypeScript
    if [ "$VERBOSE" = "true" ]; then
        echo "🔨 Building TypeScript..."
        npx tsc 
    else
        npx tsc 2>&1 | grep -v "^$" >&2
    fi
else
    if [ "$VERBOSE" = "true" ]; then
        echo "✅ ONCE is up to date, no build needed"
    fi
fi
