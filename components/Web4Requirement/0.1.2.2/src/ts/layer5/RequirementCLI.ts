/**
 * Web4Requirement Command Line Interface - Layer 5 (User Experience)
 * 
 * Provides CLI interface for Web4Requirement component operations
 */

import { DefaultRequirement } from '../layer2/DefaultRequirement.js';
import * as fs from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

export class RequirementCLI {
  private requirement: DefaultRequirement;
  private projectRoot: string;

  constructor() {
    // Get directory context from environment variable set by shell script
    const directoryContext = process.env.DIRECTORY_CONTEXT || 'arbitrary:' + process.cwd();
    this.requirement = new DefaultRequirement();
    (this.requirement as any).setDirectoryContext(directoryContext);
    
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
    if (args.length < 1) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    // Check for 'on' command with component context
    if (command === 'on' && args.length >= 4) {
      const component = args[1];
      const version = args[2]; 
      const actualCommand = args[3];
      const actualArgs = args.slice(4);
      
      // Set component context
      this.requirement.on(component, version);
      
      // Execute the actual command with component context
      switch (actualCommand) {
        case 'create':
          await this.handleCreate(actualArgs);
          break;
        case 'md':
          await this.handleMDView(actualArgs);
          break;
        case 'set':
          await this.handleSet(actualArgs);
          break;
        case 'update':
          await this.handleUpdate(actualArgs);
          break;
        case 'mv':
          await this.handleMove(actualArgs);
          break;
        case 'delete':
          await this.handleDelete(actualArgs);
          break;
        default:
          console.error(`Unknown command after 'on': ${actualCommand}`);
          this.showUsage();
      }
      return;
    }
    
    // Handle regular commands (without 'on')
    if (args.length < 2 && command !== 'on') {
      this.showUsage();
      return;
    }
    
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
      case 'delete':
        await this.handleDelete(args.slice(1));
        break;
      case 'find':
        await this.handleFind(args.slice(1));
        break;
      case 'replace':
        await this.handleReplace(args.slice(1));
        break;
      case 'process-file':
        await this.handleProcessFile(args.slice(1));
        break;
      case 'on':
        console.error('❌ "on" command requires: on <component> <version> <command> [args...]');
        this.showUsage();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        this.showUsage();
    }
  }

  private async handleDelete(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('Error: delete command requires identifier (UUID, scenario file, or MD file)');
      console.log('Usage: requirement delete <uuid|scenario.json|requirement.md>');
      console.log('Examples:');
      console.log('  requirement delete 12345678-1234-1234-1234-123456789abc');
      console.log('  requirement delete path/to/scenario.json');
      console.log('  requirement delete path/to/requirement.md');
      return;
    }

    const identifier = args[0];
    console.log(`🗑️  Attempting to delete requirement: ${identifier}`);

    const result = await this.requirement.deleteRequirement(identifier);
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
      if (result.deletedFiles) {
        console.log(`📁 Deleted files: ${result.deletedFiles.length}`);
        result.deletedFiles.forEach(file => console.log(`   - ${file}`));
      }
    } else {
      console.error(`❌ ${result.message}`);
      if (result.issues) {
        result.issues.forEach(issue => console.error(`   - ${issue}`));
      }
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
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4Requirement CLI Tool${reset} ${green}- Component-Context Aware Requirements Management${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}requirement${reset} create ${yellow}"title"${reset} ${yellow}"description"${reset}                    ${green}# Create new requirement${reset}`);
    console.log(`  ${cyan}requirement${reset} on ${yellow}<component>${reset} ${yellow}<version>${reset} create ${yellow}"title"${reset} ${yellow}"description"${reset} ${green}# Create in component context${reset}`);
    console.log(`  ${cyan}requirement${reset} md ${yellow}<scenario-file.json>${reset} [${yellow}output-directory${reset}]           ${green}# Generate markdown view${reset}`);
    console.log(`  ${cyan}requirement${reset} set ${yellow}<uuid>${reset} ${yellow}<key>${reset} ${yellow}<value>${reset}                        ${green}# Set requirement property${reset}`);
    console.log(`  ${cyan}requirement${reset} update overview                                   ${green}# Generate requirements overview${reset}`);
    console.log(`  ${cyan}requirement${reset} mv ${yellow}<uuid>${reset} ${yellow}<component>${reset} ${yellow}<version>${reset}                  ${green}# Move requirement to component${reset}`);
    console.log(`  ${cyan}requirement${reset} delete ${yellow}<uuid|scenario-file|md-file>${reset}             ${green}# Delete requirement${reset}`);
    console.log(`  ${cyan}requirement${reset} find ${yellow}<search-term>${reset}                               ${green}# Search requirements by content${reset}`);
    console.log(`  ${cyan}requirement${reset} replace ${yellow}"pattern"${reset} ${yellow}<file-path>${reset}                   ${green}# Create req and replace pattern${reset}`);
    console.log(`  ${cyan}requirement${reset} replace ${yellow}"pattern"${reset} ${yellow}<uuid>${reset} ${yellow}<file-path>${reset}           ${green}# Replace pattern with UUID${reset}`);
    console.log(`  ${cyan}requirement${reset} process-file ${yellow}<file-path>${reset}                        ${green}# Batch process all patterns${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}create${reset}       Create a new requirement with title and description`);
    console.log(`  ${bold}on${reset}           Set component context for subsequent command`);
    console.log(`  ${bold}md${reset}           Load requirement from scenario and generate MD view`);
    console.log(`  ${bold}set${reset}          Set attribute value for existing requirement`);
    console.log(`  ${bold}update${reset}       Update and regenerate components (overview)`);
    console.log(`  ${bold}mv${reset}           Move requirement files to another component`);
    console.log(`  ${bold}delete${reset}       Delete requirement by UUID, scenario file, or MD file`);
    console.log(`  ${bold}find${reset}         Search for requirements by content`);
    console.log(`  ${bold}replace${reset}      Replace requirement pattern with dual link`);
    console.log(`  ${bold}process-file${reset} Batch process all requirement patterns in file`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<uuid>${reset}           36-character UUID (e.g., 12345678-1234-1234-1234-123456789abc)`);
    console.log(`  ${yellow}<component>${reset}      Component name (e.g., User, Unit, Web4Requirement)`);
    console.log(`  ${yellow}<version>${reset}        Version string (e.g., latest, v1.0, 0.1.0.0)`);
    console.log(`  ${yellow}<key>${reset}            Property key (e.g., implemented, status, priority)`);
    console.log(`  ${yellow}<value>${reset}          Property value (e.g., true, completed, high)`);
    console.log(`  ${yellow}<file-path>${reset}      Relative path from project root (e.g., scrum.pmo/sprints/...)`);
    console.log(`  ${yellow}<pattern>${reset}        Requirement pattern (e.g., "requirement:uuid:web4-impl-001")`);
    console.log(`  ${yellow}"title"${reset}          Requirement title in quotes`);
    console.log(`  ${yellow}"description"${reset}    Detailed requirement description in quotes`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${green}# Basic requirement creation${reset}`);
    console.log(`  ${cyan}requirement${reset} create ${yellow}"Unit Architecture Fix"${reset} ${yellow}"workflows are user role specific screen transitions"${reset}`);
    console.log('');
    console.log(`  ${green}# Component context creation${reset}`);
    console.log(`  ${cyan}requirement${reset} on ${yellow}User${reset} ${yellow}latest${reset} create ${yellow}"User Component Fix"${reset} ${yellow}"Fix user authentication logic"${reset}`);
    console.log(`  ${cyan}requirement${reset} on ${yellow}Unit${reset} ${yellow}v1.0${reset} update overview`);
    console.log('');
    console.log(`  ${green}# Generate markdown views${reset}`);
    console.log(`  ${cyan}requirement${reset} md ${yellow}394d5b56-51f0-4ff8-8213-88853f387dfc.scenario.json${reset}`);
    console.log(`  ${cyan}requirement${reset} md ${yellow}394d5b56-51f0-4ff8-8213-88853f387dfc.scenario.json${reset} ${yellow}./output${reset}`);
    console.log('');
    console.log(`  ${green}# Set requirement properties${reset}`);
    console.log(`  ${cyan}requirement${reset} set ${yellow}12345678-1234-1234-1234-123456789abc${reset} ${yellow}implemented${reset} ${yellow}true${reset}`);
    console.log(`  ${cyan}requirement${reset} set ${yellow}12345678-1234-1234-1234-123456789abc${reset} ${yellow}status${reset} ${yellow}completed${reset}`);
    console.log(`  ${cyan}requirement${reset} set ${yellow}12345678-1234-1234-1234-123456789abc${reset} ${yellow}priority${reset} ${yellow}high${reset}`);
    console.log('');
    console.log(`  ${green}# Move requirements between components${reset}`);
    console.log(`  ${cyan}requirement${reset} mv ${yellow}21ce7e72${reset} ${yellow}User${reset} ${yellow}latest${reset}`);
    console.log(`  ${cyan}requirement${reset} mv ${yellow}12345678-1234-1234-1234-123456789abc${reset} ${yellow}Unit${reset} ${yellow}v2.0${reset}`);
    console.log('');
    console.log(`  ${green}# Delete requirements${reset}`);
    console.log(`  ${cyan}requirement${reset} delete ${yellow}12345678-1234-1234-1234-123456789abc${reset}`);
    console.log(`  ${cyan}requirement${reset} delete ${yellow}path/to/scenario.json${reset}`);
    console.log(`  ${cyan}requirement${reset} delete ${yellow}path/to/requirement.md${reset}`);
    console.log('');
    console.log(`  ${green}# Search requirements${reset}`);
    console.log(`  ${cyan}requirement${reset} find ${yellow}"empty constructor"${reset}`);
    console.log(`  ${cyan}requirement${reset} find ${yellow}scenario${reset}`);
    console.log(`  ${cyan}requirement${reset} find ${yellow}"TypeScript only"${reset}`);
    console.log('');
    console.log(`  ${green}# Pattern replacement (new feature)${reset}`);
    console.log(`  ${cyan}requirement${reset} replace ${yellow}"requirement:uuid:web4-impl-001"${reset} ${yellow}scrum.pmo/sprints/sprint-20/web4.requirement.md${reset}`);
    console.log(`  ${cyan}requirement${reset} replace ${yellow}"requirement:uuid:web4-impl-001"${reset} ${yellow}15685fae-ff10-45ba-ae26-ad6b8f215d8e${reset} ${yellow}scrum.pmo/sprints/sprint-20/web4.requirement.md${reset}`);
    console.log('');
    console.log(`  ${green}# Batch processing (new feature)${reset}`);
    console.log(`  ${cyan}requirement${reset} process-file ${yellow}scrum.pmo/sprints/sprint-20/web4.requirement.md${reset}`);
    console.log(`  ${cyan}requirement${reset} process-file ${yellow}components/Web4Requirement/latest/spec/requirements.md${reset}`);
    console.log('');
    console.log(`${bold}Context Detection:${reset}`);
    console.log(`  ${green}• Automatically detects if you're in a component directory${reset}`);
    console.log(`  ${green}• Requirements saved to detected component's spec/ directory${reset}`);
    console.log(`  ${green}• Use "on" command to override auto-detection${reset}`);
    console.log(`  ${green}• Supports both project-root and component-relative operations${reset}`);
    console.log('');
    console.log(`${bold}TSRanger Compatible Format:${reset}`);
    console.log(`  ${cyan}Requirement${reset} create ${yellow}"description:your requirement text here"${reset}`);
    console.log('');
    console.log(`${green}For more information, visit: https://github.com/Cerulean-Circle-GmbH/Web4Articles${reset}`);
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
    // Support both old format (2 args) and new format (3 args)
    if (args.length < 2) {
      console.error('❌ UUID and target required');
      console.error('Usage (new): mv <uuid> <component> <version>');
      console.error('Usage (old): mv <uuid> <target-component-path>');
      console.error('Examples:');
      console.error('  requirement mv 21ce7e72 User latest');
      console.error('  requirement mv 37be4307 Web4Requirement v1.0');
      console.error('  requirement mv 37be4307-8b77-4a68-a92f-da203ff8244e.scenario.json Web4Requirement');
      return;
    }

    let [uuidOrFilename, componentOrPath, version] = args;
    
    // Extract UUID from filename if needed
    let uuid = uuidOrFilename;
    if (uuid.endsWith('.scenario.json')) {
      uuid = uuid.replace('.scenario.json', '');
    }
    
    let targetPath: string;
    
    // Determine if using new 3-parameter format or old 2-parameter format
    if (args.length >= 3 && version) {
      // New format: mv <uuid> <component> <version>
      targetPath = `components/${componentOrPath}/${version}`;
      console.log(`🔄 Moving requirement ${uuid} to ${componentOrPath}/${version}`);
    } else {
      // Old format: mv <uuid> <target-path> (backward compatibility)
      targetPath = componentOrPath;
      
      // Resolve target path shortcuts for backward compatibility
    if (targetPath === 'Web4Requirement') {
      targetPath = 'components/Web4Requirement/v1.0';
    } else if (targetPath === 'Unit') {
      targetPath = 'components/Unit/latest';
      } else if (targetPath === 'User') {
        targetPath = 'components/User/latest';
      }
      
      console.log(`🔄 Moving requirement ${uuid} to ${targetPath}`);
    }

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

  private async handleFind(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement find <search-term>');
      console.log('Examples:');
      console.log('  requirement find "empty constructor"');
      console.log('  requirement find scenario');
      console.log('  requirement find IOR');
      return;
    }

    const searchTerm = args.join(' ');
    console.log(`🔍 Searching for: "${searchTerm}"`);

    try {
      const { execSync } = await import('child_process');
      
      // Search in all spec/requirements.md directories
      const searchPaths = [
        path.join(this.projectRoot, 'spec/requirements.md'),
        path.join(this.projectRoot, 'components/*/latest/spec/requirements.md'),
        path.join(this.projectRoot, 'components/*/v*/spec/requirements.md')
      ];
      
      // Use grep to search efficiently
      const grepCmd = `find ${this.projectRoot} -path "*/spec/requirements.md/*.requirement.md" -type f 2>/dev/null | xargs grep -l -i "${searchTerm}" 2>/dev/null || true`;
      
      const stdout = execSync(grepCmd, { encoding: 'utf8' });
      const files = stdout.trim().split('\n').filter(Boolean);
      
      if (files.length === 0) {
        console.log('No requirements found matching the search term.');
        return;
      }
      
      const uuids = new Map<string, string>();
      
      // Extract UUIDs and load names from matching files
      for (const file of files) {
        const match = file.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.requirement\.md/);
        if (match) {
          const uuid = match[1];
          try {
            // Try to load the scenario to get the name
            const scenarioPath = path.join(this.projectRoot, 'scenarios/index', uuid.substring(0, 2), uuid.substring(2, 4), `${uuid}.scenario.json`);
            if (existsSync(scenarioPath)) {
              const scenario = JSON.parse(readFileSync(scenarioPath, 'utf8'));
              uuids.set(uuid, scenario.name || 'Unnamed');
            } else {
              // If scenario not found, try to extract title from MD file
              const mdContent = readFileSync(file, 'utf8');
              const titleMatch = mdContent.match(/^#\s+(.+)$/m);
              uuids.set(uuid, titleMatch ? titleMatch[1] : 'Unnamed');
            }
          } catch (e) {
            uuids.set(uuid, 'Error loading name');
          }
        }
      }
      
      console.log(`\n📋 Found ${uuids.size} requirements matching "${searchTerm}":\n`);
      
      // Display results
      for (const [uuid, name] of uuids) {
        console.log(`  ${uuid} - ${name}`);
      }
      
      console.log('\n💡 Use "requirement delete <uuid>" to remove duplicates');
      
    } catch (error) {
      console.error(`❌ Error searching requirements: ${(error as Error).message}`);
    }
  }

  private async handleReplace(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('Error: replace command requires placeholder pattern and file path');
      console.log('Usage: requirement replace "requirement:uuid:web4-xxx-name" <file-path>');
      console.log('   or: requirement replace "requirement:uuid:web4-xxx-name" <uuid> <file-path>');
      console.log('Examples:');
      console.log('  requirement replace "requirement:uuid:web4-impl-001" scrum.pmo/sprints/sprint-20/web4.requirement.md');
      console.log('  requirement replace "requirement:uuid:web4-impl-001" 15685fae-ff10-45ba-ae26-ad6b8f215d8e scrum.pmo/sprints/sprint-20/web4.requirement.md');
      return;
    }

    const pattern = args[0];
    let targetUuid = '';
    let filePath = '';
    
    if (args.length === 2) {
      // Auto-create requirement and replace
      filePath = args[1];
      console.log(`🔍 Pattern: ${pattern}`);
      console.log(`📄 File: ${filePath}`);
      console.log('🆕 Creating new requirement for pattern...');
      
      // Extract title from pattern for requirement creation
      const title = pattern.replace(/^requirement:uuid:/, '').replace(/-/g, ' ')
                           .replace(/\b\w/g, l => l.toUpperCase());
      const description = `Web4 requirement for ${title}`;
      
      const result = await this.requirement.create(title, description);
      if (result.success && result.requirementId) {
        targetUuid = result.requirementId;
        console.log(`✅ Created requirement: ${targetUuid}`);
      } else {
        console.error('❌ Failed to create requirement');
        return;
      }
    } else {
      // Use provided UUID
      targetUuid = args[1];
      filePath = args[2];
      console.log(`🔍 Pattern: ${pattern}`);
      console.log(`🎯 Target UUID: ${targetUuid}`);
      console.log(`📄 File: ${filePath}`);
    }

    try {
      const result = await this.requirement.replaceInFile(pattern, targetUuid, filePath);
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        console.log('🔗 File updated with proper dual link');
      } else {
        console.error(`❌ ${result.message}`);
      }
    } catch (error: any) {
      console.error(`❌ Error replacing pattern: ${error.message}`);
    }
  }

  private async handleProcessFile(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('Error: process-file command requires a file path');
      console.log('Usage: requirement process-file <file-path>');
      console.log('Example: requirement process-file scrum.pmo/sprints/sprint-20/web4.requirement.md');
      console.log('');
      console.log('This command will:');
      console.log('  1. Scan file for requirement patterns like [requirement:uuid:web4-xxx-name]');
      console.log('  2. Create requirements for patterns that don\'t exist');
      console.log('  3. Replace all patterns with proper dual links');
      return;
    }

    const filePath = args[0];
    console.log(`📄 Processing file: ${filePath}`);
    console.log('🔍 Scanning for requirement patterns...');

    try {
      const result = await this.requirement.processFile(filePath);
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        console.log('🔗 File has been updated with proper dual links to the requirements');
        console.log('📁 Requirements saved to scenarios/index/ and spec/requirements/');
      } else {
        console.error(`❌ ${result.message}`);
      }
    } catch (error: any) {
      console.error(`❌ Error processing file: ${error.message}`);
    }
  }


}

// CLI entry point
const cli = new RequirementCLI();
const args = process.argv.slice(2);
cli.handleCommand(args).catch(console.error);
