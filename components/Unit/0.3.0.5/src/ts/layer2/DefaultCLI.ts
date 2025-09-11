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
      
      // Try to extract parameters using enhanced TSCompletion static methods
      if (typeof TSCompletion.getEnhancedMethodParameters === 'function') {
        const paramInfo = TSCompletion.getEnhancedMethodParameters(this.componentClass.name, methodName);
        
        return paramInfo.map((param: any, index: number) => {
          const paramName = param.name || this.generateIntelligentParameterName(methodName, index);
          const paramType = param.type || 'any';
          
          return {
            name: paramName,
            type: paramType,
            required: param.required !== false,
            description: param.description || this.generateParameterDescription(methodName, paramName, index),
            examples: this.generateParameterExamples(paramName),
            validation: [],
            // ✅ NEW: Union type detection for CLI syntax generation
            isUnionType: this.isUnionType(paramType),
            unionTypes: this.extractUnionTypes(paramType)
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
   * Generate parameter names from TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven parameter name extraction
   */
  private generateIntelligentParameterName(methodName: string, index: number): string {
    // ✅ ZERO MAPPING: Extract directly from TypeScript AST via TSCompletion
    try {
      const paramInfo = TSCompletion.getEnhancedMethodParameters(this.componentClass.name, methodName);
      if (paramInfo && paramInfo[index]) {
        return paramInfo[index].name; // ✅ Direct from TypeScript source
      }
    } catch (error) {
      // Fallback only if TSCompletion fails
    }
    
    // ✅ WEB4 CONVENTION: Generic parameter naming based on position
    const genericPatterns = ['identifier', 'target', 'data', 'options'];
    return genericPatterns[index] || `param${index + 1}`;
  }

  /**
   * Generate parameter description based on name and context
   */
  /**
   * Generate parameter description from pure TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven description extraction
   */
  private generateParameterDescription(methodName: string, paramName: string, index: number): string {
    // ✅ ZERO MAPPING: Extract directly from TSDoc via TSCompletion
    try {
      const paramInfo = TSCompletion.getEnhancedMethodParameters(this.componentClass.name, methodName);
      const param = paramInfo.find((p: any) => p.name === paramName);
      if (param && param.description) {
        return param.description; // ✅ Direct from TSDoc
      }
    } catch (error) {
      // Continue to fallback
    }
    
    // ✅ WEB4 CONVENTION: Minimal fallback for missing TSDoc
    return `${paramName.charAt(0).toUpperCase() + paramName.slice(1)} parameter (add TSDoc description)`;
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
   * Generate parameter examples from pure TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven example extraction from @example tags
   */
  private generateParameterExamples(paramName: string): string[] {
    // ✅ ZERO MAPPING: Extract examples from TSDoc @example tags
    try {
      // This would extract from @example sections in JSDoc
      // For now, use convention-based generation until TSDoc example extraction is implemented
      return this.deriveExamplesFromConventions(paramName);
    } catch (error) {
      return [`${paramName}-example`];
    }
  }

  /**
   * Derive examples from Web4 parameter naming conventions
   * Web4 pattern: Convention-driven example generation with zero configuration
   */
  private deriveExamplesFromConventions(paramName: string): string[] {
    // ✅ WEB4 CONVENTION: Derive examples from parameter name patterns
    
    // Unit reference convention
    if (paramName.includes('unit') || paramName === 'identifier') {
      return ['44443290-015c-4720-be80-c42caf842252', 'TSCompletion.ts.unit'];
    }
    
    // Folder convention
    if (paramName.toLowerCase().includes('folder') || paramName.toLowerCase().includes('directory')) {
      return ['backup/', 'temp/', 'components/'];
    }
    
    // File convention
    if (paramName.toLowerCase().includes('file') || paramName === 'filename') {
      return ['component.ts', 'auth-validator.unit', 'data.json'];
    }
    
    // Name convention
    if (paramName === 'name') {
      return ['Auth.Validator', 'User.Manager', 'Data.Processor'];
    }
    
    // Description convention
    if (paramName === 'description') {
      return ['"Component description"', '"Authentication validation"'];
    }
    
    // Position convention
    if (paramName.includes('Pos') || paramName.includes('position')) {
      return ['1,1', '5,10', '12,5'];
    }
    
    // Default: parameter name example
    return [`${paramName}-example`];
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
   * Check if parameter type is a union type
   * Web4 pattern: Union type detection for CLI syntax generation
   */
  private isUnionType(paramType: string): boolean {
    // Detect TypeScript union types (e.g., "UUIDv4 | string", "string | number")
    return paramType.includes(' | ') || paramType.includes('|');
  }

  /**
   * Extract individual types from union type
   * Web4 pattern: Union type parsing for CLI documentation
   */
  private extractUnionTypes(paramType: string): string[] {
    if (!this.isUnionType(paramType)) {
      return [paramType];
    }
    
    // Split union type and clean up whitespace
    return paramType.split('|').map(type => type.trim());
  }

  /**
   * Generate CLI parameter syntax from pure TSDoc conventions with zero mapping code
   * Web4 pattern: Pure convention-driven CLI syntax generation
   */
  private generateParameterSyntax(param: any): string {
    // ✅ ZERO MAPPING: Derive CLI syntax from TSDoc description conventions
    const description = param.description || '';
    
    // ✅ WEB4 CONVENTION: Parse union type syntax from description patterns
    
    // Pattern: "UUID or .unit file" or "UUID string or file path"
    if ((description.includes('UUID') || description.includes('uuid')) && 
        (description.includes('file') || description.includes('path'))) {
      return param.required ? '<uuid|lnfile>' : '[uuid|lnfile]';
    }
    
    // Pattern: "Type1 or .ext file"
    const unionMatch = description.match(/(\w+)\s+or\s+\.(\w+)\s+file/i);
    if (unionMatch) {
      const type1 = unionMatch[1].toLowerCase();
      const type2 = unionMatch[2].toLowerCase();
      return param.required ? `<${type1}|${type2}file>` : `[${type1}|${type2}file]`;
    }
    
    // ✅ WEB4 CONVENTION: Derive from TypeScript union types
    if (param.isUnionType && param.unionTypes) {
      const typeNames = param.unionTypes.map((type: string) => this.simplifyTypeName(type));
      return param.required ? `<${typeNames.join('|')}>` : `[${typeNames.join('|')}]`;
    }
    
    // ✅ WEB4 CONVENTION: Derive from description keywords
    if (description.toLowerCase().includes('directory')) {
      return param.required ? '<folder>' : '[folder]';
    }
    
    if (description.toLowerCase().includes('file') && !unionMatch) {
      return param.required ? '<filename>' : '[filename]';
    }
    
    if (description.toLowerCase().includes('json format')) {
      return param.required ? '<json>' : '[json]';
    }
    
    if (description.toLowerCase().includes('line,column format')) {
      return param.required ? '<position>' : '[position]';
    }
    
    // ✅ WEB4 CONVENTION: Default to parameter name from TypeScript
    return param.required ? `<${param.name}>` : `[${param.name}]`;
  }

  /**
   * Check if union types represent UnitIdentifier (UUIDv4 | string)
   */
  private isUnitIdentifierType(unionTypes: string[]): boolean {
    const hasUUID = unionTypes.some(type => type.includes('UUID') || type.includes('uuid'));
    const hasString = unionTypes.some(type => type.includes('string') || type.includes('String'));
    return hasUUID && hasString;
  }

  /**
   * Simplify TypeScript type names for CLI display
   */
  private simplifyTypeName(typeName: string): string {
    // Map TypeScript types to CLI-friendly names
    const typeMap: { [key: string]: string } = {
      'UUIDv4': 'uuid',
      'string': 'lnfile',
      'number': 'num',
      'boolean': 'bool'
    };
    
    // Extract base type name (remove import paths, generics, etc.)
    const baseType = typeName.replace(/.*\./, '').replace(/<.*>/, '');
    return typeMap[baseType] || baseType.toLowerCase();
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
   * Assemble unified Commands section with two-line format and union type support
   */
  protected assembleUnifiedCommandsSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    const componentName = this.getComponentName();
    
    let output = `${colors.sections}Commands:${colors.reset}\n`;
    
    // Generate two-line command format: command line + description line
    for (const method of methods) {
      // ✅ NEW: Generate parameter syntax with union type support
      const paramList = method.parameters.map((p: any) => {
        return this.generateParameterSyntax(p);
      }).join(' ');
      
      // Line 1: Command with parameters (enhanced with union type syntax)
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