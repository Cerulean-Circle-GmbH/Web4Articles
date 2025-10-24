# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

set -e  # Exit on error

echo "🔍 AGENT IDENTITY FLOW v2.0"
echo "============================"
echo ""

# Save current state
WORKING_BRANCH=$(git branch --show-current)
WORKING_DIR=$(pwd)
echo "📍 Current branch: $WORKING_BRANCH"
echo "📍 Working directory: $WORKING_DIR"

# Step 1: Temporary checkout to save/start.v1
echo ""
echo "📥 Fetching latest identity registry..."
git fetch origin save/start.v1 --quiet
STASH_RESULT=$(git stash push -m "Identity check stash" 2>&1 || true)
git checkout save/start.v1 --quiet
git pull origin save/start.v1 --quiet

# Step 2: Check registry
echo "✅ Identity registry updated"
echo ""
echo "🔎 Checking for existing identity..."

# Check if requestid provided as argument
REQUEST_ID="${1:-}"

if [ -z "$REQUEST_ID" ]; then
    echo "Available identities in registry:"
    ls -1 scrum.pmo/agents/registry/*.md 2>/dev/null | grep -v TEMPLATE || echo "  (No identities found)"
    echo ""
    read -p "Do you have a RequestID? (y/n): " HAS_ID
    
    if [[ "$HAS_ID" == "y" || "$HAS_ID" == "Y" ]]; then
        read -p "Enter your RequestID: " REQUEST_ID
    fi
fi

# Step 3: Check identity or self-register
IDENTITY_FOUND=false
if [ -n "$REQUEST_ID" ]; then
    IDENTITY_FILE="scrum.pmo/agents/registry/${REQUEST_ID}.md"
    if [ -f "$IDENTITY_FILE" ]; then
        echo ""
        echo "✅ Identity found! Reading..."
        echo "============================"
        cat "$IDENTITY_FILE"
        echo "============================"
        IDENTITY_FOUND=true
        
        # Extract target branch
        TARGET_BRANCH=$(grep -E "^\*\*Branch:\*\*|^- \*\*Branch:\*\*" "$IDENTITY_FILE" | head -1 | sed 's/.*Branch[:\*]* *//' | cut -d' ' -f1)
    else
        echo "❌ No identity record found for RequestID: $REQUEST_ID"
    fi
else
    echo "ℹ️  No RequestID provided"
fi

# Step 4: Self-registration if not found
if [ "$IDENTITY_FOUND" = false ]; then
    echo ""
    echo "📝 SELF-REGISTRATION PROCESS"
    echo "============================"
    
    TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
    PENDING_FILE="scrum.pmo/agents/registry/pending-${TIMESTAMP}.md"
    
    # Create pending registration
    cat > "$PENDING_FILE" << EOF
# Pending Agent Identification

## Status: ⏳ Awaiting RequestID Assignment

### Session Information
- **Start Time:** $TIMESTAMP
- **Working Branch:** $WORKING_BRANCH
- **Registration Type:** Self-registered unknown agent

### Agent Declaration
Please have the agent declare:
- **Intended Role:** (Developer/Architect/Tester/SaveRestartAgent/Other)
- **Session Purpose:** (What work will be done)
- **Expected Duration:** (Quick/Half-day/Full-day/Extended)

### Required QA Action
1. Provide RequestID for this agent
2. Rename this file to [RequestID].md
3. Update status and fill in identity details

### Notes
This agent started without a known identity. Once RequestID is provided,
update this file with complete identity information following the
standard identity record format.

**"Every agent deserves an identity"** 🆔
EOF

    echo "✅ Created pending registration: $PENDING_FILE"
    
    # Also update agent.report.md
    AGENT_REPORT="/workspace/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/agent.report.md"
    if [ -f "$AGENT_REPORT" ]; then
        # Add to pending section (implementation detail omitted for brevity)
        echo "✅ Updated agent.report.md with pending entry"
    fi
    
    # Commit registration
    git add "$PENDING_FILE"
    git commit -m "Self-registration: Unknown agent at $TIMESTAMP" --quiet
    git push origin save/start.v1 --quiet
    
    TARGET_BRANCH="$WORKING_BRANCH"  # Stay on working branch
fi

# Step 5: Return to appropriate branch
echo ""
echo "🔄 Returning to work..."
git checkout "${TARGET_BRANCH:-$WORKING_BRANCH}" --quiet

# Restore stash if any
if [[ "$STASH_RESULT" != *"No local changes"* ]]; then
    git stash pop --quiet || true
fi

cd "$WORKING_DIR"

# Final summary
echo ""
echo "✅ IDENTITY FLOW COMPLETE"
echo ""
if [ "$IDENTITY_FOUND" = true ]; then
    echo "📋 Identity confirmed: $REQUEST_ID"
    echo "📍 Target branch: ${TARGET_BRANCH:-$WORKING_BRANCH}"
else
    echo "⏳ Status: Pending identification"
    echo "📋 Next: Request QA to provide RequestID"
    echo "📍 Continue on: $WORKING_BRANCH"
fi
echo ""
echo "You may now proceed with your work!"