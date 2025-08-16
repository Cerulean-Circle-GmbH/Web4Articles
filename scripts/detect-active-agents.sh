#!/bin/bash
# Detect Active Agents Script
# Automatically detects and updates agent status based on git activity and system processes

set -euo pipefail

# Configuration
PROJECT_ROOT="/workspace"
AGENT_REGISTRY="$PROJECT_ROOT/scrum.pmo/project.journal/active-agents.md"
JOURNAL_DIR="$PROJECT_ROOT/scrum.pmo/project.journal"
DAYS_ACTIVE=1        # Days to consider "active"
DAYS_SEMI_ACTIVE=7   # Days to consider "semi-active"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Agent branch mappings
declare -A AGENT_BRANCHES=(
    ["release/dev"]="THE ScrumMaster"
    ["feature/recovery-agent"]="Recovery Agent"
    ["feature/ontology-agent"]="Ontology Agent"
    ["feature/research-agent"]="Research Agent"  
    ["feature/branchStatusAgent"]="Branch Status Agent"
    ["feature/qa-agent"]="QA Agent"
    ["feature/article-agent"]="Article Agent"
    ["feature/developer-agent"]="Developer Agent"
)

# Agent roles
declare -A AGENT_ROLES=(
    ["THE ScrumMaster"]="ScrumMaster"
    ["Recovery Agent"]="Recovery"
    ["Ontology Agent"]="Research"
    ["Research Agent"]="Research"
    ["Branch Status Agent"]="DevOps"
    ["QA Agent"]="QA"
    ["Article Agent"]="Article"
    ["Developer Agent"]="Developer"
)

echo -e "${BLUE}🔍 Detecting Active Agents...${NC}"

# Change to project directory
cd "$PROJECT_ROOT"

# Fetch latest remote info
echo -e "${YELLOW}Fetching latest remote branch info...${NC}"
git fetch --all --quiet

# Function to get days since last commit on branch
get_days_since_last_commit() {
    local branch=$1
    local last_commit_date=$(git log -1 --format=%ct "origin/$branch" 2>/dev/null || echo "0")
    
    if [ "$last_commit_date" = "0" ]; then
        echo "999"  # No commits found
    else
        local current_date=$(date +%s)
        local days_diff=$(( (current_date - last_commit_date) / 86400 ))
        echo "$days_diff"
    fi
}

# Function to get last commit info
get_last_commit_info() {
    local branch=$1
    local commit_info=$(git log -1 --format="%h %s" "origin/$branch" 2>/dev/null || echo "No commits")
    echo "$commit_info"
}

# Function to determine status based on days
determine_status() {
    local days=$1
    if [ "$days" -le "$DAYS_ACTIVE" ]; then
        echo "🟢 Active"
    elif [ "$days" -le "$DAYS_SEMI_ACTIVE" ]; then
        echo "🔵 Semi-active"
    else
        echo "⚫ Dormant"
    fi
}

# Function to find latest session for agent
find_latest_session() {
    local branch=$1
    local agent_name=$2
    
    # Search for sessions with this branch in project.state.md
    local latest_session=""
    for session_dir in $(ls -d "$JOURNAL_DIR"/2025-* 2>/dev/null | sort -r); do
        if [ -f "$session_dir/project.state.md" ]; then
            if grep -q "Branch.*$branch" "$session_dir/project.state.md" 2>/dev/null; then
                latest_session=$(basename "$session_dir")
                break
            fi
        fi
    done
    
    echo "$latest_session"
}

# Collect agent data
echo -e "${YELLOW}Analyzing git branches...${NC}"

declare -A AGENT_DATA

for branch in "${!AGENT_BRANCHES[@]}"; do
    agent_name="${AGENT_BRANCHES[$branch]}"
    role="${AGENT_ROLES[$agent_name]}"
    
    # Get activity data
    days_since_commit=$(get_days_since_last_commit "$branch")
    status=$(determine_status "$days_since_commit")
    last_commit=$(get_last_commit_info "$branch")
    latest_session=$(find_latest_session "$branch" "$agent_name")
    
    # Store data
    AGENT_DATA["$agent_name|branch"]="$branch"
    AGENT_DATA["$agent_name|role"]="$role"
    AGENT_DATA["$agent_name|status"]="$status"
    AGENT_DATA["$agent_name|days"]="$days_since_commit"
    AGENT_DATA["$agent_name|commit"]="$last_commit"
    AGENT_DATA["$agent_name|session"]="$latest_session"
    
    echo -e "  ${agent_name}: ${status} (${days_since_commit} days since last commit)"
done

# Check for current terminal session
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_AGENT="${AGENT_BRANCHES[$CURRENT_BRANCH]:-Unknown}"

# Check system processes
echo -e "${YELLOW}Checking system processes...${NC}"

# Count Cursor processes
CURSOR_COUNT=$(ps aux | grep -i cursor | grep -v grep | wc -l)
echo -e "  Found ${CURSOR_COUNT} Cursor-related processes"

# Generate updated active-agents.md
echo -e "${YELLOW}Updating agent registry...${NC}"

cat > "$AGENT_REGISTRY" << 'EOF'
# 🤖 Active Agents Registry
EOF

echo "**Last Updated**: $(date -u +"%Y-%m-%d %H:%M UTC")" >> "$AGENT_REGISTRY"
echo "**Update Method**: Automated via \`scripts/detect-active-agents.sh\`" >> "$AGENT_REGISTRY"
echo "" >> "$AGENT_REGISTRY"
echo "---" >> "$AGENT_REGISTRY"
echo "" >> "$AGENT_REGISTRY"
echo "## 🌐 Background Agents (Cloud/Remote)" >> "$AGENT_REGISTRY"
echo "" >> "$AGENT_REGISTRY"
echo "| Agent | Role | Branch | Status | Last Activity | Session Link |" >> "$AGENT_REGISTRY"
echo "|-------|------|--------|--------|---------------|--------------|" >> "$AGENT_REGISTRY"

# Sort agents by activity (active first)
# Create temp file for sorting
TEMP_SORT=$(mktemp)
for branch in "${!AGENT_BRANCHES[@]}"; do
    agent="${AGENT_BRANCHES[$branch]}"
    days="${AGENT_DATA["$agent|days"]:-999}"
    echo "$days|$agent" >> "$TEMP_SORT"
done

# Process sorted agents
while IFS='|' read -r days agent_name; do
    branch="${AGENT_DATA["$agent_name|branch"]:-}"
    role="${AGENT_DATA["$agent_name|role"]:-}"
    status="${AGENT_DATA["$agent_name|status"]:-}"
    days="${AGENT_DATA["$agent_name|days"]:-999}"
    commit="${AGENT_DATA["$agent_name|commit"]:-}"
    session="${AGENT_DATA["$agent_name|session"]:-}"
    
    # Format last activity
    if [ "$days" -eq 0 ]; then
        last_activity="Today"
    elif [ "$days" -eq 1 ]; then
        last_activity="Yesterday"
    elif [ "$days" -le 7 ]; then
        last_activity="${days} days ago"
    elif [ "$days" -eq 999 ]; then
        last_activity="No commits"
    else
        last_activity="$(date -d "${days} days ago" +%Y-%m-%d)"
    fi
    
    # Add NOW indicator for current agent
    if [ "$agent_name" = "$CURRENT_AGENT" ] && [ "$days" -eq 0 ]; then
        status="${status} NOW"
    fi
    
    # Format session link
    if [ -n "$session" ]; then
        session_link="[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/$branch/scrum.pmo/project.journal/$session/project.state.md) [./$session/project.state.md](file:///workspace/scrum.pmo/project.journal/$session/project.state.md)"
    else
        session_link="[View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/$branch)"
    fi
    
    echo "| **${agent_name}** | ${role} | \`${branch}\` | ${status} | ${last_activity} | ${session_link} |" >> "$AGENT_REGISTRY"
done < <(sort -n "$TEMP_SORT")

# Clean up temp file
rm -f "$TEMP_SORT"

# Add status legend
cat >> "$AGENT_REGISTRY" << 'EOF'

### Status Legend
- 🟢 **Active**: Currently working or very recent activity (< 24h)
- 🔵 **Semi-active**: Recent commits but not currently active (< 7 days)
- ⚫ **Dormant**: No recent activity (> 7 days)
- 🔴 **Violation**: Working on wrong branch (requires immediate action)

---

## 💻 Local Processes

EOF

# Add process information
echo "| Process | Type | Count | Status |" >> "$AGENT_REGISTRY"
echo "|---------|------|-------|--------|" >> "$AGENT_REGISTRY"
echo "| Cursor Processes | Editor/Server | ${CURSOR_COUNT} | 🟢 Running |" >> "$AGENT_REGISTRY"
echo "| Git Operations | VCS | Active | 🟢 Running |" >> "$AGENT_REGISTRY"
echo "| Terminal Session | Shell | 1 | 🟢 Active (${CURRENT_AGENT}) |" >> "$AGENT_REGISTRY"

# Add branch ownership section
cat >> "$AGENT_REGISTRY" << 'EOF'

---

## 🔒 Branch Ownership Rules

**CRITICAL**: One Agent = One Branch Policy (See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/sprints/sprint-0/agent-branch-assignments.md) [./sprints/sprint-0/agent-branch-assignments.md](file:///workspace/scrum.pmo/sprints/sprint-0/agent-branch-assignments.md))

| Branch | Owner | Lock Status |
|--------|-------|-------------|
EOF

# Add branch ownership data
for branch in "${!AGENT_BRANCHES[@]}"; do
    agent="${AGENT_BRANCHES[$branch]}"
    if [ "$branch" = "release/dev" ]; then
        lock_status="🔒 EXCLUSIVE"
    else
        lock_status="🔐 Assigned"
    fi
    echo "| \`${branch}\` | ${agent} | ${lock_status} |" >> "$AGENT_REGISTRY"
done | sort >> "$AGENT_REGISTRY"

# Add activity metrics
active_count=0
semi_active_count=0
dormant_count=0

for agent_name in "${!AGENT_ROLES[@]}"; do
    days="${AGENT_DATA["$agent_name|days"]:-999}"
    if [ "$days" -le "$DAYS_ACTIVE" ]; then
        ((active_count++))
    elif [ "$days" -le "$DAYS_SEMI_ACTIVE" ]; then
        ((semi_active_count++))
    else
        ((dormant_count++))
    fi
done

total_agents=${#AGENT_ROLES[@]}
active_percentage=$(( (active_count * 100) / total_agents ))

cat >> "$AGENT_REGISTRY" << EOF

---

## 📊 Activity Metrics

### Current Statistics
- **Total Registered Agents**: ${total_agents}
- **Active Agents**: ${active_count} (🟢)
- **Semi-Active Agents**: ${semi_active_count} (🔵)
- **Dormant Agents**: ${dormant_count} (⚫)
- **Activity Rate**: ${active_percentage}%

### Branch Activity (Last 7 Days)
EOF

# Show recent commits across all agent branches
echo "| Branch | Commits | Last Commit |" >> "$AGENT_REGISTRY"
echo "|--------|---------|-------------|" >> "$AGENT_REGISTRY"

for branch in "${!AGENT_BRANCHES[@]}"; do
    commit_count=$(git rev-list --count --since="7 days ago" "origin/$branch" 2>/dev/null || echo "0")
    last_commit=$(git log -1 --format="%s" "origin/$branch" 2>/dev/null | cut -c1-50 || echo "No commits")
    if [ "$commit_count" -gt 0 ]; then
        echo "| \`${branch}\` | ${commit_count} | ${last_commit}... |" >> "$AGENT_REGISTRY"
    fi
done | sort -k3 -nr >> "$AGENT_REGISTRY"

# Add alerts section
cat >> "$AGENT_REGISTRY" << 'EOF'

---

## 🚨 Alerts & Violations

### Current Status
EOF

# Check for any violations
violations_found=false
for branch in $(git branch -r | grep -v HEAD | sed 's/origin\///'); do
    # Skip non-agent branches
    if [[ ! " ${!AGENT_BRANCHES[@]} " =~ " ${branch} " ]]; then
        continue
    fi
    
    # Check if multiple agents committed to same branch in last 24h
    authors=$(git log --since="24 hours ago" --format="%an" "origin/$branch" 2>/dev/null | sort -u | wc -l)
    if [ "$authors" -gt 1 ]; then
        violations_found=true
        echo "- 🔴 **VIOLATION**: Multiple authors on \`${branch}\` in last 24h" >> "$AGENT_REGISTRY"
    fi
done

if [ "$violations_found" = false ]; then
    echo "- ✅ No violations detected" >> "$AGENT_REGISTRY"
fi

# Add update timestamp
cat >> "$AGENT_REGISTRY" << EOF

---

## 📝 Auto-Detection Log

**Script Run**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
**Git Remote**: $(git remote get-url origin)
**Current Branch**: ${CURRENT_BRANCH}
**Current Agent**: ${CURRENT_AGENT}

### Detection Summary
- Analyzed ${total_agents} agent branches
- Checked ${CURSOR_COUNT} local processes
- Scanned commits from last ${DAYS_SEMI_ACTIVE} days
- Updated registry automatically

---

**Next Update**: Run \`./scripts/detect-active-agents.sh\` or wait for scheduled execution
EOF

echo -e "${GREEN}✅ Agent registry updated successfully!${NC}"
echo -e "   Registry: ${BLUE}${AGENT_REGISTRY}${NC}"

# Show summary
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   Active Agents: ${GREEN}${active_count}${NC}"
echo -e "   Semi-Active: ${YELLOW}${semi_active_count}${NC}"
echo -e "   Dormant: ${RED}${dormant_count}${NC}"