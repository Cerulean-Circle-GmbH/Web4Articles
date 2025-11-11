/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { CLI } from '../layer3/CLI.interface.js';
import { MethodInfo } from '../layer3/MethodInfo.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { Component } from '../layer3/Component.interface.js';
import { Colors } from '../layer3/Colors.interface.js';
import { TSCompletion } from '../layer4/TSCompletion.js';
import { DefaultColors } from '../layer4/DefaultColors.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';
import { webcrypto as crypto } from 'crypto';

export abstract class DefaultCLI implements CLI {
  protected componentClass: any;
  protected componentName: string = '';
  protected componentVersion: string = '';
  protected componentInstance: Component | null = null;
  protected methodSignatures: Map<string, MethodSignature> = new Map();
  protected colors: Colors = DefaultColors.getInstance();
  
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
   * Get Web4TSComponent reference for helper methods
   * Works in both master (Web4TSComponent) and generated components
   * Eliminates ugly (this as any) casts throughout CLI code
   * @cliHide
   */
  protected getWeb4TS(): any {
    // If componentInstance has web4ts property (generated components)
    if (this.componentInstance && (this.componentInstance as any).web4ts) {
      return (this.componentInstance as any).web4ts;
    }
    
    // If component has getOrCreateTSComponent method (Web4TSComponent itself)
    if (typeof (this as any).getOrCreateTSComponent === 'function') {
      return (this as any).getOrCreateTSComponent();
    }
    
    throw new Error('No Web4TSComponent reference available');
  }

  /**
   * Get test directory path (DRY helper)
   * Eliminates duplicated path resolution logic across completion methods
   * @cliHide
   */
  protected getTestDir(): string {
    const web4ts = this.getWeb4TS();
    const context = web4ts.getComponentContext();
    
    if (context) {
      return join(web4ts.resolveComponentPath(context.component, context.version), 'test');
    }
    
    // Fallback to current working directory
    return join(process.cwd(), 'test');
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
      const instance = this.componentInstance; // TypeScript type narrowing helper
      if (instance && typeof instance.init === 'function') {
        const emptyScenario = this.createEmptyScenario();
        instance.init(emptyScenario);
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
        
        // ✅ FIX: If TSCompletion found no parameters but method exists, use fallback
        // This happens for private methods, methods without CLI annotations, etc.
        if (paramInfo.length === 0) {
          return this.extractParameterInfoFallback(methodName);
        }
        
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
            default: param.default, // ✅ FIX: Pass through default value for yellow coloring
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
   * ✅ ENHANCED: Returns "Possible Values" for parameters with @cliValues TSDoc annotation
   */
  private deriveExamplesFromConventions(paramName: string): string[] {
    // ✅ ZERO HARDCODING: Extract from @cliValues TSDoc annotation
    const enumValues = this.enumParameterCompletion(paramName);
    
    if (enumValues && enumValues.length > 0) {
      // Format: Show all values with proper formatting
      // Values will be colored in assembleParameterSection (default=yellow, others=green)
      const valuesStr = enumValues.map(v => `'${v}'`).join(', ');
      return [`Possible Values: ${valuesStr}`];
    }
    
    // ✅ FALLBACK: If no @cliValues, try calling actual completion method
    const completionMethodName = `${paramName}ParameterCompletion`;
    if (typeof (this as any)[completionMethodName] === 'function') {
      // Show command to discover values dynamically (will be colored in assembleParameterSection)
      return [`Discovery Command: web4tscomponent completion parameter ${paramName}`];
    }
    
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
   * Assemble command section with color coding
   */
  protected assembleCommandSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.colors;
    
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
    const colors = this.colors;
    const allParams = new Map<string, any>();
    
    // Collect all parameters
    for (const method of methods) {
      for (const param of method.parameters) {
        if (!allParams.has(param.name)) {
          allParams.set(param.name, param);
        } else {
          // ✅ FIX: If we already have this parameter, prefer the one WITH a default value
          const existing = allParams.get(param.name);
          if (param.default && !existing.default) {
            allParams.set(param.name, param);
          }
        }
      }
    }
    
    // ✅ ZERO CONFIG: Group parameters by @cliSyntax annotation
    const parameterGroups = this.groupParametersBySyntax(allParams);
    
    let output = `${colors.sections}Parameters:${colors.reset}\n`;
    
    // Generate documentation for unique parameter syntax types only
    for (const [syntaxType, param] of parameterGroups) {
      // ✅ ENHANCED: Use enhanced optional formatting
      const syntax = this.generateParameterSyntax(param, 'linkInto'); // Use a method name for annotation access
      
      // Line 1: Parameter syntax
      output += `  ${colors.parameters}${syntax}${colors.reset}\n`;
      
      // Line 2: Description (from TSDoc or convention)
      const description = param.description || this.getConventionDescription(syntaxType);
      output += `    ${colors.descriptions}${description}${colors.reset}\n`;
      
      // Line 3: Intelligent value documentation (Possible Values or Examples)
      const examples = this.generateParameterExamples(param.name);
      
      if (examples.length > 0) {
        for (let i = 0; i < Math.min(2, examples.length); i++) {
          const example = examples[i];
          
          // Check if this is a "Possible Values" line (from completion callback)
          if (example.startsWith('Possible Values:')) {
            // Show possible values with colored formatting
            // Default value in yellow, others in green
            const valuesText = example.replace('Possible Values: ', '');
            
            // Extract default value from param
            const defaultValue = param.default;
            
            // Color each value: default=yellow, others=green
            let coloredValues = valuesText;
            if (defaultValue) {
              // Regex to find and color values
              coloredValues = valuesText.replace(/'([^']+)'/g, (match, value) => {
                if (value === defaultValue) {
                  return `'${colors.parameters}${value}${colors.reset}'`; // Yellow for default
                } else {
                  return `'${colors.descriptions}${value}${colors.reset}'`; // Green for others
                }
              });
            } else {
              // No default - all values in green
              coloredValues = valuesText.replace(/'([^']+)'/g, `'${colors.descriptions}$1${colors.reset}'`);
            }
            
            output += `    ${colors.descriptions}Possible Values:${colors.reset} ${coloredValues}\n`;
          } else if (example.startsWith('Discovery Command:')) {
            // Show discovery command with proper colors
            const commandText = example.replace('Discovery Command: ', '');
            // Color: web4tscomponent (GREEN) + completion (WHITE) + parameter X (YELLOW)
            const coloredCommand = commandText.replace(
              /^(web4tscomponent)\s+(completion)\s+(parameter\s+.+)$/,
              `${colors.toolName}$1${colors.reset} ${colors.commands}$2${colors.reset} ${colors.parameters}$3${colors.reset}`
            );
            output += `    ${colors.descriptions}Possible Values:${colors.reset} ${coloredCommand}\n`;
          } 
          // Else: Skip useless examples
        }
      } else if (param.default) {
        // ✅ FIX: No enum values, but has default → show default in yellow
        output += `    ${colors.descriptions}Default: ${colors.parameters}${param.default}${colors.reset}\n`;
      }
      
      // ✅ NEW: Line 4: Used By (which commands use this parameter)
      const usedByCommands = this.getCommandsUsingParameter(param.name, methods);
      if (usedByCommands.length > 0) {
        output += `    ${colors.descriptions}Used By: ${colors.commands}${usedByCommands.join(', ')}${colors.reset}\n`;
      }
      
      output += '\n'; // Empty line between parameters
    }
    
    return output;
  }

  /**
   * Get list of commands that use a specific parameter
   * Web4 pattern: Cross-reference parameter usage across all methods
   */
  private getCommandsUsingParameter(parameterName: string, methods: any[]): string[] {
    const commandsUsingParam: string[] = [];
    
    for (const method of methods) {
      // Check if this method has a parameter with the given name
      const hasParameter = method.parameters.some((param: any) => param.name === parameterName);
      if (hasParameter) {
        commandsUsingParam.push(method.name);
      }
    }
    
    return commandsUsingParam.sort(); // Sort alphabetically for consistency
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
    const colors = this.colors;
    const componentName = this.getComponentName().toLowerCase();
    
    let output = `${colors.sections}Examples:${colors.reset}\n`;
    
    // ✅ HIGHLIGHT: Real chaining syntax (most common usage - works in single command!)
    output += `  ${colors.descriptions}# Method chaining in single command (common pattern - use often!)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}4${colors.reset}                    ${colors.descriptions}# Load context + show structure${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Web4TSComponent 0.3.2.0${colors.reset} ${colors.commands}upgrade${colors.reset} ${colors.parameters}nextBuild${colors.reset}     ${colors.descriptions}# Load + upgrade component${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}MyComponent 0.1.0.0${colors.reset} ${colors.commands}links${colors.reset} ${colors.parameters}fix${colors.reset}              ${colors.descriptions}# Load + fix symlinks${colors.reset}\n`;
    output += '\n';
    output += `  ${colors.descriptions}# Alternative: Separate commands (also works)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset}                        ${colors.descriptions}# 1. Load component context${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}4${colors.reset}                                 ${colors.descriptions}# 2. Show directory structure${colors.reset}\n`;
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
            // Skip useless examples and "Possible Values" lines
            if (examples[0] && !examples[0].startsWith('Possible Values:') && examples[0] !== `${p.name}-example`) {
              return examples[0];
            } else {
              // Use parameter name placeholder when no good example exists
              return `<${p.name}>`;
            }
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
   * Notation: <param:value1|value2|value3> for union types
   */
  private generateParameterSyntax(param: any, methodName?: string): string {
    // Get base syntax from @cliSyntax annotation or conventions
    let baseSyntax = this.getBaseSyntax(param, methodName);
    
    // ✅ NEW: Check for union values from @cliValues annotation
    const unionValues = this.getParameterUnionValues(param.name);
    if (unionValues && unionValues.length > 0) {
      // Add union values to syntax: <paramName:value1|value2|value3>
      baseSyntax = `${baseSyntax}:${unionValues.join('|')}`;
    }
    
    // ✅ ENHANCED: Apply Web4 notation for optional parameters
    let finalSyntax: string;
    if (param.required) {
      finalSyntax = `<${baseSyntax}>`;
    } else {
      // Check for default value in TypeScript or TSDoc
      const defaultValue = this.extractDefaultValue(param, methodName);
      
      if (defaultValue) {
        finalSyntax = `<?${baseSyntax}:'${defaultValue}'>`;  // ✅ Web4 notation: <?parameter:'defaultValue'>
      } else {
        finalSyntax = `<?${baseSyntax}>`;     // ✅ Web4 notation: <?parameter> (no default available)
      }
    }
    
    // ✅ NEW: Check if parameter has completion method and add ! prefix to entire syntax if not
    const hasCompletion = this.hasParameterCompletion(param.name);
    if (!hasCompletion) {
      finalSyntax = `!${finalSyntax}`;
    }
    
    return finalSyntax;
  }

  /**
   * Check if a parameter has a completion method
   * Web4 pattern: Parameters with completion methods get intelligent tab completion
   */
  private hasParameterCompletion(parameterName: string): boolean {
    const completionMethodName = `${parameterName}ParameterCompletion`;
    
    // Check if the completion method exists on this class instance
    return typeof (this as any)[completionMethodName] === 'function';
  }

  /**
   * Generic enum parameter completion based on @cliValues TSDoc annotation
   * Web4 pattern: Convention-based enum completion with zero hardcoding
   * 
   * ALL enum parameters should use this method via convention:
   * - Parameter: versionPromotion
   * - Completion: async versionPromotionParameterCompletion(args) { return this.enumParameterCompletion('versionPromotion'); }
   * - TSDoc: @cliValues nextPatch nextMinor nextMajor nextBuild
   * 
   * @param paramName Parameter name to get enum values for
   * @returns Array of possible enum values from @cliValues annotation
   */
  protected enumParameterCompletion(paramName: string): string[] {
    // ✅ PERFORMANCE: Direct TSCompletion query without method analysis overhead
    // Try to extract @cliValues from any method that has this parameter
    
    try {
      // Quick extraction: search for @cliValues in source files directly
      const values = TSCompletion.extractCliValues(
        this.componentClass.name,
        '',  // Empty method name = search all methods
        paramName
      );
      
      if (values && values.length > 0) {
        return values;
      }
    } catch (error) {
      // Fallback: return empty array
    }
    
    return [];
  }

  /**
   * Get union values for parameters with known completion values
   * Web4 pattern: Show finite value sets directly in syntax via @cliValues TSDoc annotation
   * @returns Array of possible values, or null if not applicable
   */
  private getParameterUnionValues(paramName: string): string[] | null {
    // ✅ ZERO HARDCODING: Extract from @cliValues TSDoc annotation
    const values = this.enumParameterCompletion(paramName);
    return values.length > 0 ? values : null;
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
    const colors = this.colors;
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
    const colors = this.colors;
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
   * @returns Array of action completions (no empty string to avoid spacing issues)
   */
  async actionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return [
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
    // Check if callback method exists on this instance OR on component instance
    let target: any = null;
    
    if (typeof (this as any)[callbackName] === 'function') {
      // Method exists on CLI instance (e.g., depthParameterCompletion in DefaultCLI)
      target = this;
    } else {
      // Try component instance (e.g., renameCaseParameterCompletion in DefaultPDCA)
      const componentInstance = this.getComponentInstance();
      if (componentInstance && typeof componentInstance[callbackName] === 'function') {
        target = componentInstance;
      }
    }
    
    if (target) {
      // Pass context args to completion method (e.g., ['on', 'ComponentName'] for versionParameterCompletion)
      const values = await target[callbackName](contextArgs);
      
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
        // Multi-WORD mode: space-separated for compgen -W (no trailing newline)
        process.stdout.write(values.join(' '));
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
   * Fundamental parameter completion: format (output format)
   * Used by: getContext, and any method with format parameter
   * @cliHide
   */
  async formatParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['json', 'bash', 'text', 'xml', 'csv'];
  }

  /**
   * Fundamental parameter completion: what (completion type)
   * Used by: completion method for testing tab completions
   * @cliHide
   */
  async whatParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['method', 'parameter'];
  }

  /**
   * Fundamental parameter completion: filter (prefix for filtering completions)
   * Used by: completion method for testing tab completions
   * Delegates to completionNameParameterCompletion for shared logic
   * @cliHide
   */
  async filterParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // TSCompletion expects {parameterName}ParameterCompletion naming convention
    // Delegate to shared logic in completionNameParameterCompletion
    return this.completionNameParameterCompletion(currentArgs);
  }

  /**
   * Check if a method has CLI annotations (@cli* tags in JSDoc)
   * Used by: completion method to visually distinguish CLI-exposed methods
   * @cliHide
   */
  private hasCliAnnotations(methodName: string): boolean {
    try {
      // CRITICAL: Check @cliHide FIRST using TSCompletion (source analysis)
      // Method.toString() doesn't have TSDoc comments (stripped in compilation)
      if (TSCompletion.isMethodHidden(this.componentClass.name, methodName)) {
        return false;
      }
      
      // Check if method exists on component class
      const method = this.componentClass?.prototype?.[methodName];
      if (!method) return false;
      
      // Check method source for @cli annotations
      const methodStr = method.toString();
      
      // Check for CLI-exposing annotations in method source (for runtime-added methods)
      if (methodStr.includes('@cliSyntax') || methodStr.includes('@cliExample') || methodStr.includes('@cliDefault')) {
        return true;
      }
      
      // Fallback: check if TSCompletion found parameters
      // (TSCompletion only extracts parameters from methods with proper TSDoc)
      const paramInfo = TSCompletion.getEnhancedMethodParameters(this.componentClass.name, methodName);
      if (paramInfo.length > 0) {
        // Method has TSDoc-documented parameters - likely a CLI method
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Dynamic parameter completion: completionName (depends on 'what' value)
   * Returns method names if what=method, parameter completion names if what=parameter
   * Uses multiline format with full signatures for methods
   * Shared by: filterParameterCompletion (via delegation)
   * @cliHide
   */
  async completionNameParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // currentArgs: ['completion', 'method'|'parameter', 'prefix', ...] in bash completion context
    // Extract 'what' value from args (index 1 = first parameter value)
    const what = currentArgs[1]; // Index 1 contains the 'what' value
    const filterPrefix = currentArgs[2]; // Optional prefix for filtering
    
    if (!what || (what !== 'method' && what !== 'parameter')) {
      // No valid 'what' value yet - return empty
      return [];
    }
    
    // ANSI color codes (use centralized Colors instance)
    const BRIGHT_CYAN = this.colors.toolName;     // Numbers
    const BRIGHT_YELLOW = this.colors.parameters;   // Parameters
    const BRIGHT_WHITE_BOLD = this.colors.sections; // CLI methods (user-facing commands)
    const RESET = this.colors.reset;
    
    if (what === 'parameter') {
      // Return parameter names in Web4 notation with defaults (matching method signatures)
      const allMethods = Array.from(this.methodSignatures.keys());
      let filtered = allMethods
        .filter(name => name.endsWith('ParameterCompletion'))
        .sort();
      
      // Apply prefix filtering if provided
      if (filterPrefix) {
        filtered = filtered.filter(name => name.startsWith(filterPrefix));
      }
      
      // ✅ EXACT MATCH: Execute the completion callback to discover parameter values
      // Example: "versionPromotion" → execute versionPromotionParameterCompletion
      if (filtered.length === 1) {
        const callbackName = filtered[0];
        const paramName = callbackName.replace(/ParameterCompletion$/, '');
        
        // Check if filter exactly matches the parameter name (discovery mode)
        if (filterPrefix === paramName) {
          // Execute the completion callback to show available values
          const callback = (this as any)[callbackName];
          if (callback && typeof callback === 'function') {
            try {
              // Call the completion callback with empty args (discovery mode)
              const results = await callback.call(this, []);
              const resultArray = Array.isArray(results) ? results : [results];
              
              // ✅ POST-PROCESSING: Format values for better UX
              // 1. Color values bright cyan (matching shell completion style)
              // 2. Add double newline for clean separation from prompt
              const BRIGHT_CYAN = this.colors.toolName;
              const RESET = this.colors.reset;
              
              if (resultArray.length > 0) {
                // Color each result bright cyan
                const coloredResults = resultArray.map(val => `${BRIGHT_CYAN}${val}${RESET}`);
                
                // Add double newline to last element for clean spacing
                const lastIndex = coloredResults.length - 1;
                coloredResults[lastIndex] = coloredResults[lastIndex] + '\n\n';
                
                return coloredResults;
              }
              
              return resultArray;
            } catch (error) {
              // If callback fails, return parameter name
              return [paramName];
            }
          }
        }
        
        // Otherwise return plain name for bash completion
        return [paramName];
      }
      
      // ✅ DRY FIX: Extract parameters from ALL methods ONCE (not once per parameter!)
      // Cache results to avoid O(parameters × methods) complexity  
      const allMethodNames = Array.from(this.methodSignatures.keys())
        .filter(m => !m.endsWith('ParameterCompletion'));
      
      // Extract parameters from all methods ONCE (DRY principle)
      // Also cache CLI annotation checks to avoid repeated calls during sort
      const allMethodParams = new Map<string, any[]>();
      const cliMethodsSet = new Set<string>();
      
      for (const methodName of allMethodNames) {
        const params = this.extractParameterInfoFromTSCompletion(methodName);
        allMethodParams.set(methodName, params);
        
        // Cache CLI annotation check: method with TSDoc parameters from TSCompletion = CLI method
        // This avoids calling hasCliAnnotations which would re-call getEnhancedMethodParameters
        if (params.length > 0) {
          cliMethodsSet.add(methodName);
        }
      }
      
      // Sort methods: CLI methods first (they have better metadata)
      const methodNames = allMethodNames.sort((a, b) => {
        const aIsCLI = cliMethodsSet.has(a);
        const bIsCLI = cliMethodsSet.has(b);
        if (aIsCLI && !bIsCLI) return -1;
        if (!aIsCLI && bIsCLI) return 1;
        return a.localeCompare(b);
      });
      
      // Transform: versionParameterCompletion → <?version:'0.1.0.0'>
      // Now use cached parameter data for each parameter
      return filtered.map((callbackName, index) => {
        const paramName = callbackName.replace(/ParameterCompletion$/, '');
        
        let paramSyntax = `<${paramName}>`;  // Default: required parameter
        let bestParam: any = null;
        
        // Search cached method parameters (no repeated extraction!)
        // Prefer optional parameters with defaults over required ones
        for (const methodName of methodNames) {
          const params = allMethodParams.get(methodName)!;  // Cached lookup
          const param = params.find(p => p.name === paramName);
          
          if (param) {
            if (!bestParam) {
              bestParam = { param, methodName };
            }
            // If we found an optional parameter with default, prefer it
            if (!param.required && param.default) {
              bestParam = { param, methodName };
              break;  // Found ideal match - optional with default
            }
          }
        }
        
        if (bestParam) {
          paramSyntax = this.generateParameterSyntax(bestParam.param, bestParam.methodName);
        }
        
        return `${BRIGHT_CYAN}${index + 1}:${RESET} ${BRIGHT_YELLOW}${paramSyntax}${RESET}`;
      });
    } else {
      // what === 'method' - Use methodSignatures for ALL methods (including @cliHide)
      // Discovery tool should show hidden methods for debugging/development
      const allMethodNames = Array.from(this.methodSignatures.keys());
      let filtered = allMethodNames
        .filter(name => !name.endsWith('ParameterCompletion'))
        .filter(name => name !== 'completeParameter')
        .filter(name => name !== 'execute')
        .filter(name => name !== 'start')
        .sort();
      
      // Apply prefix filtering if provided
      if (filterPrefix) {
        filtered = filtered.filter(name => name.startsWith(filterPrefix));
      }
      
      // ✅ SINGLE MATCH: Auto-complete if only one method matches
      // Standard shell behavior: one match = complete it, multiple = show list
      if (filtered.length === 1) {
        const methodName = filtered[0];
        
        // ✅ SHOW DOCUMENTATION: Display TSDoc for discovered method
        // Get method documentation from TSCompletion
        const componentClassName = this.componentClass.name;
        const fullMethodDoc = TSCompletion.getMethodDoc(componentClassName, methodName);
        
        if (fullMethodDoc) {
          // Format documentation with full signature and green TSDoc
          const BRIGHT_CYAN = this.colors.toolName;
          const BRIGHT_WHITE_BOLD = this.colors.sections;
          const BRIGHT_YELLOW = this.colors.parameters;
          const GREEN = this.colors.descriptions;
          const RESET = this.colors.reset;
          
          // Extract parameters for full signature
          const parameters = this.extractParameterInfoFromTSCompletion(methodName);
          
          // Build full colored signature (method name + parameters)
          const isCLIMethod = this.hasCliAnnotations(methodName);
          const methodColor = isCLIMethod ? BRIGHT_WHITE_BOLD : '';
          
          let signature = `${methodColor}${methodName}${RESET}`;
          if (parameters && parameters.length > 0) {
            const paramList = parameters.map((p: any) => {
              return this.generateParameterSyntax(p, methodName);
            }).join(' ');
            signature = `${methodColor}${methodName}${RESET} ${BRIGHT_YELLOW}${paramList}${RESET}`;
          }
          
          // Return: full signature + separator + green doc + double newline
          const separator = `\n${BRIGHT_CYAN}${'─'.repeat(60)}${RESET}\n`;
          const header = `${BRIGHT_WHITE_BOLD}📖 Documentation:${RESET}\n`;
          const greenDoc = `${GREEN}${fullMethodDoc}${RESET}`;
          return [signature + separator + header + greenDoc + '\n\n'];
        }
        
        return [methodName];  // Plain method name for bash completion
      }
      
      // Generate full CLI signatures using extractParameterInfoFromTSCompletion (with color coding)
      return filtered.map((methodName, index) => {
        // Extract parameters for this method
        const parameters = this.extractParameterInfoFromTSCompletion(methodName);
        
        // Check if method has CLI annotations for visual distinction
        const isCLIMethod = this.hasCliAnnotations(methodName);
        const methodColor = isCLIMethod ? BRIGHT_WHITE_BOLD : '';  // CLI methods: bright white bold, internal: plain
        
        // ✅ SEARCH HIGHLIGHTING: Highlight filter prefix in red
        const RED = this.colors.red;
        let displayName = methodName;
        if (filterPrefix && methodName.toLowerCase().startsWith(filterPrefix.toLowerCase())) {
          // Split: prefix (red) + rest (normal method color)
          const prefix = methodName.substring(0, filterPrefix.length);
          const rest = methodName.substring(filterPrefix.length);
          displayName = `${RED}${prefix}${RESET}${methodColor}${rest}${RESET}`;
        } else {
          displayName = `${methodColor}${methodName}${RESET}`;
        }
        
        if (parameters && parameters.length > 0) {
          // Build parameter list using auto-discovery
          const paramList = parameters.map((p: any) => {
            return this.generateParameterSyntax(p, methodName);
          }).join(' ');
          // Color scheme: number (bright cyan), search term (red), method name (bright white bold for CLI, plain for internal), parameters (bright yellow)
          return `${BRIGHT_CYAN}${index + 1}:${RESET} ${displayName} ${BRIGHT_YELLOW}${paramList}${RESET}`;
        }
        // No parameters - just method name
        return `${BRIGHT_CYAN}${index + 1}:${RESET} ${displayName}`;
      });
    }
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
   * Returns available test scopes: file, describe, itCase
   * Note: 'all' is the default (runs full suite), not needed in tab completion
   * 
   * ENHANCED: When currentArgs contains 'test', also output one-line documentation
   * like the 'links' command does, to help users understand test command
   * 
   * @cliHide
   */
  async scopeParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const scopes = ['file', 'describe', 'itCase'];
    
    // Check if we're completing for the 'test' command
    // currentArgs format when called from bash: ['test', ...]
    // (NOT [className, 'test'] - that's for other callbacks!)
    if (currentArgs.length >= 1 && currentArgs[0] === 'test') {
      // Output ONE LINE documentation BEFORE the parameter options
      // This helps users understand what 'test' does while seeing parameter options
      const GREEN = this.colors.descriptions;
      const YELLOW = this.colors.parameters;
      const RESET = this.colors.reset;
      
      // MUST use process.stdout.write (not console.log) because bash completion
      // filters stderr - only stdout is captured and displayed
      process.stdout.write(`${GREEN}1: test <?scope:'all'> <references> - Execute test command - runs tests WITHOUT promotion${RESET}\n`);
      process.stdout.write(`${GREEN}   Use releaseTest() for version promotion workflow${RESET}\n`);
      process.stdout.write(`${GREEN}   Modes: all (full suite), file (specific file), describe (describe block), itCase (specific test)${RESET}\n\n`);
      process.stdout.write(`${YELLOW}<?scope:'all'>${RESET}\n`);
    }
    
    return scopes;
  }

  /**
   * Completion for targetDir parameter
   * Returns: resolved project root path (from §) and test/data (for test isolation)
   * @cliHide
   */
  async targetDirParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // Get enum values from @cliValues annotation (§ and test/data)
    const values = this.enumParameterCompletion('targetDir');
    
    // Resolve § to actual project root path for tab completion
    return values.map(value => {
      if (value === '§') {
        return this.findProjectRoot();
      }
      return value;
    });
  }

  /**
   * Tab completion for targetVersion parameter of 'setCICDVersion' command
   * Returns available semantic links: dev, latest, prod, test
   * @cliHide
   */
  async targetVersionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['dev', 'latest', 'prod', 'test'];
  }

  /**
   * Tab completion for versionPromotion parameter
   * Provides semantic version increment options
   * Used by: upgrade, releaseTest
   * @cliHide
   */
  async versionPromotionParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return ['nextBuild', 'nextMinor', 'nextMajor', 'nextPatch'];
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
    const { existsSync } = await import('fs');
    
    // Use DRY helper to get test directory
    const testDir = this.getTestDir();
    
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
    const { existsSync } = await import('fs');
    
    // Use DRY helper to get test directory
    const testDir = this.getTestDir();
    
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
    const { existsSync } = await import('fs');
    
    // Use DRY helper to get test directory
    const testDir = this.getTestDir();
    
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
    
    // Use DRY helper to get test directory
    const testDir = this.getTestDir();
    
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
    
    // Use DRY helper to get test directory
    const testDir = this.getTestDir();
    
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

  /**
   * Complete component names for create command
   * Provides suggestions for new component names based on common patterns
   */
  async nameParameterCompletion(currentArgs: string[]): Promise<string[]> {
    // Suggest common component name patterns
    const suggestions = [
      'UserManager',
      'DataProcessor', 
      'FileHandler',
      'ConfigManager',
      'ServiceClient',
      'EventHandler',
      'ApiConnector',
      'DatabaseManager',
      'CacheManager',
      'LoggingService'
    ];
    
    const filterPrefix = currentArgs[1];
    if (filterPrefix) {
      const filtered = suggestions.filter(name => 
        name.toLowerCase().startsWith(filterPrefix.toLowerCase())
      );
      return filtered.length > 0 ? filtered : suggestions;
    }
    
    return suggestions;
  }

  /**
   * Complete options parameter for create command
   * Provides feature option suggestions
   */
  async optionsParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const allOptions = [
      'all',      // All features (recommended)
      'cli',      // CLI only
      'spec',     // Specification folder
      'vitest',   // Testing framework  
      'layers',   // Layer architecture
      'cli layers',        // CLI + layers
      'cli spec',          // CLI + spec
      'cli vitest',        // CLI + vitest
      'spec vitest',       // Spec + vitest
      'layers vitest',     // Layers + vitest
      'cli spec vitest',   // CLI + spec + vitest
      'layers spec vitest' // Layers + spec + vitest
    ];
    
    const filterPrefix = currentArgs[3] || currentArgs[2] || currentArgs[1]; // Handle different contexts
    if (filterPrefix) {
      const filtered = allOptions.filter(option => 
        option.toLowerCase().includes(filterPrefix.toLowerCase()) ||
        option.startsWith(filterPrefix)
      );
      return filtered.length > 0 ? filtered : allOptions;
    }
    
    return allOptions;
  }
}

// MethodSignature interface moved to layer3/MethodSignature.interface.ts (imported above)