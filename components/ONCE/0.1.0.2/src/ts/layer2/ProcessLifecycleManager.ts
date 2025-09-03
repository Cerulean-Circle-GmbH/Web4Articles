/**
 * ProcessLifecycleManager - Web4 Radical OOP Process Management
 * Replaces shell script PID management and cleanup with TypeScript class
 */

import { spawn, exec, ChildProcess } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export interface ProcessInfo {
    pid: number;
    command: string;
    startTime: Date;
}

export class ProcessLifecycleManager {
    private pidFile: string;
    private processes: Map<string, ProcessInfo> = new Map();
    private logger: any;
    private cleanupHandlers: (() => Promise<void>)[] = [];

    constructor(pidFileName: string = 'once-demo.pid', logger?: any) {
        this.pidFile = path.join(os.tmpdir(), pidFileName);
        this.logger = logger || console;
        this.setupSignalHandlers();
    }

    /**
     * Start a process and track it
     */
    public async startProcess(command: string, args: string[] = [], options: any = {}): Promise<number> {
        this.logger.info(`🚀 Starting process: ${command} ${args.join(' ')}`);

        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                stdio: 'inherit',
                ...options
            });

            if (!child.pid) {
                reject(new Error('Failed to start process - no PID'));
                return;
            }

            const processInfo: ProcessInfo = {
                pid: child.pid,
                command: `${command} ${args.join(' ')}`,
                startTime: new Date()
            };

            // Store process info
            this.processes.set(`${child.pid}`, processInfo);

            // Write PID file
            this.writePidFile(child.pid);

            child.on('exit', (code, signal) => {
                this.logger.info(`Process ${child.pid} exited with code ${code}, signal ${signal}`);
                this.processes.delete(`${child.pid}`);
                if (this.processes.size === 0) {
                    this.cleanupPidFile();
                }
            });

            child.on('error', (error) => {
                this.logger.error(`Process ${child.pid} error:`, error);
                reject(error);
            });

            // Give it a moment to ensure it started
            setTimeout(() => {
                if (child.pid && this.isProcessRunning(child.pid)) {
                    this.logger.info(`✅ Process started successfully (PID: ${child.pid})`);
                    resolve(child.pid);
                } else {
                    reject(new Error('Process failed to start'));
                }
            }, 100);
        });
    }

    /**
     * Check if a process is running
     */
    public isProcessRunning(pid: number): boolean {
        try {
            process.kill(pid, 0);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Stop a specific process
     */
    public async stopProcess(pid: number, signal: NodeJS.Signals = 'SIGTERM'): Promise<boolean> {
        if (!this.isProcessRunning(pid)) {
            this.logger.info(`Process ${pid} is not running`);
            return true;
        }

        this.logger.info(`🛑 Stopping process ${pid} with signal ${signal}`);

        try {
            process.kill(pid, signal);
            
            // Wait for graceful termination
            await this.waitForProcessExit(pid, 3000);
            
            if (this.isProcessRunning(pid)) {
                // Force kill if still running
                this.logger.info(`Force killing process ${pid}...`);
                process.kill(pid, 'SIGKILL');
                await this.waitForProcessExit(pid, 1000);
            }

            const stopped = !this.isProcessRunning(pid);
            if (stopped) {
                this.processes.delete(`${pid}`);
                this.logger.info(`✅ Process ${pid} stopped successfully`);
            } else {
                this.logger.error(`❌ Failed to stop process ${pid}`);
            }

            return stopped;
        } catch (error) {
            this.logger.error(`Error stopping process ${pid}:`, error);
            return false;
        }
    }

    /**
     * Stop all tracked processes
     */
    public async stopAllProcesses(): Promise<void> {
        this.logger.info('🛑 Stopping all processes...');

        const pids = Array.from(this.processes.keys()).map(k => parseInt(k));
        
        for (const pid of pids) {
            await this.stopProcess(pid);
        }

        // Clean up any remaining orphaned processes
        await this.cleanupOrphanedProcesses();
    }

    /**
     * Clean up orphaned processes (replaces shell script logic)
     */
    private async cleanupOrphanedProcesses(): Promise<void> {
        this.logger.info('🧹 Checking for orphaned processes...');

        try {
            // Find processes related to interactive-demo or server.mjs
            const { stdout } = await execAsync('ps -eo pid,comm,args');
            const lines = stdout.split('\n');
            
            const orphans: number[] = [];
            
            for (const line of lines) {
                if (line.includes('interactive-demo') || line.includes('server.mjs')) {
                    const match = line.trim().match(/^(\d+)/);
                    if (match) {
                        const pid = parseInt(match[1]);
                        if (pid !== process.pid && !this.processes.has(`${pid}`)) {
                            orphans.push(pid);
                        }
                    }
                }
            }

            // Clean up orphans
            for (const pid of orphans) {
                this.logger.info(`  Cleaning up orphaned PID: ${pid}`);
                try {
                    process.kill(pid, 'SIGTERM');
                    await this.waitForProcessExit(pid, 2000);
                    if (this.isProcessRunning(pid)) {
                        process.kill(pid, 'SIGKILL');
                    }
                } catch (error) {
                    // Ignore errors - process might already be gone
                }
            }

            if (orphans.length > 0) {
                this.logger.info(`✅ Cleaned up ${orphans.length} orphaned processes`);
            } else {
                this.logger.info('✅ No orphaned processes found');
            }

        } catch (error) {
            this.logger.error('Error during orphan cleanup:', error);
        }
    }

    /**
     * Wait for a process to exit
     */
    private async waitForProcessExit(pid: number, timeoutMs: number): Promise<void> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = 100;

            const check = () => {
                if (!this.isProcessRunning(pid)) {
                    resolve();
                    return;
                }

                if (Date.now() - startTime > timeoutMs) {
                    resolve(); // Timeout, but don't reject
                    return;
                }

                setTimeout(check, checkInterval);
            };

            check();
        });
    }

    /**
     * Write PID file
     */
    private writePidFile(pid: number): void {
        try {
            fs.writeFileSync(this.pidFile, pid.toString());
        } catch (error) {
            this.logger.error('Error writing PID file:', error);
        }
    }

    /**
     * Read PID from file
     */
    public readPidFile(): number | null {
        try {
            if (fs.existsSync(this.pidFile)) {
                const pidStr = fs.readFileSync(this.pidFile, 'utf8').trim();
                return parseInt(pidStr);
            }
        } catch (error) {
            this.logger.error('Error reading PID file:', error);
        }
        return null;
    }

    /**
     * Clean up PID file
     */
    private cleanupPidFile(): void {
        try {
            if (fs.existsSync(this.pidFile)) {
                fs.unlinkSync(this.pidFile);
            }
        } catch (error) {
            this.logger.error('Error cleaning up PID file:', error);
        }
    }

    /**
     * Setup signal handlers for graceful shutdown
     */
    private setupSignalHandlers(): void {
        const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

        for (const signal of signals) {
            process.on(signal, async () => {
                this.logger.info(`\n🛑 Received ${signal}, cleaning up...`);
                await this.cleanup();
                process.exit(0);
            });
        }

        // Handle process exit
        process.on('exit', () => {
            this.cleanupPidFile();
        });
    }

    /**
     * Add custom cleanup handler
     */
    public onCleanup(handler: () => Promise<void>): void {
        this.cleanupHandlers.push(handler);
    }

    /**
     * Complete cleanup
     */
    public async cleanup(): Promise<void> {
        await this.stopAllProcesses();
        
        // Run custom cleanup handlers
        for (const handler of this.cleanupHandlers) {
            try {
                await handler();
            } catch (error) {
                this.logger.error('Error in cleanup handler:', error);
            }
        }
        
        this.cleanupPidFile();
        this.logger.info('✅ Cleanup complete');
    }

    /**
     * Get all tracked processes
     */
    public getProcesses(): ProcessInfo[] {
        return Array.from(this.processes.values());
    }
}
