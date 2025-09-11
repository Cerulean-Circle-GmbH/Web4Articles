/**
 * DefaultCLI - Base CLI implementation with common utilities
 * Web4 pattern: Abstract base class implementing CLI interface with static start
 * Purpose: Foundation CLI class with common utilities and Web4 radical OOP patterns
 */

import { CLI } from '../layer3/CLI.interface.js';
import { MethodInfo } from '../layer3/MethodInfo.interface.js';
import { ComponentAnalysis } from '../layer3/ComponentAnalysis.interface.js';
import { ColorScheme, DocumentationSections } from '../layer3/ColorScheme.interface.js';
import { TSCompletion } from '../layer4/TSCompletion.js';

export abstract class DefaultCLI implements CLI {
  protected componentClass: any;
  protected componentName: string = '';
  protected componentVersion: string = '';
  protected componentInstance: any | null = null;
  protected methodSignatures: Map<string, MethodSignature> = new Map();
  
  constructor() {
    // Empty constructor - Web4 pattern
    // NO component instantiation for usage display
  }
  
  /**
   * Initialize CLI with component class reference (NOT instance)
   */
  initWithComponentClass(componentClass: any, name: string, version: string): this {
    this.componentClass = componentClass;
    this.componentName = name;
    this.componentVersion = version;
    this.discoverMethods(); // TSRanger 2.2 pattern
    return this;
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
   * Initialize CLI with component context (legacy - use initWithComponentClass)
   */
  init(component: any): this {
    // Legacy method - component instance initialization
    this.componentInstance = component;
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
    if (!this.componentClass) return;
    
    const prototype = this.componentClass.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => typeof prototype[name] === 'function')
      .filter(name => !name.startsWith('_') && name !== 'constructor')
      .filter(name => !['init', 'toScenario', 'validateModel', 'getModel'].includes(name));

    for (const methodName of methodNames) {
      const method = prototype[methodName];
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
    
    // Dynamic argument validation with overload support
    const minArgs = this.getMinimumArguments(command);
    if (args.length < minArgs) {
      throw new Error(`At least ${minArgs} arguments required for ${command} command`);
    }

    // Dynamic method invocation with lazy instantiation
    const componentInstance = this.getComponentInstance();
    const method = componentInstance[command];
    
    if (signature.isAsync) {
      await method.apply(componentInstance, args);
    } else {
      method.apply(componentInstance, args);
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
   * Analyze component methods for dynamic documentation generation using class reference
   */
  protected analyzeComponentMethods(): MethodInfo[] {
    if (!this.componentClass) return [];
    
    const methods: MethodInfo[] = [];
    const prototype = this.componentClass.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype);
    
    for (const name of methodNames) {
      if (name === 'constructor' || name.startsWith('_')) continue;
      
      const method = prototype[name];
      if (typeof method === 'function') {
        methods.push({
          name: name,
          parameters: this.extractParameterInfoFromTSCompletion(name),
          description: this.extractMethodDescriptionFromTSDoc(name),
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
   * Get minimum arguments for overloaded methods
   */
  private getMinimumArguments(command: string): number {
    // Handle overloaded methods with different minimum arguments
    const overloadedMethods: { [key: string]: number } = {
      'from': 1,  // Can be called with 1 (file) or 3 (file, start, end) arguments
    };
    
    return overloadedMethods[command] || this.methodSignatures.get(command)?.paramCount || 0;
  }

  /**
   * Get component instance only when method is actually called (lazy instantiation)
   */
  protected getComponentInstance(): any {
    if (!this.componentInstance && this.componentClass) {
      this.componentInstance = new this.componentClass();
      // Initialize with empty scenario if component supports it
      if (typeof this.componentInstance.init === 'function') {
        const emptyScenario = this.createEmptyScenario();
        this.componentInstance.init(emptyScenario);
      }
    }
    return this.componentInstance;
  }

  /**
   * Create empty scenario for component initialization
   */
  private createEmptyScenario(): any {
    return {
      ior: { uuid: crypto.randomUUID(), component: this.componentName, version: this.componentVersion },
      owner: '',
      model: {
        uuid: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * Extract parameter information using TSCompletion from TSRanger 2.2
   */
  private extractParameterInfoFromTSCompletion(methodName: string): any[] {
    try {
      // Use TSCompletion static methods to get parameter information from TypeScript source
      
      // Try to extract parameters using TSCompletion static methods
      if (typeof TSCompletion.getMethodParameters === 'function') {
        const paramInfo = TSCompletion.getMethodParameters(this.componentClass.name, methodName);
        
        return paramInfo.map((param: any, index: number) => {
          const paramName = param.name || this.generateIntelligentParameterName(methodName, index);
          return {
            name: paramName,
            type: param.type || 'any',
            required: param.required !== false,
            description: param.description || this.generateParameterDescription(methodName, paramName, index),
            examples: this.generateParameterExamples(paramName),
            validation: []
          };
        });
      }
      
      // Fallback to intelligent parameter extraction
      return this.extractParameterInfoFallback(methodName);
    } catch (error) {
      // Fallback to reflection-based approach
      return this.extractParameterInfoFallback(methodName);
    }
  }

  /**
   * Extract method description using TSDoc from TypeScript source
   */
  private extractMethodDescriptionFromTSDoc(methodName: string): string {
    try {
      // Use TSCompletion static methods to extract JSDoc comments from TypeScript source
      
      // Try to extract JSDoc using TSCompletion static methods
      if (typeof (TSCompletion as any).extractJsDocText === 'function') {
        // Use TSCompletion to analyze TypeScript source files for JSDoc
        const jsDocText = (TSCompletion as any).extractJsDocText(this.componentClass.name, methodName);
        if (jsDocText && jsDocText.trim()) {
          return jsDocText.trim();
        }
      }
      
      // For now, fallback to intelligent description
      return this.extractMethodDescriptionFallback(methodName);
    } catch (error) {
      // Fallback to intelligent description
    }
    
    return this.extractMethodDescriptionFallback(methodName);
  }

  /**
   * Fallback parameter extraction using reflection
   */
  private extractParameterInfoFallback(methodName: string): any[] {
    const method = this.componentClass.prototype[methodName];
    if (!method) return [];
    
    const paramCount = method.length;
    const params = [];
    
    for (let i = 0; i < paramCount; i++) {
      const paramName = this.generateIntelligentParameterName(methodName, i);
      params.push({
        name: paramName,
        type: this.inferParameterType(methodName, paramName),
        required: this.isParameterRequired(methodName, i),
        description: this.generateParameterDescription(methodName, paramName, i),
        examples: this.generateParameterExamples(paramName),
        validation: []
      });
    }
    
    return params;
  }

  /**
   * Fallback method description extraction
   */
  private extractMethodDescriptionFallback(methodName: string): string {
    const descriptions: { [key: string]: string } = {
      'create': 'Create new component with name, optional description, and optional classification',
      'classify': 'Set MOF typeM3 classification for existing component',
      'link': 'Create initial link to existing component using UUID',
      'deleteLink': 'Delete specific link file while preserving component in central storage',
      'list': 'List all links pointing to specific component UUID',
      'from': 'Create component from file text with extracted name and origin',
      'execute': 'Execute component with input data',
      'transform': 'Transform input data using component logic',
      'validate': 'Validate object against component rules',
      'process': 'Process data through component workflow'
    };
    
    if (descriptions[methodName]) {
      return descriptions[methodName];
    }
    
    for (const [pattern, desc] of Object.entries(descriptions)) {
      if (methodName.includes(pattern)) {
        return desc.replace('component', this.componentName.toLowerCase());
      }
    }
    
    return `${methodName.charAt(0).toUpperCase() + methodName.slice(1)} operation`;
  }

  /**
   * Extract parameter information from method with intelligent naming (legacy)
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
      'linkIntoCopy': ['uuid', 'filename', 'targetfolder'],
      'list': ['uuid'],
      'origin': ['uuid'],
      'deleteLink': ['linkfile'],
      'deleteUnit': ['linkfile'],
      'from': ['filename', 'startPos', 'endPos'],
      'definition': ['uuid', 'filename', 'startPos', 'endPos'],
      'execute': ['name', 'input'],
      'set': ['uuid', 'key', 'value'],
      'find': ['search-term'],
      'replace': ['pattern', 'file-path'],
      'update': ['component', 'version'],
      'init': ['uuid'],
      'transform': ['uuid'],
      'validate': ['uuid'],
      'process': ['input'],
      'validateModel': ['uuid'],
      'toScenario': ['uuid'],
      'addExecutionCapability': ['uuid'],
      'getModel': ['uuid'],
      'extractUuidFromPath': ['path'],
      'calculateRelativePath': ['fromPath', 'toPath'],
      'get': ['key'],
      'store': ['key', 'value'],
      'renameLink': ['oldLinkPath', 'newLinkPath'],
      'rename': ['newName']
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
      'name': 'Component name for identification (kebab-case preferred)',
      'uuid': 'Unique identifier (36-character UUID format)',
      'description': 'Detailed description of the component or operation (quoted string)',
      'typeM3': 'MOF M3 metamodel classification (CLASS, ATTRIBUTE, RELATIONSHIP)',
      'filename': 'File path for links or source references (relative to project root)',
      'linkfile': 'Link file path with .link extension for component reference',
      'targetfolder': 'Target directory for component placement (relative path)',
      'start:line,column': 'Starting position in file (line,column format like 5,10)',
      'end:line,column': 'Ending position in file (line,column format like 15,30)',
      'startPos': 'Starting position in file (line,column format like 5,10)',
      'endPos': 'Ending position in file (line,column format like 15,30)',
      'input': 'JSON input data for processing (quoted JSON string)',
      'search-term': 'Search term for finding components (quoted string)',
      'pattern': 'Pattern to search and replace (regex supported)',
      'file-path': 'File or directory path (relative to project root)',
      'path': 'File or directory path (relative to project root)',
      'fromPath': 'Source path for relative calculation (relative to project root)',
      'toPath': 'Target path for relative calculation (relative to project root)',
      'key': 'Property key to set or modify (string identifier)',
      'value': 'Property value to assign (string or JSON)',
      'component': 'Component name (e.g., User, Unit, Web4Requirement)',
      'version': 'Version string (e.g., latest, v1.0, 0.3.0.5)',
      'oldLinkPath': 'Current link file path (relative to project root, .unit/.link extension)',
      'newLinkPath': 'New link file path (relative to project root, .unit/.link extension)',
      'newName': 'New name for the unit (kebab-case preferred, will update all references)',
      'arg1': 'First method argument (context-dependent parameter)',
      'arg2': 'Second method argument (context-dependent parameter)',
      'arg3': 'Third method argument (context-dependent parameter)'
    };
    
    // Handle special parameter patterns
    if (paramName.includes(':')) {
      if (paramName.includes('start:') || paramName.includes('end:')) {
        return 'File position in line,column format (e.g., 5,10)';
      }
    }
    
    return descriptions[paramName] || `${paramName.charAt(0).toUpperCase() + paramName.slice(1)} parameter (see method documentation)`;
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
      'uuid': ['a1b2c3d4-e5f6-7890-abcd-ef1234567890', '12345678-1234-1234-1234-123456789abc'],
      'description': ['"User authentication validation"', '"Data processing component"', '"Web4 unit for validation"'],
      'typeM3': ['CLASS', 'ATTRIBUTE', 'RELATIONSHIP'],
      'filename': ['components/Unit/0.3.0.5/src/ts/layer2/DefaultUnit.ts', 'auth-validator.unit', 'UserValidator.ts'],
      'input': ['{"user": "test"}', '{"data": "sample"}', '{"name": "example"}'],
      'search-term': ['"authentication"', '"validation"', '"empty constructor"'],
      'file-path': ['scrum.pmo/sprints/sprint-20/', 'components/Unit/0.3.0.5/', 'docs/'],
      'path': ['scrum.pmo/sprints/sprint-20/', 'components/Unit/0.3.0.5/', 'docs/'],
      'fromPath': ['components/Unit/0.3.0.5/', 'scrum.pmo/sprints/', 'docs/'],
      'toPath': ['scenarios/index/', 'components/User/', 'scripts/'],
      'linkfile': ['unit-auth-validator.link', 'user-manager.link', 'data-processor.link'],
      'targetfolder': ['scenarios/index/a/5/0/', 'components/backup/', 'temp/'],
      'start': ['1,1', '5,10', '12,5'],
      'end': ['10,20', '15,30', '25,15'],
      'startPos': ['1,1', '5,10', '12,5'],
      'endPos': ['10,20', '15,30', '25,15'],
      'key': ['"name"', '"description"', '"typeM3"'],
      'value': ['"auth-validator"', '"User validation component"', 'CLASS'],
      'pattern': ['[A-Za-z]+', '\\d{4}-\\d{2}-\\d{2}', 'function\\s+\\w+'],
      'component': ['User', 'Unit', 'Web4Requirement'],
      'version': ['0.3.0.5', 'latest', '1.0.0'],
      'oldLinkPath': ['TSCompletion.unit', 'auth-validator.link', 'components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.unit'],
      'newLinkPath': ['TSCompletion.ts.unit', 'auth-validator-enhanced.link', 'components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts.unit'],
      'newName': ['ts-completion-enhanced', 'auth-validator-v2', 'user-manager-pro']
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
   * Assemble parameter section with specifications and example values
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
    
    // Two-line format for parameters with examples
    for (const [name, param] of uniqueParams) {
      const examples = this.generateParameterExamples(param.name);
      const exampleValue = examples[0] || 'value';
      
      // Line 1: Parameter name and description
      output += `  ${colors.parameters}<${name}>${colors.reset}\n`;
      
      // Line 2: Description and example value
      output += `    ${colors.descriptions}${param.description}${colors.reset}\n`;
      output += `    ${colors.descriptions}Example: ${colors.parameters}${exampleValue}${colors.reset}\n`;
      output += '\n'; // Empty line between parameters for better separation
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
          
          output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}${method.name}${colors.reset} ${colors.parameters}${exampleParams}${colors.reset}${padding}${colors.descriptions}# ${method.description}${colors.reset}\n`;
        }
        output += '\n';
      }
    }
    
    return output;
  }

  /**
   * Generate structured usage output with unified Commands section
   */
  public generateStructuredUsage(): string {
    const colors = this.getTSCompletionColors();
    const componentName = this.getComponentName();
    const version = this.getComponentVersion();
    
    let output = '';
    
    // Header section - ensure unit is cyan
    output += `${colors.toolName}Web4 ${componentName} CLI Tool${colors.reset} v${colors.version}${version}${colors.reset} - Dynamic Method Discovery with Structured Documentation\n\n`;
    
    // Unified Commands section (replaces Usage + Commands)
    output += this.assembleUnifiedCommandsSection();
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
   * Assemble unified Commands section with two-line format for smaller screens
   */
  protected assembleUnifiedCommandsSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    const componentName = this.getComponentName();
    
    let output = `${colors.sections}Commands:${colors.reset}\n`;
    
    // Generate two-line command format: command line + description line
    for (const method of methods) {
      const paramList = method.parameters.map(p => {
        return p.required ? `<${p.name}>` : `[${p.name}]`;
      }).join(' ');
      
      // Line 1: Command with parameters
      output += `  ${colors.toolName}${componentName.toLowerCase()}${colors.reset} ${colors.commands}${method.name}${colors.reset} ${colors.parameters}${paramList}${colors.reset}\n`;
      
      // Line 2: Description indented for better readability
      output += `    ${colors.descriptions}${method.description}${colors.reset}\n`;
      output += '\n'; // Empty line between commands for better separation
    }
    
    return output;
  }

  /**
   * Get component name for documentation
   */
  private getComponentName(): string {
    return this.componentName || 'Unknown';
  }

  /**
   * Get component version for documentation
   */
  private getComponentVersion(): string {
    return this.componentVersion || '0.3.0.5';
  }
}

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}