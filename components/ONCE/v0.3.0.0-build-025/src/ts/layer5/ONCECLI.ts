#!/usr/bin/env node

/**
 * ONCECLI - ONCE component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Commands delegate to same-named methods in DefaultONCE implementation
 * Following TSRanger 2.2 pattern but simplified
 */

import { DefaultCLI, CLIColors } from '../../../../IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultONCE } from '../layer2/DefaultONCE.js';

export class ONCECLI {
  private cli: DefaultCLI;
  private once: DefaultONCE;

  /**
   * Web4 Pattern: Empty constructor + initialization
   */
  constructor() {
    this.once = new DefaultONCE();
    this.cli = DefaultCLI.createForComponent(this.once, 'ONCE');
  }

  /**
   * Show colorful usage display using DRY CLI colors
   */
  private showUsage(): void {
    console.log(CLIColors.cliHeader('Web4 ONCE CLI Tool', 'Object Network Communication Engine'));
    console.log('');
    console.log(CLIColors.bold('Usage:'));
    console.log(CLIColors.usageLine('once', 'start', 'Start ONCE kernel'));
    console.log(CLIColors.usageLine('once', 'stop', 'Stop ONCE kernel'));
    console.log(CLIColors.usageLine('once', 'status', 'Show kernel status'));
    console.log(CLIColors.usageLine('once', 'info', 'Show kernel information'));
    console.log(CLIColors.usageLine('once', 'deinstall', 'Clean all components'));
    console.log(CLIColors.usageLine('once', 'help', 'Show this help'));
    console.log('');
    console.log(CLIColors.bold('Commands:'));
    console.log(CLIColors.commandDesc('start', 'Start ONCE kernel with 42777 service registry'));
    console.log(CLIColors.commandDesc('stop', 'Stop ONCE kernel and service registry'));
    console.log(CLIColors.commandDesc('status', 'Display kernel state and service registry status'));
    console.log(CLIColors.commandDesc('info', 'Show detailed ONCE kernel information'));
    console.log(CLIColors.commandDesc('deinstall', 'Clean all Web4 components and force rebuild'));
    console.log(CLIColors.commandDesc('help', 'Show this help message'));
    console.log('');
    console.log(CLIColors.bold('Examples:'));
    console.log(CLIColors.usageLine('once', 'start', 'Start ONCE kernel'));
    console.log(CLIColors.usageLine('once', 'deinstall', 'Clean ecosystem'));
    console.log(CLIColors.usageLine('once', 'status', 'Check kernel status'));
    console.log('');
    console.log(CLIColors.bold('Web4 Integration:'));
    console.log('  ONCE operates as Web4 component kernel with 42777 service registry.');
    console.log('  All components follow Web4 UCP patterns with scenario configuration.');
    console.log('');
  }

  /**
   * Run CLI with command line arguments
   */
  async run(args: string[]): Promise<void> {
    // Show usage if no arguments provided
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      await this.cli.execute(command, commandArgs);
    } catch (error) {
      console.error(`❌ ONCE CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Radical OOP: Static start method
   * Validates requirement: f016a180-a591-4f5b-ab50-9e6f3186da7d
   */
  static async start(args: string[] = process.argv.slice(2)): Promise<void> {
    try {
      const cli = new ONCECLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ ONCE CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// Radical OOP Entry Point - Static method call
if (import.meta.url === `file://${process.argv[1]}`) {
  ONCECLI.start();
}