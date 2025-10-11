#!/bin/sh
echo "🚀 Starting P2PServer (normal)..."

# Check if rebuild is needed
if [ ! -f "dist/ts/layer5/P2PServerCLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/P2PServerCLI.js" 2>/dev/null | grep -q .; then
    echo "🔧 Source files updated, rebuilding..."
    
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
    echo "✅ Component is up to date, skipping build"
fi

# Run component
npm run component
