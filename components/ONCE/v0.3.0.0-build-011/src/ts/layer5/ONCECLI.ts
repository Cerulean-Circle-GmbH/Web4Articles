#!/usr/bin/env node

/**
 * ONCECLI - ONCE component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Commands delegate to same-named methods in DefaultONCE implementation
 * Following TSRanger 2.2 pattern but simplified
 */

import { DefaultCLI } from '../../../../IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultONCE } from '../layer2/DefaultONCE.js';

class ONCECLI {
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
   * Run CLI with command line arguments
   */
  async run(args: string[]): Promise<void> {
    console.log('🔗 ONCE - Object Network Communication Engine v0.3.0.0');
    
    if (args.length === 0) {
      return this.cli.help([]);
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
}

// CLI entry point
async function main() {
  try {
    const cli = new ONCECLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ ONCE CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}