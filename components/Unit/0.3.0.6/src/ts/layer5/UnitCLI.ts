#!/usr/bin/env node

/**
 * UnitCLI - Unit component CLI implementation
 * Web4 pattern: Dependency-free CLI with unit creation and management
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultUnit } from '../layer2/DefaultUnit.js';
import { TypeM3 } from '../layer3/TypeM3.enum.js';

export class UnitCLI extends DefaultCLI {
  private unit: DefaultUnit | null;

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate unit for usage display - command-based instantiation only
    this.unit = null;
    // Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultUnit, 'Unit', '0.3.0.6');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new UnitCLI();
    await cli.execute(args);
  }

  private getOrCreateUnit(): DefaultUnit {
    if (!this.unit) {
      // Use lazy instantiation from DefaultCLI - only when method actually called
      this.unit = this.getComponentInstance() as DefaultUnit;
    }
    return this.unit;
  }

  /**
   * Unit-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use new structured usage generation like requirement-v0.1.2.2
    console.log(this.generateStructuredUsage());
  }

  private async createUnit(name: string, description: string = '', typeM3String?: string): Promise<void> {
    // Validate typeM3 if provided
    let typeM3: TypeM3 | undefined;
    if (typeM3String) {
      if (Object.values(TypeM3).includes(typeM3String as TypeM3)) {
        typeM3 = typeM3String as TypeM3;
      } else {
        throw new Error(`Invalid typeM3: ${typeM3String}. Valid values: CLASS, ATTRIBUTE, RELATIONSHIP`);
      }
    }
    
    // Get or create unit instance (command-based instantiation)
    const unit = this.getOrCreateUnit();
    
    // ✅ FIX: Set name, definition, and typeM3 IMMEDIATELY to prevent warning
    unit.unitModel.name = name;
    unit.unitModel.definition = description || `Unit: ${name}`;  // ✅ Always set definition
    if (typeM3) {
      unit.unitModel.typeM3 = typeM3;  // ✅ Set MOF classification if provided
    }
    
    // ✅ FIX: Set origin to prevent warning
    unit.unitModel.origin = `Created via CLI: unit create "${name}"`;
    
    // Update timestamp after setting properties
    unit.unitModel.updatedAt = new Date().toISOString();
    
    // Add execution capability for the named unit
    unit.addExecutionCapability(name);
    
    // Convert multi-word names to filename (spaces → single dots) and set in model
    const filename = name.replace(/\s+/g, '.');
    unit.unitModel.name = filename;
    
    const scenario = await unit.toScenario();
    console.log(`✅ Unit created: ${name}`);
    console.log(`   UUID: ${scenario.ior.uuid}`);
    console.log(`   Index Path: ${scenario.model.indexPath}`);
    if (typeM3) {
      console.log(`   TypeM3: ${typeM3}`);
    }
    console.log(`\n   Named Link: ${filename}.unit`);
  }

  private async classifyUnit(uuid: string, typeM3String: string): Promise<void> {
    // Validate typeM3
    if (!Object.values(TypeM3).includes(typeM3String as TypeM3)) {
      throw new Error(`Invalid typeM3: ${typeM3String}. Valid values: CLASS, ATTRIBUTE, RELATIONSHIP`);
    }

    const typeM3 = typeM3String as TypeM3;
    
    // This would need to load existing unit from storage and update it
    // For now, show what would be done
    console.log(`✅ Unit ${uuid} would be classified as ${typeM3}`);
    console.log(`   Note: Full implementation requires unit loading from storage`);
  }

  private async executeUnit(name: string, inputJson: string): Promise<void> {
    try {
      const input = JSON.parse(inputJson);
      const unit = this.getOrCreateUnit();
      const result = unit.transform(input);
      
      console.log(`✅ Unit executed: ${name}`);
      console.log(`   Result:`, JSON.stringify(result, null, 2));
    } catch (error) {
      throw new Error(`Failed to execute unit: ${(error as Error).message}`);
    }
  }

  private async showInfo(unitFile?: string): Promise<void> {
    const unit = this.getOrCreateUnit();
    
    // If unit file specified, load it first
    if (unitFile) {
      await (unit as any).loadFromUnitFile(unitFile);
    }
    
    const scenario = await unit.toScenario();
    
    console.log(`${'\x1b[36m'}═══ Unit Information ═══${'\x1b[0m'}`);
    console.log('');
    
    // Key Information (Highlighted)
    console.log(`${'\x1b[1m'}Name:${'\x1b[0m'}       ${scenario.model.name || '\x1b[90m(not specified)\x1b[0m'}`);
    console.log(`${'\x1b[1m'}TypeM3:${'\x1b[0m'}     ${scenario.model.typeM3 || '\x1b[90m(not classified)\x1b[0m'}`);
    console.log('');
    console.log(`${'\x1b[1m'}Definition:${'\x1b[0m'}`);
    if (scenario.model.definition) {
      console.log(`${scenario.model.definition}`);
    } else {
      console.log(`${'\x1b[90m'}(not specified)${'\x1b[0m'}`);
    }
    console.log('');
    console.log(`${'\x1b[1m'}Origin:${'\x1b[0m'}     ${scenario.model.origin || '\x1b[90m(not specified)\x1b[0m'}`);
    console.log('');
    console.log(`${'\x1b[1m'}References:${'\x1b[0m'} ${scenario.model.references?.length || 0} links`);
    if (scenario.model.references && scenario.model.references.length > 0) {
      scenario.model.references.forEach((ref: any, index: number) => {
        const filename = ref.linkLocation.split('/').pop()?.replace('ior:local:ln:file:', '') || 'unknown';
        const status = ref.syncStatus === 'SYNCED' ? '\x1b[32m●\x1b[0m' : '\x1b[31m●\x1b[0m';
        console.log(`  ${index + 1}. ${status} ${filename} → ${ref.linkTarget}`);
      });
    } else {
      console.log(`    ${'\x1b[90m'}(no references)${'\x1b[0m'}`);
    }
    console.log('');
    
    // Technical Details
    console.log(`${'\x1b[90m'}Technical Details:${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  UUID:       ${scenario.ior.uuid}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Index Path: ${scenario.model.indexPath}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Created:    ${scenario.model.createdAt}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Updated:    ${scenario.model.updatedAt}${'\x1b[0m'}`);
  }


  /**
   * Unit-specific command execution implementation using DefaultCLI dynamic functionality
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

      // ✅ METHOD CHAINING: Check for chained commands FIRST
      if (await this.executeMethodChain(command, commandArgs)) {
        return; // Method chain executed successfully
      }

      // Try dynamic command execution (TSRanger 2.2 pattern)
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return; // Command executed successfully
      }

      // Special cases (non-component methods)
      switch (command) {
        case 'create':
          if (commandArgs.length < 1) {
            console.log('Usage: unit create <name> [definition] [typeM3]');
            console.log('TypeM3 values: CLASS, ATTRIBUTE, RELATIONSHIP');
            return;
          }
          await this.create(commandArgs[0], commandArgs[1], commandArgs[2]);
          break;

        case 'classify':
          if (commandArgs.length < 2) {
            console.log('Usage: unit classify <uuid> <typeM3>');
            console.log('TypeM3 values: CLASS, ATTRIBUTE, RELATIONSHIP');
            return;
          }
          await this.classify(commandArgs[0], commandArgs[1]);
          break;

        case 'info':
          const infoFile = commandArgs[0]; // Extract file parameter
          await this.showInfo(infoFile);
          break;

          
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

  /**
   * Execute method chaining from CLI arguments
   * Web4 pattern: CLI method chaining support for natural language commands
   */
  private async executeMethodChain(command: string, args: string[]): Promise<boolean> {
    // ✅ CHAINING: Parse method chain from CLI arguments
    // Example: "find Unit list" → unit.find("Unit").list()
    
    if (command === 'find' && args.length >= 2) {
      const searchTerm = args[0];
      const chainedMethods = args.slice(1);
      
      // Start with find
      const unit = this.getOrCreateUnit();
      let chainedUnit = await unit.find(searchTerm);
      
      // Execute chained methods
      for (const methodName of chainedMethods) {
        if (methodName === 'list') {
          // ✅ INTERACTIVE: Execute list with less for interactive browsing
          await this.executeInteractiveList(chainedUnit);
          return true;
        }
        // Add support for other chainable methods here
      }
      
      return true;
    }
    
    return false; // No method chain recognized
  }

  /**
   * Execute interactive list with less for browsing found references
   * Web4 pattern: Interactive reference browsing with less pager
   */
  private async executeInteractiveList(unit: DefaultUnit): Promise<void> {
    try {
      const extendedModel = (unit as any).unitModel;
      const foundRefs = extendedModel.foundReferences;
      
      if (!foundRefs || !foundRefs.files || foundRefs.files.length === 0) {
        console.log(`❌ No found references available`);
        console.log(`   💡 Use 'unit find <name>' first to discover references`);
        return;
      }
      
      console.log(`📄 Opening ${foundRefs.count} references in interactive viewer...`);
      console.log(`   💡 Use 'q' to quit, '/' to search, arrow keys to navigate\n`);
      
      // Create formatted content for less
      const { promises: fs } = await import('fs');
      const { tmpdir } = await import('os');
      const path = await import('path');
      
      const tempFile = path.join(tmpdir(), `unit-find-${foundRefs.searchTerm}-${Date.now()}.txt`);
      
      const content = [
        `🔍 Filesystem Search Results for: "${foundRefs.searchTerm}"`,
        `📊 Found ${foundRefs.count} potential references`,
        `⏰ Search completed: ${foundRefs.timestamp}`,
        '',
        '📁 Files containing references:',
        '=' .repeat(80),
        ...foundRefs.files.map((ref: any, index: number) => {
          if (typeof ref === 'object' && ref.gitTextIOR) {
            return `${(index + 1).toString().padStart(4)}: ${ref.file}:${ref.line},${ref.column} → "${ref.match}"`;
          } else {
            return `${(index + 1).toString().padStart(4)}: ${ref}`;
          }
        }),
        '',
        '💡 Usage Instructions:',
        '=' .repeat(80),
        `   unit link <uuid|lnfile> <file>              # Track specific reference`,
        `   unit from <file> <line,column> <line,column> # Create GitTextIOR unit from precise position`,
        `   unit references <uuid|lnfile>               # Show existing unit references`,
        '',
        '🔗 JEDI MODE - GitTextIOR Examples:',
        ...foundRefs.files.slice(0, 3).map((ref: any) => {
          if (typeof ref === 'object' && ref.gitTextIOR) {
            const endLine = parseInt(ref.line);
            const endColumn = parseInt(ref.column) + ref.match.length;
            return `   unit from ${ref.file} ${ref.line},${ref.column} ${endLine},${endColumn}  # Create from "${ref.match}"`;
          } else {
            return `   unit link 44443290-015c-4720-be80-c42caf842252 ${ref}`;
          }
        }),
        ''
      ].join('\n');
      
      await fs.writeFile(tempFile, content, 'utf-8');
      
      // ✅ INTERACTIVE: Open in less for paging
      const { spawn } = await import('child_process');
      const less = spawn('less', ['-R', tempFile], { stdio: 'inherit' });
      
      await new Promise((resolve) => {
        less.on('close', () => {
          // Clean up temp file
          fs.unlink(tempFile).catch(() => {});
          resolve(void 0);
        });
      });
      
    } catch (error) {
      console.error(`❌ Failed to show interactive list: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Create a new unit with name, definition, and optional TypeM3 classification
   */
  async create(name: string, definition?: string, typeM3String?: string): Promise<void> {
    // Validate typeM3 if provided
    let typeM3: TypeM3 | undefined;
    if (typeM3String) {
      if (Object.values(TypeM3).includes(typeM3String as TypeM3)) {
        typeM3 = typeM3String as TypeM3;
      } else {
        console.log(`❌ Invalid typeM3: ${typeM3String}`);
        console.log('Valid values: CLASS, ATTRIBUTE, RELATIONSHIP');
        return;
      }
    }

    const unit = this.getOrCreateUnit();
    
    // Set unit properties
    unit.unitModel.name = name;
    if (definition) {
      unit.unitModel.definition = definition;
    }
    if (typeM3) {
      unit.unitModel.typeM3 = typeM3;
    }

    // Set model name and save the unit
    const filename = name.replace(/\s+/g, '.');
    unit.unitModel.name = filename;
    
    // toScenario() now uses model.name automatically
    const scenario = await unit.toScenario();
    
    console.log(`✅ Unit created: ${name}`);
    console.log(`   UUID: ${scenario.ior.uuid}`);
    if (typeM3) {
      console.log(`   TypeM3: ${typeM3}`);
    }
    console.log(`   Index Path: ${scenario.model.indexPath}`);
    console.log(`\n   Named Link: ${filename}.unit`);
  }

  /**
   * Classify an existing unit with MOF typeM3
   */
  async classify(uuid: string, typeM3String: string): Promise<void> {
    // Validate typeM3
    if (!Object.values(TypeM3).includes(typeM3String as TypeM3)) {
      console.log(`❌ Invalid typeM3: ${typeM3String}`);
      console.log('Valid values: CLASS, ATTRIBUTE, RELATIONSHIP');
      return;
    }

    const typeM3 = typeM3String as TypeM3;
    
    // For now, show what would be done (full implementation requires loading from storage)
    console.log(`✅ Unit ${uuid} would be classified as ${typeM3}`);
    console.log(`   Note: Full implementation requires unit loading from storage`);
    console.log(`   TypeM3 Classifications:`);
    console.log(`     CLASS        - Components, classes, objects that can be instantiated`);
    console.log(`     ATTRIBUTE    - Files, properties, data that describe characteristics`);
    console.log(`     RELATIONSHIP - LD Links, associations, connections between entities`);
  }
}

// Static entry point for shell execution - Web4 radical OOP pattern
if (import.meta.url === `file://${process.argv[1]}`) {
  UnitCLI.start(process.argv.slice(2));
}