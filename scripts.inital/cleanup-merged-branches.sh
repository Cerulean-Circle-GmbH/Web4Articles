#!/bin/bash

# Branch Cleanup Script
# Safely deletes branches that have been merged and marked for deletion

set -e

echo "🧹 Branch Cleanup Script"
echo "========================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Safety check - must be run from git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Fetch latest remote information
echo "Fetching latest remote branch information..."
git fetch --prune origin

# Find the most recent branch overview file
LATEST_OVERVIEW=$(find scrum.pmo/project.journal -name "branch-overview.md" -type f | sort -r | head -n 1)

if [[ -z "$LATEST_OVERVIEW" ]]; then
    echo -e "${RED}Error: No branch overview found. Run EOD workflow first.${NC}"
    exit 1
fi

echo "Using branch overview: $LATEST_OVERVIEW"
echo ""

# Extract branches marked for deletion
BRANCHES_TO_DELETE=$(grep -E "\[x\].*\[MARKED FOR DELETION" "$LATEST_OVERVIEW" | sed -E 's/- \[x\] ([^ ]+).*/\1/')

if [[ -z "$BRANCHES_TO_DELETE" ]]; then
    echo -e "${GREEN}No branches marked for deletion.${NC}"
    exit 0
fi

# Display branches to be deleted
echo -e "${YELLOW}The following branches are marked for deletion:${NC}"
echo "$BRANCHES_TO_DELETE" | while read -r branch; do
    echo "  - $branch"
done
echo ""

# Confirm deletion
read -p "Do you want to delete these branches? (yes/no): " CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
    echo "Deletion cancelled."
    exit 0
fi

# Delete branches
echo ""
echo "Deleting branches..."

SUCCESS_COUNT=0
FAIL_COUNT=0

echo "$BRANCHES_TO_DELETE" | while read -r branch; do
    if [[ -z "$branch" ]]; then
        continue
    fi
    
    echo -n "Deleting $branch... "
    
    # Check if branch exists
    if ! git ls-remote --heads origin "$branch" | grep -q .; then
        echo -e "${YELLOW}Already deleted${NC}"
        continue
    fi
    
    # Try to delete the branch
    if git push origin --delete "$branch" 2>/dev/null; then
        echo -e "${GREEN}Deleted${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}Failed${NC}"
        ((FAIL_COUNT++))
    fi
done

# Summary
echo ""
echo "Branch cleanup complete!"
echo -e "  ${GREEN}Successfully deleted: $SUCCESS_COUNT${NC}"
echo -e "  ${RED}Failed to delete: $FAIL_COUNT${NC}"

# Update local references
echo ""
echo "Cleaning up local references..."
git remote prune origin

echo ""
echo "✅ Cleanup complete!"