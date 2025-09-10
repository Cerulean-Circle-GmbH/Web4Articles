/**
 * DefaultCLI - Base CLI implementation with common utilities
 * Web4 pattern: Abstract base class implementing CLI interface with static start
 * Purpose: Foundation CLI class with common utilities and Web4 radical OOP patterns
 */

import { CLI } from '../layer3/CLI.interface.js';

export abstract class DefaultCLI implements CLI {
  protected component: any;
  protected methodSignatures: Map<string, MethodSignature> = new Map();
  
  constructor() {
    // Empty constructor - Web4 pattern
    this.component = null;
    this.discoverMethods(); // TSRanger 2.2 pattern
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
  
  /**
   * Common info formatting
   */
  protected formatInfo(message: string): string {
    return `ℹ️ ${message}`;
  }

  /**
   * TSRanger 2.2 method discovery pattern
   */
  protected discoverMethods(): void {
    if (!this.component) return;
    
    const prototype = Object.getPrototypeOf(this.component);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => typeof this.component[name] === 'function')
      .filter(name => !name.startsWith('_') && name !== 'constructor')
      .filter(name => !['init', 'toScenario', 'validateModel', 'getModel'].includes(name));

    for (const methodName of methodNames) {
      const method = this.component[methodName];
      this.methodSignatures.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === 'AsyncFunction'
      });
    }
  }

  /**
   * Dynamic command execution (TSRanger 2.2 pattern)
   */
  protected async executeDynamicCommand(command: string, args: string[]): Promise<boolean> {
    if (!this.methodSignatures.has(command)) {
      return false; // Command not found
    }

    const signature = this.methodSignatures.get(command)!;
    
    // Dynamic argument validation
    if (args.length < signature.paramCount) {
      throw new Error(`${signature.paramCount} arguments required for ${command} command`);
    }

    // Dynamic method invocation
    const method = this.component[command];
    
    if (signature.isAsync) {
      await method.apply(this.component, args);
    } else {
      method.apply(this.component, args);
    }
    
    return true;
  }

  /**
   * TSCompletion color-coded usage generation
   */
  protected generateDynamicUsage(toolName: string, version: string): void {
    console.log(`${this.colors.cyan}${toolName} CLI Tool v${version} - Dynamic Method Discovery${this.colors.reset}`);
    console.log('');
    console.log(`${this.colors.bold}Usage:${this.colors.reset}`);
    
    // Dynamic usage generation from discovered methods
    for (const [methodName, signature] of this.methodSignatures) {
      const params = Array(signature.paramCount).fill(0)
        .map((_, i) => `${this.colors.yellow}<arg${i + 1}>${this.colors.reset}`)
        .join(' ');
      console.log(`  ${this.colors.green}${toolName} ${methodName}${this.colors.reset} ${params}`);
    }
    
    console.log(`  ${this.colors.green}${toolName} help${this.colors.reset}                    # Show this help`);
    console.log(`  ${this.colors.green}${toolName} info${this.colors.reset}                    # Show component info`);
    console.log('');
    console.log(`${this.colors.dim}Commands automatically discovered from component methods${this.colors.reset}`);
    console.log(`${this.colors.dim}Add new methods to component and they become available immediately${this.colors.reset}`);
  }

  /**
   * TSCompletion color definitions
   */
  protected colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[90m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  };
}

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}