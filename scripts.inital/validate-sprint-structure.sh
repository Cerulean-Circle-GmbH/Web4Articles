#!/bin/bash
# Sprint Structure Validation Script
# Validates sprint folder structures follow project standards

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Counters
TOTAL_SPRINTS=0
CLEAN_SPRINTS=0
WARNING_SPRINTS=0
ERROR_SPRINTS=0

# Project root
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SPRINTS_DIR="$PROJECT_ROOT/scrum.pmo/sprints"

# Function to validate a single sprint
validate_sprint() {
    local sprint_dir=$1
    local sprint_name=$(basename "$sprint_dir")
    local has_errors=0
    local has_warnings=0
    
    echo -e "\n${GREEN}Validating $sprint_name...${NC}"
    
    # Check for planning.md
    if [ ! -f "$sprint_dir/planning.md" ]; then
        echo -e "${RED}  ✗ Missing planning.md${NC}"
        has_errors=1
    else
        echo -e "${GREEN}  ✓ Has planning.md${NC}"
    fi
    
    # Check for tasks/ subfolder (should not exist)
    if [ -d "$sprint_dir/tasks" ]; then
        echo -e "${RED}  ✗ Has tasks/ subfolder (should be flat structure)${NC}"
        has_errors=1
    fi
    
    # Check task naming patterns
    local task_files=$(find "$sprint_dir" -maxdepth 1 -name "task-*.md" -type f 2>/dev/null || true)
    
    if [ -n "$task_files" ]; then
        # Check for proper naming
        while IFS= read -r task_file; do
            local task_name=$(basename "$task_file")
            
            # Check pattern: task-X.Y-role-description.md or task-X.Y.Z-role-description.md
            if ! [[ "$task_name" =~ ^task-[0-9]+(\.[0-9]+)?(\.[0-9]+)?-[a-z]+-.*\.md$ ]]; then
                # Check if it's a major task (task-X-description.md)
                if ! [[ "$task_name" =~ ^task-[0-9]+-[a-z]+-.*\.md$ ]]; then
                    echo -e "${YELLOW}  ⚠ Non-standard task name: $task_name${NC}"
                    has_warnings=1
                fi
            fi
        done <<< "$task_files"
    fi
    
    # Check for typos in common files
    if [ -f "$sprint_dir/requiremnents.md" ]; then
        echo -e "${YELLOW}  ⚠ Typo: requiremnents.md (should be requirements.md)${NC}"
        has_warnings=1
    fi
    
    # Return status
    if [ $has_errors -eq 1 ]; then
        ERROR_SPRINTS=$((ERROR_SPRINTS + 1))
        return 1
    elif [ $has_warnings -eq 1 ]; then
        WARNING_SPRINTS=$((WARNING_SPRINTS + 1))
        return 0
    else
        CLEAN_SPRINTS=$((CLEAN_SPRINTS + 1))
        echo -e "${GREEN}  ✓ Sprint structure OK${NC}"
        return 0
    fi
}

# Main validation
echo -e "${GREEN}Sprint Structure Validation${NC}"
echo "=============================="

# Get sprint to validate (all or specific)
SPRINT_FILTER="${1:-all}"

if [ "$SPRINT_FILTER" = "all" ]; then
    # Validate all sprints
    for sprint_dir in "$SPRINTS_DIR"/sprint-*; do
        if [ -d "$sprint_dir" ]; then
            TOTAL_SPRINTS=$((TOTAL_SPRINTS + 1))
            validate_sprint "$sprint_dir" || true
        fi
    done
else
    # Validate specific sprint
    sprint_dir="$SPRINTS_DIR/sprint-$SPRINT_FILTER"
    if [ -d "$sprint_dir" ]; then
        TOTAL_SPRINTS=1
        validate_sprint "$sprint_dir" || true
    else
        echo -e "${RED}Sprint $SPRINT_FILTER not found${NC}"
        exit 1
    fi
fi

# Summary
echo -e "\n${GREEN}Summary${NC}"
echo "======="
echo "Total Sprints: $TOTAL_SPRINTS"
echo -e "${GREEN}Clean: $CLEAN_SPRINTS${NC}"
echo -e "${YELLOW}Warnings: $WARNING_SPRINTS${NC}"
echo -e "${RED}Errors: $ERROR_SPRINTS${NC}"

# Exit code based on errors
if [ $ERROR_SPRINTS -gt 0 ]; then
    exit 1
else
    exit 0
fi