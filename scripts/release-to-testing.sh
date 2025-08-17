#!/bin/bash

# Safe Release to Testing Script
# This script provides automated, safe release from release/dev to release/testing

set -euo pipefail

WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
cd "$WORKSPACE_ROOT"

echo "🔒 CI/CD Agent: Safe Release to Testing"
echo "======================================"

# Safety Check 1: Confirm we're on release/dev
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "release/dev" ]]; then
    echo "❌ SAFETY VIOLATION: Must be on release/dev branch"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Run: git checkout release/dev"
    exit 1
fi

# Safety Check 2: Clean working tree
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ SAFETY VIOLATION: Working tree must be clean"
    echo "Uncommitted changes detected:"
    git status --short
    exit 1
fi

# Safety Check 3: Up to date with origin
git fetch origin
LOCAL=$(git rev-parse release/dev)
REMOTE=$(git rev-parse origin/release/dev)
if [[ "$LOCAL" != "$REMOTE" ]]; then
    echo "❌ SAFETY VIOLATION: release/dev not up to date with origin"
    echo "Run: git pull origin release/dev"
    exit 1
fi

# Safety Check 4: Confirm no active agents (manual confirmation required)
echo "⚠️  CRITICAL SAFETY CHECK:"
echo "Are ALL other agents stopped? (y/N)"
read -r response
if [[ "$response" != "y" && "$response" != "Y" ]]; then
    echo "❌ RELEASE ABORTED: Other agents must be stopped first"
    echo "Coordinate with QA user to stop all agents before release"
    exit 1
fi

# Get current commit info
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MSG=$(git log -1 --pretty=format:"%s")

echo "✅ Safety checks passed"
echo "📋 Release Info:"
echo "   Source: release/dev @ $COMMIT_HASH"
echo "   Target: release/testing"
echo "   Commit: $COMMIT_MSG"
echo ""

# Perform safe release
echo "🚀 Starting safe release..."

# Check out release/testing
git checkout release/testing

# Merge release/dev
git merge release/dev --no-edit

# Push to origin
git push origin release/testing

echo "✅ Release completed successfully"
echo "📊 Release Summary:"
git log --oneline -1

# CRITICAL: Return to release/dev immediately
echo "🔄 Returning to release/dev for continued development..."
git checkout release/dev

echo "✅ Safe release to testing completed"
echo "🏠 Back on release/dev - ready for continued development"
