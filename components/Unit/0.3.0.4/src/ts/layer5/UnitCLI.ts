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
    // Initialize unit with empty scenario (Web4 pattern)
    const emptyScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Unit', version: '0.3.0.4' },
      owner: '',
      model: {
        uuid: crypto.randomUUID(),
        name: '',
        origin: '',
        definition: '',
        indexPath: '',
        symlinkPaths: [],
        namedLinks: [],
        executionCapabilities: ['transform', 'validate', 'process'],
        storageCapabilities: ['scenarios', 'ld-links'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    this.unit.init(emptyScenario);
  }

  private showUsage(): void {
    console.log('Web4 Unit CLI Tool v0.3.0.4 - Atomic Execution Elements');
    console.log('');
    console.log('Usage:');
    console.log('  unit create <name> [description]                # Create unit');
    console.log('  unit link <uuid> <filename>                     # Create link to existing unit');
    console.log('  unit list <uuid>                                # List all links to unit');
    console.log('  unit origin <uuid>                              # Show origin and definition links');
    console.log('  unit from <filename> <start:line,column> <end:line,column>  # Create unit from source');
    console.log('  unit definition <uuid> <filename> <start:line,column> <end:line,column>  # Add definition');
    console.log('  unit execute <name> <input>                     # Execute unit');
    console.log('  unit info                                       # Show unit info');
    console.log('  unit help                                       # Show this help');
    console.log('');
    console.log('Commands:');
    console.log('  create       Create new unit with name and optional description');
    console.log('  link         Create new LD link to existing unit in different location');
    console.log('  list         List all LD links pointing to specific unit UUID');
    console.log('  origin       Show origin and definition source links as clickable URLs');
    console.log('  from         Create unit from file text with extracted name and origin');
    console.log('  definition   Add definition source reference to existing unit');
    console.log('  execute      Execute unit with input data');
    console.log('  info         Display current unit information and scenario');
    console.log('  help         Show this help message');
    console.log('');
    console.log('Parameters:');
    console.log('  <name>        Unit name for identification (required for create)');
    console.log('  <uuid>        Unit UUID for link operations (8+ characters accepted)');
    console.log('  <filename>    File name for links or source references');
    console.log('  <start:line,column>  Start position in file (line:column format)');
    console.log('  <end:line,column>    End position in file (line:column format)');
    console.log('  <description> Optional description for unit creation');
    console.log('  <input>       JSON input data for unit execution');
    console.log('');
    console.log('Examples:');
    console.log('  unit create test-unit "Test description"        # Create unit');
    console.log('  unit link a1b2c3d4-e5f6 auth-validator         # Create link to existing unit');
    console.log('  unit list a1b2c3d4-e5f6                        # List all links to unit');
    console.log('  unit origin a1b2c3d4-e5f6                      # Show source links');
    console.log('  unit from UserValidator.ts 42:15 67:23         # Create from source');
    console.log('  unit definition a1b2c3d4-e5f6 UserValidator.ts 1250 1890  # Add definition');
    console.log('  unit execute test-unit \'{"data": "test"}\'      # Execute unit');
    console.log('  unit info                                      # Show details');
    console.log('');
    console.log('Web4 Integration:');
    console.log('  Unit operates as atomic Web4 element with terminal identification (uni-t).');
    console.log('  All units use central UUID storage with LD links tracking and source traceability.');
    console.log('  GitTextIOR format enables complete source reference with ior:git:text:giturl.');
    console.log('');
  }

  private async createUnit(name: string, description: string = ''): Promise<void> {
    // Add execution capability for the named unit
    this.unit.addExecutionCapability(name);
    
    const scenario = await this.unit.toScenario(name);
    console.log(`✅ Unit created: ${name}`);
    console.log(`   UUID: ${scenario.ior.uuid}`);
    console.log(`   Index Path: ${scenario.model.indexPath}`);
    console.log(`   Named Link: ${name}.unit`);
  }

  private async executeUnit(name: string, inputJson: string): Promise<void> {
    try {
      const input = JSON.parse(inputJson);
      const result = this.unit.transform(input);
      
      console.log(`✅ Unit executed: ${name}`);
      console.log(`   Result:`, JSON.stringify(result, null, 2));
    } catch (error) {
      throw new Error(`Failed to execute unit: ${(error as Error).message}`);
    }
  }

  private async showInfo(): Promise<void> {
    const scenario = await this.unit.toScenario();
    
    console.log(`${'\x1b[36m'}Current Unit Information:${'\x1b[0m'}`);
    console.log(`  UUID: ${scenario.ior.uuid}`);
    console.log(`  Index Path: ${scenario.model.indexPath}`);
    console.log(`  Execution Capabilities: ${scenario.model.executionCapabilities.join(', ')}`);
    console.log(`  Storage Capabilities: ${scenario.model.storageCapabilities.join(', ')}`);
    console.log(`  Symlink Paths: ${scenario.model.symlinkPaths.length} links`);
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

        case 'link':
          if (commandArgs.length < 2) {
            throw new Error('UUID and filename required for link command');
          }
          await this.unit.link(commandArgs[0], commandArgs[1]);
          break;

        case 'list':
          if (commandArgs.length < 1) {
            throw new Error('UUID required for list command');
          }
          await this.unit.list(commandArgs[0]);
          break;

        case 'from':
          if (commandArgs.length < 3) {
            throw new Error('Filename, start position, and end position required for from command');
          }
          await this.unit.from(commandArgs[0], commandArgs[1], commandArgs[2]);
          break;

        case 'origin':
          if (commandArgs.length < 1) {
            throw new Error('UUID required for origin command');
          }
          await this.unit.origin(commandArgs[0]);
          break;

        case 'definition':
          if (commandArgs.length < 4) {
            throw new Error('UUID, filename, start position, and end position required for definition command');
          }
          await this.unit.definition(commandArgs[0], commandArgs[1], commandArgs[2], commandArgs[3]);
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