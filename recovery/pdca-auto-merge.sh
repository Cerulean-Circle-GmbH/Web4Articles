# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# PDCA Auto-Merge to release/dev
# This script automatically merges PDCA commits to release/dev branch

# Don't exit on errors - we handle them gracefully
set +e

echo "🔄 PDCA Auto-Merge Script"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Function to create PR on conflicts
create_pr_on_conflict() {
    local SOURCE_BRANCH="$1"
    local TARGET_BRANCH="release/dev"
    
    echo "⚠️  Merge conflict detected! Creating PR for QA review..."
    echo "📋 QA NOTIFICATION: Merge conflict requires manual resolution"
    echo "🔗 Creating PR from $SOURCE_BRANCH to $TARGET_BRANCH"
    
    # Push the source branch if not already pushed
    git push origin $SOURCE_BRANCH 2>/dev/null || true
    
    # Create PR using GitHub CLI if available, otherwise show manual instructions
    if command -v gh &> /dev/null; then
        gh pr create --base $TARGET_BRANCH --head $SOURCE_BRANCH \
            --title "🔄 Auto-merge conflict: $SOURCE_BRANCH → $TARGET_BRANCH" \
            --body "## ⚠️ Merge Conflict Detected

This PR was automatically created because the auto-merge script encountered conflicts.

**Source Branch:** $SOURCE_BRANCH
**Target Branch:** $TARGET_BRANCH
**Timestamp:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")

### QA Action Required:
1. Review the conflicts
2. Resolve them appropriately
3. Merge this PR

### Context:
Auto-merge from post-commit hook failed due to conflicts between branches." || {
            echo "❌ Failed to create PR automatically"
            echo "📝 Please create PR manually at:"
            echo "   https://github.com/Cerulean-Circle-GmbH/Web4Articles/pull/new/$SOURCE_BRANCH"
        }
    else
        echo "📝 GitHub CLI not found. Please create PR manually:"
        echo "   https://github.com/Cerulean-Circle-GmbH/Web4Articles/pull/new/$SOURCE_BRANCH"
        echo "   Base: $TARGET_BRANCH"
        echo "   Compare: $SOURCE_BRANCH"
    fi
}

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
    git checkout -b $TEMP_BRANCH origin/release/dev
    
    # Try to merge current work
    echo "🔄 Attempting to merge $CURRENT_BRANCH..."
    if git merge $CURRENT_BRANCH --no-edit; then
        # Push to release/dev
        echo "📤 Pushing to release/dev..."
        if git push origin $TEMP_BRANCH:release/dev; then
            echo "✅ Successfully merged to release/dev!"
            # Return to original branch
            git checkout $CURRENT_BRANCH
            # Delete temp branch
            git branch -D $TEMP_BRANCH
        else
            echo "❌ Push failed - checking for non-fast-forward..."
            # Return to original branch first
            git checkout $CURRENT_BRANCH
            # Create PR for non-fast-forward
            create_pr_on_conflict $TEMP_BRANCH
            # Clean up temp branch
            git branch -D $TEMP_BRANCH
        fi
    else
        echo "❌ Merge conflict detected!"
        # Abort the merge
        git merge --abort
        # Return to original branch
        git checkout $CURRENT_BRANCH
        # Create PR with original branch
        create_pr_on_conflict $CURRENT_BRANCH
        # Clean up temp branch
        git branch -D $TEMP_BRANCH
    fi
    
    # Restore stashed changes if any
    if [ "$STASHED" = true ]; then
        echo "📥 Restoring stashed changes..."
        git stash pop
    fi
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