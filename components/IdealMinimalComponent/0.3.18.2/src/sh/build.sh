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
        echo "🔧 Force building IdealMinimalComponent..."
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
elif [ ! -f "dist/ts/layer5/IdealMinimalComponentCLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/IdealMinimalComponentCLI.js" 2>/dev/null | grep -q .; then
    if [ "$VERBOSE" = "true" ]; then
        echo "🔧 Smart building IdealMinimalComponent (changes detected)..."
    else
        echo "✅ Building IdealMinimalComponent..." >&2
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
        npx tsc 2>&1 | grep -v "^$" >&2
    fi
else
    if [ "$VERBOSE" = "true" ]; then
        echo "✅ IdealMinimalComponent is up to date, no build needed"
    fi
fi
