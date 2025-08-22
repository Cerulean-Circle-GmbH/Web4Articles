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
    // Get directory context from environment variable set by shell script
    const directoryContext = process.env.DIRECTORY_CONTEXT || 'arbitrary:' + process.cwd();
    this.requirement = new DefaultRequirement();
    (this.requirement as any).setDirectoryContext(directoryContext);
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
      case 'md':
        await this.handleMDView(args.slice(1));
        break;
      case 'set':
        await this.handleSet(args.slice(1));
        break;
      case 'update':
        await this.handleUpdate(args.slice(1));
        break;
      case 'mv':
        await this.handleMove(args.slice(1));
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
        await this.saveScenario(result.requirementId || 'unknown', result.scenario);
        console.log(`💾 Scenario saved: ${result.requirementId}.scenario.json`);
        
        // Auto-generate MD view - let DefaultRequirement handle directory structure
        const requirementId = result.requirementId || 'unknown';
        const mdResult = await this.requirement.saveMDView();
        
        if (mdResult.success) {
          console.log(`📄 MD view auto-generated: ${mdResult.message}`);
        } else {
          console.error(`⚠️ MD view generation failed: ${mdResult.message}`);
        }
      } else {
        console.error('❌ Failed to create requirement');
      }
    } catch (error) {
      console.error(`❌ Error creating requirement: ${(error as Error).message}`);
    }
  }

  private async handleMDView(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('Error: md command requires scenario file path');
      console.log('Usage: requirement md <scenario-file.json> [output-directory]');
      return;
    }

    const scenarioPath = args[0];
    const outputPath = args[1];

    try {
      const loadResult = await this.requirement.loadFromScenario(scenarioPath);
      
      if (loadResult.success) {
        console.log(`✅ Requirement loaded from scenario: ${scenarioPath}`);
        console.log(`📋 UUID: ${loadResult.requirementId}`);
        console.log(`📄 Name: ${this.requirement.name}`);
        console.log(`📝 Description: ${this.requirement.getDescription()}`);

        const saveResult = await this.requirement.saveMDView(outputPath);
        
        if (saveResult.success) {
          console.log(`📄 MD view generated: ${loadResult.requirementId}.requirement.md`);
          console.log(`💾 ${saveResult.message}`);
        } else {
          console.error(`❌ Failed to save MD view: ${saveResult.message}`);
        }
      } else {
        console.error(`❌ Failed to load scenario: ${loadResult.message}`);
        if (loadResult.issues) {
          loadResult.issues.forEach(issue => console.error(`   - ${issue}`));
        }
      }
    } catch (error) {
      console.error(`❌ Error processing MD view: ${(error as Error).message}`);
    }
  }

  private async saveScenario(uuid: string, scenario: any): Promise<void> {
    // Let DefaultRequirement handle the proper directory structure
    await (this.requirement as any).saveScenario(uuid, scenario);
  }

  private showUsage(): void {
    console.log('Web4Requirement CLI Tool');
    console.log('');
    console.log('Usage:');
    console.log('  requirement create "title" "description"');
    console.log('  requirement md <scenario-file.json> [output-directory]');
    console.log('');
    console.log('Commands:');
    console.log('  create     Create a new requirement with title and description');
    console.log('  md         Load requirement from scenario and generate MD view');
    console.log('  set        Set attribute value for existing requirement');
    console.log('  update     Update and regenerate components (overview)');
    console.log('  mv         Move requirement files to another component');
    console.log('');
    console.log('Examples:');
    console.log('  requirement create "Unit Architecture Fix" "workflows are user role specific screen transitions"');
    console.log('  requirement md 394d5b56-51f0-4ff8-8213-88853f387dfc.scenario.json');
    console.log('  requirement set 12345678-1234-1234-1234-123456789abc implemented true');
    console.log('  requirement update overview');
    console.log('  requirement mv 37be4307-8b77-4a68-a92f-da203ff8244e ../../../../Web4Requirement/v1.0');
    console.log('');
    console.log('TSRanger Compatible Format:');
    console.log('  Requirement create "description:your requirement text here"');
  }

  private async handleSet(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ UUID, attribute, and value required for set command');
      console.error('Usage: set <uuid> <attribute> <value>');
      console.error('Example: set 12345678-1234-1234-1234-123456789abc implemented true');
      return;
    }

    const [uuid, attribute, value] = args;
    
    try {
      const requirement = new DefaultRequirement();
      
      // Try to load from existing scenario  
      const scenarioPath = `spec/requirements/${uuid}.scenario.json`;
      const loadResult = await requirement.loadFromScenario(scenarioPath);
      
      if (!loadResult.success) {
        console.error(`❌ Failed to load requirement ${uuid}: ${loadResult.message}`);
        return;
      }
      
      // Set the attribute
      const setResult = await requirement.set(attribute, value);
      
      if (setResult.success) {
        console.log(`✅ ${setResult.message}`);
      } else {
        console.error(`❌ ${setResult.message}`);
        if (setResult.issues) {
          setResult.issues.forEach(issue => console.error(`   - ${issue}`));
        }
      }
    } catch (error) {
      console.error(`❌ Failed to set attribute: ${(error as Error).message}`);
    }
  }

  private async handleUpdate(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Update target required');
      console.error('Usage: update <target>');
      console.error('Available targets: overview');
      console.error('Example: update overview');
      return;
    }

    const target = args[0].toLowerCase();

    switch (target) {
      case 'overview':
        await this.handleUpdateOverview();
        break;
      default:
        console.error(`❌ Unknown update target: ${target}`);
        console.error('Available targets: overview');
        break;
    }
  }

  private async handleUpdateOverview(): Promise<void> {
    try {
      const requirement = new DefaultRequirement();
      const result = await requirement.updateOverview();
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
      } else {
        console.error(`❌ ${result.message}`);
        if (result.issues) {
          result.issues.forEach(issue => console.error(`   - ${issue}`));
        }
      }
    } catch (error) {
      console.error(`❌ Failed to update overview: ${(error as Error).message}`);
    }
  }

  private async handleMove(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ UUID and target component path required');
      console.error('Usage: mv <uuid> <target-component-path>');
      console.error('Example: mv 37be4307-8b77-4a68-a92f-da203ff8244e ../../../../Web4Requirement/v1.0');
      return;
    }

    const [uuid, targetPath] = args;

    try {
      const requirement = new DefaultRequirement();
      const result = await requirement.moveToComponent(uuid, targetPath);
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        console.log('📋 Both source and target overviews updated');
      } else {
        console.error(`❌ ${result.message}`);
        if (result.issues) {
          result.issues.forEach(issue => console.error(`   - ${issue}`));
        }
      }
    } catch (error) {
      console.error(`❌ Failed to move requirement: ${(error as Error).message}`);
    }
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new RequirementCLI();
  const args = process.argv.slice(2);
  cli.handleCommand(args).catch(console.error);
}
