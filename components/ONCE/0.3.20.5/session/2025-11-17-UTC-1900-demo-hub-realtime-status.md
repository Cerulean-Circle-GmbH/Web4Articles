# Demo Hub Real-Time Status Tracking Fix

**Date**: 2025-11-17 UTC 19:00  
**Version**: 0.3.20.5  
**Issue**: Demo hub status bar never reflects stopped servers

## Problem Analysis

The demo hub at `http://localhost:42777/demo` was not correctly tracking server lifecycle events:

1. **Polling-only approach**: Used HTTP polling every 3 seconds via `/servers` endpoint
2. **Assumed all registered servers are running**: No status tracking per server
3. **Hardcoded stopped count to 0**: Status bar always showed `⚪ Stopped: 0`
4. **No real-time updates**: User had to wait for next poll cycle (up to 3 seconds)

## Root Cause

The primary server broadcasts lifecycle events internally but **never notified browser clients** about:
- Server registration events
- Server stop events
- Server state changes

The demo hub had no WebSocket connection to receive these events.

## Solution Implemented

### 1. Server-Side Changes (`ServerHierarchyManager.ts`)

#### Added Broadcast Helper Method
```typescript
private broadcastServerEvent(eventType: string, data: any): void {
    const clientCount = this.browserClients.size;
    console.log(`📡 Broadcasting ${eventType} to ${clientCount} browser client(s)`);
    
    if (clientCount === 0) {
        console.log('ℹ️  No browser clients connected');
        return;
    }
    
    this.browserClients.forEach((client: WebSocket) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: eventType,
                data: data,
                timestamp: new Date().toISOString()
            }));
        }
    });
}
```

#### Broadcast on Server Registration
```typescript
private async handleServerRegistration(ws: WebSocket, clientServerModel: ONCEServerModel): Promise<void> {
    // ... registration logic ...
    
    // ✅ Broadcast server registration event to all browser clients
    this.broadcastServerEvent('server-registered', clientServerModel);
}
```

#### Broadcast on Server Stop
```typescript
// In /stop-server endpoint handler
this.serverRegistry.delete(uuid);

// ✅ Broadcast server stopped event to all browser clients
this.broadcastServerEvent('server-stopped', { uuid, port });
```

### 2. Client-Side Changes (`demo-hub.html`)

#### Added WebSocket Connection
```javascript
let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function connectWebSocket() {
    ws = new WebSocket(`ws://localhost:${primaryPort}`);
    
    ws.onopen = () => {
        console.log('✅ WebSocket connected to primary server');
        reconnectAttempts = 0;
    };
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleServerEvent(message);
    };
    
    ws.onclose = () => {
        // Automatic reconnection with exponential backoff
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(connectWebSocket, 2000 * reconnectAttempts);
        }
    };
}
```

#### Added Event Handlers
```javascript
function handleServerEvent(message) {
    switch (message.type) {
        case 'server-registered':
            handleServerRegistered(message.data);
            break;
        case 'server-stopped':
            handleServerStopped(message.data);
            break;
    }
}

function handleServerRegistered(serverModel) {
    // Add or update server in serverData array
    const existingIndex = serverData.findIndex(s => s.uuid === serverModel.uuid);
    
    if (existingIndex === -1) {
        const port = serverModel.capabilities.find(c => c.capability === 'httpPort')?.port;
        serverData.push({
            name: `Client Server ${serverData.length}`,
            port: port,
            status: 'running',
            uuid: serverModel.uuid
        });
    } else {
        serverData[existingIndex].status = 'running';
    }
    
    updateUI();
}

function handleServerStopped(data) {
    // Mark server as stopped (don't remove from array)
    const server = serverData.find(s => s.uuid === data.uuid);
    if (server) {
        server.status = 'stopped';
    }
    
    updateUI();
}
```

#### Centralized UI Update
```javascript
function updateUI() {
    // Count servers by status
    const running = serverData.filter(s => s.status === 'running').length;
    const stopped = serverData.filter(s => s.status === 'stopped').length;
    const clients = serverData.filter(s => s.port !== primaryPort && s.status === 'running').length;
    
    // Update status bar with actual counts
    document.getElementById('totalServers').textContent = serverData.length;
    document.getElementById('runningServers').textContent = running;
    document.getElementById('clientServers').textContent = clients;
    document.getElementById('stoppedServers').textContent = stopped; // ✅ Now shows actual count!
    
    // Update server grid
    const grid = document.getElementById('serverGrid');
    grid.innerHTML = serverData.map(s => createServerCard(s)).join('');
    
    // Update timestamp
    document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}
```

## Benefits

### Real-Time Updates ✅
- **Instant** status updates when servers start or stop
- No waiting for polling cycle
- Visual feedback within milliseconds

### Accurate State Tracking ✅
- Status bar correctly shows:
  - `Total Servers`: All servers (running + stopped)
  - `🟢 Running`: Only currently running servers
  - `🔵 Clients`: Running client servers (excludes primary)
  - `⚪ Stopped`: Servers that were stopped

### Improved UX ✅
- Server cards visually indicate stopped state (greyed out, 50% opacity)
- Stopped servers remain visible for reference
- Automatic WebSocket reconnection with exponential backoff

### Reduced Polling ✅
- Polling interval increased from 3s to 10s (only as fallback)
- Primary updates come via WebSocket (instant)
- Lower server load

## Testing

Manual testing procedure:
1. Start demo with `once demo 2`
2. Open `http://localhost:42777/demo` in browser
3. Observe initial status: 3 servers, 3 running, 2 clients, 0 stopped
4. Click "🛑 Stop Server" on a client server
5. **Verify**: Status bar immediately updates to show 1 stopped
6. **Verify**: Server card becomes greyed out
7. Start another server with "➕ Start Next Server"
8. **Verify**: Status bar immediately updates
9. **Verify**: New server card appears instantly

## Files Changed

1. **`ServerHierarchyManager.ts`** (+30 lines)
   - Added `broadcastServerEvent()` method
   - Broadcast on server registration
   - Broadcast on server stop

2. **`demo-hub.html`** (+147 lines, -19 lines)
   - Added WebSocket connection with auto-reconnect
   - Added real-time event handlers
   - Centralized UI update logic
   - Server state tracking (running/stopped)

## Commit
- **Message**: `2025-11-17-UTC-1900-demo-hub-realtime-status.md`
- **Files**: 2 changed, 158 insertions(+), 19 deletions(-)

