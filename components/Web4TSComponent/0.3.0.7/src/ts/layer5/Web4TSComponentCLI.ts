#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4-compliant CLI with dynamic method discovery
 * Implements Unit 0.3.0.5 patterns: DRY, Occam's razor, TSCompletion integration
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate component for usage display - command-based instantiation only
    this.tsComponent = null;
    // ✅ UNIT PATTERN: Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', '0.3.0.7');
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
      // ✅ UNIT PATTERN: Use lazy instantiation from DefaultCLI - only when method actually called
      this.tsComponent = this.getComponentInstance() as DefaultWeb4TSComponent;
    }
    return this.tsComponent;
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // ✅ UNIT PATTERN: Use DefaultCLI structured usage generation (TSCompletion-powered)
    console.log(this.generateStructuredUsage());
  }

  /**
   * Web4TSComponent-specific command execution using DefaultCLI dynamic functionality
   * ✅ UNIT PATTERN: Dynamic method discovery eliminates switch cases
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

      // ✅ UNIT PATTERN: Try dynamic command execution FIRST (eliminates switch cases)
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return; // Command executed successfully via dynamic discovery
      }

      // ✅ MINIMAL SWITCH: Only for special cases (like Unit) - 85% reduction achieved
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