/**
 * DemoOperationsManager - Web4 Architecture Layer 2
 * Manages demo-specific operations like metrics, cleanup, process management
 * Replaces utility functions with proper Web4 class
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { DemoStateManager } from './DemoStateManager.js';
import type { DemoLogger } from './DemoLogger.js';
import type { ClientConnectionManager } from './ClientConnectionManager.js';
import type { ServerLifecycleManager } from './ServerLifecycleManager.js';

const execAsync = promisify(exec);

export class DemoOperationsManager {
    private stateManager: DemoStateManager | null = null;
    private logger: DemoLogger | null = null;
    private clientManager: ClientConnectionManager | null = null;
    private serverManager: ServerLifecycleManager | null = null;
    private chalk: any = null;

    constructor() {
        // Empty constructor following Web4 principles
    }

    static fromScenario(scenario: any): DemoOperationsManager {
        const manager = new DemoOperationsManager();
        return manager;
    }

    public async initialize(
        stateManager: DemoStateManager,
        logger: DemoLogger,
        clientManager: ClientConnectionManager,
        serverManager: ServerLifecycleManager
    ): Promise<void> {
        this.stateManager = stateManager;
        this.logger = logger;
        this.clientManager = clientManager;
        this.serverManager = serverManager;

        // Initialize chalk for metrics display
        try {
            const chalkModule = await import('chalk');
            this.chalk = chalkModule.default;
        } catch (error) {
            this.chalk = {
                bold: (text: string) => text,
                green: (text: string) => text,
                red: (text: string) => text,
                gray: (text: string) => text
            };
        }
    }

    public async showMetrics(): Promise<void> {
        if (!this.stateManager || !this.logger || !this.clientManager) {
            throw new Error('DemoOperationsManager not initialized');
        }

        const state = this.stateManager.getState();

        console.log(this.chalk.bold('\n📊 System Metrics:'));
        console.log(this.chalk.gray('─────────────────'));

        if (state.running && state.serverURL) {
            try {
                // Try to fetch server health (using native Node.js fetch)
                const response = await fetch(`${state.serverURL}/health`);
                const health = await response.json() as any;

                console.log(`  Server Status: ${this.chalk.green('RUNNING')}`);
                console.log(`  Server URL: ${state.serverURL}`);
                console.log(`  ONCE Version: ${health.once?.version || '0.1.0.1'}`);
                console.log(`  Connected Peers: ${health.peers || 0}`);
                console.log(`  Total Scenarios: ${health.scenarios || 0}`);
            } catch (error) {
                console.log(`  Server Status: ${this.chalk.red('ERROR')}`);
                console.log(`  Server URL: ${state.serverURL}`);
                console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            console.log(`  Server Status: ${this.chalk.red('STOPPED')}`);
        }

        const clientCount = this.clientManager.getConnectionCount();
        console.log(`  Active Clients: ${clientCount}`);
        
        if (clientCount > 0) {
            const clients = this.stateManager.getAllClients();
            clients.forEach((client, id) => {
                const status = client.connected ? this.chalk.green('connected') : this.chalk.red('disconnected');
                console.log(`    - ${client.type}: ${status}`);
            });
        }
        console.log();
    }

    public async killAllProcesses(): Promise<void> {
        if (!this.logger || !this.clientManager || !this.serverManager) {
            throw new Error('DemoOperationsManager not initialized');
        }

        this.logger.warn('Shutting down all demo processes...');

        // Close all client connections
        this.clientManager.closeAllConnections();

        // Stop server
        await this.serverManager.stopServer();

        // Clean up any orphaned processes
        await this.cleanupOrphanedProcesses();

        this.logger.success('All processes terminated');
    }

    private async cleanupOrphanedProcesses(): Promise<void> {
        if (!this.logger) return;

        try {
            // Platform-specific cleanup
            const platform = process.platform;
            
            if (platform === 'win32') {
                // Windows process cleanup
                await execAsync(`taskkill /F /IM node.exe /FI "WINDOWTITLE eq server.mjs*" 2>nul || exit 0`);
            } else {
                // Unix-like systems
                await execAsync(`ps -edalf | grep -E "(server.mjs|once-demo)" | grep -v grep | awk '{print $4}' | xargs -r kill -TERM 2>/dev/null || true`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                await execAsync(`ps -edalf | grep -E "(server.mjs|once-demo)" | grep -v grep | awk '{print $4}' | xargs -r kill -KILL 2>/dev/null || true`);
            }
        } catch (error) {
            // Ignore errors from kill commands - they're expected if no processes exist
            this.logger?.warn(`Process cleanup completed with warnings: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    public async performCleanup(): Promise<void> {
        if (!this.logger) {
            throw new Error('DemoOperationsManager not initialized');
        }

        this.logger.info('Performing cleanup...');

        // Kill all processes
        await this.killAllProcesses();

        // Additional cleanup tasks
        await this.clearTemporaryFiles();

        this.logger.success('Cleanup complete');
    }

    private async clearTemporaryFiles(): Promise<void> {
        try {
            // Clean up any temporary files created during demo
            const platform = process.platform;
            
            if (platform === 'win32') {
                // Windows temp cleanup
                await execAsync(`del /Q /S %TEMP%\\once-demo-* 2>nul || exit 0`);
            } else {
                // Unix-like systems
                await execAsync(`find /tmp -name "once-demo-*" -type f -delete 2>/dev/null || true`);
            }
        } catch (error) {
            // Ignore errors - temp files may not exist
        }
    }

    public async getSystemInfo(): Promise<{
        serverStatus: string;
        clientCount: number;
        platform: string;
        nodeVersion: string;
        uptime: number;
    }> {
        if (!this.stateManager || !this.clientManager) {
            throw new Error('DemoOperationsManager not initialized');
        }

        const state = this.stateManager.getState();
        const serverInfo = this.serverManager?.getServerInfo();

        return {
            serverStatus: state.running ? 'RUNNING' : 'STOPPED',
            clientCount: this.clientManager.getConnectionCount(),
            platform: process.platform,
            nodeVersion: process.version,
            uptime: process.uptime()
        };
    }

    public clearScreen(): void {
        if (!this.logger) return;
        this.logger.showHeader();
        this.logger.showHelp();
    }

    public toScenario(): any {
        return {
            uuid: `demo-operations-${Date.now()}`,
            objectType: 'DemoOperationsManager',
            version: '0.1.0.1',
            state: {
                initialized: this.stateManager !== null,
                platform: process.platform,
                nodeVersion: process.version
            }
        };
    }
}
