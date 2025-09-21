#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation
 * Web4 pattern: Dependency-free CLI with component creation and management
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate tsComponent for usage display - command-based instantiation only
    this.tsComponent = null;
    // Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', '0.3.0.8');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  private getOrCreateTSComponent(): DefaultWeb4TSComponent {
    if (!this.tsComponent) {
      // Use lazy instantiation from DefaultCLI - only when method actually called
      this.tsComponent = this.getComponentInstance() as DefaultWeb4TSComponent;
    }
    return this.tsComponent;
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use new structured usage generation like requirement-v0.1.2.2
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with Unit pattern - dynamic discovery with minimal switch
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Component already initialized with class reference in constructor
      // No need to create instance for method discovery

      // Try dynamic command execution (TSRanger 2.2 pattern)
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return; // Command executed successfully
      }

      // Special cases (minimal switch - only help)
      switch (command) {
        case 'help':
          this.showUsage();
          break;
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(this.formatError((error as Error).message));
      process.exit(1);
    }
  }
}

// Static entry point for shell execution - Web4 radical OOP pattern
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4TSComponentCLI.start(process.argv.slice(2));
}