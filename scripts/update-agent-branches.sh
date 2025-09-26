#!/bin/bash
# Automated Agent Branch Update Script
# Purpose: Update multiple branches with identity-first process

echo "🚀 Agent Branch Update Automation v1.0"
echo "====================================="

# Configuration
ORIGINAL_BRANCH=$(git branch --show-current)
UPDATES_APPLIED=0
UPDATES_FAILED=0

# Branches to update (from agent report)
BRANCHES=(
    "dev/2025-08-28-UTC-1125"
    "dev/2025-08-28-UTC-0850"
    "cursor/start-background-process-78bf"
    "dev/2025-08-28-UTC-1225"
    "testing-analysis-clean"
    "dev/2025-08-25-UTC-1308"
)

# Function to update a branch
update_branch() {
    local BRANCH=$1
    echo ""
    echo "📋 Processing branch: $BRANCH"
    echo "------------------------"
    
    # Fetch the branch
    git fetch origin $BRANCH:$BRANCH --no-tags 2>/dev/null
    if [ $? -ne 0 ]; then
        echo "❌ Failed to fetch branch $BRANCH"
        ((UPDATES_FAILED++))
        return
    fi
    
    # Checkout the branch
    git checkout $BRANCH
    if [ $? -ne 0 ]; then
        echo "❌ Failed to checkout branch $BRANCH"
        ((UPDATES_FAILED++))
        return
    fi
    
    # Get the identity script and role files
    echo "📥 Getting identity-first resources..."
    git checkout origin/save/start.v1 -- scripts/agent-identity-first-startup.sh 2>/dev/null
    
    # Determine which role files to get based on branch
    if [[ $BRANCH == *"test"* ]] || [[ $BRANCH == "testing-analysis-clean" ]]; then
        # Tester branches
        git checkout origin/save/start.v1 -- scrum.pmo/roles/Tester/ 2>/dev/null
    elif [[ $BRANCH == "cursor/start-background-process-78bf" ]]; then
        # Developer branch
        git checkout origin/save/start.v1 -- scrum.pmo/roles/Developer/ 2>/dev/null
    elif [[ $BRANCH == "dev/2025-08-25-UTC-1308" ]]; then
        # Tool Builder - use generic template for now
        mkdir -p scrum.pmo/roles/ToolBuilder
        git checkout origin/save/start.v1 -- scrum.pmo/roles/_shared/process.template.md 2>/dev/null
        cp scrum.pmo/roles/_shared/process.template.md scrum.pmo/roles/ToolBuilder/process.md 2>/dev/null
    else
        # Default to BackgroundAgent
        git checkout origin/save/start.v1 -- scrum.pmo/roles/BackgroundAgent/ 2>/dev/null
    fi
    
    # Update README if it exists
    if [ -f README.md ]; then
        echo "📝 Updating README..."
        # Check if identity step already exists
        if ! grep -q "agent-identity-first-startup.sh" README.md; then
            # Insert identity check as step 1
            sed -i '/## 🚀 When You See "start"/,/1\. / {
                /1\. / i\
1. **Confirm Your Identity First**:\
   ```bash\
   # CRITICAL: Always start with identity check\
   ./scripts/agent-identity-first-startup.sh\
   ```\
\
2. **Previous Step 1 becomes Step 2** (and renumber subsequent steps)
            }' README.md 2>/dev/null || echo "⚠️ README update needs manual intervention"
        fi
    fi
    
    # Check if there are changes to commit
    if git diff --cached --quiet && git diff --quiet; then
        echo "ℹ️ No changes needed for $BRANCH"
        git checkout $ORIGINAL_BRANCH
        return
    fi
    
    # Commit changes
    echo "💾 Committing changes..."
    git add -A
    git commit -m "Add identity-first process and role documentation

- Added agent-identity-first-startup.sh script
- Added role-specific documentation
- Updated README with identity-first step
- Part of system-wide identity verification rollout" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        # Push changes
        echo "📤 Pushing to remote..."
        git push origin $BRANCH
        if [ $? -eq 0 ]; then
            echo "✅ Successfully updated $BRANCH"
            ((UPDATES_APPLIED++))
        else
            echo "❌ Failed to push $BRANCH"
            ((UPDATES_FAILED++))
        fi
    else
        echo "❌ Failed to commit changes for $BRANCH"
        ((UPDATES_FAILED++))
    fi
    
    # Return to original branch
    git checkout $ORIGINAL_BRANCH
}

# Main execution
echo ""
echo "🎯 Starting automated updates..."
echo "Original branch: $ORIGINAL_BRANCH"
echo "Branches to update: ${#BRANCHES[@]}"

# Update each branch
for BRANCH in "${BRANCHES[@]}"; do
    update_branch "$BRANCH"
done

# Summary
echo ""
echo "====================================="
echo "📊 Update Summary"
echo "====================================="
echo "✅ Successfully updated: $UPDATES_APPLIED branches"
echo "❌ Failed updates: $UPDATES_FAILED branches"
echo "📍 Returned to: $ORIGINAL_BRANCH"
echo ""
echo "Remember: Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."