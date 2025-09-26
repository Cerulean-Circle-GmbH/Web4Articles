/**
 * ONCE Node.js Server Example
 * Demonstrates ONCE kernel running as a server with P2P capabilities
 */
// Note: In a real implementation, these would be imported from the built ONCE package
// For demo purposes, we'll create a simplified ONCE mock
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
// Mock ONCE implementation for demo
const ONCE = {
    init: async () => ({
        getEnvironment: () => ({
            platform: 'node',
            version: process.version,
            capabilities: ['server', 'websocket', 'p2p']
        }),
        on: (event, handler) => {
            console.log(`Event listener registered: ${event}`);
        },
        getVersion: () => '0.1.0.0',
        isInitialized: () => true,
        getMetrics: () => ({
            componentsLoaded: 0,
            memoryUsage: process.memoryUsage().heapUsed
        }),
        discoverComponents: async () => []
    })
};
// Import sample scenarios
import { userScenario, articleScenario, componentScenario, createCounterScenario } from '../shared/sample-scenarios.js';
// Server configuration
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
async function startServer() {
    console.log('🚀 Starting ONCE Node.js Server...');
    // Initialize ONCE kernel
    const once = await ONCE.init();
    // Get environment info
    const env = once.getEnvironment();
    console.log(`✅ ONCE initialized on ${env.platform} v${env.version}`);
    console.log(`📡 Capabilities: ${env.capabilities.join(', ')}`);
    // Register event handlers
    once.on('after-init', async (event) => {
        console.log(`📦 Component initialized`);
    });
    once.on('after-start', async (event) => {
        console.log(`✨ Component started`);
    });
    // Create HTTP server for WebSocket signaling
    const httpServer = createServer((req, res) => {
        // Simple HTTP endpoint for health check
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'healthy',
                once: {
                    version: once.getVersion(),
                    initialized: once.isInitialized(),
                    metrics: once.getMetrics()
                }
            }));
        }
        else if (req.url === '/discover') {
            // Discovery endpoint
            once.discoverComponents().then(components => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    components: components.map(ior => ior.toURL())
                }));
            });
        }
        else {
            res.writeHead(404);
            res.end('Not found');
        }
    });
    // Create WebSocket server for P2P signaling
    const wss = new WebSocketServer({ server: httpServer });
    // Store connected peers
    const peers = new Map();
    wss.on('connection', (ws, req) => {
        const peerId = generateUUID();
        console.log(`🔗 New peer connected: ${peerId}`);
        peers.set(peerId, { ws, info: {} });
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                switch (message.type) {
                    case 'register':
                        // Peer registration
                        peers.get(peerId).info = message.peerInfo;
                        console.log(`📝 Peer registered: ${message.peerInfo.name}`);
                        // Send back server info
                        ws.send(JSON.stringify({
                            type: 'server-info',
                            serverIOR: createServerIOR(),
                            availableScenarios: [
                                'user', 'article', 'component', 'counter'
                            ]
                        }));
                        break;
                    case 'request-scenario':
                        // Handle scenario requests
                        console.log(`📥 Scenario requested: ${message.scenarioType}`);
                        const scenario = getScenarioByType(message.scenarioType);
                        ws.send(JSON.stringify({
                            type: 'scenario-response',
                            scenario: scenario,
                            requestId: message.requestId
                        }));
                        break;
                    case 'share-scenario':
                        // Receive shared scenario
                        console.log(`📤 Scenario shared: ${message.scenario.objectType}`);
                        // Broadcast to other peers
                        broadcastToPeers(peerId, {
                            type: 'scenario-broadcast',
                            scenario: message.scenario,
                            fromPeer: peerId
                        });
                        break;
                    case 'discover-peers':
                        // Send list of connected peers
                        const peerList = Array.from(peers.entries())
                            .filter(([id]) => id !== peerId)
                            .map(([id, peer]) => ({ id, info: peer.info }));
                        ws.send(JSON.stringify({
                            type: 'peer-list',
                            peers: peerList
                        }));
                        break;
                }
            }
            catch (error) {
                console.error('❌ Message processing error:', error);
            }
        });
        ws.on('close', () => {
            console.log(`🔌 Peer disconnected: ${peerId}`);
            peers.delete(peerId);
        });
    });
    // Helper function to broadcast to all peers except sender
    function broadcastToPeers(senderId, message) {
        peers.forEach((peer, id) => {
            if (id !== senderId && peer.ws.readyState === 1) {
                peer.ws.send(JSON.stringify(message));
            }
        });
    }
    // Start sample components
    await startSampleComponents(once);
    // Start HTTP server
    httpServer.listen(PORT, () => {
        console.log(`🌐 ONCE Server listening on http://${HOST}:${PORT}`);
        console.log(`🔍 Health check: http://${HOST}:${PORT}/health`);
        console.log(`🔍 Discovery: http://${HOST}:${PORT}/discover`);
        console.log(`🔌 WebSocket: ws://${HOST}:${PORT}`);
    });
    // Periodic status update
    setInterval(() => {
        const metrics = once.getMetrics();
        console.log(`📊 Status - Peers: ${peers.size}, Components: ${metrics.componentsLoaded}, Memory: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }, 30000);
}
// Start sample components
async function startSampleComponents(once) {
    try {
        // Mock component registration for demo
        console.log(`📦 Registered component: web4://${HOST}:${PORT}/component/example`);
    }
    catch (error) {
        console.error('❌ Failed to start sample components:', error);
    }
}
// Create server IOR
function createServerIOR() {
    return `web4://${HOST}:${PORT}/once-server/${generateUUID()}`;
}
// Get scenario by type
function getScenarioByType(type) {
    switch (type) {
        case 'user':
            return userScenario;
        case 'article':
            return articleScenario;
        case 'component':
            return componentScenario;
        case 'counter':
            return createCounterScenario(Math.floor(Math.random() * 100));
        default:
            return null;
    }
}
// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// Start the server
startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
