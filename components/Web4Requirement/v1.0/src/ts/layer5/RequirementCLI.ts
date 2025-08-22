/**
 * Web4Requirement Command Line Interface - Layer 5 (User Experience)
 * 
 * Provides CLI interface for Web4Requirement component operations
 */

import { DefaultRequirement } from '../layer2/DefaultRequirement.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class RequirementCLI {
  private requirement: DefaultRequirement;

  constructor() {
    this.requirement = new DefaultRequirement();
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length < 2) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    switch (command) {
      case 'create':
        await this.handleCreate(args.slice(1));
        break;
      default:
        console.error(`Unknown command: ${command}`);
        this.showUsage();
    }
  }

  private async handleCreate(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('Error: create command requires title and description');
      console.log('Usage: requirement create "title" "description"');
      return;
    }

    const title = args[0];
    const description = args[1];

    try {
      const result = await this.requirement.create(title, description);
      
      if (result.success) {
        console.log(`✅ Requirement created successfully`);
        console.log(`📋 UUID: ${result.requirementId}`);
        console.log(`📄 Title: ${title}`);
        console.log(`📝 Description: ${description}`);

        // Save scenario JSON to file
        await this.saveScenario(result.requirementId, result.scenario);
        console.log(`💾 Scenario saved: ${result.requirementId}.scenario.json`);
      } else {
        console.error('❌ Failed to create requirement');
      }
    } catch (error) {
      console.error(`❌ Error creating requirement: ${error.message}`);
    }
  }

  private async saveScenario(uuid: string, scenario: any): Promise<void> {
    const filename = `${uuid}.scenario.json`;
    const scenarioJSON = JSON.stringify(scenario, null, 2);
    
    try {
      await fs.writeFile(filename, scenarioJSON, 'utf-8');
    } catch (error) {
      console.error(`Failed to save scenario file: ${error.message}`);
    }
  }

  private showUsage(): void {
    console.log('Web4Requirement CLI Tool');
    console.log('');
    console.log('Usage:');
    console.log('  requirement create "title" "description"');
    console.log('');
    console.log('Examples:');
    console.log('  requirement create "Unit Architecture Fix" "workflows are user role specific screen transitions"');
    console.log('');
    console.log('TSRanger Compatible Format:');
    console.log('  Requirement create "description:your requirement text here"');
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new RequirementCLI();
  const args = process.argv.slice(2);
  cli.handleCommand(args).catch(console.error);
}
