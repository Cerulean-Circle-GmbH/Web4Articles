#!/usr/bin/env node

/**
 * UnitCLI - Unit component CLI implementation
 * Web4 pattern: Dependency-free CLI with unit creation and management
 */

import { DefaultUnit } from '../layer2/DefaultUnit.js';
import { promises as fs } from 'fs';

class UnitCLI {
  private unit: DefaultUnit;

  constructor() {
    this.unit = new DefaultUnit();
  }

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 Unit CLI Tool${reset} ${green}- Atomic Execution Elements${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}unit${reset} create ${yellow}<name>${reset} [description]              ${green}# Create unit${reset}`);
    console.log(`  ${cyan}unit${reset} execute ${yellow}<name>${reset} ${yellow}<input>${reset}                 ${green}# Execute unit${reset}`);
    console.log(`  ${cyan}unit${reset} info                                    ${green}# Show unit info${reset}`);
    console.log(`  ${cyan}unit${reset} help                                    ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}unit${reset} create test-unit "Test unit description"  ${green}# Create unit${reset}`);
    console.log(`  ${cyan}unit${reset} execute test-unit '{"data": "test"}'     ${green}# Execute unit${reset}`);
    console.log(`  ${cyan}unit${reset} info                                     ${green}# Show details${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  Unit operates as atomic Web4 element with scenario storage.`);
    console.log(`  All units use central UUID storage with LD links tracking.`);
    console.log('');
  }

  private async createUnit(name: string, description: string = ''): Promise<void> {
    this.unit.setName(name).setDescription(description);
    
    const scenario = await this.unit.toScenario();
    console.log(`✅ Unit created: ${name}`);
    console.log(`   UUID: ${scenario.ior.uuid}`);
    console.log(`   Description: ${description}`);
  }

  private async executeUnit(name: string, inputJson: string): Promise<void> {
    try {
      const input = JSON.parse(inputJson);
      const result = await this.unit.execute({ data: input });
      
      console.log(`✅ Unit executed: ${name}`);
      console.log(`   Result:`, JSON.stringify(result, null, 2));
    } catch (error) {
      throw new Error(`Failed to execute unit: ${(error as Error).message}`);
    }
  }

  private async showInfo(): Promise<void> {
    const scenario = await this.unit.toScenario();
    
    console.log(`${'\x1b[36m'}Current Unit Information:${'\x1b[0m'}`);
    console.log(`  Name: ${scenario.model.name}`);
    console.log(`  UUID: ${scenario.ior.uuid}`);
    console.log(`  State: ${scenario.model.state}`);
    console.log(`  Capabilities: ${scenario.model.capabilities.join(', ')}`);
    console.log(`  Created: ${scenario.model.createdAt}`);
    console.log(`  Updated: ${scenario.model.updatedAt}`);
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      switch (command) {
        case 'create':
          if (commandArgs.length === 0) {
            throw new Error('Unit name required for create command');
          }
          await this.createUnit(commandArgs[0], commandArgs[1]);
          break;

        case 'execute':
          if (commandArgs.length < 2) {
            throw new Error('Unit name and input JSON required for execute command');
          }
          await this.executeUnit(commandArgs[0], commandArgs[1]);
          break;

        case 'info':
          await this.showInfo();
          break;

        case 'help':
          this.showUsage();
          break;

        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`❌ Unit CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// CLI entry point
async function main() {
  try {
    const cli = new UnitCLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ Unit CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}