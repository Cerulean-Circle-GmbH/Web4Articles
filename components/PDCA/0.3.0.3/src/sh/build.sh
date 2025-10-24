# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

FORCE_BUILD=${1:-false}

if [ "$FORCE_BUILD" = "force" ] || [ "$FORCE_BUILD" = "true" ]; then
    echo "🔧 Force building PDCA..." >&2
    # Clean everything
    ./src/sh/clean.sh
    # Install dependencies and create symlink
    ./src/sh/install-deps.sh
    # Build TypeScript
    echo "🔨 Building TypeScript..." >&2
    npx tsc
elif [ ! -f "dist/ts/layer5/PDCACLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/PDCACLI.js" 2>/dev/null | grep -q .; then
    echo "🔧 Smart building PDCA (changes detected)..." >&2
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    if [ ! -L "node_modules" ] || [ ! -d "../../../node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        echo "📦 Dependencies already installed" >&2
    fi
    
    # Build TypeScript
    echo "🔨 Building TypeScript..." >&2
    npx tsc
else
    echo "✅ PDCA is up to date, no build needed" >&2
fi
