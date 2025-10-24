/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { CLI } from '../layer3/CLI.interface.js';
import { MethodInfo } from '../layer3/MethodInfo.interface.js';
import { TSCompletion } from '../layer4/TSCompletion.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';
import { webcrypto as crypto } from 'crypto';

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
   * Discovers methods from entire CLI inheritance chain (DefaultCLI and subclasses)
   */
  protected discoverMethods(): void {
    // Walk up the prototype chain to discover ALL CLI methods
    let currentPrototype = Object.getPrototypeOf(this);
    while (currentPrototype && currentPrototype !== Object.prototype) {
      const methodNames = Object.getOwnPropertyNames(currentPrototype)
        .filter(name => typeof currentPrototype[name] === 'function')
        .filter(name => !name.startsWith('_') && name !== 'constructor')
        .filter(name => !['init', 'toScenario', 'validateModel', 'getModel'].includes(name));

      for (const methodName of methodNames) {
        // Don't overwrite if already discovered (subclass takes precedence)
        if (!this.methodSignatures.has(methodName)) {
          const method = currentPrototype[methodName];
          this.methodSignatures.set(methodName, {
            name: methodName,
            paramCount: method.length,
            isAsync: method.constructor.name === 'AsyncFunction'
          });
        }
      }
      
      // Move up the chain
      currentPrototype = Object.getPrototypeOf(currentPrototype);
    }
    
    // Also discover component methods if componentClass is set
    if (this.componentClass) {
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

    // Check if method exists on CLI (this) or component
    // CLI methods take precedence (e.g., completeParameter, actionParameterCompletion)
    if (typeof (this as any)[command] === 'function') {
      // Execute on CLI instance (DefaultCLI or Web4TSComponentCLI)
      const method = (this as any)[command];
      if (signature.isAsync) {
        await method.apply(this, args);
      } else {
        method.apply(this, args);
      }
    } else {
      // Fallback to component instance
      const componentInstance = this.getComponentInstance();
      const method = componentInstance[command];
      
      if (signature.isAsync) {
        await method.apply(componentInstance, args);
      } else {
        method.apply(componentInstance, args);
      }
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
    
    // Whitelist for internal CLI methods that start with __ (hidden but executable)
    const internalCLIMethods = ['__completeParameter'];
    
    for (const name of methodNames) {
      // Skip constructor and private methods (except whitelisted internal CLI methods)
      if (name === 'constructor') continue;
      if (name.startsWith('_') && !internalCLIMethods.includes(name)) continue;
      
      // ✅ ZERO CONFIG: Check @cliHide annotation with enhanced processing
      const cliAnnotations = TSCompletion.extractCliAnnotations(this.componentClass.name, name);
      if (cliAnnotations.hide) {
        continue;
      }
      
      const method = prototype[name];
      if (typeof method === 'function') {
        methods.push({
          name: name,
          parameters: this.extractParameterInfoFromTSCompletion(name),
          description: this.extractMethodDescriptionFromTSDoc(name),
          examples: this.extractExamplesFromTSDoc(name),
          returnType: 'any',
          isPublic: !name.startsWith('_'),
          category: this.categorizeMethod(name)
        });
      }
    }
    
    return methods;
  }

  /**
   * Extract method description from TSDoc annotations
   */
  private extractMethodDescriptionFromTSDoc(methodName: string): string {
    try {
      // Try to extract description from TSCompletion
      const componentInstance = this.getComponentInstance();
      if (componentInstance) {
        const componentClassName = componentInstance.constructor.name;
        // Get full method documentation using TSCompletion
        const fullMethodDoc = TSCompletion.getMethodDoc(componentClassName, methodName);
        
        if (fullMethodDoc) {
          // Extract first meaningful line from TSDoc
          const lines = fullMethodDoc.split('\n');
          for (const line of lines) {
            const cleaned = line.replace(/^\s*\*\s*/, '').trim();
            if (cleaned && !cleaned.startsWith('@') && cleaned !== '/**' && cleaned !== '*/') {
              return cleaned;
            }
          }
        }
      }
    } catch (error) {
      // Continue to fallback
    }
    
    // If TSDoc extraction failed, return method name only (no fallback descriptions)
    return methodName;
  }

  /**
   * Extract examples from TSDoc @example annotations
   */
  private extractExamplesFromTSDoc(methodName: string): string[] {
    try {
      const componentInstance = this.getComponentInstance();
      if (componentInstance) {
        const componentClassName = componentInstance.constructor.name;
        
        // Get full method documentation using TSCompletion
        const fullMethodDoc = TSCompletion.getMethodDoc(componentClassName, methodName);
        
        if (fullMethodDoc) {
          const examples: string[] = [];
          const lines = fullMethodDoc.split('\n');
          let inExampleSection = false;
          
          for (const line of lines) {
            const cleaned = line.replace(/^\s*\*\s*/, '').trim();
            
            if (cleaned.startsWith('@example')) {
              inExampleSection = true;
              const exampleText = cleaned.replace('@example', '').trim();
              if (exampleText) {
                examples.push(exampleText);
              }
            } else if (inExampleSection && cleaned && !cleaned.startsWith('@')) {
              examples.push(cleaned);
            } else if (cleaned.startsWith('@') && !cleaned.startsWith('@example')) {
              inExampleSection = false;
            }
          }
          
          if (examples.length > 0) {
            return examples;
          }
        }
      }
    } catch (error) {
      // Continue to fallback
    }
    
    // If no TSDoc examples found, return method name only
    return [methodName];
  }

  /**
   * Get TypeScript files for JSDoc extraction
   */
  private getTypeScriptFiles(): string[] {
    const files = [];
    
    try {
      // Look for TypeScript files in src/ts/layer directories
      const srcDir = join(process.cwd(), 'src', 'ts');
      for (let layer = 2; layer <= 5; layer++) {
        const layerDir = join(srcDir, `layer${layer}`);
        if (existsSync(layerDir)) {
          const layerFiles = readdirSync(layerDir)
            .filter((file: string) => file.endsWith('.ts'))
            .map((file: string) => join(layerDir, file));
          files.push(...layerFiles);
        }
      }
    } catch (error) {
      // Continue with empty files array
    }
    
    return files;
  }

  /**
   * Extract JSDoc text for a specific method
   */
  private extractJsDocForMethod(methodName: string, componentClassName?: string): string {
    try {
      // Get TypeScript files for JSDoc extraction
      const files = this.getTypeScriptFiles();
      const classNameToFind = componentClassName || this.componentClass.name;
      
      for (const file of files) {
        const src = readFileSync(file, 'utf8');
        const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
        
        const jsDoc = this.findMethodJsDoc(sourceFile, classNameToFind, methodName);
        if (jsDoc) {
          return jsDoc;
        }
      }
    } catch (error) {
      // Fallback to default descriptions
    }
    
    return '';
  }

  /**
   * Find JSDoc for specific method in source file
   */
  private findMethodJsDoc(sourceFile: any, className: string, methodName: string): string {
    let jsDocText = '';
    
    ts.forEachChild(sourceFile, (node: any) => {
      if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name) && member.name.text === methodName) {
            // Get JSDoc comments
            const jsDocComments = ts.getJSDocCommentsAndTags(member);
            for (const comment of jsDocComments) {
              if (ts.isJSDoc(comment)) {
                jsDocText += comment.getFullText();
              }
            }
            break;
          }
        }
      }
    });
    
    return jsDocText;
  }

  /**
   * Get minimum arguments for overloaded methods
   */
  protected getMinimumArguments(command: string): number {
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
   * Categorize method based on name patterns
   */
  private categorizeMethod(name: string): 'create' | 'modify' | 'query' | 'delete' | 'utility' | 'context' {
    if (name === 'on') return 'context'; // Special category for context loading
    if (name.includes('create') || name.includes('add')) return 'create';
    if (name.includes('update') || name.includes('set') || name.includes('upgrade')) return 'modify';
    if (name.includes('get') || name.includes('find') || name.includes('list') || name.includes('info')) return 'query';
    if (name.includes('delete') || name.includes('remove')) return 'delete';
    return 'utility';
  }

  /**
   * Get TSCompletion color scheme
   */
  protected getTSCompletionColors(): any {
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
   * Assemble parameter section with radical elimination of redundant parameters
   * Web4 pattern: Occam's Razor parameter documentation with value-based filtering
   */
  protected assembleParameterSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    const allParams = new Map<string, any>();
    
    // Collect all parameters
    for (const method of methods) {
      for (const param of method.parameters) {
        if (!allParams.has(param.name)) {
          allParams.set(param.name, param);
        }
      }
    }
    
    // ✅ ZERO CONFIG: Group parameters by @cliSyntax annotation
    const parameterGroups = this.groupParametersBySyntax(allParams);
    
    let output = `${colors.sections}Parameters:${colors.reset}\n`;
    
    // Generate documentation for unique parameter syntax types only
    for (const [syntaxType, param] of parameterGroups) {
      const examples = this.generateParameterExamples(param.name);
      
      // ✅ ENHANCED: Use enhanced optional formatting
      const syntax = this.generateParameterSyntax(param, 'linkInto'); // Use a method name for annotation access
      
      // Line 1: Parameter syntax
      output += `  ${colors.parameters}${syntax}${colors.reset}\n`;
      
      // Line 2: Description (from TSDoc or convention)
      const description = param.description || this.getConventionDescription(syntaxType);
      output += `    ${colors.descriptions}${description}${colors.reset}\n`;
      
      // Line 3: Examples (multiple if available)
      if (examples.length > 0) {
        for (let i = 0; i < Math.min(2, examples.length); i++) {
          output += `    ${colors.descriptions}Example: ${colors.parameters}${examples[i]}${colors.reset}\n`;
        }
      }
      output += '\n'; // Empty line between parameters
    }
    
    return output;
  }

  /**
   * Group parameters by CLI syntax type with zero config through @cliSyntax annotations
   * Web4 pattern: Pure TSDoc annotation-driven parameter grouping
   */
  private groupParametersBySyntax(allParams: Map<string, any>): Map<string, any> {
    const syntaxGroups = new Map<string, any>();
    
    // ✅ ZERO CONFIG: Group parameters by their @cliSyntax annotations
    for (const [paramName, param] of allParams) {
      // Get CLI syntax from @cliSyntax annotation or derive from conventions
      let syntaxType = this.getParameterSyntaxType(param, paramName);
      
      // Only add first occurrence of each syntax type
      if (!syntaxGroups.has(syntaxType)) {
        syntaxGroups.set(syntaxType, {
          ...param,
          syntaxType: syntaxType
        });
      }
    }
    
    return syntaxGroups;
  }

  /**
   * Get parameter syntax type from @cliSyntax annotation or conventions
   * Web4 pattern: Zero config syntax type detection
   */
  private getParameterSyntaxType(param: any, paramName: string): string {
    // ✅ ZERO CONFIG: Check @cliSyntax annotation in parameter description
    const description = param.description || '';
    const syntaxMatch = description.match(/@cliSyntax\s+([^\s\n]+)/);
    if (syntaxMatch) {
      return syntaxMatch[1]; // Direct from @cliSyntax annotation
    }
    
    // ✅ FALLBACK: Convention-based detection
    if ((description.includes('UUID') || description.includes('uuid')) && 
        (description.includes('file') || description.includes('path'))) {
      return 'uuid|lnfile';
    }
    
    if (description.toLowerCase().includes('directory')) {
      return 'folder';
    }
    
    if (description.toLowerCase().includes('file')) {
      return 'file';
    }
    
    // Default: parameter name
    return paramName;
  }

  /**
   * Get convention-based description for syntax types
   * Web4 pattern: Convention-driven parameter descriptions
   */
  private getConventionDescription(syntaxType: string): string {
    const descriptions: { [key: string]: string } = {
      'uuid|lnfile': 'Unit reference (UUID or .unit file)',
      'folder': 'Directory (relative to project root)',
      'file': 'File path (relative to project root)',
      'position': 'Position (line,column format)',
      'name': 'Component name (spaces become dots)',
      'json': 'Data (JSON format)',
      'boolean': 'Boolean flag (true/false)'
    };
    
    return descriptions[syntaxType] || `${syntaxType} parameter`;
  }

  /**
   * Assemble example section with usage examples highlighting 'on' method chaining
   */
  protected assembleExampleSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.getTSCompletionColors();
    const componentName = this.getComponentName().toLowerCase();
    
    let output = `${colors.sections}Examples:${colors.reset}\n`;
    
    // ✅ HIGHLIGHT: Real chaining syntax (most common usage - works in single command!)
    output += `  ${colors.descriptions}# Method chaining in single command (common pattern - use often!)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}2${colors.reset}                    ${colors.descriptions}# Load context + show structure${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Web4TSComponent 0.3.2.0${colors.reset} ${colors.commands}upgrade${colors.reset} ${colors.parameters}nextBuild${colors.reset}     ${colors.descriptions}# Load + upgrade component${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}MyComponent 0.1.0.0${colors.reset} ${colors.commands}verifyAndFix${colors.reset}              ${colors.descriptions}# Load + fix symlinks${colors.reset}\n`;
    output += '\n';
    output += `  ${colors.descriptions}# Alternative: Separate commands (also works)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset}                        ${colors.descriptions}# 1. Load component context${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}2${colors.reset}                                 ${colors.descriptions}# 2. Show directory structure${colors.reset}\n`;
    output += '\n';
    
    // Standard categorized examples
    const categories = ['create', 'modify', 'query', 'delete', 'utility'];
    
    for (const category of categories) {
      const categoryMethods = methods.filter(m => m.category === category && m.name !== 'on');
      if (categoryMethods.length > 0) {
        output += `  ${colors.descriptions}# ${category.charAt(0).toUpperCase() + category.slice(1)} operations${colors.reset}\n`;
        
        for (const method of categoryMethods.slice(0, 2)) {
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
   * Generate CLI parameter syntax with enhanced optional formatting
   * Web4 pattern: Clear optional parameter syntax with default values
   * Notation: <?param:'defaultValue'> for optional parameters
   */
  private generateParameterSyntax(param: any, methodName?: string): string {
    // Get base syntax from @cliSyntax annotation or conventions
    let baseSyntax = this.getBaseSyntax(param, methodName);
    
    // ✅ ENHANCED: Apply Web4 notation for optional parameters
    if (param.required) {
      return `<${baseSyntax}>`;
    } else {
      // Check for default value in TypeScript or TSDoc
      const defaultValue = this.extractDefaultValue(param, methodName);
      
      if (defaultValue) {
        return `<?${baseSyntax}:'${defaultValue}'>`;  // ✅ Web4 notation: <?parameter:'defaultValue'>
      } else {
        return `<?${baseSyntax}>`;     // ✅ Web4 notation: <?parameter> (no default available)
      }
    }
  }

  /**
   * Get base syntax - ALWAYS use actual TypeScript parameter name
   * Web4 pattern: Zero config, zero convention, zero magic - just the truth!
   * 
   * CRITICAL: NO convention detection here! The parameter name IS the syntax.
   * User expectation: "showHidden" parameter should show as "<?showHidden:'false'>"
   * NOT as "<?file:'false'>" just because description mentions "files"!
   */
  private getBaseSyntax(param: any, methodName?: string): string {
    // ALWAYS return actual TypeScript parameter name - NOTHING ELSE!
    // This is what the user types in the command: web4tscomponent tree 4 false
    // The parameter names ARE: depth, showHidden (not depth, file!)
    return param.name;
  }

  /**
   * Extract default value from TypeScript parameter or TSDoc
   * Web4 pattern: Default value detection for enhanced optional syntax
   */
  private extractDefaultValue(param: any, methodName?: string): string | null {
    // ✅ ZERO CONFIG: Check for @cliDefault annotation
    if (methodName) {
      const cliAnnotations = TSCompletion.extractCliAnnotations(this.componentClass.name, methodName, param.name);
      if (cliAnnotations.default) {
        return cliAnnotations.default;
      }
    }
    
    // ✅ CONVENTION: Common default values based on parameter type
    const description = param.description || '';
    
    if (description.includes('boolean')) {
      return 'false';
    }
    
    if (description.includes('copy tracking') || description.includes('optional')) {
      return null; // Show as <?optional> rather than default
    }
    
    // No default value detected
    return null;
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
      // ✅ ZERO CONFIG: Generate parameter syntax with @cliSyntax annotation support
      const paramList = method.parameters.map((p: any) => {
        return this.generateParameterSyntax(p, method.name);
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
    return this.componentVersion || 'unknown';
  }

  /**
   * Minimal parameter completion for 'action' parameter
   * First iteration: Static list, no dynamic logic
   * 
   * Future: Will be auto-discovered via naming convention
   * See: 2025-10-10-UTC-0340-tscompletion-oop-modernization.pdca.md
   * 
   * @param currentArgs Current argument values (unused in minimal version)
   * @returns Array of action completions
   */
  async actionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return [
      '',         // Empty = default action
      'fix',      // Fix/repair
      'verify',   // Verify/check
      'show',     // Display/show
      'list'      // List items
    ];
  }

  /**
   * Execute parameter completion callback for dynamic tab completion
   * Called by bash completion when TSCompletion returns __CALLBACK__:methodName
   * Web4 pattern: Hidden via @cliHide, not via naming convention
   * @cliHide
   */
  async completeParameter(callbackName: string, ...contextArgs: string[]): Promise<void> {
    // Check if callback method exists on this instance
    if (typeof (this as any)[callbackName] === 'function') {
      // Pass context args to completion method (e.g., ['on', 'ComponentName'] for versionParameterCompletion)
      const values = await (this as any)[callbackName](contextArgs);
      
      // Smart Join (OOSH-inspired, matching TSCompletion.start() logic):
      // If values contain numbered references (e.g. "1:filename") or any item with spaces,
      // join with NEWLINES to trigger bash line-based completion (preserves spaces).
      // Otherwise join with SPACES for backward compatibility (standard single-word completion).
      const hasNumberedRefs = values.some((v: string) => v.match(/^\d+:/));
      const hasSpaces = values.some((v: string) => v.includes(' '));
      
      if (hasNumberedRefs || hasSpaces) {
        // Multi-LINE mode: each value on its own line
        console.log(values.join('\n'));
      } else {
        // Multi-WORD mode: space-separated for compgen -W
        console.log(values.join(' '));
      }
    } else {
      // Callback not found - return empty (no completions)
      console.log('');
    }
  }

  /**
   * Fundamental parameter completion: depth (tree depth, integer values)
   * Used by: tree, and any method with depth parameter
   * @cliHide
   */
  async depthParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  }

  /**
   * Fundamental parameter completion: showHidden (boolean flag)
   * Used by: tree, and any method with showHidden parameter
   * @cliHide
   */
  async showHiddenParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['true', 'false'];
  }

  /**
   * Fundamental parameter completion: skipPromotion (boolean flag)
   * Used by: test, and any method with skipPromotion parameter
   * @cliHide
   */
  async skipPromotionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['true', 'false'];
  }

  /**
   * Fundamental parameter completion: successPromotion (promotion level)
   * Used by: releaseTest for configurable promotion levels
   * @cliHide
   */
  async successPromotionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const allOptions = ['nextPatch', 'nextMinor', 'nextMajor'];
    
    // Apply simple prefix filtering
    const filterPrefix = currentArgs[1]; // The second argument is the prefix to filter by
    
    if (filterPrefix) {
      const filtered = allOptions.filter(option => option.startsWith(filterPrefix));
      return filtered.length > 0 ? filtered : allOptions;
    }
    
    return allOptions;
  }

  /**
   * Fundamental parameter completion: format (output format)
   * Used by: getContext, and any method with format parameter
   * @cliHide
   */
  async formatParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['json', 'bash', 'text', 'xml', 'csv'];
  }

  /**
   * Find project root using git (Web4 standard pattern)
   * Fallback to directory traversal if not in git repo
   * @private
   */
  private findProjectRoot(): string {
    // Try WEB4_PROJECT_ROOT first (if source.env was sourced)
    if (process.env.WEB4_PROJECT_ROOT) {
      return process.env.WEB4_PROJECT_ROOT;
    }
    
    // Fallback: traverse up looking for .git and package.json
    let current = process.cwd();
    while (current !== '/') {
      if (existsSync(join(current, '.git')) && existsSync(join(current, 'package.json'))) {
        return current;
      }
      current = join(current, '..');
    }
    
    // Last resort: current working directory
    return process.cwd();
  }

  /**
   * Get current component context from working directory
   * 
   * Replaces shell detect_component_context() function.
   * TypeScript-first approach: NO environment variables!
   * 
   * Migration: Replaces WEB4_COMPONENT_* ENV vars.
   * See: 2025-10-10-UTC-1002.pdca.md
   * 
   * @param format Output format: 'json' (default) or 'bash'
   * @returns Component context information
   * @example
   *   web4tscomponent getContext
   *   web4tscomponent getContext bash
   */
  async getContext(format: string = 'json'): Promise<void> {
    const cwd = process.cwd();
    const projectRoot = this.findProjectRoot();
    
    // Check if in component directory
    const componentsDir = join(projectRoot, 'components');
    if (!cwd.startsWith(componentsDir)) {
      if (format === 'bash') {
        console.log('export WEB4_COMPONENT_CONTEXT="false"');
      } else {
        console.log(JSON.stringify({ 
          context: false, 
          message: 'Not in component directory',
          cwd,
          projectRoot
        }, null, 2));
      }
      return;
    }
    
    // Parse component path: .../components/ComponentName/version
    const relative = cwd.replace(componentsDir + '/', '');
    const parts = relative.split('/');
    
    if (parts.length < 2) {
      if (format === 'bash') {
        console.log('export WEB4_COMPONENT_CONTEXT="false"');
      } else {
        console.log(JSON.stringify({ 
          context: false, 
          message: 'Invalid component path (need ComponentName/version)',
          cwd,
          projectRoot
        }, null, 2));
      }
      return;
    }
    
    const [componentName, version, ...rest] = parts;
    const componentRoot = join(componentsDir, componentName, version);
    
    if (format === 'bash') {
      // Legacy bash export format (for backwards compat if needed)
      console.log(`export WEB4_COMPONENT_CONTEXT="true"`);
      console.log(`export WEB4_COMPONENT_NAME="${componentName}"`);
      console.log(`export WEB4_COMPONENT_VERSION="${version}"`);
      console.log(`export WEB4_COMPONENT_ROOT="${componentRoot}"`);
    } else {
      // Modern JSON format (default)
      console.log(JSON.stringify({
        context: true,
        componentName,
        version,
        componentRoot,
        projectRoot,
        subdirectory: rest.length > 0 ? rest.join('/') : null
      }, null, 2));
    }
  }

  /**
   * Tab completion for component parameter of 'on' command
   * NOTE: Implemented in base CLI for all Web4 components
   * @cliHide
   */
  async componentParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // Resolve project root from current process
    const cwd = process.cwd();
    const { readdirSync, lstatSync, existsSync } = await import('fs');
    const { join } = await import('path');

    // Find project root by looking for components directory
    let projectRoot = cwd;
    while (!existsSync(join(projectRoot, 'components'))) {
      const parent = join(projectRoot, '..');
      if (parent === projectRoot) break; // Reached filesystem root
      projectRoot = parent;
    }

    try {
      const componentsDir = join(projectRoot, 'components');
      const entries = readdirSync(componentsDir);
      const components: string[] = [];

      for (const entry of entries) {
        const entryPath = join(componentsDir, entry);
        try {
          const stats = lstatSync(entryPath);
          if (stats.isDirectory()) {
            components.push(entry);
          }
        } catch {
          // Skip entries we can't stat
        }
      }
      
      return components.sort();
    } catch {
      return [];
    }
  }

  /**
   * Tab completion for version parameter of 'on' command
   * NOTE: Implemented in base CLI for all Web4 components
   * @cliHide
   */
  async versionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // Extract component name from args (should be the first arg after 'on')
    const componentName = currentArgs[1]; // args: ['on', 'ComponentName', ...]
    
    if (!componentName) {
      return ['latest', 'dev', 'test', 'prod'];
    }
    
    // Resolve project root from current process
    const cwd = process.cwd();
    const { readdirSync, existsSync } = await import('fs');
    const { join } = await import('path');

    // Find project root by looking for components directory
    let projectRoot = cwd;
    while (!existsSync(join(projectRoot, 'components'))) {
      const parent = join(projectRoot, '..');
      if (parent === projectRoot) break; // Reached filesystem root
      projectRoot = parent;
    }
    
    try {
      const componentDir = join(projectRoot, 'components', componentName);
      const entries = readdirSync(componentDir);
      const versions: string[] = ['latest', 'dev', 'test', 'prod'];
      
      for (const entry of entries) {
        // Add semantic version directories
        if (entry.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          versions.push(entry);
        }
      }
      
      // Simple sort: semantic links first, then versions descending
      return versions.sort((a, b) => {
        const semanticOrder = ['latest', 'prod', 'test', 'dev'];
        const aIdx = semanticOrder.indexOf(a);
        const bIdx = semanticOrder.indexOf(b);
        
        if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
        if (aIdx >= 0) return -1;
        if (bIdx >= 0) return 1;
        
        // Both are versions - sort descending
        return b.localeCompare(a, undefined, { numeric: true });
      });
    } catch {
      return ['latest', 'dev', 'test', 'prod'];
    }
  }

  /**
   * Tab completion for scope parameter of 'test' command
   * Returns available test scopes: all (full suite), file, describe, itCase
   * @cliHide
   */
  async scopeParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['all', 'file', 'describe', 'itCase'];
  }

  /**
   * Tab completion for references parameter of 'test' command (file scope)
   * Returns numbered list of test files when scope is 'file'
   * @cliHide
   */
  async referencesParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // Check which scope was selected
    const scope = currentArgs[1]; // ['test', 'file|describe|itCase', ...]
    
    if (scope === 'file') {
      return this.getTestFileReferences(currentArgs);
    } else if (scope === 'describe') {
      return this.getTestDescribeReferences(currentArgs);
    } else if (scope === 'itCase') {
      return this.getTestItCaseReferences(currentArgs);
    }
    
    return [];
  }

  /**
   * Get test file references for completion
   * @cliHide
   */
  private async getTestFileReferences(currentArgs: string[]): Promise<string[]> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    const { HierarchicalCompletionFilter } = await import('../layer4/HierarchicalCompletionFilter.js');
    const { join, dirname } = await import('path');
    const { existsSync } = await import('fs');
    
    // Determine test directory
    const component = (this as any).getOrCreateTSComponent();
    const context = component.getComponentContext();
    
    let testDir: string;
    if (context) {
      testDir = join((this as any).resolveComponentPath(context.component, context.version), 'test');
    } else {
      // No context - use Web4TSComponent's own test directory
      // Navigate from dist/ts/layer2/DefaultCLI.js to test/
      const currentFileUrl = new URL(import.meta.url);
      const componentRoot = join(dirname(currentFileUrl.pathname), '../../..');
      testDir = join(componentRoot, 'test');
    }
    
    if (!existsSync(testDir)) {
      return [];
    }
    
    // Get all files in hierarchical format with tokens
    const result = TestFileParser.getAllFilesHierarchical(testDir);
    
    // Apply DRY Web4 filtering pattern
    const filterPrefix = currentArgs[2];
    const fileTokenPattern = /^(\d+):/; // Pattern to match file tokens in display like "1:", "17:"
    
    return HierarchicalCompletionFilter.applyPrefixFilter(result, filterPrefix, fileTokenPattern);
  }

  /**
   * Get test describe references for completion
   * @cliHide
   */
  private async getTestDescribeReferences(currentArgs: string[]): Promise<string[]> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    const { join, dirname } = await import('path');
    const { existsSync } = await import('fs');
    
    // Get test directory
    const component = (this as any).getOrCreateTSComponent();
    const context = component.getComponentContext();
    
    let testDir: string;
    if (context) {
      testDir = join((this as any).resolveComponentPath(context.component, context.version), 'test');
    } else {
      const currentFileUrl = new URL(import.meta.url);
      const componentRoot = join(dirname(currentFileUrl.pathname), '../../..');
      testDir = join(componentRoot, 'test');
    }
    
    if (!existsSync(testDir)) {
      return [];
    }
    
    // Get all describes in hierarchical format with tokens
    const result = TestFileParser.getAllDescribesHierarchical(testDir);
    
    // Check if there's a filter prefix (e.g., '1a' from 'test describe 1a')
    const filterPrefix = currentArgs[2];
    
    if (filterPrefix) {
      // Filter tokens that start with the prefix
      const filteredTokens = result.tokens.filter(token => token.startsWith(filterPrefix));
      
      if (filteredTokens.length === 0) {
        // No matches - return empty
        return [];
      }
      
      // Filter the display lines to show only matching entries
      const filteredDisplay: string[] = [];
      const displayLines = result.display;
      
      for (let i = 0; i < displayLines.length; i++) {
        const line = displayLines[i];
        
        // Find file context for this line
        const fileContext = this.findFileContext(displayLines, i);
        
        // Strip ANSI escape codes for pattern matching
        const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, '');
        
        // Check if this line represents a describe block
        const describeMatch = cleanLine.match(/^\s+([a-z])\)/);
        if (describeMatch && fileContext) {
          const fullToken = `${fileContext}${describeMatch[1]}`;
          
          if (filteredTokens.includes(fullToken)) {
            // Add file header if not already added
            const fileHeaderPattern = new RegExp(`^${fileContext}:\\s`);
            const fileHeaderIndex = displayLines.findIndex(l => {
              const cleanL = l.replace(/\x1B\[[0-9;]*m/g, '');
              return fileHeaderPattern.test(cleanL);
            });
            if (fileHeaderIndex !== -1 && !filteredDisplay.includes(displayLines[fileHeaderIndex])) {
              filteredDisplay.push(displayLines[fileHeaderIndex]);
            }
            
            // Add the matching describe line
            filteredDisplay.push(line);
          }
        }
      }
      
      return [filteredDisplay.join('\n')];
    }
    
    // OOSH Pattern: Return hierarchical display for bash printf + token extraction
    return result.display;
  }

  /**
   * Find the file number context for a describe line
   */
  private findFileContext(displayLines: string[], currentIndex: number): string | null {
    // Look backwards for the most recent file header
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = displayLines[i];
      const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, '');
      const fileMatch = cleanLine.match(/^(\d+):/);
      if (fileMatch) {
        return fileMatch[1];
      }
    }
    return null;
  }

  /**
   * Get test it case references for completion
   * @cliHide
   */
  private async getTestItCaseReferences(currentArgs: string[]): Promise<string[]> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    const { HierarchicalCompletionFilter } = await import('../layer4/HierarchicalCompletionFilter.js');
    const { join, dirname } = await import('path');
    const { existsSync } = await import('fs');
    
    // Get test directory
    const component = (this as any).getOrCreateTSComponent();
    const context = component.getComponentContext();
    
    let testDir: string;
    if (context) {
      testDir = join((this as any).resolveComponentPath(context.component, context.version), 'test');
    } else {
      const currentFileUrl = new URL(import.meta.url);
      const componentRoot = join(dirname(currentFileUrl.pathname), '../../..');
      testDir = join(componentRoot, 'test');
    }
    
    if (!existsSync(testDir)) {
      return [];
    }
    
    // Get all it cases in hierarchical format with tokens
    const result = TestFileParser.getAllItCasesHierarchical(testDir);
    
    // Apply DRY Web4 filtering pattern
    const filterPrefix = currentArgs[2];
    const itCaseTokenPattern = /(\d+[a-z]\d+)\)/; // Pattern to match it case tokens like "1a1)", "17b2)"
    
    return HierarchicalCompletionFilter.applyPrefixFilter(result, filterPrefix, itCaseTokenPattern);
  }

  /**
   * Tab completion for describe reference parameter of 'test' command
   * Returns numbered list of describe blocks from selected test file
   * @cliHide
   */
  async testDescribeReferenceParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    const { join } = await import('path');
    const { existsSync } = await import('fs');
    
    // Extract file number from args: ['test', 'describe', '2', ...]
    const scope = currentArgs[1];
    const fileNumStr = currentArgs[2];
    
    if (!fileNumStr || scope !== 'describe') {
      return [];
    }
    
    const fileNum = parseInt(fileNumStr, 10);
    if (isNaN(fileNum)) {
      return [];
    }
    
    // Get test directory
    const component = (this as any).getOrCreateTSComponent();
    const context = component.getComponentContext();
    
    const testDir = context
      ? join((this as any).resolveComponentPath(context.component, context.version), 'test')
      : join(process.cwd(), 'test');
    
    if (!existsSync(testDir)) {
      return [];
    }
    
    // Get test files and target file
    const testFiles = TestFileParser.scanTestFiles(testDir);
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
    
    if (!targetFile) {
      return [];
    }
    
    // Parse describe blocks
    const describes = TestFileParser.parseDescribeBlocks(targetFile.absolutePath);
    return TestFileParser.formatDescribesForCompletion(describes);
  }

  /**
   * Tab completion for it case reference parameter of 'test' command
   * Returns numbered list of it cases from selected describe block
   * @cliHide
   */
  async testItCaseReferenceParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    const { join } = await import('path');
    const { existsSync } = await import('fs');
    
    // Extract file and describe numbers: ['test', 'itCase', '2', '1', ...]
    const scope = currentArgs[1];
    const fileNumStr = currentArgs[2];
    const describeNumStr = currentArgs[3];
    
    if (!fileNumStr || !describeNumStr || scope !== 'itCase') {
      return [];
    }
    
    const fileNum = parseInt(fileNumStr, 10);
    const describeNum = parseInt(describeNumStr, 10);
    
    if (isNaN(fileNum) || isNaN(describeNum)) {
      return [];
    }
    
    // Get test directory
    const component = (this as any).getOrCreateTSComponent();
    const context = component.getComponentContext();
    
    const testDir = context
      ? join((this as any).resolveComponentPath(context.component, context.version), 'test')
      : join(process.cwd(), 'test');
    
    if (!existsSync(testDir)) {
      return [];
    }
    
    // Get test files and target file
    const testFiles = TestFileParser.scanTestFiles(testDir);
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
    
    if (!targetFile) {
      return [];
    }
    
    // Parse it cases for the specific describe block
    const itCases = TestFileParser.parseItCases(targetFile.absolutePath, describeNum - 1);
    return TestFileParser.formatItCasesForCompletion(itCases);
  }
}

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}