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
        
        if (url.pathname === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'running',
                uuid: this.serverModel.uuid,
                isPrimaryServer: this.serverModel.isPrimaryServer,
                state: this.serverModel.state,
                capabilities: this.serverModel.capabilities
            }));
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
