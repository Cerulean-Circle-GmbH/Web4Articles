# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# Find the project root by looking for source.env
find_project_root() {
    local current_dir="$(pwd)"
    local check_dir="$current_dir"
    
    while [ "$check_dir" != "/" ]; do
        if [ -f "$check_dir/source.env" ]; then
            echo "$check_dir"
            return 0
        fi
        check_dir="$(dirname "$check_dir")"
    done
    
    # If not found by traversing up, check if we're in scripts directory
    if [ -f "$(dirname "${BASH_SOURCE[0]}")/../source.env" ]; then
        echo "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
        return 0
    fi
    
    return 1
}

# Find and source the environment
PROJECT_ROOT=$(find_project_root)

if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Could not find Web4Articles project root (source.env not found)"
    echo "   Make sure you're inside the Web4Articles project directory"
    return 1 2>/dev/null || exit 1
fi

# Source the environment file
source "$PROJECT_ROOT/source.env"