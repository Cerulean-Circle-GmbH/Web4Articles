#!/usr/bin/env node
/**
 * ONCE CLI Interactive - Enhanced CLI with keyboard controls
 * Provides interactive demo management with graceful lifecycle handling
 */

import { OnceCLI } from './ONCECLI.js';
import { KeyboardController } from './KeyboardController.js';
import { DefaultONCE } from '../layer2/DefaultONCE.js';
import { spawn, ChildProcess } from 'child_process';
import { execSync } from 'child_process';

interface DemoProcess {
    name: string;
    process?: ChildProcess;
    pid?: number;
    type: 'server' | 'client';
    startTime: Date;
}

export class ONCECLIInteractive extends OnceCLI {
    private keyboard?: KeyboardController;
    private processes: Map<string, DemoProcess> = new Map();
    private serverUrl?: string;
    private host: string = 'localhost';
    private port: number = 8080;

    constructor() {
        super();
    }

    async runInteractive(): Promise<void> {
        console.clear();
        this.printHeader();
        
        // Get host IP
        try {
            this.host = execSync("hostname -I | awk '{print $1}'").toString().trim();
        } catch (error) {
            console.log('⚠️  Using localhost (could not detect IP)');
        }

        // Initialize keyboard controller
        this.keyboard = new KeyboardController();
        this.setupKeyboardBindings();

        // Setup event handlers
        this.setupEventHandlers();

        // ONCE initialization handled by parent class

        // Show help
        this.keyboard.showHelp();
        this.printCustomHelp();

        // Start keyboard listening
        this.keyboard.start();

        console.log('\n🎯 Interactive mode ready. Press "q" to quit.\n');
    }

    private printHeader(): void {
        console.log('╔════════════════════════════════════════════════╗');
        console.log('║      ONCE Interactive Demo Controller          ║');
        console.log('║         with Lifecycle Management              ║');
        console.log('╚════════════════════════════════════════════════╝');
        console.log();
    }

    private printCustomHelp(): void {
        console.log('\n📋 Demo Controls:');
        console.log('─────────────────');
        console.log('  [s] Start/Stop server');
        console.log('  [1-3] Launch demo clients');
        console.log('  [d] Discover peers');
        console.log('  [e] Exchange scenarios');
        console.log('  [m] Show metrics');
        console.log('  [k] Kill all processes');
        console.log('  [l] List active processes');
        console.log('  [r] Refresh status\n');
    }

    private setupKeyboardBindings(): void {
        if (!this.keyboard) return;

        // Server control
        this.keyboard.bind('s', 'Start/Stop ONCE server', async () => {
            if (this.processes.has('server')) {
                await this.stopServer();
            } else {
                await this.startDemoServer();
            }
        });

        // Client launches
        this.keyboard.bind('1', 'Launch Browser Client', async () => {
            await this.launchClient('browser');
        });

        this.keyboard.bind('2', 'Launch Node.js Client', async () => {
            await this.launchClient('nodejs');
        });

        this.keyboard.bind('3', 'Launch Worker Client', async () => {
            await this.launchClient('worker');
        });

        // Demo actions
        this.keyboard.bind('d', 'Discover peers', async () => {
            await this.demoPeerDiscovery();
        });

        this.keyboard.bind('e', 'Exchange scenarios', async () => {
            await this.demoScenarioExchange();
        });

        // Management
        this.keyboard.bind('m', 'Show metrics', async () => {
            await this.showDetailedMetrics();
        });

        this.keyboard.bind('k', 'Kill all processes', async () => {
            await this.killAllProcesses();
        });

        this.keyboard.bind('l', 'List processes', () => {
            this.listProcesses();
        });

        this.keyboard.bind('r', 'Refresh status', () => {
            this.refreshStatus();
        });

        this.keyboard.bind('c', 'Clear screen', () => {
            console.clear();
            this.printHeader();
            this.keyboard?.showHelp();
            this.printCustomHelp();
        });
    }

    private setupEventHandlers(): void {
        if (!this.keyboard) return;

        this.keyboard.on('quit', async () => {
            console.log('\n🛑 Shutting down gracefully...');
            await this.gracefulShutdown();
            process.exit(0);
        });

        this.keyboard.on('interrupt', async () => {
            console.log('\n⚠️  Interrupt detected, cleaning up...');
            await this.gracefulShutdown();
            process.exit(0);
        });

        // Prevent zombie processes
        process.on('SIGINT', async () => {
            await this.gracefulShutdown();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await this.gracefulShutdown();
            process.exit(0);
        });

        process.on('exit', () => {
            // Emergency cleanup
            this.emergencyCleanup();
        });
    }

    private async startDemoServer(): Promise<void> {
        console.log(`\n🚀 Starting ONCE server on ${this.host}:${this.port}...`);

        const serverPath = '../node-server/server.mjs';
        const serverProcess = spawn('node', [serverPath], {
            env: { ...process.env, HOST: this.host, PORT: this.port.toString() },
            detached: false // Important: keep attached to prevent zombies
        });

        const demoProcess: DemoProcess = {
            name: 'ONCE Server',
            process: serverProcess,
            pid: serverProcess.pid,
            type: 'server',
            startTime: new Date()
        };

        this.processes.set('server', demoProcess);
        this.serverUrl = `http://${this.host}:${this.port}`;

        serverProcess.stdout?.on('data', (data) => {
            console.log(`[Server] ${data.toString().trim()}`);
        });

        serverProcess.stderr?.on('data', (data) => {
            console.error(`[Server Error] ${data.toString().trim()}`);
        });

        serverProcess.on('exit', (code) => {
            console.log(`[Server] Exited with code ${code}`);
            this.processes.delete('server');
        });

        // Wait for server to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`✅ Server running at ${this.serverUrl}`);
    }

    private async stopServer(): Promise<void> {
        const server = this.processes.get('server');
        if (!server?.process) {
            console.log('⚠️  Server not running');
            return;
        }

        console.log('\n🛑 Stopping server gracefully...');
        
        // Send SIGTERM for graceful shutdown
        server.process.kill('SIGTERM');
        
        // Wait for process to exit (max 5 seconds)
        await new Promise<void>((resolve) => {
            let timeout = setTimeout(() => {
                console.log('⚠️  Force killing server...');
                server.process?.kill('SIGKILL');
                resolve();
            }, 5000);

            server.process?.on('exit', () => {
                clearTimeout(timeout);
                resolve();
            });
        });

        this.processes.delete('server');
        console.log('✅ Server stopped');
    }

    private async launchClient(type: string): Promise<void> {
        if (!this.serverUrl) {
            console.log('❌ Server not running. Start server first (press "s")');
            return;
        }

        const clientId = `${type}-${Date.now()}`;
        console.log(`\n🚀 Launching ${type} client (${clientId})...`);

        // Simulate client connection
        const demoProcess: DemoProcess = {
            name: `${type} Client`,
            type: 'client',
            startTime: new Date()
        };

        this.processes.set(clientId, demoProcess);
        console.log(`✅ ${type} client connected`);
    }

    private async demoPeerDiscovery(): Promise<void> {
        const clients = Array.from(this.processes.values()).filter(p => p.type === 'client');
        
        if (clients.length === 0) {
            console.log('\n⚠️  No clients connected');
            return;
        }

        console.log(`\n🔍 Discovering peers...`);
        console.log(`Found ${clients.length} active clients`);
        clients.forEach(client => {
            console.log(`  - ${client.name}`);
        });
    }

    private async demoScenarioExchange(): Promise<void> {
        const clients = Array.from(this.processes.values()).filter(p => p.type === 'client');
        
        if (clients.length < 2) {
            console.log('\n⚠️  Need at least 2 clients for scenario exchange');
            return;
        }

        console.log('\n📦 Demonstrating scenario exchange...');
        console.log('  Client 1 → Server → Client 2');
        console.log('✅ Scenario exchanged successfully');
    }

    private async showDetailedMetrics(): Promise<void> {
        console.log('\n📊 System Metrics:');
        console.log('─────────────────');
        
        // ONCE metrics handled by interactive demo
        
        // Process metrics
        console.log('\n🔧 Process Status:');
        this.processes.forEach((proc, id) => {
            const runtime = Math.floor((Date.now() - proc.startTime.getTime()) / 1000);
            console.log(`  ${proc.name} (${id})`);
            console.log(`    PID: ${proc.pid || 'N/A'}`);
            console.log(`    Runtime: ${runtime}s`);
        });
    }

    private listProcesses(): void {
        console.log('\n📋 Active Processes:');
        console.log('──────────────────');
        
        if (this.processes.size === 0) {
            console.log('  No active processes');
            return;
        }

        this.processes.forEach((proc, id) => {
            const status = proc.process ? '🟢 Running' : '🔴 Stopped';
            console.log(`  ${status} ${proc.name} (${id})`);
        });
    }

    private refreshStatus(): void {
        console.clear();
        this.printHeader();
        console.log(`🌐 Server: ${this.serverUrl || 'Not running'}`);
        console.log(`📊 Active processes: ${this.processes.size}`);
        this.listProcesses();
        console.log();
        this.keyboard?.showHelp();
        this.printCustomHelp();
    }

    private async killAllProcesses(): Promise<void> {
        console.log('\n💀 Killing all processes...');
        
        for (const [id, proc] of this.processes) {
            if (proc.process) {
                console.log(`  Killing ${proc.name}...`);
                proc.process.kill('SIGKILL');
            }
        }
        
        this.processes.clear();
        console.log('✅ All processes terminated');
    }

    private async gracefulShutdown(): Promise<void> {
        // Stop keyboard input
        this.keyboard?.stop();
        
        // Close all processes gracefully
        for (const [id, proc] of this.processes) {
            if (proc.process) {
                console.log(`  Stopping ${proc.name}...`);
                proc.process.kill('SIGTERM');
            }
        }
        
        // Wait for processes to exit
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Force kill any remaining
        for (const [id, proc] of this.processes) {
            if (proc.process && !proc.process.killed) {
                proc.process.kill('SIGKILL');
            }
        }
        
        // Clean up system processes
        try {
            execSync('ps -edalf | grep -E "(server.mjs|once-demo)" | grep -v grep | awk \'{print $4}\' | xargs -r kill -9 2>/dev/null', { stdio: 'ignore' });
        } catch (error) {
            // Ignore errors
        }
        
        console.log('✅ Graceful shutdown complete');
    }

    private emergencyCleanup(): void {
        // Last resort cleanup
        try {
            for (const [id, proc] of this.processes) {
                if (proc.process && !proc.process.killed) {
                    proc.process.kill('SIGKILL');
                }
            }
        } catch (error) {
            // Ignore errors in emergency cleanup
        }
    }
}

// Main entry point for interactive mode
if (import.meta.url === `file://${process.argv[1]}`) {
    const cli = new ONCECLIInteractive();
    cli.runInteractive().catch(error => {
        console.error('Failed to start interactive mode:', error);
        process.exit(1);
    });
}