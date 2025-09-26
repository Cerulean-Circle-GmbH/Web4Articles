#!/bin/bash

# ONCE Multi-Environment Demo Launcher V2
# With real IP address detection and proper lifecycle management

echo "🚀 ONCE Multi-Environment Demo Launcher V2"
echo "=========================================="

# Get real IP address
HOST_IP=$(hostname -I | awk '{print $1}')
if [ -z "$HOST_IP" ]; then
    echo "❌ Could not detect host IP address"
    exit 1
fi

echo "🌐 Using host IP: $HOST_IP"
export HOST=$HOST_IP
export PORT=8080

# Tracking file for PIDs
PID_FILE="/tmp/once-demo-pids.txt"
> "$PID_FILE"  # Clear previous PIDs

# Function to record PID
record_pid() {
    echo "$1:$2" >> "$PID_FILE"
    echo "📝 Recorded PID $1 for $2"
}

# Function to kill all demo processes
cleanup_demo() {
    echo -e "\n🛑 Shutting down ONCE demo..."
    
    # First try to read from PID file
    if [ -f "$PID_FILE" ]; then
        echo "📋 Reading PIDs from tracking file..."
        while IFS=: read -r pid name; do
            if kill -0 "$pid" 2>/dev/null; then
                echo "  Stopping $name (PID: $pid)..."
                kill -TERM "$pid" 2>/dev/null
                sleep 1
                # Force kill if still running
                if kill -0 "$pid" 2>/dev/null; then
                    kill -KILL "$pid" 2>/dev/null
                fi
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    # Also check for any remaining processes
    echo "🔍 Checking for remaining demo processes..."
    ps -edalf | grep -E "(launch-demo|server.mjs|once-demo)" | grep -v grep | while read -r line; do
        pid=$(echo "$line" | awk '{print $4}')
        if [ -n "$pid" ] && [ "$pid" != "$$" ]; then
            echo "  Found orphaned process: $pid"
            kill -TERM "$pid" 2>/dev/null
        fi
    done
    
    # Clean up zombie processes
    echo "🧹 Cleaning up zombie processes..."
    ps aux | grep defunct | grep -E "(launch-demo|server.mjs)" | awk '{print $2}' | xargs -r kill -9 2>/dev/null
    
    echo "✅ Demo shutdown complete"
}

# Set up trap for cleanup on exit
trap cleanup_demo EXIT INT TERM

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to open URL in browser
open_in_browser() {
    local url=$1
    # Replace localhost with actual IP
    url=${url//localhost/$HOST_IP}
    
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url"
    elif command -v open &> /dev/null; then
        open "$url"
    elif command -v start &> /dev/null; then
        start "$url"
    else
        echo "📋 Please open manually: $url"
    fi
}

# Update server configuration files with real IP
update_server_ip() {
    echo "🔧 Updating server configuration with IP: $HOST_IP"
    
    # Create temporary server config
    cat > ../node-server/server-config.js << EOF
// Auto-generated server configuration
export const SERVER_CONFIG = {
    HOST: '${HOST_IP}',
    PORT: ${PORT}
};
EOF
}

# Start Node.js server
echo -e "\n1️⃣ Starting Node.js ONCE Server..."
cd ../node-server

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing server dependencies..."
    npm install
fi

# Update server IP configuration
update_server_ip

# Start server in background with environment variables
echo "🌐 Starting server on http://$HOST_IP:$PORT"
HOST=$HOST_IP PORT=$PORT node server.mjs &
SERVER_PID=$!
record_pid $SERVER_PID "ONCE-Server"
echo "✅ Server started (PID: $SERVER_PID)"

# Wait for server to start
echo "⏳ Waiting for server to initialize..."
for i in {1..10}; do
    if curl -s "http://$HOST_IP:$PORT/health" > /dev/null; then
        echo "✅ Server is ready!"
        break
    fi
    sleep 1
done

# Create demo status monitor
monitor_demo() {
    while true; do
        clear
        echo "📊 ONCE Demo Status Monitor"
        echo "=========================="
        echo "🌐 Server: http://$HOST_IP:$PORT"
        echo ""
        
        # Check server health
        if curl -s "http://$HOST_IP:$PORT/health" > /dev/null; then
            health=$(curl -s "http://$HOST_IP:$PORT/health")
            echo "✅ Server Status: HEALTHY"
            echo "   Peers: $(echo "$health" | grep -o '"peers":[0-9]*' | cut -d: -f2)"
            echo "   Scenarios: $(echo "$health" | grep -o '"scenarios":[0-9]*' | cut -d: -f2)"
        else
            echo "❌ Server Status: DOWN"
        fi
        
        echo ""
        echo "📋 Running Processes:"
        ps -edalf | grep -E "(server.mjs)" | grep -v grep | awk '{print "   PID:", $4, "CMD:", $NF}'
        
        echo ""
        echo "🛑 Press Ctrl+C to stop the demo"
        sleep 5
    done
}

# Show demo instructions
echo -e "\n✅ Demo Environment Launched!"
echo "=============================="
echo ""
echo "🌐 Server URL: http://$HOST_IP:$PORT"
echo ""
echo "📋 Quick Test Commands:"
echo "  curl http://$HOST_IP:$PORT/health"
echo "  curl http://$HOST_IP:$PORT/scenarios"
echo ""
echo "🌐 Browser Client:"
echo "  file://$PWD/../browser-client/index.html"
echo "  (Update WebSocket URL to: ws://$HOST_IP:$PORT)"
echo ""
echo "🖥️ Test Client:"
echo "  cd ../. && HOST=$HOST_IP node test-client.js"
echo ""
echo "📊 Visual Demo:"
echo "  cd ../. && HOST=$HOST_IP node demo-showcase.js"
echo ""
echo "🛑 To stop the demo, press Ctrl+C"
echo ""

# Optional: Start status monitor
read -p "📊 Start status monitor? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    monitor_demo
else
    echo "💡 Demo is running in background. Press Ctrl+C to stop."
    wait $SERVER_PID
fi