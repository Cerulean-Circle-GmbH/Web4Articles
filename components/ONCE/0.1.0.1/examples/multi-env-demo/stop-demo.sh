#!/bin/bash

# ONCE Demo Graceful Shutdown Script

echo "🛑 ONCE Demo Shutdown Script"
echo "============================"

# Function to gracefully stop a process
stop_process() {
    local pid=$1
    local name=$2
    
    if kill -0 "$pid" 2>/dev/null; then
        echo "  Stopping $name (PID: $pid)..."
        # Send SIGTERM for graceful shutdown
        kill -TERM "$pid" 2>/dev/null
        
        # Wait up to 5 seconds for process to exit
        local count=0
        while kill -0 "$pid" 2>/dev/null && [ $count -lt 5 ]; do
            sleep 1
            ((count++))
        done
        
        # Force kill if still running
        if kill -0 "$pid" 2>/dev/null; then
            echo "    Force killing $name..."
            kill -KILL "$pid" 2>/dev/null
        else
            echo "    ✓ $name stopped gracefully"
        fi
    fi
}

# Find all demo-related processes
echo "🔍 Finding ONCE demo processes..."
echo ""

# Use ps -edalf to find processes
PROCESSES=$(ps -edalf | grep -E "(launch-demo|server\.mjs|once-demo|node.*server)" | grep -v grep | grep -v "stop-demo")

if [ -z "$PROCESSES" ]; then
    echo "✅ No ONCE demo processes found running"
    exit 0
fi

echo "Found processes:"
echo "$PROCESSES" | while read -r line; do
    pid=$(echo "$line" | awk '{print $4}')
    cmd=$(echo "$line" | awk '{for(i=15;i<=NF;i++) printf "%s ", $i; print ""}')
    echo "  PID: $pid - $cmd"
done

echo ""
read -p "🤔 Stop all these processes? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted"
    exit 0
fi

echo ""
echo "🛑 Stopping processes..."

# Stop each process
echo "$PROCESSES" | while read -r line; do
    pid=$(echo "$line" | awk '{print $4}')
    ppid=$(echo "$line" | awk '{print $5}')
    cmd=$(echo "$line" | awk '{for(i=15;i<=NF;i++) printf "%s ", $i; print ""}')
    
    # Identify process type
    if [[ "$cmd" == *"server.mjs"* ]]; then
        name="ONCE-Server"
    elif [[ "$cmd" == *"launch-demo"* ]]; then
        name="Demo-Launcher"
    else
        name="Demo-Process"
    fi
    
    stop_process "$pid" "$name"
done

# Clean up zombie processes
echo ""
echo "🧹 Cleaning up zombie processes..."
ZOMBIES=$(ps aux | grep defunct | grep -E "(launch-demo|server\.mjs)")
if [ -n "$ZOMBIES" ]; then
    echo "$ZOMBIES" | awk '{print $2}' | xargs -r kill -9 2>/dev/null
    echo "  ✓ Zombies cleaned"
fi

# Check for any remaining processes
echo ""
echo "🔍 Final check..."
REMAINING=$(ps -edalf | grep -E "(launch-demo|server\.mjs|once-demo)" | grep -v grep | grep -v "stop-demo")

if [ -z "$REMAINING" ]; then
    echo "✅ All ONCE demo processes stopped successfully!"
else
    echo "⚠️  Some processes may still be running:"
    echo "$REMAINING"
fi

# Clean up PID file if exists
if [ -f "/tmp/once-demo-pids.txt" ]; then
    rm -f "/tmp/once-demo-pids.txt"
    echo "✓ Cleaned up PID tracking file"
fi

echo ""
echo "✅ Demo shutdown complete!"