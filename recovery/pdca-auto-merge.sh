#!/bin/bash

# PDCA Auto-Merge to release/dev
# This script automatically merges PDCA commits to release/dev branch

set -e

echo "🔄 PDCA Auto-Merge Script"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Function to merge to release/dev
merge_to_release_dev() {
    echo "📋 Merging PDCA to release/dev..."
    
    # Stash any uncommitted changes
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "⚠️  Uncommitted changes detected, stashing..."
        git stash push -m "Auto-stash before PDCA merge"
        STASHED=true
    fi
    
    # Fetch latest release/dev
    echo "🔍 Fetching latest release/dev..."
    git fetch origin release/dev
    
    # Create temporary branch for merge
    TEMP_BRANCH="temp-pdca-merge-$(date +%s)"
    git checkout -b $TEMP_BRANCH
    
    # Merge current work
    git merge $CURRENT_BRANCH --no-edit
    
    # Push to release/dev
    echo "📤 Pushing to release/dev..."
    git push origin $TEMP_BRANCH:release/dev
    
    # Return to original branch
    git checkout $CURRENT_BRANCH
    
    # Delete temp branch
    git branch -D $TEMP_BRANCH
    
    # Restore stashed changes if any
    if [ "$STASHED" = true ]; then
        echo "📥 Restoring stashed changes..."
        git stash pop
    fi
    
    echo "✅ Successfully merged to release/dev!"
}

# Function for PDCA workflow
pdca_commit_and_merge() {
    local FILES="$1"
    local MESSAGE="$2"
    
    echo "📝 PDCA Workflow: Commit and Merge"
    
    # Add files
    git add $FILES
    
    # Commit
    git commit -m "$MESSAGE"
    
    # Push to current branch
    git push origin $CURRENT_BRANCH
    
    # Merge to release/dev
    merge_to_release_dev
}

# Check if running as function or script
if [ "${1}" = "merge" ]; then
    merge_to_release_dev
elif [ "${1}" = "pdca" ]; then
    shift
    pdca_commit_and_merge "$@"
else
    echo "Usage:"
    echo "  ./pdca-auto-merge.sh merge              - Merge current branch to release/dev"
    echo "  ./pdca-auto-merge.sh pdca FILES MESSAGE - Commit files and auto-merge to release/dev"
    echo ""
    echo "Example:"
    echo "  ./pdca-auto-merge.sh pdca 'temp/*.md scrum.pmo/*' 'Add PDCA documentation'"
fi