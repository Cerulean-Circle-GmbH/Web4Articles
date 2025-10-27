#!/usr/bin/env node

/**
 * DemoComponentCLI - DemoComponent CLI implementation with auto-discovery
 * Web4 pattern: Auto-discovery CLI with chaining support
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultDemoComponent } from '../layer2/DefaultDemoComponent.js';

export class DemoComponentCLI extends DefaultCLI {
  private component: DefaultDemoComponent | null;

  constructor() {
    super();
    this.component = null;
    this.initWithComponentClass(DefaultDemoComponent, 'DemoComponent', '0.5.0.0');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new DemoComponentCLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): DefaultDemoComponent {
    if (!this.component) {
      this.component = this.getComponentInstance() as DefaultDemoComponent;
    }
    return this.component;
  }

  /**
   * DemoComponent-specific usage display using DefaultCLI dynamic generation
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
  DemoComponentCLI.start(process.argv.slice(2));
}
