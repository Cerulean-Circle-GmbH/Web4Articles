#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;
  protected methodSignatures: Map<string, MethodSignature> = new Map();

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate tsComponent for usage display - command-based instantiation only
    this.tsComponent = null;
    // Get version from a temporary component instance (reads from directory in constructor)
    const tempComponent = new DefaultWeb4TSComponent();
    const version = (tempComponent as any).model.version; // Access model directly (synchronous)
    // Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', version);
    // Discover methods for chaining support
    this.discoverMethods();
  }

  /**
   * Use parent class method discovery (DefaultCLI now handles both CLI and component methods)
   * No override needed - inherits from DefaultCLI
   */
  // protected discoverMethods() removed - using DefaultCLI implementation

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  /**
   * Get component instance (Web4TSComponent-specific)
   */
  private getOrCreateTSComponent(): DefaultWeb4TSComponent {
    if (!this.tsComponent) {
      this.tsComponent = new DefaultWeb4TSComponent();
    }
    return this.tsComponent;
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
   * Supports: web4tscomponent on Unit 0.3.0.5 tree 2
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
   */
  private async executeDynamicCommandWithChaining(command: string, args: string[]): Promise<{executed: boolean, remainingArgs: string[]}> {
    if (!this.methodSignatures.has(command)) {
      return { executed: false, remainingArgs: args };
    }

    const signature = this.methodSignatures.get(command)!;
    const minArgs = Math.min(signature.paramCount, 1); // At least 1 arg for most methods
    
    if (args.length < minArgs && signature.paramCount > 0) {
      throw new Error(`At least ${minArgs} arguments required for ${command} command`);
    }

    // Intelligently determine how many arguments this method consumes
    const consumedArgs = this.determineArgumentConsumption(command, args);
    const methodArgs = args.slice(0, consumedArgs);
    const remainingArgs = args.slice(consumedArgs);

    // Execute the method (CLI methods take precedence over component methods)
    // Web4 pattern: completeParameter, actionParameterCompletion are CLI methods
    if (typeof (this as any)[command] === 'function') {
      // Execute on CLI instance
      const method = (this as any)[command];
      if (signature.isAsync) {
        await method.apply(this, methodArgs);
      } else {
        method.apply(this, methodArgs);
      }
    } else {
      // Fallback to component instance
      const componentInstance = this.getOrCreateTSComponent();
      const method = (componentInstance as any)[command];
      
      if (signature.isAsync) {
        await method.apply(componentInstance, methodArgs);
      } else {
        method.apply(componentInstance, methodArgs);
      }
    }
    
    return { executed: true, remainingArgs };
  }

  /**
   * Intelligently determine how many arguments a method should consume
   * Stops at next known command to enable chaining (unless explicit max is set)
   */
  private determineArgumentConsumption(command: string, args: string[]): number {
    const signature = this.methodSignatures.get(command)!;
    
    // Special handling for methods with hardcoded parameter counts
    // These MUST consume their args even if they look like commands (e.g., completeParameter)
    const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
    if (methodSpecificMaxArgs !== null) {
      // Hardcoded count - consume exactly that many args, no command detection
      return Math.min(methodSpecificMaxArgs, args.length);
    }
    
    // Default behavior: stop at next command for chaining
    const maxArgs = signature.paramCount;
    for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
      if (this.methodSignatures.has(args[i])) {
        // Found next command, consume up to this point
        return i;
      }
    }
    
    // No next command found, consume up to method's parameter count
    return Math.min(maxArgs, args.length);
  }

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
    // It should consume ALL remaining args to pass as context to completion method
    if (command === 'completeParameter') {
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