/**
 * ServerLifecycleManager - Web4 Architecture Layer 2
 * Manages ONCE server lifecycle (start/stop/monitoring)
 * Replaces server management functions with proper Web4 class
 */

import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { DemoStateManager } from './DemoStateManager.js';
import type { DemoLogger } from './DemoLogger.js';

export class ServerLifecycleManager {
    private stateManager: DemoStateManager | null = null;
    private logger: DemoLogger | null = null;
    private baseDir: string;

    constructor() {
        // For ES modules compatibility
        this.baseDir = '';
    }

    static fromScenario(scenario: any): ServerLifecycleManager {
        const manager = new ServerLifecycleManager();
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

    public async startServer(host: string): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ServerLifecycleManager not initialized');
        }

        const state = this.stateManager.getState();
        if (state.serverProcess) {
            this.logger.warn('Server already running');
            return;
        }

        this.logger.info('Starting ONCE server...');
        
        this.stateManager.setHost(host);
        // Use PROJECT_ROOT to get absolute path to server
        const projectRoot = process.env.PROJECT_ROOT || process.cwd();
        const serverPath = join(projectRoot, 'components/ONCE/0.1.0.2/examples/node-server/server.mjs');
        
        const serverProcess = spawn('node', [serverPath], {
            env: { ...process.env, HOST: host, PORT: state.PORT.toString() },
            cwd: join(projectRoot, 'components/ONCE/0.1.0.2/examples/node-server')
        });
        
        this.stateManager.updateServerProcess(serverProcess, serverProcess.pid || 0);
        
        serverProcess.stdout?.on('data', (data: Buffer) => {
            const output = data.toString().trim();
            if (output.includes('listening')) {
                this.stateManager!.setRunning(true);
                this.logger!.success(`Server started on ${this.stateManager!.getState().serverURL}`);
            }
        });
        
        serverProcess.stderr?.on('data', (data: Buffer) => {
            this.logger!.error('Server error: ' + data.toString());
        });
        
        serverProcess.on('exit', (code: number | null) => {
            this.logger!.info(`Server exited with code ${code}`);
            this.stateManager!.resetServer();
        });
        
        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    public async stopServer(): Promise<void> {
        if (!this.stateManager || !this.logger) {
            throw new Error('ServerLifecycleManager not initialized');
        }

        const state = this.stateManager.getState();
        if (!state.serverProcess) {
            this.logger.warn('Server not running');
            return;
        }
        
        this.logger.info('Stopping server gracefully...');
        
        // Send SIGTERM for graceful shutdown
        state.serverProcess.kill('SIGTERM');
        
        // Wait for graceful shutdown
        await new Promise(resolve => {
            const timeout = setTimeout(() => {
                // Force kill if graceful shutdown failed
                if (state.serverProcess) {
                    this.logger!.warn('Forcing server shutdown...');
                    state.serverProcess.kill('SIGKILL');
                }
                resolve(undefined);
            }, 5000);
            
            if (state.serverProcess) {
                state.serverProcess.on('exit', () => {
                    clearTimeout(timeout);
                    resolve(undefined);
                });
            }
        });
        
        this.logger.success('Server stopped');
    }

    public async toggleServer(host: string): Promise<void> {
        if (!this.stateManager) {
            throw new Error('ServerLifecycleManager not initialized');
        }

        const state = this.stateManager.getState();
        if (state.running) {
            await this.stopServer();
        } else {
            await this.startServer(host);
        }
    }

    public isRunning(): boolean {
        if (!this.stateManager) return false;
        return this.stateManager.getState().running;
    }

    public getServerInfo(): { url: string | null; pid: number | null } {
        if (!this.stateManager) {
            return { url: null, pid: null };
        }
        
        const state = this.stateManager.getState();
        return {
            url: state.serverURL,
            pid: state.serverPID
        };
    }

    public toScenario(): any {
        const state = this.stateManager?.getState();
        return {
            uuid: `server-lifecycle-${Date.now()}`,
            objectType: 'ServerLifecycleManager',
            version: '0.1.0.1',
            state: {
                baseDir: this.baseDir,
                running: state?.running || false,
                serverURL: state?.serverURL || null,
                serverPID: state?.serverPID || null
            }
        };
    }
}
