#!/bin/sh
# Web4 Standard Library: Project Root Discovery
# DRY: Single source of truth for finding project root via git
# Usage: source this file, then use $PROJECT_ROOT variable
#
# @pdca 2025-11-05-UTC-2226.pdca.md - DRY shell libraries

# Find project root using git (Web4 standard pattern)
find_project_root() {
    # Try git first (most reliable for Web4 projects)
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    # Fallback: directory traversal looking for .git + package.json
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

# Auto-initialize PROJECT_ROOT when sourced (convenience)
if [ -z "$PROJECT_ROOT" ]; then
    PROJECT_ROOT=$(find_project_root)
    if [ -z "$PROJECT_ROOT" ]; then
        echo "❌ ERROR: Not in a Web4 project directory" >&2
        echo "💡 Run this from within a Web4 project (must have .git and package.json)" >&2
        return 1 2>/dev/null || exit 1
    fi
fi

# Export for child processes
export PROJECT_ROOT

