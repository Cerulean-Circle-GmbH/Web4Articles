/**
 * DefaultCLI - Base CLI implementation with common utilities
 * Web4 pattern: Abstract base class implementing CLI interface with static start
 * Purpose: Foundation CLI class with common utilities and Web4 radical OOP patterns
 */

import { CLI } from '../layer3/CLI.interface.js';
import { MethodInfo } from '../layer3/MethodInfo.interface.js';
import { ComponentAnalysis } from '../layer3/ComponentAnalysis.interface.js';
import { ColorScheme, DocumentationSections } from '../layer3/ColorScheme.interface.js';

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

  /**
   * Analyze component methods for dynamic documentation generation
   */
  protected analyzeComponentMethods(): MethodInfo[] {
    if (!this.component) return [];
    
    const methods: MethodInfo[] = [];
    const prototype = Object.getPrototypeOf(this.component);
    const methodNames = Object.getOwnPropertyNames(prototype);
    
    for (const name of methodNames) {
      if (name === 'constructor' || name.startsWith('_')) continue;
      
      const method = prototype[name];
      if (typeof method === 'function') {
        methods.push({
          name: name,
          parameters: this.extractParameterInfo(method),
          description: this.extractMethodDescription(name),
          examples: [`${name} example`],
          returnType: 'any',
          isPublic: !name.startsWith('_'),
          category: this.categorizeMethod(name)
        });
      }
    }
    
    return methods;
  }

  /**
   * Extract parameter information from method
   */
  private extractParameterInfo(method: Function): any[] {
    const paramCount = method.length;
    const params = [];
    
    for (let i = 0; i < paramCount; i++) {
      params.push({
        name: `arg${i + 1}`,
        type: 'any',
        required: true,
        description: `Parameter ${i + 1}`,
        examples: [],
        validation: []
      });
    }
    
    return params;
  }

  /**
   * Extract method description from method name
   */
  private extractMethodDescription(name: string): string {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} operation`;
  }

  /**
   * Categorize method based on name patterns
   */
  private categorizeMethod(name: string): 'create' | 'modify' | 'query' | 'delete' | 'utility' {
    if (name.includes('create') || name.includes('add')) return 'create';
    if (name.includes('update') || name.includes('set') || name.includes('upgrade')) return 'modify';
    if (name.includes('get') || name.includes('find') || name.includes('list') || name.includes('info')) return 'query';
    if (name.includes('delete') || name.includes('remove')) return 'delete';
    return 'utility';
  }

  /**
   * Get TSCompletion color scheme
   */
  protected getTSCompletionColors(): ColorScheme {
    return {
      toolName: '\x1b[1;36m',
      version: '\x1b[1;33m',
      commands: '\x1b[1;32m',
      parameters: '\x1b[1;35m',
      descriptions: '\x1b[0;37m',
      examples: '\x1b[0;33m',
      sections: '\x1b[1;34m',
      reset: '\x1b[0m'
    };
  }

  /**
   * Assemble command section with color coding
   */
  protected assembleCommandSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    
    let output = `${colors.sections}Commands:${colors.reset}\n`;
    
    for (const method of methods) {
      output += `  ${colors.commands}${method.name}${colors.reset}       ${colors.descriptions}${method.description}${colors.reset}\n`;
    }
    
    return output;
  }

  /**
   * Assemble parameter section with specifications
   */
  protected assembleParameterSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    const uniqueParams = new Map<string, any>();
    
    for (const method of methods) {
      for (const param of method.parameters) {
        if (!uniqueParams.has(param.name)) {
          uniqueParams.set(param.name, param);
        }
      }
    }
    
    let output = `${colors.sections}Parameters:${colors.reset}\n`;
    
    for (const [name, param] of uniqueParams) {
      output += `  ${colors.parameters}<${name}>${colors.reset}        ${colors.descriptions}${param.description}${colors.reset}\n`;
    }
    
    return output;
  }

  /**
   * Assemble example section with usage examples
   */
  protected assembleExampleSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    
    let output = `${colors.sections}Examples:${colors.reset}\n`;
    
    const categories = ['create', 'modify', 'query', 'delete', 'utility'];
    
    for (const category of categories) {
      const categoryMethods = methods.filter(m => m.category === category);
      if (categoryMethods.length > 0) {
        output += `  ${colors.descriptions}# ${category.charAt(0).toUpperCase() + category.slice(1)} operations${colors.reset}\n`;
        
        for (const method of categoryMethods.slice(0, 2)) {
          const paramList = method.parameters.map(p => `"${p.name}"`).join(' ');
          output += `  ${colors.examples}${this.getComponentName().toLowerCase()} ${method.name} ${paramList}${colors.reset}  ${colors.descriptions}# ${method.description}${colors.reset}\n`;
        }
        output += '\n';
      }
    }
    
    return output;
  }

  /**
   * Generate structured usage output like requirement-v0.1.2.2
   */
  public generateStructuredUsage(): string {
    const colors = this.getTSCompletionColors();
    const componentName = this.getComponentName();
    const version = this.getComponentVersion();
    
    let output = '';
    
    // Header section
    output += `${colors.toolName}Web4 ${componentName} CLI Tool v${colors.version}${version}${colors.reset} - Dynamic Method Discovery with Structured Documentation\n\n`;
    
    // Usage section  
    output += `${colors.sections}Usage:${colors.reset}\n`;
    const methods = this.analyzeComponentMethods();
    for (const method of methods.slice(0, 5)) {
      const paramList = method.parameters.map(p => `<${p.name}>`).join(' ');
      output += `  ${colors.commands}${componentName.toLowerCase()} ${method.name}${colors.reset} ${colors.parameters}${paramList}${colors.reset}       ${colors.descriptions}# ${method.description}${colors.reset}\n`;
    }
    output += '\n';
    
    // Commands section
    output += this.assembleCommandSection();
    output += '\n';
    
    // Parameters section
    output += this.assembleParameterSection();
    output += '\n';
    
    // Examples section
    output += this.assembleExampleSection();
    
    // Integration section
    output += `${colors.sections}Web4 Integration:${colors.reset}\n`;
    output += `  ${colors.descriptions}${componentName} operates as atomic Web4 element with dynamic CLI documentation.${colors.reset}\n`;
    output += `  ${colors.descriptions}Commands automatically discovered from component methods with structured formatting.${colors.reset}\n`;
    output += `  ${colors.descriptions}TSCompletion color coding and professional documentation generation.${colors.reset}\n`;
    
    return output;
  }

  /**
   * Get component name for documentation
   */
  private getComponentName(): string {
    if (!this.component) return 'Unknown';
    return this.component.constructor.name.replace('Default', '');
  }

  /**
   * Get component version for documentation
   */
  private getComponentVersion(): string {
    return '0.3.0.5';
  }
}

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}