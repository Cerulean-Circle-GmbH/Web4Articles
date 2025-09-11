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
   * Extract parameter information from method with intelligent naming
   */
  private extractParameterInfo(method: Function): any[] {
    const paramCount = method.length;
    const params = [];
    const methodName = method.name;
    
    for (let i = 0; i < paramCount; i++) {
      const paramName = this.generateIntelligentParameterName(methodName, i);
      const paramDesc = this.generateParameterDescription(methodName, paramName, i);
      
      params.push({
        name: paramName,
        type: this.inferParameterType(methodName, paramName),
        required: this.isParameterRequired(methodName, i),
        description: paramDesc,
        examples: this.generateParameterExamples(paramName),
        validation: []
      });
    }
    
    return params;
  }

  /**
   * Generate intelligent parameter names based on method context
   */
  private generateIntelligentParameterName(methodName: string, index: number): string {
    // Common parameter patterns based on method names and position
    const parameterPatterns: { [key: string]: string[] } = {
      'create': ['name', 'description', 'typeM3'],
      'classify': ['uuid', 'typeM3'],
      'link': ['uuid', 'filename'],
      'linkInto': ['linkfile', 'targetfolder'],
      'list': ['uuid'],
      'origin': ['uuid'],
      'deleteLink': ['linkfile'],
      'deleteUnit': ['linkfile'],
      'from': ['filename', 'start:line,column', 'end:line,column'],
      'definition': ['uuid', 'filename', 'start:line,column', 'end:line,column'],
      'execute': ['name', 'input'],
      'set': ['uuid', 'key', 'value'],
      'find': ['search-term'],
      'replace': ['pattern', 'file-path'],
      'update': ['component', 'version']
    };
    
    // Check for exact method name match
    if (parameterPatterns[methodName]) {
      return parameterPatterns[methodName][index] || `arg${index + 1}`;
    }
    
    // Check for partial matches
    for (const [pattern, params] of Object.entries(parameterPatterns)) {
      if (methodName.includes(pattern)) {
        return params[index] || `arg${index + 1}`;
      }
    }
    
    // Generic fallback with common patterns
    const genericPatterns = ['uuid', 'name', 'data', 'value', 'path'];
    return genericPatterns[index] || `arg${index + 1}`;
  }

  /**
   * Generate parameter description based on name and context
   */
  private generateParameterDescription(methodName: string, paramName: string, index: number): string {
    const descriptions: { [key: string]: string } = {
      'name': 'Component name for identification (required)',
      'uuid': 'Component UUID for operations (8+ characters accepted)',
      'description': 'Detailed description of the component or operation',
      'typeM3': 'MOF classification (CLASS, ATTRIBUTE, RELATIONSHIP)',
      'filename': 'File name for links or source references',
      'linkfile': 'Link file name (e.g., component.unit)',
      'targetfolder': 'Target directory for additional links',
      'start:line,column': 'Start position in file (line:column format)',
      'end:line,column': 'End position in file (line:column format)',
      'input': 'JSON input data for operation',
      'search-term': 'Search term for finding components',
      'pattern': 'Pattern to search and replace',
      'file-path': 'Relative path from project root',
      'key': 'Property key to set or modify',
      'value': 'Property value to assign',
      'component': 'Component name (e.g., User, Unit, Web4Requirement)',
      'version': 'Version string (e.g., latest, v1.0, 0.3.0.5)'
    };
    
    return descriptions[paramName] || `${paramName.charAt(0).toUpperCase() + paramName.slice(1)} parameter`;
  }

  /**
   * Infer parameter type based on name patterns
   */
  private inferParameterType(methodName: string, paramName: string): string {
    const typeMap: { [key: string]: string } = {
      'uuid': 'string (UUID format)',
      'name': 'string',
      'description': 'string',
      'typeM3': 'TypeM3 enum',
      'filename': 'string (file path)',
      'input': 'JSON object',
      'search-term': 'string',
      'pattern': 'string (regex pattern)',
      'file-path': 'string (relative path)',
      'key': 'string',
      'value': 'any',
      'component': 'string',
      'version': 'string'
    };
    
    return typeMap[paramName] || 'any';
  }

  /**
   * Determine if parameter is required based on method and position
   */
  private isParameterRequired(methodName: string, index: number): boolean {
    // First parameters are usually required, later ones optional
    if (index === 0) return true;
    if (methodName === 'create' && index <= 1) return true;
    if (methodName.includes('delete') || methodName.includes('find')) return true;
    return index < 2; // Default: first 2 parameters required
  }

  /**
   * Generate parameter examples based on parameter name
   */
  private generateParameterExamples(paramName: string): string[] {
    const examples: { [key: string]: string[] } = {
      'name': ['auth-validator', 'user-manager', 'data-processor'],
      'uuid': ['a1b2c3d4-e5f6', '12345678-1234-1234-1234-123456789abc'],
      'description': ['User authentication validation', 'Data processing component'],
      'typeM3': ['CLASS', 'ATTRIBUTE', 'RELATIONSHIP'],
      'filename': ['UserValidator.ts', 'auth-validator.unit'],
      'input': ['{"user": "test"}', '{"data": "sample"}'],
      'search-term': ['authentication', 'validation', 'empty constructor'],
      'file-path': ['scrum.pmo/sprints/sprint-20/', 'components/Unit/0.3.0.5/']
    };
    
    return examples[paramName] || [`${paramName}-example`];
  }

  /**
   * Extract method description from method name with detailed descriptions
   */
  private extractMethodDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      'create': 'Create new component with name, optional description, and optional classification',
      'classify': 'Set MOF typeM3 classification for existing component',
      'link': 'Create initial link to existing component using UUID',
      'linkInto': 'Create additional link to same component in different location',
      'list': 'List all links pointing to specific component UUID',
      'origin': 'Show origin and definition source links as clickable URLs',
      'deleteLink': 'Delete specific link file while preserving component in central storage',
      'deleteUnit': 'Delete entire component from central storage and all associated link files',
      'from': 'Create component from file text with extracted name and origin',
      'definition': 'Add definition source reference to existing component',
      'execute': 'Execute component with input data',
      'info': 'Display current component information and scenario',
      'help': 'Show this help message',
      'transform': 'Transform input data using component logic',
      'validate': 'Validate object against component rules',
      'process': 'Process data through component workflow',
      'init': 'Initialize component with scenario data',
      'toScenario': 'Convert component state to scenario format',
      'upgrade': 'Upgrade component to newer version',
      'find': 'Search for components by content or properties',
      'set': 'Set property value for existing component',
      'update': 'Update component properties or regenerate components'
    };
    
    // Check for exact match
    if (descriptions[name]) {
      return descriptions[name];
    }
    
    // Check for partial matches
    for (const [pattern, desc] of Object.entries(descriptions)) {
      if (name.includes(pattern)) {
        return desc.replace('component', name.includes('Unit') ? 'unit' : 'component');
      }
    }
    
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
      toolName: '\x1b[1;36m',      // Cyan for unit
      version: '\x1b[1;36m',       // Cyan for version
      commands: '\x1b[0;37m',      // White for commands
      parameters: '\x1b[1;33m',    // Yellow for parameters
      descriptions: '\x1b[0;32m',  // Green for documentation
      examples: '\x1b[0;37m',      // White for examples (commands)
      sections: '\x1b[1;37m',      // White bold for section headers
      reset: '\x1b[0m'             // Reset
    };
  }

  /**
   * Assemble command section with color coding
   */
  protected assembleCommandSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    
    let output = `${colors.sections}Commands:${colors.reset}\n`;
    
    // Calculate max command name length for alignment
    const maxCommandLength = Math.max(...methods.map(m => m.name.length));
    
    for (const method of methods) {
      const padding = ' '.repeat(maxCommandLength - method.name.length + 3);
      output += `  ${colors.commands}${method.name}${colors.reset}${padding}${colors.descriptions}${method.description}${colors.reset}\n`;
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
    
    // Calculate max parameter name length for column alignment
    const maxParamLength = Math.max(...Array.from(uniqueParams.keys()).map(name => name.length + 2)); // +2 for < >
    
    for (const [name, param] of uniqueParams) {
      const paramDisplay = `<${name}>`;
      const padding = ' '.repeat(maxParamLength - paramDisplay.length + 3);
      output += `  ${colors.parameters}${paramDisplay}${colors.reset}${padding}${colors.descriptions}${param.description}${colors.reset}\n`;
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
          const componentName = this.getComponentName().toLowerCase();
          const exampleParams = method.parameters.map(p => {
            const examples = this.generateParameterExamples(p.name);
            return examples[0] || p.name;
          }).join(' ');
          
          const exampleCommand = `${componentName} ${method.name} ${exampleParams}`;
          const padding = ' '.repeat(Math.max(1, 50 - exampleCommand.length));
          
          output += `  ${colors.commands}${componentName}${colors.reset} ${colors.commands}${method.name}${colors.reset} ${colors.parameters}${exampleParams}${colors.reset}${padding}${colors.descriptions}# ${method.description}${colors.reset}\n`;
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
    
    // Show key methods with proper parameter syntax
    const keyMethods = ['create', 'classify', 'link', 'list', 'deleteLink', 'execute', 'info', 'help'];
    const displayMethods = methods.filter(m => keyMethods.includes(m.name)).slice(0, 8);
    
    // Calculate max command length for column alignment
    let maxCommandLength = 0;
    for (const method of displayMethods) {
      const paramList = method.parameters.map(p => {
        return p.required ? `<${p.name}>` : `[${p.name}]`;
      }).join(' ');
      const fullCommand = `${componentName.toLowerCase()} ${method.name} ${paramList}`;
      maxCommandLength = Math.max(maxCommandLength, fullCommand.length);
    }
    
    for (const method of displayMethods) {
      const paramList = method.parameters.map(p => {
        return p.required ? `<${p.name}>` : `[${p.name}]`;
      }).join(' ');
      
      const commandPart = `${componentName.toLowerCase()} ${method.name}`;
      const fullCommand = `${commandPart} ${paramList}`;
      const padding = ' '.repeat(Math.max(1, maxCommandLength - fullCommand.length + 3));
      
      output += `  ${colors.commands}${componentName.toLowerCase()} ${method.name}${colors.reset} ${colors.parameters}${paramList}${colors.reset}${padding}${colors.descriptions}# ${method.description}${colors.reset}\n`;
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