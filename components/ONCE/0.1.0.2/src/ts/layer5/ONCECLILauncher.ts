/**
 * ONCECLILauncher - Web4 Radical OOP CLI Entry Point
 * Layer 5: Command Line Interface Launcher
 * Follows Web4 principles: everything is an object, loadable from Scenario
 */

export class ONCECLILauncher {
    private args: string[];
    private projectRoot: string;

    constructor() {
        // Initialize from Scenario pattern
        this.args = [];
        this.projectRoot = process.cwd();
    }

    /**
     * Web4 pattern: Create from Scenario
     */
    public static fromScenario(scenario: any): ONCECLILauncher {
        const launcher = new ONCECLILauncher();
        if (scenario?.state?.args) {
            launcher.args = scenario.state.args;
        }
        if (scenario?.state?.projectRoot) {
            launcher.projectRoot = scenario.state.projectRoot;
        }
        return launcher;
    }

    /**
     * Initialize with command line arguments
     */
    public initialize(args: string[]): void {
        this.args = args;
    }

    /**
     * Main execution method - Web4 OOP approach
     */
    public async execute(): Promise<void> {
        if (this.args.length === 0) {
            await this.showUsage();
            return;
        }

        const command = this.args[0];
        
        switch (command) {
            case 'demo':
                await this.handleDemo(this.args.slice(1));
                break;
            case 'test':
                // test <input> is identical to demo <input>
                await this.handleDemo(this.args.slice(1));
                break;
            case 'start':
            case 'stop':
            case 'help':
            case 'version':
            case 'launch':
            case 'deps':
            default:
                // Route all other commands to ONCECLI
                await this.delegateToONCECLI(this.args);
                break;
        }
    }

    /**
     * Show usage when no arguments provided
     */
    private async showUsage(): Promise<void> {
        const { OnceCLI } = await import('./ONCECLI.js');
        const cli = new OnceCLI();
        await cli.handleCommand([]);
    }

    /**
     * Handle demo commands - Web4 OOP method
     */
    private async handleDemo(args: string[]): Promise<void> {
        if (args.length === 0) {
            // once demo (no args) - interactive mode
            await this.launchInteractiveDemo();
        } else if (args[0] === 'headless') {
            // once demo headless - same as once start headless
            await this.delegateToONCECLI(['start', 'headless']);
        } else if (args[0] === 'help') {
            // once demo help
            await this.delegateToONCECLI(['demo', 'help']);
        } else {
            // once demo <input> - test sequence mode
            await this.launchTestSequence(args[0]);
        }
    }

    /**
     * Launch interactive demo - Web4 OOP method
     */
    private async launchInteractiveDemo(): Promise<void> {
        const demoModule = await import('../../../examples/multi-env-demo/interactive-demo-web4.mjs') as any;
        await demoModule.main([]);
    }

    /**
     * Launch test sequence - Web4 OOP method
     */
    private async launchTestSequence(input: string): Promise<void> {
        const demoModule = await import('../../../examples/multi-env-demo/interactive-demo-web4.mjs') as any;
        await demoModule.main(['test:' + input]);
    }

    /**
     * Delegate to ONCE CLI class - Web4 OOP delegation
     */
    private async delegateToONCECLI(args: string[]): Promise<void> {
        const { OnceCLI } = await import('./ONCECLI.js');
        const cli = new OnceCLI();
        await cli.handleCommand(args);
    }

    /**
     * Web4 pattern: Convert to Scenario for persistence/serialization
     */
    public toScenario(): any {
        return {
            uuid: `once-cli-launcher-${Date.now()}`,
            objectType: 'ONCECLILauncher',
            version: '0.1.0.2',
            state: {
                args: this.args,
                projectRoot: this.projectRoot
            }
        };
    }

    /**
     * Get current state - Web4 pattern
     */
    public getState(): any {
        return {
            args: this.args,
            projectRoot: this.projectRoot,
            initialized: this.args.length > 0
        };
    }

    /**
     * Error handling - Web4 OOP approach
     */
    public handleError(error: Error): void {
        console.error('❌ ONCE CLI Launcher Error:', error.message);
        process.exit(1);
    }
}
