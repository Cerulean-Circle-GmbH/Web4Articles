#!/usr/bin/env node
/**
 * Layer 5: Message CLI
 * Web4 Message Component Command Line Interface
 */

import { DefaultMessage } from '../layer2/DefaultMessage';
import { MessageScenario } from '../layer3/Message';

class MessageCLI {
    private message: DefaultMessage;

    constructor() {
        this.message = new DefaultMessage();
    }

    async run(args: string[]): Promise<void> {
        const command = args[0];
        
        switch (command) {
            case 'create':
                await this.createMessage(args.slice(1));
                break;
            case 'acknowledge':
                await this.createAcknowledgment(args.slice(1));
                break;
            case 'help':
            case '--help':
            case '-h':
                this.showHelp();
                break;
            default:
                console.log(`Unknown command: ${command}`);
                this.showHelp();
        }
    }

    private async createMessage(args: string[]): Promise<void> {
        if (args.length < 2) {
            console.log('Usage: message create <content> <sender>');
            return;
        }

        const [content, sender] = args;
        const scenario = this.message.writeMessageScenario(content, sender, 'message');
        
        console.log('Message Scenario Created:');
        console.log(JSON.stringify(scenario, null, 2));
    }

    private async createAcknowledgment(args: string[]): Promise<void> {
        if (args.length < 2) {
            console.log('Usage: message acknowledge <original-type> <sender>');
            return;
        }

        const [originalType, sender] = args;
        const mockOriginalScenario = { uuid: 'demo-scenario', component: originalType };
        const ackScenario = this.message.createAcknowledgment(mockOriginalScenario, sender);
        
        console.log('Acknowledgment Scenario Created:');
        console.log(JSON.stringify(ackScenario, null, 2));
    }

    private showHelp(): void {
        console.log(`
Message Component CLI v0.1.0.0

Usage:
  message create <content> <sender>      Create a new message scenario
  message acknowledge <type> <sender>    Create an acknowledgment scenario
  message help                          Show this help

Examples:
  message create "Hello World" "Alice"
  message acknowledge "DemoMessage" "Bob"

Web4 Architecture:
  - Empty Constructor Pattern
  - Scenario-Based Initialization  
  - P2P Acknowledgment Support
  - Hibernation Capable
        `);
    }
}

// CLI Entry Point
async function main() {
    const cli = new MessageCLI();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        args.push('help');
    }
    
    try {
        await cli.run(args);
    } catch (error) {
        console.error('CLI Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
