# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# WsServer CLI Tool - Location Resilient Version
# Web4 Architecture Standard - Self-Implementing Reference
# Works from any directory via symlink resolution

# Get component version directory from script location (location-resilient)
# Resolve symlinks: Follow the script file itself, not just the directory
SCRIPT_FILE="${BASH_SOURCE[0]}"
# Resolve all symlinks
while [ -L "$SCRIPT_FILE" ]; do
    DIR="$(cd "$(dirname "$SCRIPT_FILE")" && pwd)"
    SCRIPT_FILE="$(readlink "$SCRIPT_FILE")"
    # Handle relative symlinks - resolve relative to current script's directory
    if [[ "$SCRIPT_FILE" != /* ]]; then
        SCRIPT_FILE="$DIR/$SCRIPT_FILE"
    fi
done
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_FILE")" && pwd)"
COMPONENT_PATH="$SCRIPT_DIR"

# Verify component exists
if [ ! -d "$COMPONENT_PATH" ]; then
    echo "❌ WsServer 0.3.1.0 not found at $COMPONENT_PATH"
    exit 1
fi

# Change to component directory
cd "$COMPONENT_PATH" || {
    echo "❌ Failed to cd to $COMPONENT_PATH"
    exit 1
}

# Use smart build system (handles freshness, dependencies, everything)
./src/sh/build.sh

# Check if CLI is available after build
CLI_PATH="dist/ts/layer5/WsServerCLI.js"
if [ ! -f "$CLI_PATH" ]; then
    echo "❌ WsServer CLI build failed"
    exit 1
fi

# Execute compiled CLI (no ts-node, no deprecation warnings)
node "$CLI_PATH" "$@"
