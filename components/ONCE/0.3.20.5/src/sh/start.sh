#!/usr/bin/env sh
# DRY: Source shared component start library
# @pdca 2025-01-XX-UTC-optimize-shell-scripts-eliminate-dry.pdca.md
# @pdca 2025-01-18-UTC-analyze-build-system-update-failure.pdca.md - Auto-update detection

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
COMPONENT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd -P)"

# 🛡️ SELF-HEALING: Auto-detect and update old-style start.sh
# Check if this is an old-style start.sh (hardcoded paths, no shared library)
if [ ! -f "$SCRIPT_DIR/lib-component-start.sh" ] || grep -q '\.\./\.\./\.\.' "$0" 2>/dev/null; then
    echo "🔧 Detected old-style start.sh - auto-updating build system..."
    
    # Extract component name and version from component directory
    COMPONENT_NAME=$(basename "$(dirname "$COMPONENT_DIR")")
    COMPONENT_VERSION=$(basename "$COMPONENT_DIR")
    
    # Find project root (go up from components/ComponentName/version)
    PROJECT_ROOT="$(cd "$COMPONENT_DIR/../../.." && pwd -P)"
    
    # Call updateBuildSystem via web4tscomponent CLI
    if command -v web4tscomponent >/dev/null 2>&1; then
        echo "   📦 Updating build system for $COMPONENT_NAME $COMPONENT_VERSION..."
        cd "$PROJECT_ROOT"
        web4tscomponent on "$COMPONENT_NAME" "$COMPONENT_VERSION" updateBuildSystem >/dev/null 2>&1
        cd "$COMPONENT_DIR"
        
        # Re-execute start.sh with updated scripts
        if [ -f "$SCRIPT_DIR/lib-component-start.sh" ]; then
            echo "   ✅ Build system updated, restarting with optimized scripts..."
            exec "$0"
        fi
    else
        echo "   ⚠️  web4tscomponent not found in PATH - cannot auto-update"
        echo "   💡 Run: web4tscomponent on $COMPONENT_NAME $COMPONENT_VERSION updateBuildSystem"
    fi
fi

# Normal execution: Use shared component start library
. "$SCRIPT_DIR/lib-component-start.sh" "ONCE" "dist/ts/layer5/ONCECLI.js"
