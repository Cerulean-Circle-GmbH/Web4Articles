#!/bin/bash
# Agent Identity-First Startup Process
# Version: 1.0
# Purpose: Ensure agents identify themselves before proceeding

echo "🤖 Agent Identity-First Startup Process v1.0"
echo "============================================"

# Step 1: Check for RequestID environment variable or cursor context
echo "📋 Step 1: Checking for agent identity..."

# Look for identity markers
IDENTITY_FOUND=false
REQUEST_ID=""

# Check common locations for RequestID
if [ -f ".cursor/request-id" ]; then
    REQUEST_ID=$(cat .cursor/request-id)
    IDENTITY_FOUND=true
elif [ ! -z "$CURSOR_REQUEST_ID" ]; then
    REQUEST_ID=$CURSOR_REQUEST_ID
    IDENTITY_FOUND=true
fi

# Step 2: Check agent registry
if [ "$IDENTITY_FOUND" = true ] && [ ! -z "$REQUEST_ID" ]; then
    echo "✅ Found RequestID: $REQUEST_ID"
    
    if [ -f "scrum.pmo/agents/registry/${REQUEST_ID}.md" ]; then
        echo "📄 Identity record found!"
        echo ""
        echo "Your identity:"
        head -n 20 "scrum.pmo/agents/registry/${REQUEST_ID}.md"
        echo ""
        echo "✅ Identity confirmed. Please read your full identity record."
    else
        echo "⚠️ No identity record found for $REQUEST_ID"
        echo "📝 Creating pending registration..."
        
        # Create pending identity record
        TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
        cat > "scrum.pmo/agents/registry/pending-${REQUEST_ID}.md" << EOF
# Pending Agent Identity Record

## RequestID: $REQUEST_ID

### Status
- **Status:** ⏳ Pending QA Assignment
- **Created:** $TIMESTAMP
- **Branch:** $(git branch --show-current)

### Next Steps
1. QA will assign your role and identity
2. This file will be updated with your details
3. Follow your role-specific process.md

**Waiting for QA assignment...**
EOF
        echo "✅ Pending identity created: scrum.pmo/agents/registry/pending-${REQUEST_ID}.md"
    fi
else
    echo "❌ No RequestID found!"
    echo ""
    echo "🔍 Please check:"
    echo "   1. Are you running in Cursor?"
    echo "   2. Can you see your RequestID in the UI?"
    echo "   3. If yes, please set: export CURSOR_REQUEST_ID=<your-id>"
    echo ""
    echo "📋 Creating unknown agent registration..."
    
    TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
    BRANCH=$(git branch --show-current)
    
    cat > "scrum.pmo/agents/registry/pending-unknown-${TIMESTAMP}.md" << EOF
# Unknown Agent Registration

## Status
- **Status:** ❓ Unknown Agent - Needs RequestID
- **Created:** $TIMESTAMP  
- **Branch:** $BRANCH

### Required Action
QA: Please provide this agent's RequestID and role assignment

### Current Context
- Working Branch: $BRANCH
- Session Start: $TIMESTAMP

**Awaiting identification...**
EOF
    
    echo "📝 Registration created: scrum.pmo/agents/registry/pending-unknown-${TIMESTAMP}.md"
    echo "⏳ Please wait for QA to provide your RequestID"
fi

echo ""
echo "============================================"
echo "🎯 Next Steps:"
echo "1. If identified: Read your role's process.md"
echo "2. If pending: Wait for QA assignment"
echo "3. Always start with identity confirmation"
echo ""
echo "Remember: Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."