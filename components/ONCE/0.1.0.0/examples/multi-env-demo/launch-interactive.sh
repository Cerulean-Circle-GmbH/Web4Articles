# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# ONCE Interactive Demo Launcher
# Prevents zombie processes with proper lifecycle management

echo "🚀 ONCE Interactive Demo Launcher"
echo "================================"
echo ""

# Change to examples directory
cd "$(dirname "$0")/.." || exit 1

# Check dependencies
echo "📦 Checking dependencies..."

# Install chalk if needed
if ! npm list chalk >/dev/null 2>&1; then
    echo "Installing chalk for colored output..."
    npm install chalk
fi

# Install ws if needed  
if ! npm list ws >/dev/null 2>&1; then
    echo "Installing ws for WebSocket support..."
    npm install ws
fi

echo ""
echo "✅ Dependencies ready"
echo ""

# PID tracking file
PID_FILE="/tmp/once-interactive-demo.pid"

# Cleanup function
cleanup() {
    echo -e "\n🛑 Cleaning up..."
    
    # Kill interactive demo if PID exists
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "Stopping interactive demo (PID: $PID)..."
            kill -TERM "$PID" 2>/dev/null
            sleep 1
            if kill -0 "$PID" 2>/dev/null; then
                kill -KILL "$PID" 2>/dev/null
            fi
        fi
        rm -f "$PID_FILE"
    fi
    
    # Clean up any remaining processes
    echo "Checking for orphaned processes..."
    ps -edalf | grep -E "(interactive-demo|server\.mjs)" | grep -v grep | awk '{print $4}' | while read -r pid; do
        if [ -n "$pid" ] && [ "$pid" != "$$" ]; then
            echo "  Cleaning up PID: $pid"
            kill -TERM "$pid" 2>/dev/null || true
        fi
    done
    
    # Final zombie cleanup
    ps aux | grep defunct | grep -E "(demo|server)" | awk '{print $2}' | xargs -r kill -9 2>/dev/null || true
    
    echo "✅ Cleanup complete"
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# Launch interactive demo
echo "🎮 Starting ONCE Interactive Demo..."
echo "──────────────────────────────────"
echo ""
echo "This demo features:"
echo "  • Keyboard controls (press 'h' for help)"
echo "  • Graceful lifecycle management"
echo "  • No zombie processes"
echo "  • Real IP address usage"
echo ""
echo "Starting in 2 seconds..."
sleep 2

# Start the interactive demo
node multi-env-demo/interactive-demo.js &
DEMO_PID=$!
echo $DEMO_PID > "$PID_FILE"

echo ""
echo "✅ Interactive demo started (PID: $DEMO_PID)"
echo ""
echo "Press Ctrl+C to exit cleanly"
echo ""

# Wait for the demo process
wait $DEMO_PID