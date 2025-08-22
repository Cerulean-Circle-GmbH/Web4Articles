#!/bin/bash

# Web4Requirement Shell Interface
# Provides command line access to Web4Requirement component

# @TODO @CRITICAL: Temporary fix using PROJECT_ROOT environment variable
# This is a temporary solution and needs to be migrated to proper Web4 component discovery
# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# @TODO @CRITICAL: PROJECT_ROOT should be replaced with proper Web4 IOR-based component resolution
if [ -n "$PROJECT_ROOT" ]; then
    # Use PROJECT_ROOT if available (temporary fix)
                CLI_PATH="$PROJECT_ROOT/components/Web4Requirement/v1.0/dist/ts/layer5/RequirementCLI.js"
else
    # Fallback to script directory (original behavior)
                CLI_PATH="$SCRIPT_DIR/dist/ts/layer5/RequirementCLI.js"
fi

# Check if TypeScript is compiled
if [ ! -f "$CLI_PATH" ]; then
    echo "🔧 Compiling Web4Requirement component..."
    # @TODO @CRITICAL: Temporary fix for build directory resolution
    if [ -n "$PROJECT_ROOT" ]; then
        cd "$PROJECT_ROOT/components/Web4Requirement/v1.0"
    else
        cd "$SCRIPT_DIR"
    fi
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to compile Web4Requirement component"
        exit 1
    fi
fi

# Execute the CLI with all arguments
node "$CLI_PATH" "$@"
