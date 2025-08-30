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
            
            // Try to load existing scenario first, then save if needed
            await this.loadOrCreateScenario();
            
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
        
        if (url.pathname === '/') {
            // Root path - serve comprehensive server status page (like v0.1.0.2 view/html/index.html)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getServerStatusHTML());
        } else if (url.pathname === '/health') {
            // Health endpoint - JSON status
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
            // Simple browser client endpoint - just ONCE import and heading
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getSimpleONCEClientHTML());
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
     * Get comprehensive server status HTML (for root path /)
     */
    private getServerStatusHTML(): string {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        const wsCapability = this.serverModel.capabilities.find(c => c.capability === 'wsPort');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONCE Server v0.2.0.0 - Object Network Communication Engine</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #0e7490 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
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
            font-size: 3em;
            background: linear-gradient(45deg, #fff, #67e8f9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .cerulean-logo {
            margin-bottom: 20px;
            filter: drop-shadow(0 4px 8px rgba(8,145,178,0.3));
        }
        .cerulean-branding {
            color: #67e8f9;
            font-style: italic;
            margin: 10px 0;
        }
        .header h2 {
            margin: 10px 0;
            color: rgba(255,255,255,0.8);
            font-weight: 300;
        }
        .status {
            background: rgba(0,255,0,0.2);
            border: 2px solid rgba(0,255,0,0.4);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        .status h3 {
            margin-top: 0;
            color: #4ade80;
            font-size: 1.5em;
        }
        .server-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        .info-card {
            background: rgba(255,255,255,0.15);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .info-card h3 {
            margin-top: 0;
            color: #a8edea;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .endpoints {
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
        }
        .endpoints h3 {
            margin-top: 0;
            color: #fbbf24;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .endpoint {
            margin: 15px 0;
            padding: 15px;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            border-left: 4px solid #10b981;
        }
        .endpoint strong {
            color: #10b981;
        }
        .endpoint code {
            background: rgba(0,0,0,0.4);
            padding: 5px 10px;
            border-radius: 5px;
            font-family: 'Monaco', 'Menlo', monospace;
            color: #a8edea;
        }
        .endpoint a {
            color: #a8edea;
            text-decoration: none;
        }
        .endpoint a:hover {
            color: #fff;
            text-decoration: underline;
        }
        .hierarchy-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
            margin-left: 10px;
        }
        .primary-badge {
            background: linear-gradient(45deg, #10b981, #34d399);
            color: white;
        }
        .client-badge {
            background: linear-gradient(45deg, #3b82f6, #60a5fa);
            color: white;
        }
        .emoji {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg width="60" height="60" viewBox="0 0 100 100" class="cerulean-logo">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0891b2" stroke-width="3"/>
                <circle cx="50" cy="50" r="30" fill="#06b6d4" opacity="0.3"/>
                <circle cx="50" cy="50" r="15" fill="#0891b2"/>
                <text x="50" y="55" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="white">C</text>
            </svg>
            <h1><span class="emoji">🚀</span> ONCE Server</h1>
            <h2>Object Network Communication Engine</h2>
            <p>Enhanced v0.2.0.0 with Server Hierarchy & Dynamic Port Management</p>
            <p class="cerulean-branding">Powered by <strong>Cerulean Circle GmbH</strong></p>
            <span class="hierarchy-badge ${this.serverModel.isPrimaryServer ? 'primary-badge' : 'client-badge'}">
                ${this.serverModel.isPrimaryServer ? '🟢 Primary Server' : '🔵 Client Server'}
            </span>
        </div>
        
        <div class="status">
            <h3><span class="emoji">✅</span> Server Status: Running</h3>
            <p>ONCE kernel v0.2.0.0 initialized and ready for enhanced P2P communication</p>
        </div>

        <div class="server-info">
            <div class="info-card">
                <h3><span class="emoji">🆔</span> Identity</h3>
                <p><strong>UUID:</strong><br><code>${this.serverModel.uuid}</code></p>
                <p><strong>Domain:</strong> ${this.serverModel.domain}</p>
                <p><strong>State:</strong> ${this.serverModel.state}</p>
            </div>
            
            <div class="info-card">
                <h3><span class="emoji">🌐</span> Network</h3>
                <p><strong>HTTP Port:</strong> ${httpCapability?.port || 'Unknown'}</p>
                <p><strong>WebSocket Port:</strong> ${wsCapability?.port || 'Unknown'}</p>
                <p><strong>Server Type:</strong> ${this.serverModel.isPrimaryServer ? 'Primary (42777)' : 'Client (8080+)'}</p>
            </div>
            
            <div class="info-card">
                <h3><span class="emoji">⚡</span> Capabilities</h3>
                ${this.serverModel.capabilities.map(cap => 
                    `<p><strong>${cap.capability}:</strong> ${cap.port || 'Active'}</p>`
                ).join('')}
            </div>
        </div>

        <div class="endpoints">
            <h3><span class="emoji">📡</span> Available Endpoints</h3>
            
            <div class="endpoint">
                <strong>Health Check:</strong> 
                <code><a href="/health">/health</a></code>
                <p>JSON server health and status information</p>
            </div>
            
            <div class="endpoint">
                <strong>Server Registry:</strong> 
                <code><a href="/servers">/servers</a></code>
                <p>${this.serverModel.isPrimaryServer ? 'List all registered servers in hierarchy' : 'Only available on primary server'}</p>
            </div>
            
            <div class="endpoint">
                <strong>Browser Client:</strong> 
                <code><a href="/once">/once</a></code>
                <p>Simple ONCE browser client interface</p>
            </div>
        </div>

        <div class="endpoints">
            <h3><span class="emoji">🔌</span> WebSocket Connection</h3>
            <p>WebSocket endpoint available at: <code>ws://localhost:${httpCapability?.port || '42777'}/</code></p>
            <p>Use this endpoint for real-time P2P communication with ONCE v0.2.0.0 kernel</p>
            <p><strong>New in v0.2.0.0:</strong> Enhanced server hierarchy, dynamic port management, scenario-based configuration</p>
        </div>
    </div>

    <script>
        console.log('🚀 ONCE Server v0.2.0.0 Interface Loaded');
        console.log('Server UUID:', '${this.serverModel.uuid}');
        console.log('Server Type:', '${this.serverModel.isPrimaryServer ? 'Primary' : 'Client'}');
        console.log('HTTP Port:', '${httpCapability?.port}');
    </script>
</body>
</html>`;
    }

    /**
     * Get simple ONCE client HTML (for /once endpoint)
     */
    private getSimpleONCEClientHTML(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ONCE v0.2.0.0 Browser Client</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            margin: 0;
            padding: 20px 0 0 0;
            background: #f8f9fa;
        }
        .top-text {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin: 0;
            line-height: 1;
        }
    </style>
</head>
<body>
    <div class="top-text">ONCE 0.2.0.0 up and running</div>
    <script type="module">
        import { ONCE } from './dist/js/layer3/ONCE.js';
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
     * Load existing scenario or create new one with organized directory structure
     */
    private async loadOrCreateScenario(): Promise<void> {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        if (!httpCapability) return;

        // Use organized folder structure: scenarios/local.once/ONCE/0.2.0.0/capability/httpPort/{port}/uuid.scenario.json
        const scenarioDir = `scenarios/local.once/ONCE/0.2.0.0/capability/httpPort/${httpCapability.port}`;
        const scenarioPath = `${scenarioDir}/${this.serverModel.uuid}.scenario.json`;
        
        try {
            // Try to load existing scenario first
            const fs = await import('fs');
            const path = await import('path');
            
            if (fs.existsSync(scenarioPath)) {
                console.log(`📂 Loading existing scenario: ${scenarioPath}`);
                const scenarioData = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
                
                // Restore configuration from scenario
                if (scenarioData.state) {
                    console.log(`✅ Scenario restored from ${scenarioPath}`);
                    return;
                }
            }
        } catch (error) {
            console.log(`⚠️ Could not load existing scenario: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Create new scenario if none exists or loading failed
        await this.saveScenario(scenarioDir, scenarioPath);
    }

    /**
     * Save server scenario to organized directory structure
     */
    private async saveScenario(scenarioDir: string, scenarioPath: string): Promise<void> {
        try {
            const fs = await import('fs');
            const path = await import('path');
            
            // Ensure directory exists
            fs.mkdirSync(scenarioDir, { recursive: true });
            
            const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
            
            const scenario = {
                uuid: this.serverModel.uuid,
                objectType: 'ONCE',
                version: '0.2.0.0',
                state: {
                    ...this.serverModel,
                    created: new Date().toISOString()
                },
                metadata: {
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    creator: 'ONCE-v0.2.0.0',
                    description: `ONCE server scenario - ${this.serverModel.isPrimaryServer ? 'Primary' : 'Client'} server`,
                    domain: this.serverModel.domain,
                    host: this.serverModel.host,
                    port: httpCapability?.port,
                    isPrimaryServer: this.serverModel.isPrimaryServer,
                    capabilities: this.serverModel.capabilities
                }
            };

            fs.writeFileSync(scenarioPath, JSON.stringify(scenario, null, 2));
            console.log(`💾 Scenario saved to: ${scenarioPath}`);
        } catch (error) {
            console.error(`❌ Failed to save scenario: ${error instanceof Error ? error.message : String(error)}`);
        }
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
