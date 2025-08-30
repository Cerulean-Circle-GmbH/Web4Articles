/**
 * Server Hierarchy Manager v0.2.0.0 - Implements server hierarchy with name server model
 * Implements requirement 9beee86b-09c2-43c8-b449-b9a7b8f2b338
 */

import { createServer, Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { PortManager } from './PortManager.js';
import { ONCEServerModel, ONCE_DEFAULT_CONFIG, createDefaultServerModel } from '../layer3/ONCEServerModel.js';
import { LifecycleState } from '../layer3/LifecycleEvents.js';
import { IOR, iorToUrl } from '../layer3/IOR.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Server registry entry for primary server
 */
export interface ServerRegistryEntry {
    model: ONCEServerModel;
    lastSeen: string;
    websocket?: WebSocket;
}

/**
 * Server Hierarchy Manager - manages ONCE v0.2.0.0 server hierarchy
 * Handles primary server (42777) and client server registration
 */
export class ServerHierarchyManager {
    private serverModel: ONCEServerModel;
    private httpServer?: Server;
    private wsServer?: WebSocketServer;
    private portManager: PortManager;
    private serverRegistry: Map<string, ServerRegistryEntry> = new Map();
    private primaryServerConnection?: WebSocket;

    constructor() {
        this.portManager = PortManager.getInstance();
        
        // Initialize server model with defaults
        const defaultModel = createDefaultServerModel();
        this.serverModel = {
            ...defaultModel,
            uuid: uuidv4(),
            pid: process.pid,
            state: LifecycleState.CREATED,
            platform: this.detectEnvironment(),
            domain: ONCE_DEFAULT_CONFIG.DEFAULT_DOMAIN,
            host: this.detectHostname(),
            ip: ONCE_DEFAULT_CONFIG.DEFAULT_IP,
            capabilities: [],
            isPrimaryServer: false
        } as ONCEServerModel;
    }

    /**
     * Start server with automatic port management and hierarchy
     */
    async startServer(): Promise<void> {
        this.serverModel.state = LifecycleState.STARTING;

        try {
            // Get next available port (42777 or 8080+)
            const portResult = await this.portManager.getNextAvailablePort();
            
            this.serverModel.isPrimaryServer = portResult.isPrimary;
            
            // Add HTTP capability
            this.serverModel.capabilities.push({
                capability: 'httpPort',
                port: portResult.port
            });

            // Start HTTP server
            await this.startHttpServer(portResult.port);
            
            // Start WebSocket server
            await this.startWebSocketServer();
            
            if (this.serverModel.isPrimaryServer) {
                console.log(`🟢 Started as PRIMARY SERVER on port ${portResult.port}`);
                console.log(`📋 Server UUID: ${this.serverModel.uuid}`);
                console.log(`🏠 Domain: ${this.serverModel.domain}`);
                this.serverModel.state = LifecycleState.PRIMARY_SERVER;
            } else {
                console.log(`🔵 Started as CLIENT SERVER on port ${portResult.port}`);
                console.log(`📋 Server UUID: ${this.serverModel.uuid}`);
                
                // Register with primary server
                await this.registerWithPrimaryServer();
                this.serverModel.state = LifecycleState.CLIENT_SERVER;
            }

            this.serverModel.state = LifecycleState.RUNNING;
            
            // Auto-generate and save scenario
            await this.saveScenario();
            
        } catch (error) {
            this.serverModel.state = LifecycleState.ERROR;
            console.error('❌ Failed to start server:', error);
            throw error;
        }
    }

    /**
     * Start HTTP server
     */
    private async startHttpServer(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.httpServer = createServer((req, res) => {
                this.handleHttpRequest(req, res);
            });

            this.httpServer.listen(port, () => {
                console.log(`🌐 HTTP server listening on port ${port}`);
                resolve();
            });

            this.httpServer.on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Start WebSocket server
     */
    private async startWebSocketServer(): Promise<void> {
        if (!this.httpServer) {
            throw new Error('HTTP server must be started first');
        }

        this.wsServer = new WebSocketServer({ server: this.httpServer });
        
        // Add WebSocket capability
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        if (httpCapability) {
            this.serverModel.capabilities.push({
                capability: 'wsPort',
                port: httpCapability.port
            });
        }

        this.wsServer.on('connection', (ws, request) => {
            this.handleWebSocketConnection(ws, request);
        });

        console.log(`📡 WebSocket server started`);
    }

    /**
     * Handle HTTP requests
     */
    private handleHttpRequest(req: any, res: any): void {
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        if (url.pathname === '/' || url.pathname === '/health') {
            // Root path and health endpoint - server health status
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'running',
                uuid: this.serverModel.uuid,
                isPrimaryServer: this.serverModel.isPrimaryServer,
                state: this.serverModel.state,
                capabilities: this.serverModel.capabilities,
                domain: this.serverModel.domain,
                version: '0.2.0.0',
                message: 'ONCE v0.2.0.0 Server - Enhanced Hierarchy'
            }));
        } else if (url.pathname === '/once' || url.pathname === '/once/') {
            // Browser client endpoint - serve HTML interface
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getBrowserClientHTML());
        } else if (url.pathname === '/servers' && this.serverModel.isPrimaryServer) {
            // Only primary server can list all servers
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                servers: Array.from(this.serverRegistry.values()).map(entry => entry.model)
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }

    /**
     * Get browser client HTML
     */
    private getBrowserClientHTML(): string {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        const wsCapability = this.serverModel.capabilities.find(c => c.capability === 'wsPort');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONCE Browser Client v0.2.0.0</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            background: linear-gradient(45deg, #fff, #a8edea);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .status {
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .status h3 {
            margin-top: 0;
            color: #4ade80;
        }
        .connection-box {
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        #connectionStatus {
            font-weight: bold;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .connected {
            background-color: #10b981;
        }
        .disconnected {
            background-color: #ef4444;
        }
        button {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        #messages {
            background: rgba(0,0,0,0.4);
            border-radius: 10px;
            padding: 15px;
            height: 200px;
            overflow-y: auto;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
        }
        .emoji {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">🚀</span> ONCE Browser Client</h1>
            <p>Enhanced v0.2.0.0 with Server Hierarchy</p>
        </div>
        
        <div class="status">
            <h3><span class="emoji">📊</span> Server Status</h3>
            <p><strong>UUID:</strong> ${this.serverModel.uuid}</p>
            <p><strong>Domain:</strong> ${this.serverModel.domain}</p>
            <p><strong>Type:</strong> ${this.serverModel.isPrimaryServer ? '🟢 Primary Server (42777)' : '🔵 Client Server'}</p>
            <p><strong>HTTP Port:</strong> ${httpCapability?.port || 'Unknown'}</p>
            <p><strong>WebSocket Port:</strong> ${wsCapability?.port || 'Unknown'}</p>
            <p><strong>State:</strong> ${this.serverModel.state}</p>
        </div>

        <div class="connection-box">
            <h3><span class="emoji">🔗</span> Connection</h3>
            <div id="connectionStatus" class="disconnected">Disconnected</div>
            <button onclick="connect()">Connect to WebSocket</button>
            <button onclick="disconnect()">Disconnect</button>
            <button onclick="sendPing()">Send Ping</button>
        </div>

        <div class="connection-box">
            <h3><span class="emoji">📡</span> Messages</h3>
            <div id="messages"></div>
            <button onclick="clearMessages()">Clear Messages</button>
        </div>
    </div>

    <script>
        let ws = null;
        const messages = document.getElementById('messages');
        const status = document.getElementById('connectionStatus');

        function addMessage(message) {
            const time = new Date().toLocaleTimeString();
            messages.innerHTML += \`<div>[\${time}] \${message}</div>\`;
            messages.scrollTop = messages.scrollHeight;
        }

        function connect() {
            const wsUrl = \`ws://\${window.location.host}\`;
            ws = new WebSocket(wsUrl);
            
            ws.onopen = function() {
                status.textContent = 'Connected';
                status.className = 'connected';
                addMessage('✅ Connected to ONCE WebSocket server');
            };
            
            ws.onmessage = function(event) {
                addMessage(\`📨 Received: \${event.data}\`);
            };
            
            ws.onclose = function() {
                status.textContent = 'Disconnected';
                status.className = 'disconnected';
                addMessage('❌ WebSocket connection closed');
            };
            
            ws.onerror = function(error) {
                addMessage(\`❌ WebSocket error: \${error}\`);
            };
        }

        function disconnect() {
            if (ws) {
                ws.close();
                ws = null;
            }
        }

        function sendPing() {
            if (ws && ws.readyState === WebSocket.OPEN) {
                const pingMessage = {
                    type: 'ping',
                    timestamp: Date.now(),
                    client: 'browser'
                };
                ws.send(JSON.stringify(pingMessage));
                addMessage(\`🏓 Sent ping: \${JSON.stringify(pingMessage)}\`);
            } else {
                addMessage('❌ Not connected - cannot send ping');
            }
        }

        function clearMessages() {
            messages.innerHTML = '';
        }

        // Auto-connect on load
        addMessage('🚀 ONCE Browser Client v0.2.0.0 initialized');
        addMessage('🌐 Click "Connect to WebSocket" to establish connection');
    </script>
</body>
</html>`;
    }

    /**
     * Handle WebSocket connections
     */
    private handleWebSocketConnection(ws: WebSocket, request: any): void {
        console.log('📡 WebSocket connection established');

        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                await this.handleWebSocketMessage(ws, message);
            } catch (error) {
                console.error('❌ WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            console.log('📡 WebSocket connection closed');
        });
    }

    /**
     * Handle WebSocket messages (server registration, discovery, etc.)
     */
    private async handleWebSocketMessage(ws: WebSocket, message: any): Promise<void> {
        switch (message.type) {
            case 'server-registration':
                if (this.serverModel.isPrimaryServer) {
                    await this.handleServerRegistration(ws, message.serverModel);
                }
                break;
            case 'server-discovery':
                if (this.serverModel.isPrimaryServer) {
                    await this.handleServerDiscovery(ws, message.query);
                }
                break;
            default:
                console.log('🔄 Unknown WebSocket message type:', message.type);
        }
    }

    /**
     * Handle server registration (primary server only)
     */
    private async handleServerRegistration(ws: WebSocket, clientServerModel: ONCEServerModel): Promise<void> {
        console.log(`📋 Registering client server: ${clientServerModel.uuid}`);
        
        this.serverRegistry.set(clientServerModel.uuid, {
            model: clientServerModel,
            lastSeen: new Date().toISOString(),
            websocket: ws
        });

        // Send registration confirmation
        ws.send(JSON.stringify({
            type: 'registration-confirmed',
            primaryServerModel: this.serverModel
        }));
    }

    /**
     * Handle server discovery requests (primary server only)
     */
    private async handleServerDiscovery(ws: WebSocket, query: any): Promise<void> {
        const servers = Array.from(this.serverRegistry.values()).map(entry => entry.model);
        
        ws.send(JSON.stringify({
            type: 'discovery-response',
            servers: servers
        }));
    }

    /**
     * Register with primary server (client servers only)
     */
    private async registerWithPrimaryServer(): Promise<void> {
        if (this.serverModel.isPrimaryServer) {
            return; // Primary server doesn't register with itself
        }

        try {
            const primaryPort = this.portManager.getPrimaryPort();
            const wsUrl = `ws://localhost:${primaryPort}`;
            
            this.primaryServerConnection = new WebSocket(wsUrl);
            
            return new Promise((resolve, reject) => {
                if (!this.primaryServerConnection) {
                    reject(new Error('Failed to create primary server connection'));
                    return;
                }

                this.primaryServerConnection.on('open', () => {
                    console.log(`🔗 Connected to primary server at port ${primaryPort}`);
                    
                    // Send registration message
                    this.primaryServerConnection!.send(JSON.stringify({
                        type: 'server-registration',
                        serverModel: this.serverModel
                    }));
                });

                this.primaryServerConnection.on('message', (data) => {
                    try {
                        const message = JSON.parse(data.toString());
                        if (message.type === 'registration-confirmed') {
                            console.log('✅ Registration confirmed with primary server');
                            this.serverModel.primaryServerIOR = this.createPrimaryServerIOR(message.primaryServerModel);
                            this.serverModel.state = LifecycleState.REGISTERED;
                            resolve();
                        }
                    } catch (error) {
                        console.error('❌ Primary server message error:', error);
                    }
                });

                this.primaryServerConnection.on('error', (error) => {
                    console.error('❌ Primary server connection error:', error);
                    reject(error);
                });
            });
            
        } catch (error) {
            console.error('❌ Failed to register with primary server:', error);
            throw error;
        }
    }

    /**
     * Create IOR for primary server
     */
    private createPrimaryServerIOR(primaryServerModel: ONCEServerModel): string {
        const httpCapability = primaryServerModel.capabilities.find(c => c.capability === 'httpPort');
        if (!httpCapability) {
            throw new Error('Primary server has no HTTP capability');
        }

        const ior: IOR = {
            protocol: 'web4',
            host: primaryServerModel.host,
            port: httpCapability.port,
            path: '/once',
            uuid: primaryServerModel.uuid,
            objectType: 'ONCE',
            version: '0.2.0.0'
        };

        return iorToUrl(ior);
    }

    /**
     * Save server scenario to organized directory structure
     */
    private async saveScenario(): Promise<void> {
        // Implement scenario saving according to requirement 9b768111-7a06-4266-9d71-0ef72e90c62b
        // /scenarios/reverseDomain/component/version/uuid.scenario.json
        
        const scenarioPath = `scenarios/${this.serverModel.domain}/ONCE/0.2.0.0/${this.serverModel.uuid}.scenario.json`;
        
        const scenario = {
            uuid: this.serverModel.uuid,
            objectType: 'ONCE',
            version: '0.2.0.0',
            state: this.serverModel,
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                creator: 'ONCE-v0.2.0.0',
                description: 'Auto-generated ONCE server scenario',
                domain: this.serverModel.domain,
                host: this.serverModel.host,
                port: this.serverModel.capabilities.find(c => c.capability === 'httpPort')?.port,
                isPrimaryServer: this.serverModel.isPrimaryServer
            }
        };

        console.log(`💾 Scenario would be saved to: ${scenarioPath}`);
        // TODO: Implement actual file saving
    }

    /**
     * Detect current environment
     */
    private detectEnvironment(): any {
        return {
            platform: 'node',
            version: process.version,
            capabilities: ['server', 'websocket', 'p2p'],
            isOnline: true,
            hostname: this.detectHostname(),
            ip: ONCE_DEFAULT_CONFIG.DEFAULT_IP
        };
    }

    /**
     * Detect hostname
     */
    private detectHostname(): string {
        try {
            const os = require('os');
            return os.hostname();
        } catch {
            return 'localhost';
        }
    }

    /**
     * Get current server model
     */
    getServerModel(): ONCEServerModel {
        return { ...this.serverModel };
    }

    /**
     * Check if this is the primary server
     */
    isPrimaryServer(): boolean {
        return this.serverModel.isPrimaryServer;
    }

    /**
     * Get registered servers (primary server only)
     */
    getRegisteredServers(): ONCEServerModel[] {
        if (!this.serverModel.isPrimaryServer) {
            return [];
        }
        return Array.from(this.serverRegistry.values()).map(entry => entry.model);
    }

    /**
     * Stop server gracefully
     */
    async stopServer(): Promise<void> {
        this.serverModel.state = LifecycleState.STOPPING;

        if (this.primaryServerConnection) {
            this.primaryServerConnection.close();
        }

        if (this.wsServer) {
            this.wsServer.close();
        }

        if (this.httpServer) {
            return new Promise((resolve) => {
                this.httpServer!.close(() => {
                    console.log('🛑 Server stopped');
                    this.serverModel.state = LifecycleState.STOPPED;
                    resolve();
                });
            });
        }
    }
}
