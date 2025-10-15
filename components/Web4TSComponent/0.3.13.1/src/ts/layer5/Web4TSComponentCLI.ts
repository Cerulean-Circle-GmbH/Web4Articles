#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;
  // Inherited from DefaultCLI: method signatures removed - using direct reflection instead

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate tsComponent for usage display - command-based instantiation only
    this.tsComponent = null;
    
    // Get version from package.json or directory name instead of instantiating component
    const version = this.getVersionFromDirectory() || '0.3.13.1';
    
    // Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', version);
    // Method discovery removed - using direct reflection on-demand
  }
  
  /**
   * Get version from directory name (safer than instantiating component)
   */
  private getVersionFromDirectory(): string | null {
    try {
      const currentDir = process.cwd();
      const dirName = currentDir.split('/').pop();
      if (dirName && /^\d+\.\d+\.\d+\.\d+$/.test(dirName)) {
        return dirName;
      }
    } catch {
      // Fallback to default
    }
    return null;
  }

  // Method discovery removed - using direct reflection on-demand

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
    try {
      // Use DefaultCLI's auto-discovery which respects @cliHide annotations
      if (typeof super.generateStructuredUsage === 'function') {
        console.log(super.generateStructuredUsage());
      } else {
        // Fallback if generateStructuredUsage doesn't exist
        console.log('Web4TSComponent CLI - Dynamic Method Discovery');
        console.log('Run with specific command for help: web4tscomponent <command>');
      }
    } catch (error) {
      // Safe fallback if anything goes wrong
      console.log('Web4TSComponent CLI v0.3.13.1');
      console.log('Available commands: create, upgrade, on, tree, version, help');
      console.log('Run with specific command for help: web4tscomponent <command>');
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

  // getMethodByName inherited from DefaultCLI (now protected)

  /**
   * Execute dynamic command and return remaining arguments for chaining
   */
  private async executeDynamicCommandWithChaining(command: string, args: string[]): Promise<{executed: boolean, remainingArgs: string[]}> {
    const method = this.getMethodByName(command);
    if (!method) {
      return { executed: false, remainingArgs: args };
    }

    const paramCount = method.length;
    const minArgs = Math.min(paramCount, 1); // At least 1 arg for most methods
    
    if (args.length < minArgs && paramCount > 0) {
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
      if (method.constructor.name === 'AsyncFunction') {
        await method.apply(this, methodArgs);
      } else {
        method.apply(this, methodArgs);
      }
    } else {
      // Fallback to component instance
      const componentInstance = this.getOrCreateTSComponent();
      const method = (componentInstance as any)[command];
      
      if (method.constructor.name === 'AsyncFunction') {
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
    // Special handling for methods with hardcoded parameter counts
    // These MUST consume their args even if they look like commands (e.g., completeParameter)
    const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
    if (methodSpecificMaxArgs !== null) {
      // Hardcoded count - consume exactly that many args, no command detection
      return Math.min(methodSpecificMaxArgs, args.length);
    }
    
    // Default behavior: stop at next command for chaining
    const method = this.getMethodByName(command);
    const maxArgs = method?.length || 0;
    for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
      if (this.getMethodByName(args[i])) {
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