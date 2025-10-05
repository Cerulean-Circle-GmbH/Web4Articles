#!/bin/sh
# Smart build - only rebuild if needed, unless forced
FORCE_BUILD=${1:-false}

if [ "$FORCE_BUILD" = "force" ] || [ "$FORCE_BUILD" = "true" ]; then
    echo "🔧 Force building DemoComponent..."
    # Clean everything
    ./src/sh/clean.sh
    # Install dependencies and create symlink
    ./src/sh/install-deps.sh
    # Build TypeScript
    echo "🔨 Building TypeScript..."
    npx tsc
elif [ ! -f "dist/ts/layer5/DemoComponentCLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/DemoComponentCLI.js" 2>/dev/null | grep -q .; then
    echo "🔧 Smart building DemoComponent (changes detected)..."
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    if [ ! -L "node_modules" ] || [ ! -d "../../../node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        echo "📦 Dependencies already installed"
    fi
    
    # Build TypeScript
    echo "🔨 Building TypeScript..."
    npx tsc
else
    echo "✅ DemoComponent is up to date, no build needed"
fi
