/**
 * Server Hierarchy Manager v0.2.0.0 - Implements server hierarchy with name server model
 * Implements requirement 9beee86b-09c2-43c8-b449-b9a7b8f2b338
 */

import { createServer, Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { exec } from 'child_process';
import { PortManager } from './PortManager.js';
import { ONCEServerModel, ONCE_DEFAULT_CONFIG, createDefaultServerModel } from '../layer3/ONCEServerModel.js';
import { LifecycleState } from '../layer3/LifecycleEvents.js';
import { IOR, iorToUrl } from '../layer3/IOR.js';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { logAction, logBroadcast, logRegistration, logConnection, logDisconnection, shortUUID, serverIdentity } from '../layer1/LoggingUtils.js';
import { fileURLToPath } from 'url';
import { ONCEScenarioMessage } from '../layer3/ONCEModel.interface.js';

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
    private browserClients: Set<WebSocket> = new Set(); // Track browser WebSocket connections
    component?: any; // Backward link to DefaultONCE for path authority

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
            domain: this.detectDomain(), // ✅ Dynamic domain discovery (e.g., "box.fritz")
            hostname: this.extractHostname(), // ✅ Dynamic hostname extraction (e.g., "McDonges-3")
            host: this.detectHostname(), // ✅ Dynamic FQDN discovery (e.g., "McDonges-3.fritz.box")
            ip: this.detectIPAddress(), // ✅ Dynamic IP discovery
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
                
                // Perform housekeeping: discover existing servers, cleanup shutdown scenarios
                await this.performHousekeeping();
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

    this.wsServer.on('connection', (ws: WebSocket, request: any) => {
      this.handleWebSocketConnection(ws, request);
    });

        console.log(`📡 WebSocket server started`);
    }

    /**
     * Handle HTTP requests
     */
    private async handleHttpRequest(req: any, res: any): Promise<void> {
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        if (url.pathname === '/') {
            // Root path - serve comprehensive server status page (like v0.1.0.2 view/html/index.html)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getServerStatusHTML());
        } else if (url.pathname === '/health') {
            // Health endpoint - JSON status
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            
            // Include primary server connection info for client servers
            const primaryInfo = this.serverModel.isPrimaryServer ? null : {
                host: this.serverModel.primaryServer?.host || 'localhost',
                port: this.serverModel.primaryServer?.port || 42777,
                connected: !!this.primaryServerConnection,
                domain: this.serverModel.domain
            };
            
            res.end(JSON.stringify({
                status: 'running',
                uuid: this.serverModel.uuid,
                isPrimaryServer: this.serverModel.isPrimaryServer,
                state: this.serverModel.state,
                capabilities: this.serverModel.capabilities,
                domain: this.serverModel.domain,
                hostname: this.serverModel.hostname,
                version: this.version,
                primaryServer: primaryInfo,
                message: `ONCE v${this.version} Server - Enhanced Hierarchy`
            }));
        } else if (url.pathname === '/once' || url.pathname === '/once/') {
            // Simple browser client endpoint - just ONCE import and heading
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getSimpleONCEClientHTML());
        } else if (url.pathname === '/demo' || url.pathname === '/demo/') {
            // Demo hub - landing page with all server links
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.getDemoHubHTML());
        } else if (url.pathname === '/servers' && this.serverModel.isPrimaryServer) {
            // Only primary server can list all servers
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                primary: this.serverModel.isPrimaryServer,
                primaryServer: this.serverModel, // ✅ Include full primary model for UI
                servers: Array.from(this.serverRegistry.values()).map(entry => entry.model)
            }));
        } else if (url.pathname === '/start-server' && req.method === 'POST' && this.serverModel.isPrimaryServer) {
            // Start a new client server dynamically
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            
            // ✅ TRUE Radical OOP: Use path authority from component
            // Derive component root from current file location
            const dirname = path.dirname(fileURLToPath(import.meta.url));
            const componentDir = path.resolve(dirname, '../../../'); // layer2 -> ts -> dist -> component root
            
            exec(`cd ${componentDir} && ./once startServer &`, (error) => {
                if (error) {
                    console.error('Failed to start server:', error);
                }
            });
            
            res.end(JSON.stringify({ success: true, message: 'Server starting...' }));
        } else if (url.pathname === '/discover-servers' && req.method === 'POST' && this.serverModel.isPrimaryServer) {
            // Trigger housekeeping/discovery manually
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            
            console.log('🔍 Manual discovery triggered from demo hub');
            const result = await this.performHousekeeping();
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Discovery complete',
                deleted: result?.deleted || 0,
                discovered: result?.discovered || 0
            }));
        } else if (url.pathname === '/shutdown-all' && req.method === 'POST' && this.serverModel.isPrimaryServer) {
            // Gracefully shutdown all servers
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, message: 'Shutting down all servers...' }));
            
            console.log('🛑 Graceful shutdown of all servers initiated');
            
            // Shutdown all client servers first
            for (const [uuid, entry] of this.serverRegistry.entries()) {
                if (entry.websocket && entry.websocket.readyState === WebSocket.OPEN) {
                    console.log(`🛑 Sending shutdown to client: ${uuid}`);
                    entry.websocket.send(JSON.stringify({ type: 'shutdown-command' }));
                }
            }
            
            // Wait for clients to shutdown
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Shutdown primary server
            console.log('🛑 Shutting down primary server');
            await this.stopServer();
            
            // Exit process
            process.exit(0);
        } else if (url.pathname === '/shutdown-primary' && req.method === 'POST') {
            // Allow ANY client (or test) to trigger cascading shutdown of primary + all clients
            // This enables tests to clean up existing server hierarchy before starting fresh
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, message: 'Primary shutdown initiated...' }));
            
            if (this.serverModel.isPrimaryServer) {
                // We ARE the primary - cascade shutdown
                console.log('🛑 Client-triggered cascading shutdown initiated');
                
                // Shutdown all client servers first
                for (const [uuid, entry] of this.serverRegistry.entries()) {
                    if (entry.websocket && entry.websocket.readyState === WebSocket.OPEN) {
                        console.log(`🛑 Sending shutdown to client: ${uuid}`);
                        entry.websocket.send(JSON.stringify({ type: 'shutdown-command' }));
                    }
                }
                
                // Wait for clients to shutdown
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Shutdown primary server
                console.log('🛑 Shutting down primary server');
                await this.stopServer();
                
                // Exit process
                process.exit(0);
            } else {
                // We are a CLIENT - forward request to primary
                console.log('🛑 Forwarding shutdown request to primary server');
                const primaryUrl = this.serverModel.primaryServerIOR;
                if (primaryUrl) {
                    // Extract port from IOR (format: web4://localhost:PORT/once?...)
                    const portMatch = primaryUrl.match(/:(\d+)\//);
                    if (portMatch) {
                        const primaryPort = portMatch[1];
                        const http = await import('http');
                        
                        const options = {
                            hostname: 'localhost',
                            port: primaryPort,
                            path: '/shutdown-primary',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };
                        
                        const req = http.request(options, () => {
                            console.log('✅ Shutdown request forwarded to primary');
                        });
                        
                        req.on('error', (error) => {
                            console.error('❌ Failed to forward shutdown request:', error);
                        });
                        
                        req.end();
                    }
                }
            }
        } else if (url.pathname === '/stop-server' && req.method === 'POST' && this.serverModel.isPrimaryServer) {
            // Stop a client server dynamically
            let body = '';
            req.on('data', (chunk: any) => { body += chunk.toString(); });
            req.on('end', async () => {
                try {
                    const { port, uuid } = JSON.parse(body);
                    
                    // Find the registered server
                    const registryEntry = this.serverRegistry.get(uuid);
                    if (registryEntry && registryEntry.websocket) {
                        // Send shutdown command via WebSocket
                        registryEntry.websocket.send(JSON.stringify({
                            type: 'shutdown-command'
                        }));
                        
                        // Wait for the scenario to be updated to SHUTDOWN state
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        // Delete the client's scenario file (use new path structure)
                        const domainPath = this.detectDomainPath();
                        const hostname = this.serverModel.hostname || this.extractHostname();
                        const scenarioDir = path.join(
                            this.projectRoot,
                            'scenarios',
                            ...domainPath,
                            hostname,
                            'ONCE',
                            this.version,
                            'capability',
                            'httpPort',
                            port.toString()
                        );
                        const scenarioPath = path.join(scenarioDir, `${uuid}.scenario.json`);
                        
                        if (fs.existsSync(scenarioPath)) {
                            fs.unlinkSync(scenarioPath);
                            console.log(`🗑️  Deleted client scenario: ${uuid} (port ${port})`);
                        }
                        
                        // Remove from registry
                        this.serverRegistry.delete(uuid);
                        
                        // ✅ Broadcast server stopped event to all browser clients
                        this.broadcastServerEvent('server-stopped', { uuid, port });
                        
                        res.writeHead(200, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ success: true, message: 'Server stopped' }));
                    } else {
                        res.writeHead(404, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ success: false, message: 'Server not found' }));
                    }
                } catch (error) {
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, message: 'Failed to stop server' }));
                }
            });
        } else if (url.pathname.startsWith('/dist/') || url.pathname.startsWith('/src/')) {
            // Serve static files from component directory
            this.serveStaticFile(url.pathname, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }

    /**
     * Serve static files from component directory
     */
    private serveStaticFile(pathname: string, res: any): void {
        try {
            const dirname = path.dirname(fileURLToPath(import.meta.url));
            const componentRoot = path.join(dirname, '../../..');
            const filePath = path.join(componentRoot, pathname);
            
            console.log('Static file request:', pathname);
            console.log('Resolved to:', filePath);
            console.log('Component root:', componentRoot);
            console.log('Starts with check:', filePath.startsWith(componentRoot));
            
            // Security: prevent directory traversal
            if (!filePath.startsWith(componentRoot)) {
                console.log('FORBIDDEN: Path outside component root');
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('Forbidden');
                return;
            }
            
            if (!fs.existsSync(filePath)) {
                console.log('NOT FOUND: File does not exist');
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }
            
            const content = fs.readFileSync(filePath);
            const ext = path.extname(filePath);
            const contentTypes: { [key: string]: string } = {
                '.js': 'application/javascript',
                '.mjs': 'application/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.html': 'text/html',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml'
            };
            
            console.log('SERVING:', filePath, 'as', contentTypes[ext]);
            res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
            res.end(content);
        } catch (error) {
            console.log('ERROR serving static file:', error);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }

    /**
     * Radical OOP template renderer - uses native JS template literals with this context
     */
    private renderTemplate(templatePath: string): string {
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const fullPath = path.join(dirname, '../../../src/view/html', templatePath);
        const template = fs.readFileSync(fullPath, 'utf-8');
        // Escape backticks in template to prevent breaking the Function constructor
        const escapedTemplate = template.replace(/`/g, '\\`');
        return new Function('return `' + escapedTemplate + '`;').call(this);
    }

    /**
     * Get comprehensive server status HTML (for root path /)
     */
    private getServerStatusHTML(): string {
        return this.renderTemplate('server-status.html');
    }

    /**
     * Getters for template placeholders - Radical OOP model-driven
     */
    private get httpPort(): string {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        return httpCapability?.port?.toString() || 'Unknown';
    }

    private get wsPort(): string {
        const wsCapability = this.serverModel.capabilities.find(c => c.capability === 'wsPort');
        return wsCapability?.port?.toString() || 'Unknown';
    }

    private get capabilitiesHTML(): string {
        return this.serverModel.capabilities.map(cap => 
            `<p><strong>${cap.capability}:</strong> ${cap.port || 'Active'}</p>`
        ).join('');
    }

    /**
     * Get version via path authority
     * ✅ TRUE Radical OOP: Extract from own path location
     */
    private get version(): string {
        // First: try backward link to component
        if (this.component?.model?.version) {
            return this.component.model.version;
        }
        
        // Fallback: Path authority - derive version from component directory path
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const match = dirname.match(/ONCE\/(\d+\.\d+\.\d+\.\d+)/);
        return match ? match[1] : 'unknown';
    }

    private get projectRoot(): string {
        // Path authority: Use backward link to component instance if available
        if (this.component?.model?.projectRoot) {
            return this.component.model.projectRoot;
        }
        
        // Fallback: derive from component path
        // From dist/ts/layer2/, go up 7 levels: layer2 -> ts -> dist -> 0.3.20.3 -> ONCE -> components -> UpDown
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        return path.resolve(dirname, '../../../../../../');
    }

    /**
     * Get simple ONCE client HTML (for /once endpoint)
     * ✅ TRUE Radical OOP: Dynamically inject version instead of hardcoding
     */
    private getSimpleONCEClientHTML(): string {
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const fullPath = path.join(dirname, '../../../src/view/html/once-client.html');
        const html = fs.readFileSync(fullPath, 'utf-8');
        
        // Replace all hardcoded version strings with dynamic version
        return html.replace(/0\.3\.20\.[0-9]/g, this.version);
    }

    /**
     * Get demo hub HTML (for /demo endpoint)
     * ✅ TRUE Radical OOP: Dynamically inject version instead of hardcoding
     */
    private getDemoHubHTML(): string {
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const fullPath = path.join(dirname, '../../../src/view/html/demo-hub.html');
        const html = fs.readFileSync(fullPath, 'utf-8');
        
        // Replace all hardcoded version strings with dynamic version
        return html.replace(/0\.3\.20\.[0-9]/g, this.version);
    }

    /**
     * Handle WebSocket connections
     */
    private handleWebSocketConnection(ws: WebSocket, request: any): void {
        // Remove generic log - will log specific events (browser/server connections)
        
        // Initially treat as browser client (server registrations will be tracked separately)
        this.browserClients.add(ws);

    ws.on('message', async (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        await this.handleWebSocketMessage(ws, message);
      } catch (error) {
        console.error('❌ WebSocket message error:', error);
      }
    });

        ws.on('close', () => {
            // Remove generic log - connection close is normal and not useful without context
            // Remove from browser clients set
            this.browserClients.delete(ws);
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
            case 'server-unregister':
                if (this.serverModel.isPrimaryServer) {
                    await this.handleServerUnregister(message.data);
                }
                break;
            case 'server-discovery':
                if (this.serverModel.isPrimaryServer) {
                    await this.handleServerDiscovery(ws, message.query);
                }
                break;
            case 'scenario-message':
                // @pdca 2025-11-11-UTC-2322.pdca.md - Handle incoming scenario messages
                if (message.scenario.state.type === 'broadcast') {
                    if (this.serverModel.isPrimaryServer) {
                        // Primary received broadcast (from browser or client) - broadcast to all
                        console.log(`📡 Primary broadcasting scenario ${message.scenario.uuid}`);
                        // Broadcast to all registered client servers
                        this.broadcastScenario(message.scenario);
                        // Also broadcast to primary's own browser clients
                        this.broadcastToBrowserClients(message.scenario);
                    } else {
                        // Client server received broadcast
                        // Check if it's from our own browser client or from primary server
                        const fromPrimary = message.fromPrimary === true;
                        console.log(`📡 Client received broadcast, fromPrimary=${fromPrimary}, message.fromPrimary=${message.fromPrimary}`);
                        
                        if (fromPrimary) {
                            // Received from primary - broadcast to our browser clients
                            console.log(`📡 Forwarding to browser clients (wsServer has ${this.wsServer?.clients.size || 0} clients)`);
                            this.broadcastToBrowserClients(message.scenario);
                        } else {
                            // Received from our browser client - forward to primary
                            console.log(`📡 Forwarding to primary server`);
                            if (this.primaryServerConnection && this.primaryServerConnection.readyState === WebSocket.OPEN) {
                                this.primaryServerConnection.send(JSON.stringify({
                                    ...message,
                                    fromPrimary: false
                                }));
                            }
                        }
                    }
                } else {
                    await this.handleScenarioMessage(message.scenario);
                }
                break;
            case 'scenario-relay':
                // @pdca 2025-11-11-UTC-2322.pdca.md - Relay message to target
                if (this.serverModel.isPrimaryServer) {
                    this.relayScenario(message.scenario, message.targetUUID);
                } else {
                    // Client forwards to primary for relay
                    if (this.primaryServerConnection && this.primaryServerConnection.readyState === WebSocket.OPEN) {
                        this.primaryServerConnection.send(JSON.stringify(message));
                    }
                }
                break;
            case 'scenario-p2p':
                // @pdca 2025-11-11-UTC-2322.pdca.md - P2P direct message
                // Find a peer and send directly
                if (this.serverModel.isPrimaryServer && this.serverRegistry.size > 0) {
                    // Primary can help route P2P
                    const firstClient = Array.from(this.serverRegistry.values())[0];
                    const port = firstClient.model.capabilities.find(c => c.capability === 'httpPort')?.port;
                    if (port) {
                        this.sendScenarioToPeer(message.scenario, port);
                    }
                } else {
                    // Send to any peer we know
                    const peerPort = message.peerPort || 8080;
                    this.sendScenarioToPeer(message.scenario, peerPort);
                }
                break;
            case 'shutdown-command':
                // Remote shutdown command from primary
                console.log('🛑 Received shutdown command from primary server');
                void this.stopServer();
                break;
            case 'client-connected':
                // Browser client connected notification
                logConnection(this.serverModel.uuid, 'Browser', message.data?.clientId || 'unknown');
                // Optionally acknowledge or track browser clients
                break;
            case 'acknowledgment':
                // Browser client acknowledgment of received message
                const ackedType = message.data?.acknowledgedType || 'unknown';
                console.log(`✅ Browser acknowledged: ${ackedType}`);
                // Track acknowledgments if needed for reliability
                break;
            default:
                console.log('🔄 Unknown WebSocket message type:', message.type);
        }
    }

    /**
     * Handle incoming scenario message
     * @pdca 2025-11-11-UTC-2322.pdca.md - Process and track received scenarios
     */
    private async handleScenarioMessage(scenario: ONCEScenarioMessage): Promise<void> {
        // Extract sender info
        const fromUUID = scenario.state.from?.uuid || 'unknown';
        const fromPort = scenario.state.from?.port || 'unknown';
        const fromURL = fromPort !== 'unknown' ? `http://localhost:${fromPort}` : 'unknown';
        
        console.log(`📥 Received: scenario-message from ${fromUUID.substring(0, 8)}... at ${fromURL}`);
        console.log(`   Type: ${scenario.state.type}`);
        console.log(`   Content: ${scenario.state.content}`);
        console.log(`   Sequence: ${scenario.state.sequence}`);
        
        // Do NOT ACK an ACK (prevents infinite loop)
        if (scenario.state.content.startsWith('ACK:')) {
            return;
        }
        
        // Send acknowledgment as proper Scenario
        const ackScenario: ONCEScenarioMessage = {
            uuid: uuidv4(),
            objectType: 'ONCEMessage',
            version: this.version, // ✅ Use dynamic version
            state: {
                type: scenario.state.type,
                from: { uuid: this.serverModel.uuid, port: this.getHttpPort() },
                to: scenario.state.from,
                content: `ACK: ${scenario.uuid}`,
                timestamp: new Date().toISOString(),
                sequence: 0
            },
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                creator: 'ONCE-auto-ack',
                description: `Acknowledgment for ${scenario.uuid}`
            }
        };

        // Send ack back to sender
        if (scenario.state.from.port) {
            try {
                const ackConnection = new WebSocket(`ws://localhost:${scenario.state.from.port}`);
                ackConnection.on('open', () => {
                    ackConnection.send(JSON.stringify({
                        type: 'scenario-message',
                        scenario: ackScenario
                    }));
                    ackConnection.close();
                });
            } catch (error) {
                console.log(`⚠️  Failed to send acknowledgment to ${scenario.state.from.port}`);
            }
        }
    }

    /**
     * Get HTTP port from server model
     */
    private getHttpPort(): number {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        return httpCapability?.port || 0;
    }

    /**
     * Handle server registration (primary server only)
     */
    private async handleServerRegistration(ws: WebSocket, clientServerModel: ONCEServerModel): Promise<void> {
        const httpPort = clientServerModel.capabilities.find(c => c.capability === 'httpPort')?.port || 0;
        logRegistration(clientServerModel.uuid, clientServerModel.hostname, httpPort);
        
        // Remove from browser clients - this is a server connection
        this.browserClients.delete(ws);
        
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
        
        // ✅ Broadcast server registration event to all browser clients
        this.broadcastServerEvent('server-registered', clientServerModel);
    }

    /**
     * Handle server unregister (primary server only)
     * @pdca 2025-11-18-UTC-1830.pdca.md - Remove client from registry on shutdown
     */
    private async handleServerUnregister(data: { uuid: string; port?: number }): Promise<void> {
        console.log(`🗑️  [${shortUUID(this.serverModel.uuid)}] Client unregistered: ${shortUUID(data.uuid)} (port ${data.port})`);
        
        // Remove from registry
        this.serverRegistry.delete(data.uuid);
        
        // ✅ Broadcast server stopped event to all browser clients
        this.broadcastServerEvent('server-stopped', data);
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

        this.primaryServerConnection.on('message', async (data: any) => {
          try {
            const message = JSON.parse(data.toString());
            if (message.type === 'registration-confirmed') {
              console.log('✅ Registration confirmed with primary server');
              this.serverModel.primaryServerIOR = this.createPrimaryServerIOR(message.primaryServerModel);
              
              // Store primary server connection info for browser clients
              const primaryHttpPort = message.primaryServerModel.capabilities.find((c: any) => c.capability === 'httpPort')?.port;
              this.serverModel.primaryServer = {
                host: message.primaryServerModel.hostname || message.primaryServerModel.host || 'localhost',
                port: primaryHttpPort || 42777
              };
              
              this.serverModel.state = LifecycleState.REGISTERED;
              resolve();
            } else {
              // Handle all other messages (broadcasts, relays, etc.) from primary
              await this.handleWebSocketMessage(this.primaryServerConnection!, message);
            }
          } catch (error) {
            console.error('❌ Primary server message error:', error);
          }
        });

        this.primaryServerConnection.on('error', (error: any) => {
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
            version: this.version
        };

        return iorToUrl(ior);
    }

    /**
     * Load existing scenario or create new one with organized directory structure
     */
    private async loadOrCreateScenario(): Promise<void> {
        const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
        if (!httpCapability) return;

        // Use detected domain/hostname for scenario path
        // New structure: scenarios/{domain-parts}/{hostname}/ONCE/{version}
        const domainPath = this.detectDomainPath(); // e.g., ['box', 'fritz']
        const hostname = this.serverModel.hostname || this.extractHostname(); // e.g., "McDonges-3"
        
        // Main scenario file location
        const mainScenarioDir = path.join(
            this.projectRoot, 
            'scenarios',
            ...domainPath,      // Spread domain parts as separate directories
            hostname,
            'ONCE',
            this.version
        );
        const mainScenarioPath = path.join(mainScenarioDir, `${this.serverModel.uuid}.scenario.json`);
        
        // Capability symlink location (for discovery by port)
        const capabilityDir = path.join(
            this.projectRoot,
            'scenarios',
            ...domainPath,
            hostname,
            'ONCE',
            this.version,
            'capability',
            'httpPort',
            httpCapability.port.toString()
        );
        const capabilitySymlink = path.join(capabilityDir, `${this.serverModel.uuid}.scenario.json`);
        
        try {
            // Try to load existing scenario first
            const fs = await import('fs');
            const path = await import('path');
            
            if (fs.existsSync(mainScenarioPath)) {
                console.log(`📂 Loading existing scenario: ${mainScenarioPath}`);
                const scenarioData = JSON.parse(fs.readFileSync(mainScenarioPath, 'utf8'));
                
                // Restore configuration from scenario
                if (scenarioData.state) {
                    console.log(`✅ Scenario restored from ${mainScenarioPath}`);
                    
                    // Ensure capability symlink exists
                    this.ensureCapabilitySymlink(capabilityDir, capabilitySymlink, mainScenarioPath);
                    return;
                }
            }
        } catch (error) {
            console.log(`⚠️ Could not load existing scenario: ${error instanceof Error ? error.message : String(error)}`);
        }

        // Create new scenario if none exists or loading failed
        await this.saveScenario(mainScenarioDir, mainScenarioPath, capabilityDir, capabilitySymlink);
    }

    /**
     * Ensure capability symlink exists pointing to main scenario file (DRY principle)
     */
    private async ensureCapabilitySymlink(capabilityDir: string, symlinkPath: string, targetPath: string): Promise<void> {
        try {
            const fs = await import('fs');
            const path = await import('path');
            
            // Ensure capability directory exists
            if (!fs.existsSync(capabilityDir)) {
                fs.mkdirSync(capabilityDir, { recursive: true });
            }
            
            // Remove existing file/symlink if it exists
            if (fs.existsSync(symlinkPath)) {
                const stats = fs.lstatSync(symlinkPath);
                if (!stats.isSymbolicLink()) {
                    // It's a regular file - remove it (we'll replace with symlink)
                    fs.unlinkSync(symlinkPath);
                    console.log(`🔄 Removed duplicate file, creating symlink: ${symlinkPath}`);
                } else {
                    // Already a symlink - no action needed
                    return;
                }
            }
            
            // Create relative symlink from capability dir to main file
            const relativePath = path.relative(capabilityDir, targetPath);
            fs.symlinkSync(relativePath, symlinkPath);
            console.log(`🔗 Created capability symlink: ${symlinkPath} -> ${relativePath}`);
        } catch (error) {
            console.error(`⚠️  Failed to create capability symlink: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Save server scenario to organized directory structure
     */
    private async saveScenario(mainScenarioDir: string, mainScenarioPath: string, capabilityDir: string, capabilitySymlink: string): Promise<void> {
        try {
            const fs = await import('fs');
            const path = await import('path');
            
            // Ensure main directory exists
            fs.mkdirSync(mainScenarioDir, { recursive: true });
            
            const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
            
            const scenario = {
                uuid: this.serverModel.uuid,
                objectType: 'ONCE',
                version: this.version,
                state: {
                    ...this.serverModel,
                    created: new Date().toISOString()
                },
                metadata: {
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    creator: `ONCE-v${this.version}`,
                    description: `ONCE server scenario - ${this.serverModel.isPrimaryServer ? 'Primary' : 'Client'} server`,
                    domain: this.serverModel.domain,
                    host: this.serverModel.host,
                    port: httpCapability?.port,
                    isPrimaryServer: this.serverModel.isPrimaryServer,
                    capabilities: this.serverModel.capabilities
                }
            };

            // Save main scenario file
            fs.writeFileSync(mainScenarioPath, JSON.stringify(scenario, null, 2));
            // Logging done by ScenarioManager
            
            // Create capability symlink pointing to main file
            this.ensureCapabilitySymlink(capabilityDir, capabilitySymlink, mainScenarioPath);
        } catch (error) {
            console.error(`❌ Failed to save scenario: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Detect current environment
     */
    private detectEnvironment(): any {
        const hostname = this.detectHostname();
        const ip = this.detectIPAddress();
        
        return {
            platform: 'node',
            version: process.version,
            capabilities: ['server', 'websocket', 'p2p'],
            isOnline: true,
            hostname,
            ip
        };
    }

    /**
     * Detect hostname (FQDN preferred, fallback to simple hostname)
     */
    private detectHostname(): string {
        try {
            return os.hostname();
        } catch {
            return 'localhost';
        }
    }

    /**
     * Detect actual IP address from network interfaces
     * Prefers non-internal IPv4 addresses over localhost
     */
    private detectIPAddress(): string {
        try {
            const networkInterfaces = os.networkInterfaces();
            
            // Try to find first non-internal IPv4 address
            for (const name of Object.keys(networkInterfaces)) {
                const nets = networkInterfaces[name];
                if (nets) {
                    for (const net of nets) {
                        // Skip internal (loopback) and non-IPv4 addresses
                        if (net.family === 'IPv4' && !net.internal) {
                            return net.address;
                        }
                    }
                }
            }
            
            // Fallback to localhost if no external interface found
            return ONCE_DEFAULT_CONFIG.DEFAULT_IP;
        } catch {
            return ONCE_DEFAULT_CONFIG.DEFAULT_IP;
        }
    }

    /**
     * Detect domain from FQDN (without hostname) as separate path components
     * Examples:
     *   - "McDonges-3.fritz.box" -> domain path: ["box", "fritz"]
     *   - "localhost" -> domain path: ["local", "once"]
     *   - "myserver" -> domain path: ["local", "myserver"]
     */
    private detectDomainPath(): string[] {
        const fqdn = this.detectHostname(); // Returns full FQDN from OS
        
        // Special case: localhost
        if (fqdn === 'localhost') {
            return ['local', 'once']; // Default domain path
        }
        
        // If FQDN has dots, extract domain parts (all except first)
        if (fqdn.includes('.')) {
            const parts = fqdn.split('.');
            const domainParts = parts.slice(1); // Skip hostname (first part)
            return domainParts.reverse(); // Reverse for proper domain hierarchy
        }
        
        // Simple hostname without domain
        return ['local', fqdn];
    }

    /**
     * Get domain as string (for model storage, backward compatibility)
     * Examples:
     *   - "McDonges-3.fritz.box" -> "box.fritz"
     *   - "localhost" -> "local.once"
     *   - "myserver" -> "local.myserver"
     */
    private detectDomain(): string {
        return this.detectDomainPath().join('.');
    }

    /**
     * Extract hostname from FQDN (first component only)
     * Examples:
     *   - "McDonges-3.fritz.box" -> hostname: "McDonges-3"
     *   - "localhost" -> hostname: "localhost"
     *   - "myserver" -> hostname: "myserver"
     */
    private extractHostname(): string {
        const fqdn = this.detectHostname(); // Returns full FQDN from OS
        
        // If FQDN has dots, return only first part
        if (fqdn.includes('.')) {
            return fqdn.split('.')[0];
        }
        
        // Otherwise return as-is
        return fqdn;
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
     * Broadcast scenario message to all registered clients
     * @pdca 2025-11-11-UTC-2322.pdca.md - Automated multi-server demo
     */
    broadcastScenario(scenario: ONCEScenarioMessage): void {
        if (!this.serverModel.isPrimaryServer) {
            console.log('⚠️  Only primary server can broadcast');
            return;
        }

        console.log(`📡 Broadcasting scenario ${scenario.uuid} to ${this.serverRegistry.size} clients`);
        logBroadcast(this.serverModel.uuid, this.serverRegistry.size, 'client servers', `scenario ${shortUUID(scenario.uuid)}`);
        
        for (const [uuid, entry] of this.serverRegistry.entries()) {
            if (entry.websocket && entry.websocket.readyState === WebSocket.OPEN) {
                entry.websocket.send(JSON.stringify({
                    type: 'scenario-message',
                    scenario: scenario,
                    fromPrimary: true
                }));
            }
        }
    }

    /**
     * Broadcast scenario message to all connected browser clients (on this server)
     * @pdca 2025-11-11-UTC-2322.pdca.md - Client server forwards primary broadcasts to browsers
     */
    private broadcastToBrowserClients(scenario: ONCEScenarioMessage): void {
        const clientCount = this.browserClients.size;
        logBroadcast(this.serverModel.uuid, clientCount, 'browsers', `scenario ${shortUUID(scenario.uuid)}`);
        
        if (clientCount === 0) {
            console.log('ℹ️  No browser clients connected');
            return;
        }
        
        this.browserClients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'scenario-message',
                    scenario: scenario
                }));
            }
        });
    }

    /**
     * Broadcast server lifecycle events to all connected browser clients
     * Used for real-time updates in demo hub UI
     */
    private broadcastServerEvent(eventType: string, data: any): void {
        const clientCount = this.browserClients.size;
        logBroadcast(this.serverModel.uuid, clientCount, 'browsers', eventType);
        
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

    /**
     * Relay scenario message from one client through primary to another client
     * @pdca 2025-11-11-UTC-2322.pdca.md - Hub-and-spoke pattern
     */
    relayScenario(scenario: ONCEScenarioMessage, targetUUID: string): void {
        if (!this.serverModel.isPrimaryServer) {
            // Client sends to primary for relay
            if (this.primaryServerConnection && this.primaryServerConnection.readyState === WebSocket.OPEN) {
                console.log(`🔄 Relaying scenario ${scenario.uuid} via primary to ${targetUUID}`);
                this.primaryServerConnection.send(JSON.stringify({
                    type: 'scenario-relay',
                    scenario: scenario,
                    targetUUID: targetUUID
                }));
            }
            return;
        }

        // Primary relays to target
        const target = this.serverRegistry.get(targetUUID);
        if (target && target.websocket && target.websocket.readyState === WebSocket.OPEN) {
            console.log(`🔄 Primary relaying scenario ${scenario.uuid} to ${targetUUID}`);
            target.websocket.send(JSON.stringify({
                type: 'scenario-message',
                scenario: scenario
            }));
        } else {
            console.log(`⚠️  Target ${targetUUID} not found or not connected`);
        }
    }

    /**
     * Send scenario directly to peer (P2P)
     * @pdca 2025-11-11-UTC-2322.pdca.md - Direct peer-to-peer
     */
    sendScenarioToPeer(scenario: ONCEScenarioMessage, peerPort: number): void {
        try {
            const wsUrl = `ws://localhost:${peerPort}`;
            const peerConnection = new WebSocket(wsUrl);

            peerConnection.on('open', () => {
                console.log(`🔗 P2P connection established to port ${peerPort}`);
                peerConnection.send(JSON.stringify({
                    type: 'scenario-message',
                    scenario: scenario
                }));
                peerConnection.close();
            });

            peerConnection.on('error', (error) => {
                console.log(`⚠️  P2P connection to ${peerPort} failed:`, error.message);
            });
        } catch (error) {
            console.log(`⚠️  Failed to create P2P connection to ${peerPort}`);
        }
    }

    /**
     * Perform housekeeping at primary server startup
     * - Load existing scenarios from filesystem
     * - Delete scenarios with state=shutdown
     * - Discover and re-register running client servers
     */
    private async performHousekeeping(): Promise<{ deleted: number; discovered: number }> {
        console.log('🧹 Performing primary server housekeeping...');
        
        try {
            const domainPath = this.detectDomainPath();
            const hostname = this.serverModel.hostname || this.extractHostname();
            const scenarioBaseDir = path.join(
                this.projectRoot,
                'scenarios',
                ...domainPath,
                hostname,
                'ONCE',
                this.version
            );
            
            if (!fs.existsSync(scenarioBaseDir)) {
                console.log('📂 No existing scenarios found');
                return { deleted: 0, discovered: 0 };
            }
            
            // Find all scenario files
            const findScenarios = (dir: string): string[] => {
                const results: string[] = [];
                const items = fs.readdirSync(dir);
                
                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    
                    try {
                        // Use lstatSync to detect symlinks without following them
                        const stat = fs.lstatSync(fullPath);
                        
                        if (stat.isDirectory()) {
                            results.push(...findScenarios(fullPath));
                        } else if (item.endsWith('.scenario.json')) {
                            // Include all .scenario.json files (symlinks will be filtered later)
                            results.push(fullPath);
                        }
                    } catch (err: any) {
                        // Skip files we can't stat (broken symlinks, permission issues, etc.)
                        if (err.code === 'ENOENT') {
                            console.log(`⚠️ Skipping inaccessible file: ${fullPath}`);
                        } else {
                            console.warn(`⚠️ Error accessing ${fullPath}:`, err.message);
                        }
                        continue;
                    }
                }
                
                return results;
            };
            
            const scenarioFiles = findScenarios(scenarioBaseDir);
            console.log(`📂 Found ${scenarioFiles.length} existing scenario(s)`);
            
            let deletedCount = 0;
            let discoveredCount = 0;
            
            for (const scenarioPath of scenarioFiles) {
                try {
                    // Skip symlinks - we only process main files (symlinks will be cleaned up separately)
                    const stats = fs.lstatSync(scenarioPath);
                    if (stats.isSymbolicLink()) {
                        // Check if symlink target exists
                        if (!fs.existsSync(scenarioPath)) {
                            // Broken symlink - delete it
                            fs.unlinkSync(scenarioPath);
                            console.log(`🗑️  Deleted broken symlink: ${path.basename(scenarioPath)}`);
                        }
                        continue;
                    }
                    
                    const scenarioData = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
                    const state = scenarioData.state?.state;
                    const uuid = scenarioData.uuid;
                    const port = scenarioData.state?.capabilities?.find((c: any) => c.capability === 'httpPort')?.port;
                    
                    if (state === LifecycleState.SHUTDOWN || state === LifecycleState.STOPPED) {
                        // Delete shutdown/stopped server scenarios (both main file and symlink)
                        fs.unlinkSync(scenarioPath);
                        
                        // Delete corresponding symlink if it exists
                        if (port) {
                            const symlinkPath = path.join(scenarioBaseDir, `capability/httpPort/${port}/${uuid}.scenario.json`);
                            if (fs.existsSync(symlinkPath)) {
                                fs.unlinkSync(symlinkPath);
                            }
                        }
                        
                        deletedCount++;
                        console.log(`🗑️  Deleted shutdown server scenario: ${uuid} (port ${port})`);
                    } else if (state === LifecycleState.RUNNING || state === LifecycleState.CLIENT_SERVER) {
                        // Discover running client server
                        if (port && port !== 42777) {
                            // Try to connect to the server
                            try {
                                const http = await import('http');
                                await new Promise<void>((resolve, reject) => {
                                    const req = http.request({
                                        hostname: 'localhost',
                                        port: port,
                                        path: '/health',
                                        method: 'GET',
                                        timeout: 1000
                                    }, (res) => {
                                        if (res.statusCode === 200) {
                                            discoveredCount++;
                                            console.log(`🔍 Discovered running client server: ${uuid} on port ${port}`);
                                            resolve();
                                        } else {
                                            reject(new Error('Server not healthy'));
                                        }
                                    });
                                    
                                    req.on('error', reject);
                                    req.on('timeout', () => {
                                        req.destroy();
                                        reject(new Error('Timeout'));
                                    });
                                    req.end();
                                });
                            } catch (error) {
                                // Server not reachable, delete stale scenario (both main file and symlink)
                                fs.unlinkSync(scenarioPath);
                                
                                // Delete corresponding symlink if it exists
                                const symlinkPath = path.join(scenarioBaseDir, `capability/httpPort/${port}/${uuid}.scenario.json`);
                                if (fs.existsSync(symlinkPath)) {
                                    fs.unlinkSync(symlinkPath);
                                }
                                
                                deletedCount++;
                                console.log(`🗑️  Deleted stale server scenario: ${uuid} (port ${port} not reachable)`);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`⚠️  Error processing scenario ${scenarioPath}:`, error);
                }
            }
            
            console.log(`✅ Housekeeping complete: ${deletedCount} deleted, ${discoveredCount} discovered`);
            
            return { deleted: deletedCount, discovered: discoveredCount };
            
        } catch (error) {
            console.error('❌ Housekeeping error:', error);
            return { deleted: 0, discovered: 0 };
        }
    }

    /**
     * Stop server gracefully
     */
    async stopServer(): Promise<void> {
        this.serverModel.state = LifecycleState.STOPPING;
        
        // Update scenario to reflect stopping state
        await this.updateScenarioState(LifecycleState.STOPPING);

        // ✅ NEW: Notify primary server to unregister this client
        if (!this.serverModel.isPrimaryServer && this.primaryServerConnection) {
            try {
                const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
                const unregisterMsg = {
                    type: 'server-unregister',
                    data: {
                        uuid: this.serverModel.uuid,
                        port: httpCapability?.port
                    }
                };
                this.primaryServerConnection.send(JSON.stringify(unregisterMsg));
                // Give primary time to process unregister message
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.warn('⚠️  Failed to notify primary of shutdown:', error);
            }
        }

        if (this.primaryServerConnection) {
            this.primaryServerConnection.close();
        }

        if (this.wsServer) {
            this.wsServer.close();
        }

        if (this.httpServer) {
            return new Promise((resolve) => {
                this.httpServer!.close(async () => {
                    console.log('🛑 Server stopped');
                    this.serverModel.state = LifecycleState.SHUTDOWN;
                    
                    // Update scenario to SHUTDOWN state for housekeeping
                    await this.updateScenarioState(LifecycleState.SHUTDOWN);
                    
                    resolve();
                    
                    // Exit process after cleanup (for client servers)
                    // Don't exit in test environment
                    if (!this.serverModel.isPrimaryServer && process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
                        setTimeout(() => process.exit(0), 100);
                    }
                });
            });
        }
    }
    
    /**
     * Update scenario state for graceful shutdown tracking
     * Updates main scenario file (symlinks will automatically reflect changes)
     */
    private async updateScenarioState(state: LifecycleState): Promise<void> {
        try {
            const httpCapability = this.serverModel.capabilities.find(c => c.capability === 'httpPort');
            if (!httpCapability) return;
            
            const domainPath = this.detectDomainPath();
            const hostname = this.serverModel.hostname || this.extractHostname();
            
            // Update main scenario file (not the symlink)
            const mainScenarioPath = path.join(
                this.projectRoot,
                'scenarios',
                ...domainPath,
                hostname,
                'ONCE',
                this.version,
                `${this.serverModel.uuid}.scenario.json`
            );
            
            if (fs.existsSync(mainScenarioPath)) {
                const scenarioData = JSON.parse(fs.readFileSync(mainScenarioPath, 'utf8'));
                scenarioData.state.state = state;
                scenarioData.metadata.modified = new Date().toISOString();
                
                fs.writeFileSync(mainScenarioPath, JSON.stringify(scenarioData, null, 2));
                console.log(`💾 Updated scenario state to: ${state}`);
            }
        } catch (error) {
            console.error('⚠️  Failed to update scenario state:', error);
        }
    }
}
