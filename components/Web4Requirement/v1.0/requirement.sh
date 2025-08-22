#!/bin/bash

# Web4Requirement Shell Interface
# Provides command line access to Web4Requirement component

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Path to the compiled CLI
CLI_PATH="$SCRIPT_DIR/dist/layer5/RequirementCLI.js"

# Check if TypeScript is compiled
if [ ! -f "$CLI_PATH" ]; then
    echo "🔧 Compiling Web4Requirement component..."
    cd "$SCRIPT_DIR"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to compile Web4Requirement component"
        exit 1
    fi
fi

# Execute the CLI with all arguments
node "$CLI_PATH" "$@"
