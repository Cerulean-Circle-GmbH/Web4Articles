/**
 * InteractiveDemoController - Web4 Architecture Layer 5
 * Main orchestrator for the ONCE interactive demo
 * Replaces the 671-line interactive-demo.js with proper Web4 class architecture
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DemoStateManager } from '../layer2/DemoStateManager.js';
import { DemoLogger } from '../layer2/DemoLogger.js';
import { ServerLifecycleManager } from '../layer2/ServerLifecycleManager.js';
import { ClientConnectionManager } from '../layer2/ClientConnectionManager.js';
import { DemoOperationsManager } from '../layer2/DemoOperationsManager.js';
import { TestSequenceRunner } from '../layer2/TestSequenceRunner.js';
import { EnvironmentDetector } from '../layer2/EnvironmentDetector.js';
import { KeyboardController } from './KeyboardController.js';

export class InteractiveDemoController {
    private stateManager: DemoStateManager;
    private logger: DemoLogger;
    private serverManager: ServerLifecycleManager;
    private clientManager: ClientConnectionManager;
    private operationsManager: DemoOperationsManager;
    private testRunner: TestSequenceRunner;
    private keyboardController: KeyboardController;
    private environmentDetector: EnvironmentDetector;
    private baseDir: string;
    private initialized: boolean = false;

    constructor() {
        // Empty constructor following Web4 principles
        this.stateManager = new DemoStateManager();
        this.logger = new DemoLogger();
        this.serverManager = new ServerLifecycleManager();
        this.clientManager = new ClientConnectionManager();
        this.operationsManager = new DemoOperationsManager();
        this.testRunner = new TestSequenceRunner();
        this.keyboardController = new KeyboardController();
        this.environmentDetector = new EnvironmentDetector();
        this.baseDir = '';
    }

    static fromScenario(scenario: any): InteractiveDemoController {
        const controller = new InteractiveDemoController();
        if (scenario?.state?.baseDir) {
            controller.baseDir = scenario.state.baseDir;
        }
        return controller;
    }

    public async initialize(baseDir?: string): Promise<void> {
        if (this.initialized) return;

        // Set base directory
        if (baseDir) {
            this.baseDir = baseDir;
        } else {
            // Default to current module directory
            const __filename = fileURLToPath(import.meta.url);
            this.baseDir = dirname(__filename);
        }

        // Initialize all components
        await this.logger.initialize();
        
        this.serverManager.initialize(this.stateManager, this.logger, this.baseDir);
        this.clientManager.initialize(this.stateManager, this.logger, this.baseDir);
        await this.operationsManager.initialize(
            this.stateManager, 
            this.logger, 
            this.clientManager, 
            this.serverManager
        );
        await this.testRunner.initialize(
            this.stateManager, 
            this.logger, 
            (key: string) => this.handleKeypress(key)
        );

        this.initialized = true;
    }

    public async startDemo(headless: boolean = false): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Show header and help
        if (!headless) {
            this.logger.showHeader();
            this.logger.showHelp();
        }

        // Get network address with fallback
        const networkAddress = await this.getNetworkAddress();
        
        if (!headless) {
            this.logger.info(`Demo initialized with network address: ${networkAddress}`);
            this.logger.info('Press [h] for help, [s] to start server, [q] to quit');

            // Setup keyboard input
            this.setupKeyboardInput();
        }
    }

    private async getNetworkAddress(): Promise<string> {
        try {
            // Try environment variable first
            if (process.env.ONCE_SERVER_HOST) {
                this.logger.info(`Using ONCE_SERVER_HOST: ${process.env.ONCE_SERVER_HOST}`);
                return process.env.ONCE_SERVER_HOST;
            }

            // Use EnvironmentDetector for robust network detection
            const address = await this.environmentDetector.getNetworkAddress();
            this.logger.info(`Network address detected: ${address}`);
            return address;
        } catch (error) {
            // Fallback to localhost as per user requirement
            this.logger.warn(`Network detection failed, using localhost fallback: ${error instanceof Error ? error.message : String(error)}`);
            return 'localhost';
        }
    }

    private setupKeyboardInput(): void {
        const state = this.stateManager.getState();
        if (!state.keyboardEnabled) {
            this.logger.warn('Keyboard input disabled');
            return;
        }

        // Check TTY environment
        if (!process.stdin.isTTY) {
            this.logger.warn('Not a TTY environment - keyboard input disabled');
            this.stateManager.setKeyboardEnabled(false);
            return;
        }

        // Check for setRawMode availability
        if (typeof process.stdin.setRawMode !== 'function') {
            this.logger.warn('Raw mode not available - keyboard input disabled');
            this.stateManager.setKeyboardEnabled(false);
            return;
        }

        // Setup keyboard listening using stdin directly (KeyboardController needs enhancement)
        process.stdin.setRawMode!(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        
        process.stdin.on('data', (data: Buffer | string) => {
            const key = data.toString();
            this.handleKeypress(key).catch(error => {
                this.logger.error(`Keypress handler error: ${error instanceof Error ? error.message : String(error)}`);
            });
        });

        // Setup cleanup on exit
        process.on('SIGINT', () => this.handleExit());
        process.on('SIGTERM', () => this.handleExit());
        process.on('exit', () => this.handleExit());
    }

    private async handleKeypress(key: string): Promise<void> {
        switch (key.toLowerCase()) {
            case 'h':
                this.logger.showHelp();
                break;

            case 's':
                const networkAddress = await this.getNetworkAddress();
                await this.serverManager.toggleServer(networkAddress);
                break;

            case '1':
                await this.clientManager.launchBrowserClient();
                break;

            case '2':
                await this.clientManager.launchNodeClient();
                break;

            case '3':
                await this.clientManager.launchWorkerClient();
                break;

            case 'd':
                await this.clientManager.discoverPeers();
                break;

            case 'e':
                await this.clientManager.exchangeScenarios();
                break;

            case 'm':
                await this.operationsManager.showMetrics();
                break;

            case 'c':
                this.operationsManager.clearScreen();
                break;

            case 'k':
                await this.operationsManager.killAllProcesses();
                break;

            case 'q':
                this.logger.info('Quit command received');
                await this.handleExit();
                process.exit(0);
                break;

            default:
                this.logger.warn(`Unknown key: ${key}`);
        }
    }

    private async handleExit(): Promise<void> {
        this.logger.info('Performing cleanup...');
        
        // Stop keyboard listening
        if (process.stdin.setRawMode) {
            process.stdin.setRawMode(false);
        }
        process.stdin.pause();
        
        // Perform cleanup
        await this.operationsManager.performCleanup();
        
        this.logger.success('Cleanup complete');
    }

    public async runTestSequence(sequence: string): Promise<void> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Validate sequence first
        const validation = this.testRunner.validateSequence(sequence);
        if (!validation.valid) {
            this.logger.error('Invalid test sequence:');
            validation.errors.forEach(error => this.logger.error(`  - ${error}`));
            return;
        }

        // Show sequence info
        const info = this.testRunner.getSequenceInfo(sequence);
        this.logger.info(`Test sequence info: ${info.totalActions} actions, ~${info.estimatedDuration}s duration`);

        // Run the sequence
        await this.testRunner.runTestSequence(sequence);
    }

    public async startHeadlessDemo(): Promise<void> {
        await this.startDemo(true);
        
        // In headless mode, just start the server and wait
        const networkAddress = await this.getNetworkAddress();
        await this.serverManager.startServer(networkAddress);
        
        this.logger.info('Headless demo server started. Use Ctrl+C to stop.');
        
        // Keep process alive
        process.on('SIGINT', async () => {
            await this.handleExit();
            process.exit(0);
        });
    }

    public getSystemStatus(): {
        initialized: boolean;
        serverRunning: boolean;
        clientCount: number;
        testMode: boolean;
    } {
        const state = this.stateManager.getState();
        return {
            initialized: this.initialized,
            serverRunning: state.running,
            clientCount: this.clientManager.getConnectionCount(),
            testMode: state.testMode
        };
    }

    public toScenario(): any {
        const status = this.getSystemStatus();
        return {
            uuid: `interactive-demo-controller-${Date.now()}`,
            objectType: 'InteractiveDemoController',
            version: '0.1.0.1',
            state: {
                baseDir: this.baseDir,
                ...status
            }
        };
    }
}

// Main execution function for CLI usage
export async function main(args: string[] = []): Promise<void> {
    const controller = new InteractiveDemoController();
    
    // Parse command line arguments
    const hasHeadless = args.includes('headless') || args.includes('--headless');
    const testSequence = args.find(arg => arg.startsWith('test:'))?.replace('test:', '');
    
    try {
        if (testSequence) {
            // Run test sequence
            await controller.runTestSequence(testSequence);
        } else if (hasHeadless) {
            // Run headless demo
            await controller.startHeadlessDemo();
        } else {
            // Run interactive demo
            await controller.startDemo();
        }
    } catch (error) {
        console.error('Demo failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// Auto-execute if this module is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv.slice(2));
}
