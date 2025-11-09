#!/bin/sh
# Web4 Standard Library: Project Root Discovery
# DRY: Single source of truth for finding project root
# Usage: source this file, then use $PROJECT_ROOT variable
#
# @pdca 2025-11-05-UTC-2226.pdca.md - DRY shell libraries
# @pdca 2025-11-09-UTC-1540.test-isolation-project-root-detection.pdca.md - Test isolation support

# Find project root (test isolation aware)
find_project_root() {
    # Primary check: package.json + components/ (works in test isolation AND production)
    # This allows test/data to be recognized as a project root without .git
    local current_dir="$PWD"
    while [ "$current_dir" != "/" ]; do
        if [ -f "$current_dir/package.json" ] && [ -d "$current_dir/components" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Fallback: If nothing found, return PWD
    echo "$PWD"
    return 1
}

# Auto-initialize PROJECT_ROOT when sourced (convenience)
if [ -z "$PROJECT_ROOT" ]; then
    PROJECT_ROOT=$(find_project_root)
    if [ -z "$PROJECT_ROOT" ]; then
        echo "❌ ERROR: Not in a Web4 project directory" >&2
        echo "💡 Run this from within a Web4 project (must have package.json and components/)" >&2
        return 1 2>/dev/null || exit 1
    fi
fi

# Export for child processes
export PROJECT_ROOT

