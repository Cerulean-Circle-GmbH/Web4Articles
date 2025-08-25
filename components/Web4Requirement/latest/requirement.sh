#!/bin/bash

# Web4Requirement CLI Tool - Location Resilient Version
# Works from any directory, finds project root via git

# Function to find project root using git
find_project_root() {
    # Try git first (most reliable)
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        # Verify it's Web4Articles project by checking for key files
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    # Fallback: walk up looking for .git and package.json
    local current_dir="$PWD"
    while [ "$current_dir" != "/" ]; do
        if [ -d "$current_dir/.git" ] && [ -f "$current_dir/package.json" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    return 1
}

# Find project root
PROJECT_ROOT=$(find_project_root)
if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Not in a Web4Articles project directory"
    echo "💡 Please run from within the Web4Articles git repository"
    exit 1
fi

export PROJECT_ROOT

# Detect context for the CLI
CURRENT_DIR="$(pwd)"
CONTEXT_INFO=""

# Check if we're in a component directory
if [[ "$CURRENT_DIR" == *"/components/"*"/"*"/"* ]]; then
    COMPONENT_PATH=$(echo "$CURRENT_DIR" | grep -o '.*/components/[^/]*/[^/]*')
    if [ -n "$COMPONENT_PATH" ]; then
        CONTEXT_INFO="component:$COMPONENT_PATH"
    fi
fi

# Default context if none detected
if [ -z "$CONTEXT_INFO" ]; then
    CONTEXT_INFO="arbitrary:$CURRENT_DIR"
fi

# Try multiple locations for the CLI
CLI_LOCATIONS=(
    "$PROJECT_ROOT/scripts/dist/ts/layer5/RequirementCLI.js"
    "$PROJECT_ROOT/components/Web4Requirement/latest/dist/ts/layer5/RequirementCLI.js"
    "$PROJECT_ROOT/dist/ts/layer5/RequirementCLI.js"
)

CLI_PATH=""
for location in "${CLI_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
        CLI_PATH="$location"
        break
    fi
done

if [ -z "$CLI_PATH" ]; then
    echo "❌ Requirement CLI not found in any expected location"
    echo "🔍 Searched locations:"
    for location in "${CLI_LOCATIONS[@]}"; do
        echo "   - $location"
    done
    echo ""
    echo "🔧 To fix this, from project root ($PROJECT_ROOT):"
    echo "   1. cd components/Web4Requirement/latest"
    echo "   2. npm install"
    echo "   3. npm run build"
    echo ""
    echo "📍 Current directory: $CURRENT_DIR"
    echo "📂 Project root: $PROJECT_ROOT"
    exit 1
fi

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is required but not installed"
    exit 1
fi

# Execute the CLI with context info and all arguments
export DIRECTORY_CONTEXT="$CONTEXT_INFO"
node --no-warnings --no-deprecation "$CLI_PATH" "$@" 2>/dev/null || node "$CLI_PATH" "$@"
