#!/usr/bin/env node

/**
 * Web4ProgrammerCLI - Web4Programmer CLI implementation with auto-discovery
 * Web4 pattern: Auto-discovery CLI with chaining support
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4Programmer } from '../layer2/DefaultWeb4Programmer.js';

export class Web4ProgrammerCLI extends DefaultCLI {
  private component: DefaultWeb4Programmer | null;

  constructor() {
    super();
    this.component = null;
    this.initWithComponentClass(DefaultWeb4Programmer, 'Web4Programmer', '0.2.0.3');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4ProgrammerCLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): DefaultWeb4Programmer {
    if (!this.component) {
      this.component = this.getComponentInstance() as DefaultWeb4Programmer;
    }
    return this.component;
  }

  /**
   * Web4Programmer-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with auto-discovery
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Try dynamic command execution
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return;
      }

      // Special cases
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

// Static entry point for shell execution
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4ProgrammerCLI.start(process.argv.slice(2));
}
