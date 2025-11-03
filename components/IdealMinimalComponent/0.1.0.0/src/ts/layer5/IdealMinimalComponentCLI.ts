#!/usr/bin/env node

/**
 * IdealMinimalComponentCLI - IdealMinimalComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultIdealMinimalComponent } from '../layer2/DefaultIdealMinimalComponent.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';

export class IdealMinimalComponentCLI extends DefaultCLI {
  private component: DefaultIdealMinimalComponent | null;
  protected methodSignatures: Map<string, MethodSignature> = new Map();

  /**
   * Empty constructor (Web4 radical OOP pattern)
   * @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority architecture
   * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - Pass targetDirectory
   * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md - Remove useless tempComponent
   */
  constructor() {
    super(); // Call empty parent constructor
    this.component = null;
    
    // Initialize CLI (Path Authority - calculates projectRoot, sets paths)
    this.init();
    
    // Discover methods from CLI (walks CLI prototype chain)
    this.discoverMethods();
    
    // ✅ Component created on-demand via getOrCreateComponent()
    // No premature instantiation, no wasted memory
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new IdealMinimalComponentCLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): DefaultIdealMinimalComponent {
    if (!this.component) {
      // ✅ CLI is Path Authority - provides targetDirectory to component
      this.component = new DefaultIdealMinimalComponent().init({
        model: {
          targetDirectory: this.model.projectRoot // ✅ CLI provides path
        }
      }) as DefaultIdealMinimalComponent;
    }
    return this.component;
  }

  /**
   * IdealMinimalComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with auto-discovery
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Try dynamic command execution
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return;
      }

      // Special cases
      switch (command) {
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
}

// Static entry point for shell execution
if (import.meta.url === `file://${process.argv[1]}`) {
  IdealMinimalComponentCLI.start(process.argv.slice(2));
}
