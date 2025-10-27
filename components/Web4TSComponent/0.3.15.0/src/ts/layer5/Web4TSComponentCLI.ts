#!/usr/bin/env node
/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

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

  
  // protected discoverMethods() removed - using DefaultCLI implementation

  
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  
  private getOrCreateTSComponent(): DefaultWeb4TSComponent {
    if (!this.tsComponent) {
      this.tsComponent = new DefaultWeb4TSComponent();
    }
    return this.tsComponent;
  }

  
  showUsage(): void {
    // Use DefaultCLI's auto-discovery which respects @cliHide annotations
    if (typeof super.generateStructuredUsage === 'function') {
      console.log(super.generateStructuredUsage());
    } else {
      // Implement showUsage directly since it's abstract
      console.log('Web4TSComponent CLI - Run without arguments to see all available methods');
    }
  }

  
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

  
  private async executeDynamicCommandWithChaining(command: string, args: string[]): Promise<{executed: boolean, remainingArgs: string[]}> {
    if (!this.methodSignatures.has(command)) {
      return { executed: false, remainingArgs: args };
    }

    const signature = this.methodSignatures.get(command)!;
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
    
    // Check if parameters have valid values by attempting to get callback
    // If callback exists, validate the provided value
    // This handles: web4tscomponent completion m<TAB> where "m" is invalid
    // ONLY for completion command (other commands let bash filter method names)
    // @deprecated Legacy validation - Scenario-based completion handles this in model
    if (command === 'completion' && signature.paramCount > 0) {
      for (let i = 0; i < nonEmptyArgs.length && i < signature.paramCount; i++) {
        const callback = TSCompletion.getParameterCallback('DefaultWeb4TSComponent', command, i) 
                      || TSCompletion.getParameterCallback('DefaultCLI', command, i);
        
        if (callback) {
          // Callback exists for this parameter - validate the value
          // Call the callback to get valid values
          const validValues = await this.getCallbackValues(callback, command, nonEmptyArgs.slice(0, i));
          
          // If provided value doesn't match any valid value, trigger callback
          const providedValue = nonEmptyArgs[i];
          const isValid = validValues.some(v => v === providedValue);
          
          if (!isValid) {
            // Invalid value - trigger callback for completion
            console.log(`WORD: __CALLBACK__:${callback}`);
            return { executed: true, remainingArgs: [] };
          }
        }
      }
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

  
  private determineArgumentConsumption(command: string, args: string[]): number {
    const signature = this.methodSignatures.get(command)!;
    
    // Special handling for methods that MUST consume all their args (no command detection)
    // completeParameter: uses rest parameters (...contextArgs)
    // completion: filter argument might be a method name (e.g., "completion method create")
    if (command === 'completeParameter' || command === 'completion') {
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
      if (this.methodSignatures.has(argValue)) {
        // Found next command, consume up to this point
        return i;
      }
      
      // PRIORITY 3: Neither @cliValues nor method name - continue consuming as arbitrary string
    }
    
    // No next command found, consume up to method's parameter count
    return Math.min(maxArgs, args.length);
  }

  
  private async getCallbackValues(callbackName: string, command: string, contextArgs: string[]): Promise<string[]> {
    try {
      // Try CLI instance first
      if (typeof (this as any)[callbackName] === 'function') {
        const result = (this as any)[callbackName](contextArgs);
        return Array.isArray(result) ? result : [];
      }
      
      // Try component instance
      const componentInstance = this.getOrCreateTSComponent();
      if (typeof (componentInstance as any)[callbackName] === 'function') {
        const result = (componentInstance as any)[callbackName](contextArgs);
        return Array.isArray(result) ? result : [];
      }
      
      return [];
    } catch (error) {
      // If callback fails, return empty array (will trigger callback in completion)
      return [];
    }
  }

  
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

  
  async complete(scenarioJson: string): Promise<void> {
    // Parse incoming Scenario from bash
    // Pattern: completion-architecture-oop.md:405-422
    const scenario = JSON.parse(scenarioJson);
    
    // Merge scenario into model using init()
    this.init(scenario);
    
    // Compute derived fields from bash-provided data
    this.computeDerivedCompletionFields(this.model);
    
    // Get valid completion values from model
    const values = this.getValidCompletionValues();
    
    // Format with DISPLAY/WORD protocol
    await this.formatCompletionOutput(values);
  }

}

// Static entry point for shell execution - Web4 radical OOP pattern
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4TSComponentCLI.start(process.argv.slice(2));
}