#!/usr/bin/env node

/**
 * UnitCLI - Unit CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 * 
 * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
 * Uses DelegationProxy for automatic method delegation (no explicit boilerplate!)
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultUnit } from '../layer2/DefaultUnit.js';
import { DelegationProxy } from '../layer2/DelegationProxy.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';

export class UnitCLI extends DefaultCLI {
  // Component is initialized asynchronously in initComponent()
  // Type is handled by base DefaultCLI
  // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
  protected methodSignatures: Map<string, MethodSignature> = new Map();

  /**
   * Empty constructor (Web4 radical OOP pattern)
   * @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority architecture
   * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - Pass targetDirectory
   * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md - Remove useless tempComponent
   * @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Create component immediately for discovery
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md - Wrap in DelegationProxy
   */
  constructor() {
    super(); // Call empty parent constructor
    
    // Initialize CLI (Path Authority - calculates projectRoot, sets paths)
    this.init();
    
    // Component will be initialized asynchronously in initComponent()
    // (because init() now needs to await Web4TSComponent method discovery)
  }
  
  /**
   * Initialize component asynchronously (Radical OOP)
   * Called by start() before executing commands
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md - Add CLI back-reference
   * ✅ RADICAL OOP: Separate discovery of own methods vs delegated methods
   */
  async initComponent(): Promise<void> {
    // ✅ STEP 1: Create component (knows its OWN methods)
    const component = new DefaultUnit();
    
    // ✅ STEP 1.5: Set CLI back-reference for path authority BEFORE init()
    // @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
    // CRITICAL: Must be set before init() calls updateModelPaths()
    component.setCLI(this);
    
    // ✅ STEP 1.75: Initialize component (will call updateModelPaths() which needs CLI)
    await component.init();
    
    // ✅ STEP 2: Pre-load Web4TSComponent (for delegation to work at call-time)
    await (component as any).getWeb4TSComponent();
    
    // ✅ STEP 3: Wrap with DelegationProxy (transparent delegation)
    // @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // Proxy intercepts missing methods and delegates them to Web4TSComponent
    // CRITICAL: await start() to ensure Web4TSComponent is loaded before getDelegationTarget()
    this.component = await DelegationProxy.start(component as any) as any;
    
    // ✅ STEP 4: Discover CLI's own methods
    this.discoverMethods();
    
    // ✅ STEP 5: Discover component's OWN methods
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // RADICAL OOP: Component knows ONLY its own methods (3 for IdealMinimalComponent)
    if (this.component) {
      const ownMethods = this.component.listMethods();
      for (const methodName of ownMethods) {
        const signature = this.component.getMethodSignature(methodName);
        if (signature) {
          this.methodSignatures.set(methodName, signature);
        }
      }
    }
    
    // ✅ STEP 6: Discover DELEGATED methods (if delegation exists)
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // RADICAL OOP: Query delegation target separately via metadata
    if (this.component && (this.component as any).hasDelegation && (this.component as any).hasDelegation()) {
      const delegationTarget = (this.component as any).getDelegationTarget();
      if (delegationTarget) {
        const delegatedMethods = delegationTarget.listMethods();
        for (const methodName of delegatedMethods) {
          const signature = delegationTarget.getMethodSignature(methodName);
          if (signature) {
            // Mark as delegated for help display
            signature.isDelegated = true;
            this.methodSignatures.set(methodName, signature);
          }
        }
      }
    }
  }

  /**
   * Static start method - Web4 radical OOP entry point
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   */
  static async start(args: string[]): Promise<void> {
    const cli = new UnitCLI();
    await cli.initComponent(); // Initialize component asynchronously
    await cli.execute(args);
  }

  /**
   * Unit-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Override shCompletion to ensure component is initialized for method discovery
   * @pdca 2025-11-10-UTC-2030.fix-upgrade-delegation.pdca.md
   */
  async shCompletion(cword: string, ...words: string[]): Promise<void> {
    // CRITICAL: Initialize component before completion (dynamic method discovery)
    if (!this.component) {
      await this.initComponent();
    }
    
    // Call parent implementation
    await super.shCompletion(cword, ...words);
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
  UnitCLI.start(process.argv.slice(2));
}
