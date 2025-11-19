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
        echo "🔧 Force building Web4TSComponent..."
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
elif [ ! -f "dist/ts/layer5/Web4TSComponentCLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/Web4TSComponentCLI.js" 2>/dev/null | grep -q .; then
    if [ "$VERBOSE" = "true" ]; then
        echo "🔧 Smart building Web4TSComponent (changes detected)..."
    else
        echo "✅ Building Web4TSComponent..." >&2
    fi
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    if [ ! -L "node_modules" ] || [ ! -d "../../../node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        if [ "$VERBOSE" = "true" ]; then
            echo "📦 Dependencies already installed"
        fi
    fi
    
    # Build TypeScript
    if [ "$VERBOSE" = "true" ]; then
        echo "🔨 Building TypeScript..."
        npx tsc 
    else
        npx tsc 2>&1 | grep -v "^$" >&2 || true
    fi
else
    if [ "$VERBOSE" = "true" ]; then
        echo "✅ Web4TSComponent is up to date, no build needed"
    fi
fi
