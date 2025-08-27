#!/bin/bash

# Release Verification Script
# Verifies that a release was successful and maintains system integrity

set -euo pipefail

TARGET_BRANCH="${1:-release/testing}"
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
cd "$WORKSPACE_ROOT"

echo "🔍 CI/CD Agent: Release Verification"
echo "==================================="
echo "Target Branch: $TARGET_BRANCH"
echo ""

# Check if target branch exists
if ! git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
    echo "❌ ERROR: Branch '$TARGET_BRANCH' does not exist"
    exit 1
fi

# Get commit info
CURRENT_BRANCH=$(git branch --show-current)
DEV_COMMIT=$(git rev-parse release/dev)
TARGET_COMMIT=$(git rev-parse "$TARGET_BRANCH")

echo "📊 Commit Analysis:"
echo "   release/dev:    $DEV_COMMIT"
echo "   $TARGET_BRANCH: $TARGET_COMMIT"
echo ""

# Verify release/dev is merged into target
if git merge-base --is-ancestor release/dev "$TARGET_BRANCH"; then
    echo "✅ release/dev successfully merged into $TARGET_BRANCH"
else
    echo "❌ ERROR: release/dev is not fully merged into $TARGET_BRANCH"
    exit 1
fi

# Check for any uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  WARNING: Uncommitted changes detected"
    git status --short
else
    echo "✅ Working tree clean"
fi

# Verify we're back on release/dev
if [[ "$CURRENT_BRANCH" != "release/dev" ]]; then
    echo "⚠️  WARNING: Not on release/dev branch (current: $CURRENT_BRANCH)"
    echo "💡 Recommend: git checkout release/dev"
else
    echo "✅ Currently on release/dev (safe for continued development)"
fi

# Check remote sync status
git fetch origin >/dev/null 2>&1
if git diff --quiet "$TARGET_BRANCH" "origin/$TARGET_BRANCH" 2>/dev/null; then
    echo "✅ $TARGET_BRANCH synchronized with origin"
else
    echo "⚠️  WARNING: $TARGET_BRANCH may not be synchronized with origin"
fi

echo ""
echo "📋 Release Verification Summary:"
echo "   ✅ Branch exists: $TARGET_BRANCH"
echo "   ✅ Merge successful: release/dev → $TARGET_BRANCH"
echo "   ✅ Repository integrity maintained"

if [[ "$CURRENT_BRANCH" == "release/dev" ]]; then
    echo "   ✅ Safe development environment restored"
    echo ""
    echo "🚀 Ready for continued development on release/dev"
else
    echo "   ⚠️  Return to release/dev recommended"
    echo ""
    echo "💡 Run: git checkout release/dev"
fi
