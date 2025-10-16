#!/usr/bin/env node

/**
 * Web4ProgrammerCLI - Web4Programmer CLI implementation with auto-discovery
 * Web4 pattern: Auto-discovery CLI with chaining support
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4Programmer } from '../layer2/DefaultWeb4Programmer.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

export class Web4ProgrammerCLI extends DefaultCLI {
  private component: DefaultWeb4Programmer | null;

  constructor() {
    super();
    this.component = null;
    this.initWithComponentClass(DefaultWeb4Programmer, 'Web4Programmer', '0.1.0.0');
    // Discover methods for chaining support
    this.discoverMethods();
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4ProgrammerCLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): DefaultWeb4Programmer {
    if (!this.component) {
      this.component = this.getComponentInstance() as DefaultWeb4Programmer;
    }
    return this.component;
  }

  /**
   * Web4Programmer-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with auto-discovery and chaining support
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
   * Supports: web4programmer on Component 0.1.0.0 addMethod myMethod
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
    const minArgs = Math.min(signature.paramCount, 1);
    
    if (args.length < minArgs && signature.paramCount > 0) {
      throw new Error(`At least ${minArgs} arguments required for ${command} command`);
    }

    // Intelligently determine how many arguments this method consumes
    const consumedArgs = this.determineArgumentConsumption(command, args);
    const methodArgs = args.slice(0, consumedArgs);
    const remainingArgs = args.slice(consumedArgs);

    // Ensure component instance exists
    const component = this.getOrCreateComponent();

    // Execute the method (check CLI first, then component)
    if (typeof (this as any)[command] === 'function') {
      const method = (this as any)[command];
      if (signature.isAsync) {
        await method.apply(this, methodArgs);
      } else {
        method.apply(this, methodArgs);
      }
    } else if (typeof (component as any)[command] === 'function') {
      const method = (component as any)[command];
      if (signature.isAsync) {
        await method.apply(component, methodArgs);
      } else {
        method.apply(component, methodArgs);
      }
    } else {
      return { executed: false, remainingArgs: args };
    }

    return { executed: true, remainingArgs };
  }

  /**
   * Determine how many arguments a method will consume
   * This is critical for method chaining - we need to know where one method ends and the next begins
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
   * Get actual parameter count from TypeScript source using AST
   */
  private getMethodMaxArguments(command: string): number | null {
    // Special case: completeParameter uses rest parameters (...contextArgs)
    // It should consume ALL remaining args to pass as context to completion method
    if (command === 'completeParameter') {
      return 999; // Consume all remaining args
    }
    
    // Auto-discover parameter count from TypeScript AST
    const params = TSCompletion.getEnhancedMethodParameters('Web4ProgrammerCLI,DefaultWeb4Programmer', command);
    
    if (params && params.length > 0) {
      // Return actual parameter count from TypeScript signature
      return params.length;
    }
    
    return null;
  }
}

// Static entry point for shell execution
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4ProgrammerCLI.start(process.argv.slice(2));
}
