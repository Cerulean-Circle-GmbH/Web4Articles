#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { join } from 'node:path';
import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { Reference } from '../layer3/Reference.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

export class Web4TSComponentCLI extends DefaultCLI {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Override component type for Web4TSComponent-specific operations
  // @pdca 2025-11-05-UTC-1158.pdca.md - Changed to Reference<T> (null not undefined)
  protected declare component: Reference<DefaultWeb4TSComponent>;

  /**
   * Constructor - creates component for discovery
   * @pdca 2025-10-31-UTC-1727.pdca.md - Phase 2: Fix Component Initialization
   * @pdca 2025-11-05-UTC-1158.pdca.md - Component self-discovers in its own init()
   */
  constructor() {
    super();
    this.init();  // ← DefaultCLI calculates ALL paths in model
    
    // ✅ CLI discovers its OWN methods (on, test, completion, etc.)
    // @pdca 2025-11-05-UTC-1223.pdca.md - CLI self-discovery, not batch component discovery
    this.discoverMethods();
    
    // ✅ Create component with defaults
    // Component discovers its own componentRoot from import.meta.url AND its methods!
    // @pdca 2025-11-05-UTC-1158.pdca.md - Self-discovery pattern
    this.component = new DefaultWeb4TSComponent().init();
    
    // ✅ Direct model assignment (OOP - NO re-init!)
    // Component already set: IOR, owner, version, componentRoot (from its own location)
    // CLI provides: projectRoot, targetDirectory, and ALL calculated paths (Path Authority)
    // @pdca 2025-11-05-UTC-2100.pdca.md - Phase 2: CLI calculates ALL paths
    this.component.model.projectRoot = this.model.projectRoot;
    this.component.model.targetDirectory = this.model.projectRoot;
    this.component.model.componentsDirectory = join(this.model.projectRoot, 'components');
    // @pdca 2025-11-10-UTC-1010.pdca.md - Radical OOP: Detect test isolation from MODEL, not environment
    // Model-driven: If projectRoot includes '/test/data', we're in test isolation
    // NO environment variables (Web4 is environment-agnostic)
    this.component.model.isTestIsolation = this.model.projectRoot.includes('/test/data');
    // testDataDirectory only set when isTestIsolation = true (in test setup)
    
    // ✅ Each object discovers itself: CLI discovers CLI methods, Component discovers component methods!
  }

  /**
   * Get Web4TSComponent reference for helper methods
   * @cliHide
   */
  protected getOrCreateTSComponent(): DefaultWeb4TSComponent {
    return this.component as DefaultWeb4TSComponent;
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use DefaultCLI's auto-discovery which respects @cliHide annotations
    if (typeof super.generateStructuredUsage === 'function') {
      console.log(super.generateStructuredUsage());
    } else {
      // Implement showUsage directly since it's abstract
      console.log('Web4TSComponent CLI - Run without arguments to see all available methods');
    }
  }

  /**
   * Execute CLI commands with Unit pattern - dynamic discovery with chaining support
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    try {
      await this.executeWithChaining(args);
    } catch (error) {
      console.error(this.formatError((error as Error).message));
      process.exit(1);
    }
  }

  /**
   * Execute commands with chaining support
   * Supports: web4tscomponent on Unit 0.3.0.5 tree 4
   */
  private async executeWithChaining(args: string[]): Promise<void> {
    let remainingArgs = [...args];
    
    while (remainingArgs.length > 0) {
      const command = remainingArgs[0];
      
      // Try dynamic command execution
      const result = await this.executeDynamicCommandWithChaining(command, remainingArgs.slice(1));
      
      if (result.executed) {
        // Command executed successfully, continue with remaining args
        remainingArgs = result.remainingArgs;
        continue;
      }

      // Special cases (minimal switch - only help)
      switch (command) {
        case 'help':
          this.showUsage();
      return;
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    }
  }

  /**
   * Execute dynamic command and return remaining arguments for chaining
   * @pdca 2025-11-05-UTC-1158.pdca.md - Check all three sources: CLI, context, component
   */
  private async executeDynamicCommandWithChaining(command: string, args: string[]): Promise<{executed: boolean, remainingArgs: string[]}> {
    // Check all three sources for the command (type-safe with Component interface!)
    let signature: MethodSignature | null = null;
    
    if (this.cliMethods.has(command)) {
      signature = this.cliMethods.get(command)!;
    } else if (this.context !== null && this.context.hasMethod(command)) {
      signature = this.context.getMethodSignature(command);
    } else if (this.component !== null && this.component.hasMethod(command)) {
      signature = this.component.getMethodSignature(command);
    }
    
    if (signature === null) {
      return { executed: false, remainingArgs: args };
    }
    const minArgs = Math.min(signature.paramCount, 1); // At least 1 arg for most methods
    
    // Filter out empty strings from args (bash completion sends empty strings for incomplete args)
    const nonEmptyArgs = args.filter(arg => arg !== '');
    
    if (nonEmptyArgs.length < minArgs && signature.paramCount > 0) {
      // Before failing, check if TSCompletion has a callback for the first missing parameter
      // This enables tab completion: web4tscomponent completion <TAB> → __CALLBACK__:whatParameterCompletion
      const paramIndex = nonEmptyArgs.length; // Index of first missing parameter
      
      // Check DefaultWeb4TSComponent first (component methods), then DefaultCLI (CLI methods)
      let callback = TSCompletion.getParameterCallback('DefaultWeb4TSComponent', command, paramIndex);
      if (!callback) {
        callback = TSCompletion.getParameterCallback('DefaultCLI', command, paramIndex);
      }
      
      if (callback) {
        // Return callback marker for bash completion to trigger
        console.log(`WORD: __CALLBACK__:${callback}`);
        return { executed: true, remainingArgs: [] };
      }
      
      throw new Error(`At least ${minArgs} arguments required for ${command} command`);
    }
    
    // Removed: Legacy validation loop (lines 149-175)
    // Rationale: CLIModel contains full completion state, validation is unnecessary
    // With Scenario-based completion, TypeScript has all context needed for direct execution

    // Intelligently determine how many arguments this method consumes
    const consumedArgs = this.determineArgumentConsumption(command, args);
    const methodArgs = args.slice(0, consumedArgs);
    const remainingArgs = args.slice(consumedArgs);

    // Execute the method with context-aware priority
    // Priority: CLI method > Context method (via on()) > Component method
    // @pdca 2025-10-30-UTC-1011.pdca.md - Context-aware command execution
    
    if (typeof (this as any)[command] === 'function') {
      // 1. CLI method (on, test, completeParameter, etc.) - HIGHEST PRIORITY
      const method = (this as any)[command];
      if (signature.isAsync) {
        await method.apply(this, methodArgs);
      } else {
        method.apply(this, methodArgs);
      }
    } else if (this.context && typeof (this.context as any)[command] === 'function') {
      // 2. Context method (via on()) - SECOND PRIORITY
      // Example: web4tscomponent on PDCA 0.3.5.1 links → calls this.context.links()
      const method = (this.context as any)[command];
      if (signature.isAsync) {
        await method.apply(this.context, methodArgs);
      } else {
        method.apply(this.context, methodArgs);
      }
    } else if (this.component && typeof (this.component as any)[command] === 'function') {
      // 3. Primary component method - FALLBACK
      const method = (this.component as any)[command];
      if (signature.isAsync) {
        await method.apply(this.component, methodArgs);
      } else {
        method.apply(this.component, methodArgs);
      }
    } else {
      throw new Error(`Method not found: ${command}`);
    }
    
    return { executed: true, remainingArgs };
  }

  /**
   * Intelligently determine how many arguments a method should consume
   * Stops at next known command to enable chaining (unless explicit max is set)
   * 
   * PRIORITY ORDER (feature.cli.parsing.md):
   * 1. Valid @cliValues (parameter value) - CONSUME
   * 2. Method name (chaining) - STOP
   * 3. Neither - CONSUME (as arbitrary string parameter)
   */
  private determineArgumentConsumption(command: string, args: string[]): number {
    // Get signature from appropriate source (CLI, context, or component)
    let signature: MethodSignature | null = null;
    if (this.cliMethods.has(command)) {
      signature = this.cliMethods.get(command)!;
    } else if (this.context !== null && this.context.hasMethod(command)) {
      signature = this.context.getMethodSignature(command);
    } else if (this.component !== null && this.component.hasMethod(command)) {
      signature = this.component.getMethodSignature(command);
    }
    
    if (signature === null) {
      return 0; // Command not found
    }
    
    // Special handling for methods that MUST consume all their args (no command detection)
    // completeParameter: uses rest parameters (...contextArgs)
    // shCompletion: uses rest parameters (...words)
    // completion: filter argument might be a method name (e.g., "completion method create")
    if (command === 'completeParameter' || command === 'shCompletion' || command === 'completion') {
      const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
      return methodSpecificMaxArgs !== null ? Math.min(methodSpecificMaxArgs, args.length) : args.length;
    }
    
    // Get max args from TypeScript signature (handles optional parameters)
    const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
    const maxArgs = methodSpecificMaxArgs !== null ? methodSpecificMaxArgs : signature.paramCount;
    
    // Get parameter info for @cliValues checking
    const params = TSCompletion.getEnhancedMethodParameters('DefaultCLI,DefaultWeb4TSComponent', command);
    
    // Check each argument position for chaining vs parameter value
    for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
      const argValue = args[i];
      
      // PRIORITY 1: Check if this argument is a valid @cliValues for its parameter position
      if (params && i < params.length) {
        const paramName = params[i].name;
        const cliValues = TSCompletion.extractCliValues('DefaultWeb4TSComponent', command, paramName);
        
        if (cliValues.length > 0 && cliValues.includes(argValue)) {
          // Valid parameter value - continue consuming
          continue;
        }
      }
      
      // PRIORITY 2: Check if it's a method name (chaining)
      if (this.cliMethods.has(argValue)) {
        // Found next command, consume up to this point
        return i;
      }
      
      // PRIORITY 3: Neither @cliValues nor method name - continue consuming as arbitrary string
    }
    
    // No next command found, consume up to method's parameter count
    return Math.min(maxArgs, args.length);
  }

  /**
   * Get valid values from a callback method
   * Used for parameter validation during completion
   * @deprecated Legacy functional approach - use model-driven getValidCompletionValues() instead
   * TODO: Remove after full migration to Scenario-based completion
   */
  // Removed: getCallbackValues() method (lines 244-264)
  // Rationale: Duplicates DefaultCLI.completeParameter() - DRY violation
  // Use inherited completeParameter() method from DefaultCLI instead

  /**
   * Get maximum arguments for methods with default parameters
   * AUTO-DISCOVERED from TypeScript signatures via TSCompletion
   * Web4 pattern: Zero config, zero hardcoding - pure AST introspection!
   * 
   * NOTE: This is called synchronously during argument parsing, so we use
   * a cached static import at the top of the file (TSCompletion is already imported)
   */
  private getMethodMaxArguments(command: string): number | null {
    // Special case: completeParameter uses rest parameters (...contextArgs)
    // Special case: shCompletion uses rest parameters (...words)
    // Both should consume ALL remaining args
    if (command === 'completeParameter' || command === 'shCompletion') {
      return 999; // Consume all remaining args
    }
    
    // TSCompletion is statically imported at the top for synchronous access
    // Auto-discover parameter count from TypeScript AST
    // This works for BOTH CLI methods (DefaultCLI) and Component methods (DefaultWeb4TSComponent)
    const params = TSCompletion.getEnhancedMethodParameters('DefaultCLI,DefaultWeb4TSComponent', command);
    
    if (params && params.length > 0) {
      // Return actual parameter count from TypeScript signature
      // This handles all methods with optional parameters automatically!
      return params.length;
    }
    
    // Method not found or has no parameters
    return null;
  }

}

// Static entry point for shell execution - Web4 radical OOP pattern
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4TSComponentCLI.start(process.argv.slice(2));
}