/**
 * ONCE Node.js Server Example
 * Demonstrates ONCE kernel running as a server with P2P capabilities
 */

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { 
    userScenario, 
    articleScenario, 
    componentScenario,
    createCounterScenario 
} from '../shared/sample-scenarios.js';

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

// Server configuration
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

// In-memory storage
const peers = new Map();
const scenarios = new Map();

// Initialize sample scenarios
scenarios.set(userScenario.uuid, userScenario);
scenarios.set(articleScenario.uuid, articleScenario);
scenarios.set(componentScenario.uuid, componentScenario);

// Main server function
async function startServer() {
    console.log('🚀 Starting ONCE Node.js Server...');
    
    // Initialize ONCE
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
                    environment: once.getEnvironment()
                },
                peers: peers.size,
                scenarios: scenarios.size,
                serverIOR: createServerIOR()
            }));
        } else if (req.url === '/scenarios') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                scenarios: Array.from(scenarios.values())
            }));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    // Create WebSocket server for P2P communication
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws, req) => {
        const peerId = generateUUID();
        const peerInfo = {
            id: peerId,
            ws: ws,
            connectedAt: new Date(),
            remoteAddress: req.socket.remoteAddress
        };

        peers.set(peerId, peerInfo);
        console.log(`🔗 New peer connected: ${peerId} from ${peerInfo.remoteAddress}`);

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            peerId: peerId,
            serverIOR: createServerIOR(),
            message: 'Connected to ONCE server'
        }));

        // Handle incoming messages
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log(`📨 Received ${message.type} from ${peerId}`);

                switch (message.type) {
                    case 'discover-peers':
                        ws.send(JSON.stringify({
                            type: 'peers',
                            peers: Array.from(peers.entries()).map(([id, info]) => ({
                                id: id,
                                connectedAt: info.connectedAt
                            })).filter(p => p.id !== peerId)
                        }));
                        break;

                    case 'request-scenario':
                        const scenario = scenarios.get(message.scenarioId);
                        if (scenario) {
                            ws.send(JSON.stringify({
                                type: 'scenario',
                                scenario: scenario
                            }));
                            console.log(`📤 Sent scenario ${message.scenarioId} to ${peerId}`);
                        } else {
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: `Scenario ${message.scenarioId} not found`
                            }));
                        }
                        break;

                    case 'share-scenario':
                        const newScenario = message.scenario;
                        scenarios.set(newScenario.uuid || generateUUID(), newScenario);
                        console.log(`📥 Received new scenario: ${newScenario.objectType}`);
                        
                        // Broadcast to all other peers
                        broadcastToPeers({
                            type: 'new-scenario',
                            scenario: newScenario,
                            fromPeer: peerId
                        }, peerId);
                        break;

                    case 'peer-message':
                        // Forward message to specific peer
                        const targetPeer = peers.get(message.targetPeerId);
                        if (targetPeer && targetPeer.ws.readyState === 1) {
                            targetPeer.ws.send(JSON.stringify({
                                type: 'peer-message',
                                fromPeerId: peerId,
                                payload: message.payload
                            }));
                        }
                        break;

                    default:
                        console.log(`❓ Unknown message type: ${message.type}`);
                }
            } catch (error) {
                console.error(`❌ Error handling message from ${peerId}:`, error);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: error.message
                }));
            }
        });

        // Handle disconnection
        ws.on('close', () => {
            peers.delete(peerId);
            console.log(`👋 Peer disconnected: ${peerId}`);
            
            // Notify other peers
            broadcastToPeers({
                type: 'peer-disconnected',
                peerId: peerId
            }, peerId);
        });
    });

    // Start the server
    httpServer.listen(PORT, HOST, () => {
        console.log(`🌐 ONCE server listening on http://${HOST}:${PORT}`);
        console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
        console.log(`📦 Scenarios list: http://${HOST}:${PORT}/scenarios`);
    });

    // Start sample components
    await startSampleComponents(once);

    // Status monitoring
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
        
    } catch (error) {
        console.error('❌ Failed to start sample components:', error);
    }
}

// Create server IOR
function createServerIOR() {
    return `web4://${HOST}:${PORT}/once-server/${generateUUID()}`;
}

// Broadcast message to all connected peers except sender
function broadcastToPeers(message, excludePeerId) {
    peers.forEach((peerInfo, peerId) => {
        if (peerId !== excludePeerId && peerInfo.ws.readyState === 1) {
            peerInfo.ws.send(JSON.stringify(message));
        }
    });
}

// Generate UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down ONCE server...');
    peers.forEach((peerInfo) => {
        if (peerInfo.ws.readyState === 1) {
            peerInfo.ws.close();
        }
    });
    process.exit(0);
});

// Start the server
startServer().catch(console.error);