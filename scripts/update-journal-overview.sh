#!/bin/bash

# Update Project Journal Overview Script
# Automatically maintains the project.journal.overview.md file with current session information

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
JOURNAL_DIR="$PROJECT_ROOT/scrum.pmo/project.journal"
OVERVIEW_FILE="$PROJECT_ROOT/scrum.pmo/project.journal/project.journal.overview.md"

# Function to get session info
get_session_info() {
    local session_dir="$1"
    local session_name=$(basename "$session_dir")
    local project_state="$session_dir/project.state.md"
    
    # Extract role and status if project.state.md exists
    if [ -f "$project_state" ]; then
        local role=$(grep -E "^\- \*\*Role\*\*:" "$project_state" 2>/dev/null | head -1 | sed 's/.*Role\*\*: *//' | tr -d '\n' || echo "Unknown")
        local status=$(grep -E "^\- \*\*Status\*\*:" "$project_state" 2>/dev/null | head -1 | sed 's/.*Status\*\*: *//' | tr -d '\n' || echo "Unknown")
        echo "$session_name|$role|$status"
    else
        echo "$session_name|Unknown|No project.state.md"
    fi
}

# Get current UTC timestamp
UTC_TIMESTAMP=$(date -u +"%Y-%m-%d UTC-%H%M")

# Count sessions and PDCAs
TOTAL_SESSIONS=$(find "$JOURNAL_DIR" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
PDCA_COUNT=$(find "$JOURNAL_DIR" -name "*.md" -path "*/pdca/*" | wc -l | tr -d ' ')

# Get latest session (chronologically, filtering directories only)
LATEST_SESSION=$(ls -1 "$JOURNAL_DIR" | grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{4}' | sort -r | head -1)
LATEST_SESSION_PATH="$JOURNAL_DIR/$LATEST_SESSION"

# Create updated overview
cat > "$OVERVIEW_FILE" << EOF
[Back to Index](../index.md)

# Project Journal Overview

This document provides a comprehensive overview of all project journal sessions, organized chronologically. Each session represents a specific recovery, development phase, or significant project milestone.

## Purpose

The project journal system tracks:
- **Recovery Sessions**: AI agent context restoration and role initialization
- **Development Milestones**: Key project phases and deliverables
- **PDCA Cycles**: Process improvement and incident documentation
- **Sprint Activities**: Development work and collaboration records

## Current Active Session

- **[$LATEST_SESSION](./project.journal/$LATEST_SESSION/project.state.md)** ⭐ *Active*
$(if [ -f "$LATEST_SESSION_PATH/project.state.md" ]; then
    echo "  - **Role**: $(grep -E "^\- \*\*Role\*\*:" "$LATEST_SESSION_PATH/project.state.md" 2>/dev/null | head -1 | sed 's/.*Role\*\*: *//' | tr -d '\n' || echo "Unknown")"
    echo "  - **Status**: $(grep -E "^\- \*\*Status\*\*:" "$LATEST_SESSION_PATH/project.state.md" 2>/dev/null | head -1 | sed 's/.*Status\*\*: *//' | tr -d '\n' || echo "Unknown")"
    echo "  - **Branch**: $(grep -E "^\- \*\*Branch\*\*:" "$LATEST_SESSION_PATH/project.state.md" 2>/dev/null | head -1 | sed 's/.*Branch\*\*: *//' | tr -d '\n' || echo "release/dev")"
    echo "  - **Agent**: 🟢 Active (Background Agent)"
    if [ -d "$LATEST_SESSION_PATH/pdca" ]; then
        PDCA_SESSION_COUNT=$(find "$LATEST_SESSION_PATH/pdca" -name "*.md" | wc -l | tr -d ' ')
        echo "  - **PDCA Entries**: [$PDCA_SESSION_COUNT entries](./project.journal/$LATEST_SESSION/pdca/)"
    fi
fi)

## All Sessions (Chronological)

EOF

# Add all sessions in chronological order
for session_dir in $(ls -1r "$JOURNAL_DIR"); do
    session_path="$JOURNAL_DIR/$session_dir"
    if [ -d "$session_path" ]; then
        # Format session entry
        echo "### $session_dir" >> "$OVERVIEW_FILE"
        
        if [ -f "$session_path/project.state.md" ]; then
            echo "- **Session**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/$session_dir/project.state.md) [./project.journal/$session_dir/project.state.md](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/$session_dir/project.state.md)" >> "$OVERVIEW_FILE"
            
            # Try to extract role, status, and branch
            role=$(grep -E "^\- \*\*Role\*\*:" "$session_path/project.state.md" 2>/dev/null | head -1 | sed 's/.*Role\*\*: *//' | tr -d '\n' || echo "Unknown")
            status=$(grep -E "^\- \*\*Status\*\*:" "$session_path/project.state.md" 2>/dev/null | head -1 | sed 's/.*Status\*\*: *//' | tr -d '\n' || echo "Unknown")
            branch=$(grep -E "^\- \*\*Branch\*\*:" "$session_path/project.state.md" 2>/dev/null | head -1 | sed 's/.*Branch\*\*: *//' | tr -d '\n' || echo "Unknown")
            
            echo "- **Role**: $role" >> "$OVERVIEW_FILE"
            echo "- **Status**: $status" >> "$OVERVIEW_FILE"
            echo "- **Branch**: $branch" >> "$OVERVIEW_FILE"
            
            # Determine agent status and identity
            if [ "$session_dir" = "2025-08-16-1201-cleanup" ]; then
                echo "- **Agent**: 🟢 Active (THE ScrumMaster Background Agent - THIS SESSION)" >> "$OVERVIEW_FILE"
            elif [ "$session_dir" = "$(basename "$LATEST_SESSION")" ]; then
                echo "- **Agent**: 🟢 Active (Background Agent)" >> "$OVERVIEW_FILE"
            else
                echo "- **Agent**: ⚫ Expired" >> "$OVERVIEW_FILE"
            fi
            
            # PDCA entries (always show)
            if [ -d "$session_path/pdca" ]; then
                pdca_count=$(find "$session_path/pdca" -name "*.md" | wc -l | tr -d ' ')
                echo "- **PDCA Entries**: [$pdca_count entries](./project.journal/$session_dir/pdca/)" >> "$OVERVIEW_FILE"
            else
                echo "- **PDCA Entries**: None" >> "$OVERVIEW_FILE"
            fi
            
            # Tree Index (always show)
            if [ -f "$session_path/tree.index.md" ]; then
                echo "- **Tree Index**: [Available](./project.journal/$session_dir/tree.index.md)" >> "$OVERVIEW_FILE"
            else
                echo "- **Tree Index**: Not available" >> "$OVERVIEW_FILE"
            fi
            
            # Workspace Documentation (always show)
            if [ -f "$session_path/workspacesMountPoint.md" ]; then
                echo "- **Workspace Documentation**: [Available](./project.journal/$session_dir/workspacesMountPoint.md)" >> "$OVERVIEW_FILE"
            else
                echo "- **Workspace Documentation**: Not available" >> "$OVERVIEW_FILE"
            fi
        else
            echo "- **Session**: $session_dir (No project.state.md)" >> "$OVERVIEW_FILE"
        fi
        
        echo "" >> "$OVERVIEW_FILE"
    fi
done

# Add footer with statistics
cat >> "$OVERVIEW_FILE" << EOF

## Statistics

- **Total Sessions**: $TOTAL_SESSIONS
- **Total PDCA Entries**: $PDCA_COUNT
- **Latest Session**: $LATEST_SESSION
- **Overview Last Updated**: $UTC_TIMESTAMP

## PDCA Structure (Current Standard)

Since session \`2025-08-15-0955-refactor\`, all PDCA entries use the simplified role-based structure:

\`\`\`
pdca/
└── role/
    ├── scrum-master/
    │   └── YYYY-MM-DD-UTC-HHMM.md
    ├── developer/
    │   └── YYYY-MM-DD-UTC-HHMM.md
    └── [other-roles]/
        └── YYYY-MM-DD-UTC-HHMM.md
\`\`\`

## Usage Guidelines

### For New Journal Entries
1. **Always add backlink**: Include \`[Back to Project Journal](../) | [Journal Overview](../../project.journal.overview.md)\` at the top
2. **Update this overview**: Run \`scripts/update-journal-overview.sh\` after creating new sessions
3. **PDCA Backlinks**: Include \`[Journal Overview](../../../../../project.journal.overview.md)\` in PDCA entries

### For Navigation
- Use this overview as the central hub for all project journal access
- Session links provide direct access to project states
- PDCA links provide access to process documentation

## Maintenance

This overview is automatically updated by:
- Running \`scripts/update-journal-overview.sh\`
- Manual updates when creating new sessions
- Automatic updates during recovery processes

**Next Update**: Run \`scripts/update-journal-overview.sh\` after each new journal session

[Back to Index](../index.md)
EOF

echo "✅ Project journal overview updated: $OVERVIEW_FILE"
echo "📊 Statistics: $TOTAL_SESSIONS sessions, $PDCA_COUNT PDCA entries"
echo "🔗 Latest session: $LATEST_SESSION"
