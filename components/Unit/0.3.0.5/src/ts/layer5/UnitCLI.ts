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
      this.unit = new DefaultUnit();
      // Initialize unit with empty scenario (Web4 pattern - 0.3.0.5 format)
      const emptyScenario = {
        ior: { uuid: crypto.randomUUID(), component: 'Unit', version: '0.3.0.5' },
        owner: '',
        model: {
          uuid: crypto.randomUUID(),
          name: '',
          origin: '',
          definition: '',
          typeM3: TypeM3.CLASS,
          indexPath: '',
          references: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      this.unit.init(emptyScenario);
    }
    return this.unit;
  }

  /**
   * Unit-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use DefaultCLI dynamic usage generation with TSCompletion colors
    this.generateDynamicUsage('unit', '0.3.0.5');
    
    console.log('');
    console.log(`${this.colors.bold}Web4 Integration:${this.colors.reset}`);
    console.log(`${this.colors.dim}  Unit operates as atomic Web4 element with terminal identification (uni-t).${this.colors.reset}`);
    console.log(`${this.colors.dim}  All units use central UUID storage with enhanced references array.${this.colors.reset}`);
    console.log(`${this.colors.dim}  Internal CLI architecture with DefaultCLI base class and dynamic method discovery.${this.colors.reset}`);
  }

  private async createUnit(name: string, description: string = '', typeM3String?: string): Promise<void> {
    // Get or create unit instance (command-based instantiation)
    const unit = this.getOrCreateUnit();
    
    // Validate typeM3 if provided
    let typeM3: TypeM3 | undefined;
    if (typeM3String) {
      if (Object.values(TypeM3).includes(typeM3String as TypeM3)) {
        typeM3 = typeM3String as TypeM3;
      } else {
        throw new Error(`Invalid typeM3: ${typeM3String}. Valid values: CLASS, ATTRIBUTE, RELATIONSHIP`);
      }
    }
    
    // Store name, definition, and typeM3 immediately (TRON's correction)
    unit.unitModel.name = name;
    if (description) {
      unit.unitModel.definition = description;  // ✅ Store description as definition immediately
    }
    if (typeM3) {
      unit.unitModel.typeM3 = typeM3;  // ✅ Set MOF classification if provided
    }
    
    // Add execution capability for the named unit
    unit.addExecutionCapability(name);
    
    // Convert multi-word names to filename (spaces → single dots)
    const filename = name.replace(/\s+/g, '.');
    
    const scenario = await unit.toScenario(filename);
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

  private async showInfo(): Promise<void> {
    const unit = this.getOrCreateUnit();
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
    console.log(`${'\x1b[1m'}References:${'\x1b[0m'} ${scenario.model.references.length} links`);
    if (scenario.model.references.length > 0) {
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
      // Initialize component for dynamic method discovery
      if (!this.component) {
        this.component = this.getOrCreateUnit();
        this.discoverMethods(); // Rediscover with component
      }

      // Try dynamic command execution first (TSRanger 2.2 pattern)
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
          await this.showInfo();
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

    // Save the unit
    const scenario = await unit.toScenario();
    const filename = name.replace(/\s+/g, '.');
    
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