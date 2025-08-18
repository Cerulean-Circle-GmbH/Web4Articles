#!/bin/bash
# Sync Recovery Procedures to Production and Main Branches
# Ensures recovery procedures are always current across all branches

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}🔄 Recovery Procedures Sync to Production${NC}"
echo -e "${BLUE}=========================================${NC}"

# Save current branch
ORIGINAL_BRANCH=$(git branch --show-current)
echo -e "${BLUE}ℹ️  Original branch: $ORIGINAL_BRANCH${NC}"

# Ensure we're on release/dev
if [ "$ORIGINAL_BRANCH" != "release/dev" ]; then
    echo -e "${YELLOW}⚠️  Switching to release/dev for sync source${NC}"
    git checkout release/dev
    git pull origin release/dev
fi

# Files and directories to sync
RECOVERY_FILES=(
    "scrum.pmo/roles/ScrumMaster/recovery-process.md"
    "scrum.pmo/roles/RecoveryDefinitionAgent/"
    "scrum.pmo/templates/"
    "scripts/test-recovery-integrity.sh"
    "scripts/update-project-index.sh"
    "scripts/generate-agent-journal-overview.sh"
    "README.md"
    ".github/workflows/recovery-integrity.yml"
)

# Function to sync to a target branch
sync_to_branch() {
    local target_branch=$1
    local sync_message=$2
    
    echo -e "${BLUE}📋 Syncing recovery procedures to $target_branch...${NC}"
    
    # Check if target branch exists
    if git show-ref --verify --quiet "refs/remotes/origin/$target_branch"; then
        echo -e "${GREEN}✅ Target branch exists: $target_branch${NC}"
    else
        echo -e "${YELLOW}⚠️  Target branch does not exist: $target_branch${NC}"
        echo -e "${YELLOW}   Creating new branch from current release/dev${NC}"
        git checkout -b "$target_branch"
        git push -u origin "$target_branch"
        git checkout release/dev
        return 0
    fi
    
    # Create temporary sync branch
    SYNC_BRANCH="sync/recovery-to-${target_branch//\//-}-$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$SYNC_BRANCH"
    
    # Get the latest target branch
    git fetch origin "$target_branch"
    git checkout "origin/$target_branch"
    git checkout -b "temp-$target_branch"
    
    # Copy recovery files from release/dev
    git checkout release/dev -- "${RECOVERY_FILES[@]}" 2>/dev/null || {
        echo -e "${YELLOW}⚠️  Some files may not exist on release/dev${NC}"
    }
    
    # Check if there are changes to commit
    if git diff --staged --quiet && git diff --quiet; then
        echo -e "${GREEN}ℹ️  No recovery procedure changes needed for $target_branch${NC}"
        git checkout release/dev
        git branch -D "$SYNC_BRANCH" "temp-$target_branch" 2>/dev/null || true
        return 0
    fi
    
    # Stage all changes
    git add .
    
    # Create commit
    git commit -m "$sync_message

Recovery procedures synchronized from release/dev to maintain consistency
across production and development environments.

Synced files:
$(printf '- %s\n' "${RECOVERY_FILES[@]}")

Source: release/dev@$(git rev-parse release/dev)
Timestamp: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Workflow: sync-recovery-to-production.sh"
    
    # Push to target branch
    git push origin "temp-$target_branch:$target_branch"
    
    echo -e "${GREEN}✅ Recovery procedures synced to $target_branch${NC}"
    
    # Cleanup
    git checkout release/dev
    git branch -D "$SYNC_BRANCH" "temp-$target_branch" 2>/dev/null || true
}

# Function to create recovery procedure version tag
create_recovery_version_tag() {
    echo -e "${BLUE}🏷️  Creating recovery procedure version tag...${NC}"
    
    # Generate version tag
    local version_tag="recovery-v$(date +%Y.%m.%d-%H%M%S)"
    
    git tag -a "$version_tag" -m "Recovery Procedures Version $version_tag

Automated version tag for recovery procedure synchronization.

Includes:
$(printf '- %s\n' "${RECOVERY_FILES[@]}")

Created: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Branch: $(git branch --show-current)
Commit: $(git rev-parse HEAD)"

    git push origin "$version_tag"
    
    echo -e "${GREEN}✅ Recovery version tag created: $version_tag${NC}"
}

# Function to validate recovery sync
validate_recovery_sync() {
    local target_branch=$1
    
    echo -e "${BLUE}🔍 Validating recovery sync for $target_branch...${NC}"
    
    # Switch to target branch temporarily
    git fetch origin "$target_branch"
    git checkout "origin/$target_branch"
    
    # Check if critical recovery files exist
    local missing_files=()
    for file in "${RECOVERY_FILES[@]}"; do
        if [ ! -e "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All recovery files present on $target_branch${NC}"
    else
        echo -e "${RED}❌ Missing recovery files on $target_branch:${NC}"
        printf '  - %s\n' "${missing_files[@]}"
        git checkout release/dev
        return 1
    fi
    
    # Return to release/dev
    git checkout release/dev
    return 0
}

# Main sync process
echo -e "${BLUE}🚀 Starting recovery procedures sync...${NC}"

# Sync to main branch
sync_to_branch "main" "chore: Sync recovery procedures from release/dev to main"

# Sync to production branch (if it exists)
if git show-ref --verify --quiet "refs/remotes/origin/release/production"; then
    sync_to_branch "release/production" "chore: Sync recovery procedures from release/dev to production"
else
    echo -e "${YELLOW}⚠️  Production branch (release/production) does not exist${NC}"
    echo -e "${YELLOW}   Consider creating it for production deployments${NC}"
fi

# Create version tag
create_recovery_version_tag

# Validate syncs
echo -e "${BLUE}🔍 Validating recovery syncs...${NC}"
validate_recovery_sync "main"

if git show-ref --verify --quiet "refs/remotes/origin/release/production"; then
    validate_recovery_sync "release/production"
fi

# Return to original branch
if [ "$ORIGINAL_BRANCH" != "release/dev" ]; then
    echo -e "${BLUE}🔄 Returning to original branch: $ORIGINAL_BRANCH${NC}"
    git checkout "$ORIGINAL_BRANCH"
fi

echo -e "${GREEN}🎉 Recovery procedures sync completed successfully!${NC}"
echo
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "${GREEN}✅ Recovery procedures synced to main branch${NC}"
if git show-ref --verify --quiet "refs/remotes/origin/release/production"; then
    echo -e "${GREEN}✅ Recovery procedures synced to production branch${NC}"
fi
echo -e "${GREEN}✅ Recovery version tag created${NC}"
echo -e "${GREEN}✅ All validations passed${NC}"
echo
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "   - Monitor GitHub Actions for automated validation"
echo -e "   - Review any pull requests created for manual approval"
echo -e "   - Test recovery procedures on target branches if needed"
echo -e "   - Update deployment pipelines to use latest recovery versions"
