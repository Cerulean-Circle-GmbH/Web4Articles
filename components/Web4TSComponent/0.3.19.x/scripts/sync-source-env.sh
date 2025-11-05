#!/bin/bash
# Sync all source.env files from the template (single source of truth)
# 
# Purpose: Ensure consistency across all source.env files when template changes
# Usage: ./scripts/sync-source-env.sh
#
# Template Propagation Flow:
#   templates/project/source.env.template (SINGLE SOURCE OF TRUTH)
#     ↓ sync
#   1. Project root: source.env
#   2. Component's own: components/Web4TSComponent/0.3.17.4/source.env
#   3. Test data: components/Web4TSComponent/0.3.17.4/test/data/source.env
#
# @pdca 2025-11-04 - Created to prevent manual editing inconsistencies

set -e

# Get script directory (works even if called from symlink)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPONENT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$COMPONENT_DIR/../../.." && pwd)"

TEMPLATE="$COMPONENT_DIR/templates/project/source.env.template"
TARGETS=(
    "$PROJECT_ROOT/source.env"  # Project root
    "$COMPONENT_DIR/source.env"  # Component's own
    "$COMPONENT_DIR/test/data/source.env"  # Test data
)

if [ ! -f "$TEMPLATE" ]; then
    echo "❌ Template not found: $TEMPLATE"
    exit 1
fi

echo "📋 Syncing source.env files from template..."
echo "   Template: $TEMPLATE"
echo ""

for target in "${TARGETS[@]}"; do
    if [ -f "$target" ]; then
        # Make relative for display
        rel_target="${target#$PROJECT_ROOT/}"
        echo "   ✅ Syncing: $rel_target"
        cp "$TEMPLATE" "$target"
        chmod 755 "$target"
    else
        rel_target="${target#$PROJECT_ROOT/}"
        echo "   ⚠️  Not found (skipping): $rel_target"
    fi
done

echo ""
echo "✅ All source.env files synced!"
echo "   👉 Run: source source.env"

