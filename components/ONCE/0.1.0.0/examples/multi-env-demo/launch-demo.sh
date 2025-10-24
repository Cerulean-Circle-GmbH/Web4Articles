# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# ONCE Multi-Environment Demo Launcher
# This script helps launch all components of the demo

echo "🚀 ONCE Multi-Environment Demo Launcher"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to open URL in browser
open_in_browser() {
    if command -v xdg-open &> /dev/null; then
        xdg-open "$1"
    elif command -v open &> /dev/null; then
        open "$1"
    elif command -v start &> /dev/null; then
        start "$1"
    else
        echo "📋 Please open manually: $1"
    fi
}

# Start Node.js server
echo "1️⃣ Starting Node.js ONCE Server..."
cd ../node-server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Start server in background
echo "🌐 Starting server on http://localhost:8080"
node server.mjs &
SERVER_PID=$!
echo "✅ Server started (PID: $SERVER_PID)"

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
sleep 3

# Open browser clients
echo ""
echo "2️⃣ Opening Browser Clients..."
BROWSER_CLIENT="file://$(pwd)/../browser-client/index.html"
echo "🌐 Browser Client 1: $BROWSER_CLIENT"
open_in_browser "$BROWSER_CLIENT"

sleep 1

echo "🌐 Browser Client 2: $BROWSER_CLIENT"
open_in_browser "$BROWSER_CLIENT"

# Open Web Worker example
echo ""
echo "3️⃣ Opening Web Worker Example..."
WORKER_EXAMPLE="file://$(pwd)/../web-worker/index.html"
echo "⚡ Web Worker: $WORKER_EXAMPLE"
open_in_browser "$WORKER_EXAMPLE"

# Display instructions
echo ""
echo "✅ Demo Environment Launched!"
echo ""
echo "📋 Instructions:"
echo "1. In Browser Client 1:"
echo "   - Click 'Connect to Server'"
echo "   - Request some scenarios"
echo "   - Create and share a scenario"
echo ""
echo "2. In Browser Client 2:"
echo "   - Click 'Connect to Server'"
echo "   - Click 'Discover Peers' to see Client 1"
echo "   - Watch for broadcast scenarios from Client 1"
echo ""
echo "3. In Web Worker Example:"
echo "   - Click 'Initialize Worker'"
echo "   - Process single or batch scenarios"
echo "   - Try heavy computation tasks"
echo ""
echo "4. Monitor the Node.js server console for activity"
echo ""
echo "🛑 To stop the demo, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping demo..."
    kill $SERVER_PID 2>/dev/null
    echo "✅ Demo stopped"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Keep script running
echo "📊 Server is running. Press Ctrl+C to stop."
wait $SERVER_PID