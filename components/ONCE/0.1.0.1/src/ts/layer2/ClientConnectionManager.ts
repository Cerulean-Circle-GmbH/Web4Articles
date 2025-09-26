/**
 * ClientConnectionManager - Web4 Architecture Layer 2
 * Manages demo client connections and WebSocket communication
 * Replaces client management functions with proper Web4 class
 */

import WebSocket from 'ws';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import type { DemoStateManager, DemoClientState } from './DemoStateManager.js';
import type { DemoLogger } from './DemoLogger.js';

const execAsync = promisify(exec);

export class ClientConnectionManager {
    private stateManager: DemoStateManager | null = null;
    private logger: DemoLogger | null = null;
    private baseDir: string = '';

    constructor() {
        // Empty constructor following Web4 principles
    }

    static fromScenario(scenario: any): ClientConnectionManager {
        const manager = new ClientConnectionManager();
        if (scenario?.state?.baseDir) {
            manager.baseDir = scenario.state.baseDir;
        }
        return manager;
    }

    public initialize(stateManager: DemoStateManager, logger: DemoLogger, baseDir?: string): void {
        this.stateManager = stateManager;
        this.logger = logger;
        if (baseDir) {
            this.baseDir = baseDir;
        }
    }

    public async launchBrowserClient(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ClientConnectionManager not initialized');
        }

        const state = this.stateManager.getState();
        if (!state.running) {
            this.logger.error('Server not running - start server first');
            return;
        }

        this.logger.info('Launching Browser Client...');

        // Auto-open browser
        await this.autoOpenBrowserClient();

        // Create WebSocket connection to simulate browser
        await this.createWebSocketClient('Browser', `ws://${state.HOST}:${state.PORT}/ws`);
    }

    public async launchNodeClient(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ClientConnectionManager not initialized');
        }

        const state = this.stateManager.getState();
        if (!state.running) {
            this.logger.error('Server not running - start server first');
            return;
        }

        this.logger.info('Launching Node.js Client...');

        // Create WebSocket connection for Node.js client
        await this.createWebSocketClient('NodeJS', `ws://${state.HOST}:${state.PORT}/ws`);
    }

    public async launchWorkerClient(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ClientConnectionManager not initialized');
        }

        const state = this.stateManager.getState();
        if (!state.running) {
            this.logger.error('Server not running - start server first');
            return;
        }

        this.logger.info('Launching Web Worker simulation...');

        // Create WebSocket connection to simulate worker
        await this.createWebSocketClient('Worker', `ws://${state.HOST}:${state.PORT}/ws`);
    }

    private async autoOpenBrowserClient(): Promise<void> {
        if (!this.stateManager || !this.logger) return;

        const state = this.stateManager.getState();
        const clientURL = `${state.serverURL}/examples/browser-client/`;

        this.logger.info(`Opening browser client: ${clientURL}`);

        try {
            let command: string;
            const platform = process.platform;

            switch (platform) {
                case 'darwin':
                    command = `open "${clientURL}"`;
                    break;
                case 'win32':
                    command = `start "${clientURL}"`;
                    break;
                case 'linux':
                    command = `xdg-open "${clientURL}" || firefox "${clientURL}" || chromium-browser "${clientURL}" || google-chrome "${clientURL}"`;
                    break;
                default:
                    this.logger.warn(`Unsupported platform for auto-opening browser: ${platform}`);
                    return;
            }

            await execAsync(command);
            this.logger.success('Browser client opened successfully');
        } catch (error) {
            this.logger.error(`Failed to open browser client: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async createWebSocketClient(clientType: string, wsUrl: string): Promise<void> {
        if (!this.stateManager || !this.logger) return;

        try {
            const ws = new WebSocket(wsUrl);
            const clientId = `${clientType}-${Date.now()}`;

            const clientState: DemoClientState = {
                type: clientType,
                connected: false,
                ws: ws
            };

            ws.on('open', () => {
                clientState.connected = true;
                this.stateManager!.addClient(clientId, clientState);
                this.logger!.success(`${clientType} client connected`);

                // Send initial scenario
                ws.send(JSON.stringify({
                    type: 'register',
                    clientType: clientType,
                    timestamp: new Date().toISOString()
                }));
            });

            ws.on('message', (data: Buffer) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.logger!.info(`${clientType} received: ${message.type}`);
                } catch (error) {
                    this.logger!.warn(`${clientType} received invalid message: ${data.toString()}`);
                }
            });

            ws.on('close', () => {
                clientState.connected = false;
                this.logger!.warn(`${clientType} client disconnected`);
            });

            ws.on('error', (error: Error) => {
                this.logger!.error(`${clientType} client error: ${error.message}`);
                this.stateManager!.removeClient(clientId);
            });

        } catch (error) {
            this.logger.error(`Failed to create ${clientType} client: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async discoverPeers(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ClientConnectionManager not initialized');
        }

        const clients = this.stateManager.getAllClients();
        if (clients.size === 0) {
            this.logger.warn('No active clients for peer discovery');
            return;
        }

        this.logger.info('Initiating peer discovery...');

        for (const [id, client] of clients) {
            if (client.connected && client.ws?.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({
                    type: 'discover-peers',
                    timestamp: new Date().toISOString(),
                    requestId: `discovery-${Date.now()}`
                }));
            }
        }

        this.logger.success('Peer discovery initiated from all clients');
    }

    public async exchangeScenarios(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ClientConnectionManager not initialized');
        }

        const clients = this.stateManager.getAllClients();
        if (clients.size < 2) {
            this.logger.warn('Need at least 2 clients for scenario exchange');
            return;
        }

        this.logger.info('Initiating scenario exchange...');

        // Get first client to share a scenario
        const [firstClient] = clients.values();
        if (firstClient.connected && firstClient.ws?.readyState === WebSocket.OPEN) {
            firstClient.ws.send(JSON.stringify({
                type: 'share-scenario',
                scenario: {
                    uuid: `demo-${Date.now()}`,
                    objectType: 'DemoMessage',
                    version: '0.1.0.1',
                    state: {
                        IOR: `message:demo-${Date.now()}`,
                        owner: firstClient.type,
                        model: {
                            content: `Hello from ${firstClient.type}!`,
                            timestamp: new Date().toISOString()
                        }
                    }
                }
            }));

            this.logger.success('Scenario shared from first client');
        }
    }

    public closeAllConnections(): void {
        if (!this.stateManager) return;

        const clients = this.stateManager.getAllClients();
        for (const [id, client] of clients) {
            if (client.ws?.readyState === WebSocket.OPEN) {
                client.ws.close();
            }
        }
        this.stateManager.clearClients();
    }

    public getConnectionCount(): number {
        if (!this.stateManager) return 0;
        return this.stateManager.getAllClients().size;
    }

    public toScenario(): any {
        const clients = this.stateManager?.getAllClients() || new Map();
        const clientStates = Array.from(clients.entries()).map(([id, client]) => ({
            id,
            type: client.type,
            connected: client.connected
        }));

        return {
            uuid: `client-connection-manager-${Date.now()}`,
            objectType: 'ClientConnectionManager',
            version: '0.1.0.1',
            state: {
                baseDir: this.baseDir,
                clientCount: clients.size,
                clients: clientStates
            }
        };
    }
}
