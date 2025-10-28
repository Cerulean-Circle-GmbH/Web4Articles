# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

echo "🚀 Starting PDCA (normal)..."

# Check if rebuild is needed
if [ ! -f "dist/ts/layer5/PDCACLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/PDCACLI.js" 2>/dev/null | grep -q .; then
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
