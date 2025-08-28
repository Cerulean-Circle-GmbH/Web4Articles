/**
 * Web4Requirement CLI v0.1.4.0 - Merged Enhanced Version
 * Combines complete architecture from v1.1.0 with enhanced CLI features from v0.1.2.2
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync, readFileSync } from 'fs';
import { View } from '../layer3/View.js';
import { Requirement } from '../layer3/Requirement.js';
import { DefaultRequirement } from '../layer2/DefaultRequirement.js';
import { RequirementOverview } from './RequirementOverview.js';

export class RequirementCLI {
  private requirement: DefaultRequirement;
  private projectRoot: string;

  constructor() {
    // Get directory context from environment variable set by shell script
    const directoryContext = process.env.DIRECTORY_CONTEXT || 'arbitrary:' + process.cwd();
    this.requirement = new DefaultRequirement();
    (this.requirement as any).setDirectoryContext(directoryContext);
    
    // Enhanced project root discovery (from 0.1.2.2)
    this.projectRoot = this.findProjectRoot();
  }

  private findProjectRoot(): string {
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(path.join(dir, '.git'))) {
        // Verify it's Web4Articles project by checking for key files
        if (existsSync(path.join(dir, 'package.json')) || 
            existsSync(path.join(dir, 'README.md')) ||
            existsSync(path.join(dir, 'components'))) {
          return dir;
        }
      }
      dir = path.dirname(dir);
    }
    return process.cwd(); // fallback
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    try {
      switch (command) {
        case 'create':
          await this.handleCreate(args.slice(1));
          break;
        case 'list':
          await this.handleList(args.slice(1));
          break;
        case 'find':
          await this.handleFind(args.slice(1));
          break;
        case 'update':
          await this.handleUpdate(args.slice(1));
          break;
        case 'generate-overview':
          await this.handleGenerateOverview(args.slice(1));
          break;
        case 'view':
          await this.handleView(args.slice(1));
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showUsage();
          return;
      }
    } catch (error) {
      console.error(`❌ Error executing command: ${(error as Error).message}`);
    }
  }

  private showUsage(): void {
    console.log(`
🚀 Web4Requirement CLI v0.1.4.0 - Enhanced Merged Version

Usage: requirement <command> [options]

Commands:
  create <title> <description>      Create a new requirement
  list [filter]                    List all requirements with optional filter  
  find <search-term>               Find requirements by content
  update <uuid> <field> <value>    Update an existing requirement
  generate-overview [output-dir]   Generate requirements overview
  view <uuid> [format]             View a specific requirement

Fields for update: title, description, status, priority, tags

Examples:
  requirement create "User Login" "Users must be able to log in"
  requirement list
  requirement list status=pending
  requirement find "authentication" 
  requirement update abc-123 title "New Title"
  requirement update abc-123 status completed
  requirement generate-overview ./docs
  requirement view abc-123 markdown

🏗️  This CLI automatically builds dependencies on first run.
🧹 Use 'npm run clean' in component directory to reset build state.
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
      // Create new requirement using DefaultRequirement
      const requirement = new DefaultRequirement();
      await requirement.initializeFromTitleAndDescription(title, description);
      
      const uuid = requirement.getIor().uuid;
      
      // Create directories relative to project root
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      const mdDir = path.join(this.projectRoot, 'spec', 'requirements.md');
      await fs.mkdir(specDir, { recursive: true });
      await fs.mkdir(mdDir, { recursive: true });

      // Save scenario file
      const scenarioPath = path.join(specDir, `${uuid}.scenario.json`);
      await requirement.saveToFile(scenarioPath);

      // Generate and save markdown view
      const view = new View();
      const mdContent = await view.generateRequirementMarkdown(requirement);
      const mdPath = path.join(mdDir, `${uuid}.requirement.md`);
      await fs.writeFile(mdPath, mdContent, 'utf-8');

        console.log(`✅ Requirement created successfully`);
      console.log(`📋 UUID: ${uuid}`);
        console.log(`📄 Title: ${title}`);
      console.log(`📁 Saved to: ${scenarioPath}`);
      console.log(`📝 Markdown: ${mdPath}`);

    } catch (error) {
      console.error(`❌ Error creating requirement: ${(error as Error).message}`);
    }
  }

  private async handleList(args: string[]): Promise<void> {
    try {
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      
      if (!existsSync(specDir)) {
        console.log('📂 No requirements directory found.');
        console.log(`💡 Create your first requirement with: requirement create "Title" "Description"`);
      return;
    }

      const files = await fs.readdir(specDir);
      const requirements = [];

      // Parse optional filter (e.g., status=pending, priority=high)
      const filter = args.length > 0 ? args[0] : null;
      let filterField: string | null = null;
      let filterValue: string | null = null;
      
      if (filter && filter.includes('=')) {
        [filterField, filterValue] = filter.split('=');
      }

      for (const file of files) {
        if (file.endsWith('.scenario.json')) {
          const filePath = path.join(specDir, file);
          try {
            const requirement = new DefaultRequirement();
            await requirement.loadFromFile(filePath);
            const info = requirement.getInfo();
            
            // Apply filter if specified
            if (filterField && filterValue) {
              const fieldValue = (info as any)[filterField];
              if (fieldValue !== filterValue) {
                continue;
              }
            }
            
            requirements.push(info);
          } catch (e) {
            console.warn(`⚠️  Skipping invalid file: ${file}`);
          }
        }
      }

      if (requirements.length === 0) {
        if (filterField) {
          console.log(`📋 No requirements found matching ${filterField}=${filterValue}`);
        } else {
          console.log('📋 No requirements found.');
        }
        return;
      }

      const filterText = filterField ? ` (filtered by ${filterField}=${filterValue})` : '';
      console.log(`\n📋 Requirements (${requirements.length} total${filterText})\n`);
      
      for (const req of requirements) {
        console.log(`${req.uuid} - ${req.title}`);
        console.log(`  Status: ${req.status} | Priority: ${req.priority}`);
        if (req.tags && req.tags.length > 0) {
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
        console.log('📂 No requirements directory found.');
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
              const requirement = new DefaultRequirement();
              await requirement.loadFromFile(filePath);
              matches.push(requirement.getInfo());
            } catch (e) {
              // Skip invalid files
            }
          }
        }
      }

      if (matches.length === 0) {
        console.log(`🔍 No requirements found matching "${searchTerm}"`);
        return;
      }

      console.log(`\n📋 Found ${matches.length} requirements matching "${searchTerm}":\n`);
      
      for (const req of matches) {
        console.log(`${req.uuid} - ${req.title}`);
        console.log(`  Status: ${req.status} | Priority: ${req.priority}`);
      }

    } catch (error) {
      console.error(`❌ Error searching requirements: ${(error as Error).message}`);
    }
  }

  private async handleUpdate(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ Usage: requirement update <uuid> <field> <value>');
      console.error('📝 Fields: title, description, status, priority, tags');
      return;
    }

    const [uuid, field, ...valueParts] = args;
    const value = valueParts.join(' ');

    try {
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      const filePath = path.join(specDir, `${uuid}.scenario.json`);
      
      if (!existsSync(filePath)) {
        console.error(`❌ Requirement not found: ${uuid}`);
        return;
      }

      const requirement = new DefaultRequirement();
      await requirement.loadFromFile(filePath);
      
      // Update the field
      await requirement.updateField(field, value);
      
      // Save back to file
      await requirement.saveToFile(filePath);
      
      // Update markdown view
      const view = new View();
      const mdContent = await view.generateRequirementMarkdown(requirement);
      const mdDir = path.join(this.projectRoot, 'spec', 'requirements.md');
      const mdPath = path.join(mdDir, `${uuid}.requirement.md`);
      await fs.writeFile(mdPath, mdContent, 'utf-8');
      
      console.log(`✅ Requirement ${uuid} updated`);
      console.log(`📝 ${field}: ${value}`);

    } catch (error) {
      console.error(`❌ Error updating requirement: ${(error as Error).message}`);
    }
  }

  private async handleGenerateOverview(args: string[]): Promise<void> {
    try {
      const outputDir = args.length > 0 ? args[0] : path.join(this.projectRoot, 'spec', 'requirements.md');
      
      const overview = new RequirementOverview();
      const result = await overview.generateOverview(this.projectRoot, outputDir);
      
      console.log('✅ Requirements overview generated');
      console.log(`📄 Output: ${result.outputPath}`);
      console.log(`📊 Statistics: ${result.stats.total} requirements, ${result.stats.completed} completed`);

    } catch (error) {
      console.error(`❌ Error generating overview: ${(error as Error).message}`);
    }
  }

  private async handleView(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement view <uuid> [format]');
      return;
    }

    const uuid = args[0];
    const format = args[1] || 'summary';

    try {
      const specDir = path.join(this.projectRoot, 'spec', 'requirements');
      const filePath = path.join(specDir, `${uuid}.scenario.json`);
      
      if (!existsSync(filePath)) {
        console.error(`❌ Requirement not found: ${uuid}`);
        return;
      }

      const requirement = new DefaultRequirement();
      await requirement.loadFromFile(filePath);
      
      const view = new View();
      
      switch (format.toLowerCase()) {
        case 'json':
          console.log(JSON.stringify(requirement.toJson(), null, 2));
          break;
        case 'markdown':
          const mdContent = await view.generateRequirementMarkdown(requirement);
          console.log(mdContent);
          break;
        default:
          const info = requirement.getInfo();
          console.log(`\n📋 Requirement: ${info.title}`);
          console.log(`🆔 UUID: ${info.uuid}`);
          console.log(`📝 Description: ${info.description}`);
          console.log(`📊 Status: ${info.status}`);
          console.log(`⚡ Priority: ${info.priority}`);
          if (info.tags && info.tags.length > 0) {
            console.log(`🏷️  Tags: ${info.tags.join(', ')}`);
          }
          console.log();
          break;
      }

    } catch (error) {
      console.error(`❌ Error viewing requirement: ${(error as Error).message}`);
    }
  }
}

// CLI entry point
  const cli = new RequirementCLI();
  const args = process.argv.slice(2);
  cli.handleCommand(args).catch(console.error);