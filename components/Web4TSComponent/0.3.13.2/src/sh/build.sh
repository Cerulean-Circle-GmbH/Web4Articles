# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

MODE=${1:-silent}

if [ "$MODE" = "force" ]; then
    echo "🔧 Force building Web4TSComponent..."
    # Clean everything
    ./src/sh/clean.sh
    # Install dependencies and create symlink
    ./src/sh/install-deps.sh
    # Build TypeScript
    echo "🔨 Building TypeScript..."
    npx tsc
elif [ ! -f "dist/ts/layer5/Web4TSComponentCLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/Web4TSComponentCLI.js" 2>/dev/null | grep -q .; then
    if [ "$MODE" = "verbose" ]; then
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
        if [ "$MODE" = "verbose" ]; then
            echo "📦 Dependencies already installed"
        fi
    fi
    
    # Build TypeScript
    if [ "$MODE" = "verbose" ]; then
        echo "🔨 Building TypeScript..."
        npx tsc
    else
        npx tsc 2>&1 | grep -v "^$" >&2
    fi
else
    if [ "$MODE" = "verbose" ]; then
        echo "✅ Web4TSComponent is up to date, no build needed"
    fi
fi
