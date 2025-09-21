#!/usr/bin/env node

/**
 * Simple ONCE Demo - Shows the concept without complex imports
 * Demonstrates multiple environments discovering each other
 */

const http = require('http');
const WebSocket = require('ws');

// Mock ONCE kernels in different environments
class ONECEKernel {
    constructor(name, port) {
        this.name = name;
        this.port = port;
        this.peers = new Map();
        this.scenarios = new Map();
        this.initialized = false;
    }

    async init() {
        console.log(`🚀 Initializing ONCE kernel: ${this.name} on port ${this.port}`);
        
        // Create HTTP server
        this.server = http.createServer((req, res) => {
            if (req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    kernel: this.name,
                    status: 'healthy',
                    peers: Array.from(this.peers.keys()),
                    scenarios: this.scenarios.size
                }));
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        });

        // Create WebSocket server
        this.wss = new WebSocket.Server({ server: this.server });
        
        this.wss.on('connection', (ws) => {
            const peerId = Math.random().toString(36).substr(2, 9);
            console.log(`${this.name}: New peer connected - ${peerId}`);
            
            ws.on('message', (data) => {
                const msg = JSON.parse(data);
                this.handleMessage(ws, msg, peerId);
            });

            ws.on('close', () => {
                console.log(`${this.name}: Peer disconnected - ${peerId}`);
                this.peers.delete(peerId);
            });

            // Send welcome message
            ws.send(JSON.stringify({
                type: 'welcome',
                kernel: this.name,
                message: `Connected to ${this.name} ONCE kernel`
            }));
        });

        // Start server
        await new Promise((resolve) => {
            this.server.listen(this.port, () => {
                console.log(`✅ ${this.name} listening on http://localhost:${this.port}`);
                this.initialized = true;
                resolve();
            });
        });

        // Add some sample scenarios
        this.addSampleScenarios();
    }

    handleMessage(ws, msg, peerId) {
        console.log(`${this.name}: Received ${msg.type} from ${peerId}`);

        switch (msg.type) {
            case 'discover':
                ws.send(JSON.stringify({
                    type: 'peers',
                    peers: Array.from(this.peers.entries()).map(([id, info]) => ({
                        id,
                        name: info.name
                    }))
                }));
                break;

            case 'register':
                this.peers.set(peerId, { name: msg.name, ws });
                console.log(`${this.name}: Registered peer ${msg.name}`);
                this.broadcastPeerList();
                break;

            case 'request-scenario':
                const scenario = this.scenarios.get(msg.scenarioId);
                if (scenario) {
                    ws.send(JSON.stringify({
                        type: 'scenario',
                        scenario
                    }));
                    console.log(`${this.name}: Sent scenario ${msg.scenarioId}`);
                }
                break;

            case 'share-scenario':
                this.scenarios.set(msg.scenario.id, msg.scenario);
                console.log(`${this.name}: Received shared scenario ${msg.scenario.id}`);
                this.broadcast({
                    type: 'new-scenario',
                    scenario: msg.scenario
                }, peerId);
                break;
        }
    }

    broadcast(message, excludePeer) {
        this.peers.forEach((peer, id) => {
            if (id !== excludePeer && peer.ws.readyState === WebSocket.OPEN) {
                peer.ws.send(JSON.stringify(message));
            }
        });
    }

    broadcastPeerList() {
        const peerList = Array.from(this.peers.entries()).map(([id, info]) => ({
            id,
            name: info.name
        }));
        
        this.broadcast({
            type: 'peer-update',
            peers: peerList
        });
    }

    addSampleScenarios() {
        // User scenario
        this.scenarios.set('user-1', {
            id: 'user-1',
            type: 'User',
            data: {
                name: 'Alice',
                role: 'Developer',
                email: 'alice@web4.example'
            }
        });

        // Article scenario
        this.scenarios.set('article-1', {
            id: 'article-1',
            type: 'Article',
            data: {
                title: 'Introduction to ONCE',
                content: 'ONCE enables universal object communication...',
                author: 'user-1'
            }
        });

        console.log(`${this.name}: Added ${this.scenarios.size} sample scenarios`);
    }
}

// Create and run demo
async function runDemo() {
    console.log('🌟 ONCE Multi-Environment Demo');
    console.log('==============================\n');

    // Create three ONCE kernels
    const server1 = new ONECEKernel('Node-Server-1', 8080);
    const server2 = new ONECEKernel('Node-Server-2', 8081);
    const server3 = new ONECEKernel('Node-Server-3', 8082);

    // Initialize all servers
    await server1.init();
    await server2.init();
    await server3.init();

    console.log('\n📡 All ONCE kernels initialized!\n');

    // Simulate client connections
    setTimeout(() => {
        console.log('\n🔗 Simulating peer connections...\n');

        // Connect Server2 to Server1
        const ws2to1 = new WebSocket('ws://localhost:8080');
        ws2to1.on('open', () => {
            ws2to1.send(JSON.stringify({
                type: 'register',
                name: 'Browser-Client-1'
            }));
        });

        // Connect Server3 to Server1
        const ws3to1 = new WebSocket('ws://localhost:8080');
        ws3to1.on('open', () => {
            ws3to1.send(JSON.stringify({
                type: 'register',
                name: 'Web-Worker-1'
            }));
        });

        // After connections, demonstrate discovery
        setTimeout(() => {
            console.log('\n🔍 Testing peer discovery...\n');
            
            ws2to1.send(JSON.stringify({ type: 'discover' }));
            ws2to1.on('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.type === 'peers') {
                    console.log('Browser-Client-1 discovered peers:', msg.peers);
                }
            });
        }, 1000);

        // Demonstrate scenario exchange
        setTimeout(() => {
            console.log('\n📦 Testing scenario exchange...\n');
            
            // Request scenario
            ws2to1.send(JSON.stringify({
                type: 'request-scenario',
                scenarioId: 'user-1'
            }));

            // Share new scenario
            ws3to1.send(JSON.stringify({
                type: 'share-scenario',
                scenario: {
                    id: 'task-1',
                    type: 'Task',
                    data: {
                        title: 'Review ONCE Documentation',
                        assignee: 'user-1',
                        status: 'in-progress'
                    }
                }
            }));
        }, 2000);

    }, 1000);

    // Show status periodically
    setInterval(() => {
        console.log('\n📊 System Status:');
        console.log(`- Server 1: ${server1.peers.size} peers, ${server1.scenarios.size} scenarios`);
        console.log(`- Server 2: ${server2.peers.size} peers, ${server2.scenarios.size} scenarios`);
        console.log(`- Server 3: ${server3.peers.size} peers, ${server3.scenarios.size} scenarios`);
    }, 10000);

    console.log('\n✅ Demo is running!');
    console.log('📋 Check health: http://localhost:8080/health');
    console.log('🛑 Press Ctrl+C to stop\n');
}

// Handle shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down demo...');
    process.exit(0);
});

// Check if ws module is available
try {
    require('ws');
    runDemo().catch(console.error);
} catch (e) {
    console.error('❌ Please install ws module: npm install ws');
    console.error('Run: cd /workspace/components/ONCE/0.1.0.0/examples && npm install ws');
}