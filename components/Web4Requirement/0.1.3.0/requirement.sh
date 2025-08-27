#!/bin/bash

# Web4Requirement CLI Wrapper - Simplified Version
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build if needed
if [ ! -d "$SCRIPT_DIR/dist" ]; then
    echo "Building Web4Requirement..."
    cd "$SCRIPT_DIR" && npm install && npm run build >/dev/null 2>&1
fi

# Run the simplified CLI
cd "$SCRIPT_DIR" && node dist/ts/RequirementCLI.js "$@"