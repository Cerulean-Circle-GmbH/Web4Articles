#!/usr/bin/env node

/**
 * IdealMinimalComponentCLI - IdealMinimalComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultIdealMinimalComponent } from '../layer2/DefaultIdealMinimalComponent.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';

export class IdealMinimalComponentCLI extends DefaultCLI {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Use declare to override component type
  protected declare component: DefaultIdealMinimalComponent;
  protected methodSignatures: Map<string, MethodSignature> = new Map();

  /**
   * Empty constructor (Web4 radical OOP pattern)
   * @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority architecture
   * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - Pass targetDirectory
   * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md - Remove useless tempComponent
   * @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Create component immediately for discovery
   */
  constructor() {
    super(); // Call empty parent constructor
    
    // Initialize CLI (Path Authority - calculates projectRoot, sets paths)
    this.init();
    
    // Create component for method discovery
    this.component = new DefaultIdealMinimalComponent().init();
    
    // Discover methods from CLI (walks CLI prototype chain)
    this.discoverMethods();
    
    // Copy component methods to methodSignatures for test/completion discovery
    // @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Populate methodSignatures from component
    const componentMethods = this.component.listMethods();
    for (const methodName of componentMethods) {
      const signature = this.component.getMethodSignature(methodName);
      if (signature) {
        this.methodSignatures.set(methodName, signature);
      }
    }
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new IdealMinimalComponentCLI();
    await cli.execute(args);
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
