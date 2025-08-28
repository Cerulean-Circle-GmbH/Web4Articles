#!/bin/bash

# Update Project Index Script
# This script updates the main index.md with enhanced links like GitHub links

set -euo pipefail

JOURNAL_DIR="${1:-}"
if [[ -z "$JOURNAL_DIR" ]]; then
    cat << EOF
Web4 Project Journal Index Updater

Usage:
  $(basename $0) <journal_dir>

Description:
  Updates the project.state.md file with current Git status and file listings
  Maintains project journal documentation consistency

Examples:
  $(basename $0) /workspace/scrum.pmo/project.journal/2025-01-27-1300
  $(basename $0) scrum.pmo/project.journal/current-session

Note: Creates project.state.md if it doesn't exist
      Updates existing content between markers if present
EOF
    exit 1
fi

WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
INDEX_FILE="$WORKSPACE_ROOT/index.md"
TEMP_INDEX="$WORKSPACE_ROOT/index.md.tmp"

# Set GitHub base URL for recovery integrity
GITHUB_BASE_URL="https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev"

# Backup existing index
cp "$INDEX_FILE" "$INDEX_FILE.backup"

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%d")

# Get current branch for GitHub links
CURRENT_BRANCH=$(git branch --show-current)

# Start building new index
{
    echo "[Back to Index](./index.md)"
    echo ""
    echo "# Web4Articles Markdown File Index ($TIMESTAMP)"
    echo ""
    echo "| File | Role/Type | Last Modified |"
    echo "|------|-----------|--------------|"
    
    # Find all markdown files and create enhanced entries
    find "$WORKSPACE_ROOT" -name "*.md" -type f \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/dist/*" \
        -not -name "index.md.tmp" \
        -not -name "index.md.backup" \
        | sort | while read -r file; do
        
        # Get relative path from workspace root (macOS compatible)
        rel_path=$(python3 -c "import os; print(os.path.relpath('$file', '$WORKSPACE_ROOT'))")
        
        # Get last modified date (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            mod_date=$(stat -f %Sm -t %Y-%m-%d "$file" 2>/dev/null || date +%Y-%m-%d)
        else
            mod_date=$(stat -c %y "$file" 2>/dev/null | cut -d' ' -f1 || date +%Y-%m-%d)
        fi
        
        # Determine role/type based on path
        role_type="Unknown"
        case "$rel_path" in
            scrum.pmo/roles/*/process.md) role_type="$(basename "$(dirname "$rel_path")") process" ;;
            scrum.pmo/roles/*/PDCA/*) role_type="PDCA" ;;
            scrum.pmo/sprints/*/planning.md) role_type="Sprint planning" ;;
            scrum.pmo/sprints/*/task-*) role_type="Sprint task" ;;
            scrum.pmo/project.journal/*/project.state.md) role_type="Project state" ;;
            scrum.pmo/project.journal/*/tree.index.md) role_type="Tree index" ;;
            scrum.pmo/templates/*) role_type="Template" ;;
            .github/chatmodes/*) role_type="Chatmode" ;;
            docs/*) role_type="Docs" ;;
            Documentation/Ontology.md/*) role_type="Ontology" ;;
            README.md) role_type="Project root, tech stack, recovery" ;;
            recovery.md) role_type="Recovery log" ;;
            # qa-feedback-log.md removed - use PDCA process instead
            index.md) role_type="Index" ;;
            COMMIT_PUSH_POINT.md) role_type="Commit guide" ;;
            *) role_type="Document" ;;
        esac
        
        # Create GitHub link
        github_link="https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/$CURRENT_BRANCH/$rel_path"
        
        # Output table row with GitHub link and relative link
        echo "| [GitHub]($github_link): [$rel_path]($rel_path) | $role_type | $mod_date |"
    done
    
    echo ""
    echo "*This index is auto-generated for recovery and onboarding. Update as new markdown files are added.*"
    echo ""
    echo "## Quick Links"
    echo ""
    echo "### Project Structure"
    if [[ -f "$JOURNAL_DIR/tree.index.md" ]]; then
        rel_tree_path=$(python3 -c "import os; print(os.path.relpath('$JOURNAL_DIR/tree.index.md', '$WORKSPACE_ROOT'))")
        echo "- [Latest Repository Tree]($rel_tree_path)"
    fi
    echo "- [Project Journal](./scrum.pmo/project.journal/)"
    echo "- [Roles](./scrum.pmo/roles/)"
    echo "- [Sprints](./scrum.pmo/sprints/)"
    echo ""
    echo "### Recovery & Process"
    echo "- [Recovery Process](./scrum.pmo/roles/ScrumMaster/recovery-process.md)"
    echo "- [README](./README.md)"
    echo "- [QA Feedback Process](./scrum.pmo/roles/_shared/PDCA/howto.PDCA.md)"
    echo ""
    echo "### Development"
    echo "- [Documentation](./Documentation/)"
    echo "- [Components](./components/)"
    echo "- [Tools](./tools/)"
    
} > "$TEMP_INDEX"

# Replace original with new index
mv "$TEMP_INDEX" "$INDEX_FILE"

echo "✅ Updated project index: $INDEX_FILE"
echo "📁 Referenced journal dir: $JOURNAL_DIR"
