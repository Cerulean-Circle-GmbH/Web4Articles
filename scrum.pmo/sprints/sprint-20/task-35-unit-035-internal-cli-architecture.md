[Back to Planning Sprint 20](./planning.md)

# Task 35: Unit 0.3.0.5 Internal CLI Architecture with Static Start Pattern

## Naming Conventions
- Tasks: `task-<number>-<short-description>.md`
- Subtasks: `task-<number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-35.1-developer-cli-interface-implementation.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done

**Achievement:** Unit 0.3.0.5 CLI architecture with DefaultCLI base class and static start pattern fully implemented

## Traceability
- Source: Unit Internal CLI Architecture Design with Web4 Radical OOP Compliance
- **Up:**
  - [Unit Internal CLI Architecture PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0315-unit-internal-cli-architecture.pdca.md)
- **Down:**
  - [ ] [Task 35.1: Developer - CLI Interface Implementation](./task-35.1-developer-cli-interface-implementation.md)
  - [ ] [Task 35.2: Developer - DefaultCLI Base Class Implementation](./task-35.2-developer-defaultcli-base-implementation.md)
  - [ ] [Task 35.3: Developer - UnitCLI Extension Implementation](./task-35.3-developer-unitcli-extension-implementation.md)
  - [ ] [Task 35.4: Developer - Static Start Method Integration](./task-35.4-developer-static-start-integration.md)

## Task Description
Implement CLI and DefaultCLI interfaces/classes inside Unit 0.3.0.5 component with UnitCLI extending DefaultCLI implementing CLI interface. Replace run() methods with static start() methods following Web4 radical OOP patterns. Create self-contained component with embedded CLI architecture.

## Context
Unit 0.3.0.5 needs internal CLI architecture for component self-containment and Web4 compliance. Current external CLI dependencies should be eliminated through embedded CLI interfaces and classes within the component structure.

## Intention
Create Web4 compliant component with internal CLI architecture following radical OOP patterns. Enable component independence through self-contained CLI capabilities while maintaining proper inheritance hierarchy and static start methods.

## Internal CLI Architecture Specification

### Component Structure (Self-Contained)
```
components/Unit/0.3.0.5/
├── src/ts/
│   ├── layer3/
│   │   ├── CLI.interface.ts              # ✅ NEW: Base CLI interface
│   │   ├── UnitModel.interface.ts        # ✅ Existing enhanced model
│   │   ├── UnitReference.interface.ts    # ✅ Existing IOR references
│   │   ├── Upgrade.interface.ts          # ✅ Existing radical OOP upgrade
│   │   └── ...
│   ├── layer2/
│   │   ├── DefaultUnit.ts               # ✅ Existing with upgrade method
│   │   ├── DefaultCLI.ts                # ✅ NEW: Base CLI implementation
│   │   └── ...
│   └── layer5/
│       └── UnitCLI.ts                   # ✅ ENHANCED: Extends DefaultCLI
```

### CLI Interface (Layer 3)
```typescript
// File: src/ts/layer3/CLI.interface.ts
export interface CLI {
  /**
   * Static start method - Web4 radical OOP pattern
   * No main functional entry point - class-based static method
   */
  static start(args: string[]): Promise<void>;
  
  /**
   * Initialize CLI with component context
   */
  init(component: any): this;
  
  /**
   * Show usage information
   */
  showUsage(): void;
  
  /**
   * Execute CLI commands
   */
  execute(args: string[]): Promise<void>;
}
```

### DefaultCLI Base Class (Layer 2)
```typescript
// File: src/ts/layer2/DefaultCLI.ts
import { CLI } from '../layer3/CLI.interface.js';

export abstract class DefaultCLI implements CLI {
  protected component: any;
  
  constructor() {
    // Empty constructor - Web4 pattern
    this.component = null;
  }
  
  /**
   * Static start method - Web4 radical OOP pattern
   * Entry point for all CLI operations
   */
  static async start(args: string[]): Promise<void> {
    const cli = new (this as any)();
    await cli.execute(args);
  }
  
  /**
   * Initialize CLI with component context
   */
  init(component: any): this {
    this.component = component;
    return this;
  }
  
  /**
   * Abstract method for component-specific execution
   */
  abstract execute(args: string[]): Promise<void>;
  
  /**
   * Abstract method for component-specific usage
   */
  abstract showUsage(): void;
  
  /**
   * Common CLI utilities for argument validation
   */
  protected validateArgs(args: string[], minCount: number, errorMessage: string): void {
    if (args.length < minCount) {
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Common error formatting
   */
  protected formatError(message: string): string {
    return `❌ CLI Error: ${message}`;
  }
  
  /**
   * Common success formatting
   */
  protected formatSuccess(message: string): string {
    return `✅ ${message}`;
  }
  
  /**
   * Common warning formatting
   */
  protected formatWarning(message: string): string {
    return `⚠️ ${message}`;
  }
}
```

### UnitCLI Enhancement (Layer 5)
```typescript
// File: src/ts/layer5/UnitCLI.ts
import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultUnit } from '../layer2/DefaultUnit.js';
import { TypeM3 } from '../layer3/TypeM3.enum.js';

export class UnitCLI extends DefaultCLI {
  private unit: DefaultUnit | null = null;
  
  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new UnitCLI();
    await cli.execute(args);
  }
  
  /**
   * Unit-specific command execution implementation
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }
    
    const command = args[0];
    const commandArgs = args.slice(1);
    
    try {
      // Command handling with DefaultCLI utilities
      switch (command) {
        case 'create':
          this.validateArgs(commandArgs, 1, 'Name required for create command');
          await this.getOrCreateUnit().create(commandArgs[0], commandArgs[1]);
          break;
          
        case 'link':
          this.validateArgs(commandArgs, 2, 'UUID and filename required for link command');
          await this.getOrCreateUnit().link(commandArgs[0], commandArgs[1]);
          break;
          
        case 'list':
          this.validateArgs(commandArgs, 1, 'UUID required for list command');
          await this.getOrCreateUnit().list(commandArgs[0]);
          break;
          
        case 'from':
          this.validateArgs(commandArgs, 3, 'Filename, start position, and end position required for from command');
          await this.getOrCreateUnit().from(commandArgs[0], commandArgs[1], commandArgs[2]);
          break;
          
        case 'definition':
          this.validateArgs(commandArgs, 4, 'UUID, filename, start position, and end position required for definition command');
          await this.getOrCreateUnit().definition(commandArgs[0], commandArgs[1], commandArgs[2], commandArgs[3]);
          break;
          
        case 'upgrade':
          this.validateArgs(commandArgs, 1, 'Target version required for upgrade command');
          const success = await this.getOrCreateUnit().upgrade(commandArgs[0]);
          if (success) {
            console.log(this.formatSuccess(`Unit upgraded to version ${commandArgs[0]}`));
          } else {
            console.error(this.formatError(`Upgrade to version ${commandArgs[0]} failed`));
          }
          break;
          
        case 'linkInto':
          this.validateArgs(commandArgs, 2, 'Link file and target folder required for linkInto command');
          await this.getOrCreateUnit().linkInto(commandArgs[0], commandArgs[1]);
          break;
          
        case 'deleteLink':
          this.validateArgs(commandArgs, 1, 'Link filename required for deleteLink command');
          await this.getOrCreateUnit().deleteLink(commandArgs[0]);
          break;
          
        case 'deleteUnit':
          this.validateArgs(commandArgs, 1, 'Link filename required for deleteUnit command');
          await this.getOrCreateUnit().deleteUnit(commandArgs[0]);
          break;
          
        case 'origin':
          this.validateArgs(commandArgs, 1, 'UUID required for origin command');
          await this.getOrCreateUnit().origin(commandArgs[0]);
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
   * Unit-specific usage display
   */
  showUsage(): void {
    console.log('Web4 Unit CLI Tool v0.3.0.5 - Internal CLI Architecture');
    console.log('');
    console.log('Usage:');
    console.log('  unit create <name> [description]                # Create unit');
    console.log('  unit link <uuid> <filename>                     # Create initial link to unit');
    console.log('  unit linkInto <lnlinkfile.unit> <targetfolder>  # Create additional link');
    console.log('  unit list <uuid>                                # List all links to unit');
    console.log('  unit origin <uuid>                              # Show origin and definition links');
    console.log('  unit deleteLink <lnfile.unit>                   # Delete specific link file only');
    console.log('  unit deleteUnit <lnfile.unit>                   # Delete entire unit and all links');
    console.log('  unit from <filename> <start:line,column> <end:line,column>  # Create unit from source');
    console.log('  unit definition <uuid> <filename> <start:line,column> <end:line,column>  # Add definition');
    console.log('  unit upgrade <version>                          # Upgrade unit model to target version');
    console.log('  unit info                                       # Show unit info');
    console.log('  unit help                                       # Show this help');
    console.log('');
    console.log('Web4 Integration:');
    console.log('  Internal CLI architecture with DefaultCLI base class');
    console.log('  Static start methods following radical OOP patterns');
    console.log('  Component self-containment with embedded CLI capabilities');
  }
  
  private getOrCreateUnit(): DefaultUnit {
    if (!this.unit) {
      this.unit = new DefaultUnit();
      // Initialize with empty scenario
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
  
  private async showInfo(): Promise<void> {
    // Enhanced info display implementation
    // (existing implementation from current UnitCLI)
  }
}

// Static entry point for shell execution
if (import.meta.url === `file://${process.argv[1]}`) {
  UnitCLI.start(process.argv.slice(2));
}
```

## Acceptance Criteria
- [ ] CLI interface implemented in layer3 with static start signature
- [ ] DefaultCLI abstract base class implemented in layer2
- [ ] UnitCLI extends DefaultCLI with Unit-specific functionality
- [ ] Static start() methods replace run() methods (Web4 radical OOP)
- [ ] Component self-containment with no external CLI dependencies
- [ ] All existing Unit CLI functionality preserved
- [ ] Common CLI utilities in DefaultCLI base class
- [ ] Proper inheritance hierarchy with code reuse
- [ ] Web4 5-layer architecture compliance
- [ ] Integration tests pass with internal CLI architecture

## Dependencies
- Builds on Unit 0.3.0.5 enhanced model and functionality
- Requires Web4 radical OOP patterns with static start methods
- Uses existing DefaultUnit implementation and upgrade method
- Integrates with enhanced UnitModel and references array

## Definition of Done
- [ ] CLI interface and DefaultCLI class implemented inside Unit 0.3.0.5
- [ ] UnitCLI extends DefaultCLI with proper inheritance
- [ ] Static start() methods functional for Web4 radical OOP compliance
- [ ] Component self-containment achieved (no external CLI dependencies)
- [ ] All existing CLI commands work with internal architecture
- [ ] Common CLI utilities available through DefaultCLI base class
- [ ] Enhanced info display preserved with internal architecture
- [ ] Integration with Unit 0.3.0.5 enhanced model validated
- [ ] Web4 5-layer architecture compliance maintained

## QA Audit & User Feedback

### TRON Requirements - Internal CLI Architecture
```quote
lets switch gears. you are great in extending the web4 component in a compliant way. for the moment implement the CLI and DefaultCLI inside of the unit 0.3.0.5 component, so that UnitCLI extends DefaultCLI which implements CLI. the run methods shall be named start and be static.
```

- **Issue:** External CLI dependencies reduce component self-containment
- **Resolution:** Implement CLI and DefaultCLI inside Unit 0.3.0.5 component
- **Inheritance:** UnitCLI extends DefaultCLI implements CLI interface
- **Static Start:** Replace run() with static start() methods (Web4 radical OOP)

### Web4 Radical OOP Compliance
- **Static Start Pattern:** No main functional entry point, class-based static methods
- **Component Self-Containment:** Embedded CLI architecture within component
- **Proper Inheritance:** Clear CLI interface hierarchy with code reuse
- **Layer Architecture:** CLI in layer3, DefaultCLI in layer2, UnitCLI in layer5

---

*Sprint 20 - Unit Internal CLI Architecture*  
*Priority: High - Web4 Compliance and Component Self-Containment*  
*Pattern: Radical OOP with Static Start Methods and Internal CLI Architecture*