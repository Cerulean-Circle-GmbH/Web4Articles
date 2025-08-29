/**
 * TestSequenceRunner - Web4 Architecture Layer 2
 * Handles test mode functionality with sequence parsing and execution
 * Replaces test mode functions with proper Web4 class
 */

import type { DemoStateManager } from './DemoStateManager.js';
import type { DemoLogger } from './DemoLogger.js';

export interface TestAction {
    type: 'key' | 'pause';
    value: string | number;
}

export class TestSequenceRunner {
    private stateManager: DemoStateManager | null = null;
    private logger: DemoLogger | null = null;
    private chalk: any = null;
    private keyHandler: ((key: string) => Promise<void>) | null = null;

    constructor() {
        // Empty constructor following Web4 principles
    }

    static fromScenario(scenario: any): TestSequenceRunner {
        const runner = new TestSequenceRunner();
        return runner;
    }

    public async initialize(
        stateManager: DemoStateManager,
        logger: DemoLogger,
        keyHandler: (key: string) => Promise<void>
    ): Promise<void> {
        this.stateManager = stateManager;
        this.logger = logger;
        this.keyHandler = keyHandler;

        // Initialize chalk for test mode display
        try {
            const chalkModule = await import('chalk');
            this.chalk = chalkModule.default;
        } catch (error) {
            this.chalk = {
                bold: {
                    yellow: (text: string) => text
                },
                gray: (text: string) => text,
                cyan: (text: string) => text,
                green: (text: string) => text,
                red: (text: string) => text
            };
        }
    }

    public parseSequence(sequence: string): TestAction[] {
        const actions: TestAction[] = [];
        let i = 0;
        
        while (i < sequence.length) {
            const char = sequence[i];
            
            // Check if it's a digit
            if (/\d/.test(char)) {
                // Collect all consecutive digits
                let numStr = '';
                while (i < sequence.length && /\d/.test(sequence[i])) {
                    numStr += sequence[i];
                    i++;
                }
                actions.push({ type: 'pause', value: parseInt(numStr) });
            } else {
                // It's a key command
                actions.push({ type: 'key', value: char });
                i++;
            }
        }
        
        return actions;
    }

    public async runTestSequence(sequence: string): Promise<void> {
        if (!this.stateManager || !this.logger || !this.keyHandler) {
            throw new Error('TestSequenceRunner not initialized');
        }

        // Enable test mode
        this.stateManager.setTestMode(true);
        
        console.log(this.chalk.bold.yellow('\n🤖 ONCE Demo Test Mode'));
        console.log(this.chalk.gray('─'.repeat(40)));
        console.log(this.chalk.cyan(`Sequence: ${sequence}`));
        console.log(this.chalk.gray('─'.repeat(40)) + '\n');
        
        const actions = this.parseSequence(sequence);
        this.logger.info(`Parsed ${actions.length} actions from sequence`);
        
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            
            if (action.type === 'pause') {
                const seconds = action.value as number;
                this.logger.info(`Pausing for ${seconds} seconds...`);
                await this.sleep(seconds * 1000);
            } else if (action.type === 'key') {
                const key = action.value as string;
                await this.simulateKeypress(key);
                
                // Small delay between keypresses
                await this.sleep(500);
            }
        }
        
        this.logger.success('Test sequence completed');
        console.log(this.chalk.gray('─'.repeat(40)));
        console.log(this.chalk.green('✅ Test mode execution finished'));
        console.log(this.chalk.gray('─'.repeat(40)) + '\n');
    }

    private async simulateKeypress(key: string): Promise<void> {
        if (!this.logger || !this.keyHandler) return;

        this.logger.info(`🔘 Simulating keypress: [${key}]`);
        
        try {
            await this.keyHandler(key);
        } catch (error) {
            this.logger.error(`Failed to simulate keypress [${key}]: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async runInteractiveTest(sequence: string): Promise<void> {
        if (!this.logger) {
            throw new Error('TestSequenceRunner not initialized');
        }

        this.logger.info('Starting interactive test mode...');
        this.logger.info('This will execute the sequence step by step with confirmations.');
        
        const actions = this.parseSequence(sequence);
        
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            
            console.log(`\nStep ${i + 1}/${actions.length}:`);
            
            if (action.type === 'pause') {
                console.log(`  Action: Wait ${action.value} seconds`);
                console.log('  Press ENTER to continue...');
                // In interactive mode, we would wait for user input
                // For now, just execute the pause
                await this.sleep((action.value as number) * 1000);
            } else {
                console.log(`  Action: Press key [${action.value}]`);
                console.log('  Press ENTER to execute...');
                // In interactive mode, we would wait for user confirmation
                // For now, just execute the keypress
                if (this.keyHandler) {
                    await this.keyHandler(action.value as string);
                }
            }
        }
        
        this.logger.success('Interactive test completed');
    }

    public validateSequence(sequence: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        const validKeys = new Set(['h', 's', '1', '2', '3', 'd', 'e', 'm', 'c', 'k', 'q']);
        
        if (!sequence || sequence.length === 0) {
            errors.push('Sequence cannot be empty');
            return { valid: false, errors };
        }
        
        const actions = this.parseSequence(sequence);
        
        for (const action of actions) {
            if (action.type === 'key') {
                const key = action.value as string;
                if (!validKeys.has(key)) {
                    errors.push(`Invalid key: ${key}. Valid keys: ${Array.from(validKeys).join(', ')}`);
                }
            } else if (action.type === 'pause') {
                const seconds = action.value as number;
                if (seconds < 0 || seconds > 300) {
                    errors.push(`Invalid pause duration: ${seconds}. Must be between 0 and 300 seconds`);
                }
            }
        }
        
        return { valid: errors.length === 0, errors };
    }

    public getSequenceInfo(sequence: string): {
        totalActions: number;
        keyActions: number;
        pauseActions: number;
        estimatedDuration: number;
    } {
        const actions = this.parseSequence(sequence);
        let keyActions = 0;
        let pauseActions = 0;
        let totalPauseTime = 0;
        
        for (const action of actions) {
            if (action.type === 'key') {
                keyActions++;
            } else {
                pauseActions++;
                totalPauseTime += action.value as number;
            }
        }
        
        // Estimate 1 second per keypress + pause time
        const estimatedDuration = keyActions * 1 + totalPauseTime;
        
        return {
            totalActions: actions.length,
            keyActions,
            pauseActions,
            estimatedDuration
        };
    }

    public toScenario(): any {
        const state = this.stateManager?.getState();
        
        return {
            uuid: `test-sequence-runner-${Date.now()}`,
            objectType: 'TestSequenceRunner',
            version: '0.1.0.1',
            state: {
                initialized: this.keyHandler !== null,
                testMode: state?.testMode || false,
                keyboardEnabled: state?.keyboardEnabled || true
            }
        };
    }
}
