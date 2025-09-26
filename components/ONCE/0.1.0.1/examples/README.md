# ONCE Examples

This directory contains examples demonstrating ONCE (Object Network Communication Engine) running in different environments, showcasing peer discovery and scenario exchange capabilities.

## Overview

These examples implement the early Web4Articles v1.0 vision where:
- Multiple ONCE kernels can run in different environments
- Kernels discover each other automatically
- Scenarios (object states) can be exchanged between kernels
- All communication follows Web4 patterns (empty constructors, scenario-based init)

## Examples

### 1. Node.js Server (`node-server/`)
A ONCE kernel running as a Node.js server that:
- Provides WebSocket endpoint for client connections
- Maintains a registry of connected peers
- Serves sample scenarios (user, article, task, counter)
- Facilitates peer discovery and scenario exchange

**Run it:**
```bash
cd node-server
npm install
npm start
```

### 2. Browser Client (`browser-client/`)
A web-based ONCE client that:
- Connects to ONCE server via WebSocket
- Requests and displays scenarios
- Creates and shares new scenarios
- Discovers other connected peers
- Shows real-time metrics

**Run it:**
Open `browser-client/index.html` in a web browser

### 3. Web Worker (`web-worker/`)
A ONCE kernel running in a Web Worker that:
- Processes scenarios in parallel
- Performs heavy computations without blocking UI
- Validates and transforms scenarios
- Demonstrates worker-specific capabilities

**Run it:**
Open `web-worker/index.html` in a web browser

### 4. Multi-Environment Demo (`multi-env-demo/`)
A complete demonstration showing all environments working together:
- Automated setup script
- Multiple clients and servers
- Peer-to-peer scenario exchange
- Cross-environment communication

**Run it:**
```bash
cd multi-env-demo
./launch-demo.sh
```

## Scenario Structure

All examples use the Web4 scenario structure defined in Sprint 22:

```javascript
{
  uuid: "unique-identifier",
  objectType: "User|Article|Task|etc",
  version: "0.1.0.0",
  state: {
    IOR: "type:uuid",      // Internet Object Reference
    owner: "owner-id",     // Owner identifier  
    model: {               // Actual data
      // Object-specific fields
    }
  },
  references: [],          // References to other scenarios
  metadata: {              // Scenario metadata
    created: "ISO-date",
    modified: "ISO-date",
    description: "..."
  }
}
```

## Communication Flow

```
1. Server starts and listens on WebSocket
2. Clients connect and register with capabilities
3. Clients can:
   - Request scenarios by type
   - Share new scenarios with all peers
   - Discover other connected clients
   - Exchange scenarios directly (P2P)
4. Workers can:
   - Process scenarios in parallel
   - Return enhanced scenarios
   - Perform heavy computations
```

## Key Features Demonstrated

### Environment Detection
Each ONCE kernel automatically detects its environment:
- **Node.js**: Server capabilities, file system access
- **Browser**: DOM access, localStorage, WebRTC
- **Worker**: Parallel processing, no DOM

### Scenario Exchange Patterns
1. **Request/Response**: Client requests specific scenario from server
2. **Broadcast**: Client shares scenario with all connected peers
3. **P2P Transfer**: Direct scenario exchange between clients
4. **Processing Pipeline**: Client → Worker → Server flow

### Web4 Architecture Compliance
- ✅ Empty constructors throughout
- ✅ Scenario-based initialization
- ✅ IOR (Internet Object Reference) system
- ✅ Platform-agnostic code
- ✅ Event-driven lifecycle

## Extending the Examples

### Add a New Environment

1. Create new directory: `examples/new-environment/`
2. Implement ONCE initialization for that environment
3. Add scenario exchange capabilities
4. Update multi-env-demo to include it

### Add New Scenario Types

1. Define in `shared/sample-scenarios.ts`
2. Add handlers in server
3. Update UI in clients
4. Add processing logic in worker

### Implement Service Worker

```javascript
// service-worker/sw.ts
import { ONCE } from '../../src/index.js';

self.addEventListener('install', async (event) => {
  const once = await ONCE.init();
  // Cache scenarios for offline use
});
```

## Testing Scenarios

### Basic Test
1. Start server
2. Open one browser client
3. Request a user scenario
4. Verify scenario displayed correctly

### P2P Test
1. Start server
2. Open two browser clients
3. Create scenario in Client 1
4. Verify Client 2 receives it via broadcast

### Worker Test
1. Open worker example
2. Initialize worker
3. Process batch of scenarios
4. Verify processing metrics

### Full Demo Test
1. Run `launch-demo.sh`
2. Follow on-screen instructions
3. Test all interaction patterns

## Troubleshooting

**Connection Issues**
- Ensure server is running on correct port
- Check firewall settings
- Verify WebSocket URL in client

**Module Loading Errors**
- Build ONCE component first: `cd ../.. && npm run build`
- Check TypeScript compilation
- Verify import paths

**Worker Errors**
- Check browser console for details
- Ensure browser supports module workers
- Verify worker file path

## Next Steps

These examples provide the foundation for:
- Distributed article collaboration
- P2P requirement sharing
- Decentralized testing
- Multi-node ONCE networks

The vision: Any ONCE kernel can participate in the Web4 network, regardless of where it runs!