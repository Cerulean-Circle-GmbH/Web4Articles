#!/bin/bash

# TestVersion CLI Tool - Location Resilient Version
# Web4 Architecture Standard - Self-Implementing Reference
# Works from any directory, finds project root via git

# Function to find project root using git
find_project_root() {
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
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

# Main execution
PROJECT_ROOT=$(find_project_root)
if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Not in a Web4 project directory"
    exit 1
fi

cd "$PROJECT_ROOT"

# Execute component CLI
node --loader ts-node/esm "./components/TestVersion/0.1.0.0/src/ts/layer5/TestVersionCLI.ts" "$@"
