#!/bin/bash
# Test: Auto-source should only source once, not on every call
# Issue: web4tscomponent was sourcing source.env on every invocation

COMPONENT_PATH="/Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.17.1"
cd "$COMPONENT_PATH" || exit 1

echo "🧪 Test: Auto-source efficiency"
echo "================================"

# Setup: Source manually and set markers
source source.env > /dev/null 2>&1
export WEB4_SOURCED_COMPONENT="0.3.17.1"
export WEB4_SOURCE_ENV_MTIME=$(stat -f %m source.env 2>/dev/null || stat -c %Y source.env 2>/dev/null)

echo "✅ Setup: Environment manually sourced"
echo "   WEB4_PROJECT_ROOT=$WEB4_PROJECT_ROOT"
echo "   WEB4_SOURCED_COMPONENT=$WEB4_SOURCED_COMPONENT"
echo "   WEB4_SOURCE_ENV_MTIME=$WEB4_SOURCE_ENV_MTIME"
echo ""

# Test: Call web4tscomponent and check if it sources again
echo "🔍 Calling web4tscomponent..."
OUTPUT=$(./web4tscomponent 2>&1 | head -20)

echo "$OUTPUT" | head -10
echo ""

# Check: Should NOT see "Web4 environment loaded" (which indicates sourcing)
if echo "$OUTPUT" | grep -q "Web4 environment loaded"; then
    echo "❌ FAIL: Environment was sourced again (inefficient)"
    echo "   Expected: Skip sourcing when already loaded"
    echo "   Actual: Sourced again despite markers being set"
    exit 1
else
    echo "✅ PASS: Environment was not sourced again (efficient)"
    echo "   Correctly detected already-loaded state"
    exit 0
fi

