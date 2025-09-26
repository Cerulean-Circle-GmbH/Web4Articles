/**
 * Web4 Requirement CLI - Simplified
 */

import { DefaultRequirement } from './DefaultRequirement.js';
// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

export class RequirementCLI {
  private projectRoot: string;

  constructor() {
    // Find project root by looking for .git directory
    this.projectRoot = process.cwd();
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(path.join(dir, '.git'))) {
        this.projectRoot = dir;
        break;
      }
      dir = path.dirname(dir);
    }
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];

    switch (command) {
      case 'create':
        await this.handleCreate(args.slice(1));
        break;
      case 'list':
        await this.handleList();
        break;
      case 'find':
        await this.handleFind(args.slice(1));
        break;
      case 'update':
        await this.handleUpdate(args.slice(1));
        break;
      default:
        console.error(`Unknown command: ${command}`);
        this.showUsage();
    }
  }

  private showUsage(): void {
    console.log(`
🚀 Web4Requirement CLI - Simplified Version

Usage: requirement <command> [options]

Commands:
  create <title> <description>  Create a new requirement
  list                         List all requirements
  find <search-term>          Find requirements by content
  update <uuid> <field> <value> Update an existing requirement

Fields for update: title, description, status, priority

Examples:
  requirement create "User Login" "Users must be able to log in"
  requirement list
  requirement find "authentication"
  requirement update abc-123 title "New Title"
  requirement update abc-123 status completed
`);
  }

  private async handleCreate(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: requirement create <title> <description>');
      return;
    }

    const title = args[0];
    const description = args.slice(1).join(' ');

    try {
      const requirement = DefaultRequirement.create(title, description);
      const uuid = requirement.toScenario().ior.uuid;
      
      // Create directories
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      const mdDir = path.join(this.projectRoot, 'spec', 'requirements.md');
      await fs.mkdir(specDir, { recursive: true });
      await fs.mkdir(mdDir, { recursive: true });

      // Save scenario
      const scenarioPath = path.join(specDir, `${uuid}.scenario.json`);
      await requirement.saveToFile(scenarioPath);

      // Save markdown view
      const mdPath = path.join(mdDir, `${uuid}.requirement.md`);
      await fs.writeFile(mdPath, requirement.toMarkdown(), 'utf-8');

      console.log(`✅ Requirement created successfully`);
      console.log(`📋 UUID: ${uuid}`);
      console.log(`📄 Title: ${title}`);
      console.log(`💾 Saved to: ${scenarioPath}`);

    } catch (error) {
      console.error(`❌ Error creating requirement: ${(error as Error).message}`);
    }
  }

  private async handleList(): Promise<void> {
    try {
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      
      if (!existsSync(specDir)) {
        console.log('No requirements found.');
        return;
      }

      const files = await fs.readdir(specDir);
      const requirements = [];

      for (const file of files) {
        if (file.endsWith('.scenario.json')) {
          const filePath = path.join(specDir, file);
          try {
            const requirement = await DefaultRequirement.loadFromFile(filePath);
            requirements.push(requirement.getInfo());
          } catch (e) {
            console.warn(`⚠️  Skipping invalid file: ${file}`);
          }
        }
      }

      if (requirements.length === 0) {
        console.log('No requirements found.');
        return;
      }

      console.log(`\n📋 Requirements (${requirements.length} total)\n`);
      
      for (const req of requirements) {
        console.log(`${req.uuid} - ${req.title}`);
        console.log(`  Status: ${req.status} | Priority: ${req.priority}`);
        if (req.tags.length > 0) {
          console.log(`  Tags: ${req.tags.join(', ')}`);
        }
        console.log();
      }

    } catch (error) {
      console.error(`❌ Error listing requirements: ${(error as Error).message}`);
    }
  }

  private async handleFind(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement find <search-term>');
      return;
    }

    const searchTerm = args.join(' ').toLowerCase();
    console.log(`🔍 Searching for: "${searchTerm}"`);

    try {
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      
      if (!existsSync(specDir)) {
        console.log('No requirements found.');
        return;
      }

      const files = await fs.readdir(specDir);
      const matches = [];

      for (const file of files) {
        if (file.endsWith('.scenario.json')) {
          const filePath = path.join(specDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          
          if (content.toLowerCase().includes(searchTerm)) {
            try {
              const requirement = await DefaultRequirement.loadFromFile(filePath);
              matches.push(requirement.getInfo());
            } catch (e) {
              // Skip invalid files
            }
          }
        }
      }

      if (matches.length === 0) {
        console.log('No requirements found matching the search term.');
        return;
      }

      console.log(`\n📋 Found ${matches.length} requirements matching "${searchTerm}":\n`);
      
      for (const req of matches) {
        console.log(`${req.uuid} - ${req.title}`);
      }

    } catch (error) {
      console.error(`❌ Error searching requirements: ${(error as Error).message}`);
    }
  }

  private async handleUpdate(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ Usage: requirement update <uuid> <field> <value>');
      console.error('Fields: title, description, status, priority');
      return;
    }

    const [uuid, field, ...valueParts] = args;
    const value = valueParts.join(' ');

    try {
      const requirement = await DefaultRequirement.update(
        uuid, field, value, this.projectRoot
      );
      
      console.log(`✅ Requirement ${uuid} updated`);
      console.log(`📋 ${field}: ${value}`);
    } catch (error) {
      console.error(`❌ Error updating requirement: ${(error as Error).message}`);
    }
  }
}

// CLI entry point
const cli = new RequirementCLI();
const args = process.argv.slice(2);
cli.handleCommand(args).catch(console.error);