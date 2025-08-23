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

# Function for PDCA workflow (ALWAYS merges to release/dev per Decision 1a)
pdca_commit_and_merge() {
    local FILES="$1"
    local MESSAGE="$2"
    
    echo "📝 PDCA Workflow: Commit and Auto-Merge (Decision 1a)"
    
    # Add files
    git add $FILES
    
    # Commit
    git commit -m "$MESSAGE"
    
    # Push to current branch
    git push origin $CURRENT_BRANCH
    
    # ALWAYS merge to release/dev (Decision 1a)
    echo "🔄 Auto-merging to release/dev (mandatory per Decision 1a)..."
    merge_to_release_dev
}

# Function to create timestamped dev branch at session end
create_session_branch() {
    local TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
    local DEV_BRANCH="dev/$TIMESTAMP"
    
    echo "🌿 Creating session branch: $DEV_BRANCH"
    
    # Create and push the branch
    git checkout -b $DEV_BRANCH
    git push -u origin $DEV_BRANCH
    
    echo "✅ Session branch created: $DEV_BRANCH"
    echo "📍 You are now on branch: $DEV_BRANCH"
}

# Check if running as function or script
if [ "${1}" = "merge" ]; then
    merge_to_release_dev
elif [ "${1}" = "pdca" ]; then
    shift
    pdca_commit_and_merge "$@"
elif [ "${1}" = "session-end" ]; then
    create_session_branch
else
    echo "Usage:"
    echo "  ./pdca-auto-merge.sh merge              - Merge current branch to release/dev"
    echo "  ./pdca-auto-merge.sh pdca FILES MESSAGE - Commit files and AUTO-MERGE to release/dev (Decision 1a)"
    echo "  ./pdca-auto-merge.sh session-end        - Create timestamped dev/YYYY-MM-DD-UTC-HHMM branch"
    echo ""
    echo "Example:"
    echo "  ./pdca-auto-merge.sh pdca 'temp/*.md scrum.pmo/*' 'Add PDCA documentation'"
    echo "  ./pdca-auto-merge.sh session-end  # Creates dev/2025-08-23-UTC-1530"
    echo ""
    echo "Note: Auto-merge to release/dev happens on EVERY commit (Decision 1a)"
fi