/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// TypeScript Completion Backend for oosh CLI
// Implements Completion interface for dynamic tab completion



import type { Completion } from '../layer3/Completion.js';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

export class TSCompletion implements Completion {
  private static extractJsDocText(node: ts.Node): string {
    const anyNode: any = node as any;
    if (anyNode && Array.isArray(anyNode.jsDoc) && anyNode.jsDoc.length > 0) {
      const parts: string[] = [];
      for (const jd of anyNode.jsDoc) {
        if (typeof jd.comment === 'string' && jd.comment.trim().length > 0) {
          parts.push(jd.comment.trim());
        }
      }
      return parts.join('\n').trim();
    }
    return '';
  }

  private static extractParamJsDoc(node: ts.Node, paramName: string): string {
    const anyNode: any = node as any;
    if (anyNode && Array.isArray(anyNode.jsDoc) && anyNode.jsDoc.length > 0) {
      for (const jd of anyNode.jsDoc) {
        if (Array.isArray(jd.tags)) {
          for (const tag of jd.tags) {
            // ts.JSDocParameterTag often has .name.getText() or .name.getText on newer TS
            try {
              const tName = (typeof tag.name?.getText === 'function') ? tag.name.getText() : (tag.name?.escapedText || tag.name?.text);
              if (String(tName) === paramName) {
                const comment = typeof tag.comment === 'string' ? tag.comment : '';
                if (comment && comment.trim().length > 0) return comment.trim();
              }
            } catch {}
          }
        }
      }
    }
    return '';
  }
  static getProjectSourceFiles(): string[] {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const dirs = [
      path.resolve(__dirname, '../layer1'),
      path.resolve(__dirname, '../layer2'),
      path.resolve(__dirname, '../layer3'),
      path.resolve(__dirname, '../layer5'),  // Scan CLI layer for component-specific completion methods
    ];
    let files: string[] = [];
    for (const dir of dirs) {
      if (existsSync(dir)) {
        files = files.concat(
          readdirSync(dir)
            .filter(f => f.endsWith('.ts'))
            .map(f => path.join(dir, f))
        );
      }
    }
    return files;
  }

  static getClasses(): string[] {
    const files = TSCompletion.getProjectSourceFiles();
    const classNames: Set<string> = new Set();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name) {
          classNames.add(node.name.text);
        }
      });
    }
    return Array.from(classNames);
  }

  static getClassMethods(className: string): string[] {
    // Support comma-separated class names: "DefaultCLI,DefaultWeb4TSComponent"
    // Web4 standard syntax (same as compare command)
    // This discovers methods from multiple classes (e.g., CLI + Component)
    if (className.includes(',')) {
      const classes = className.split(',');
      const allMethods = new Set<string>();
      classes.forEach(cls => {
        const methods = this.getClassMethods(cls.trim());
        methods.forEach(m => allMethods.add(m));
      });
      return Array.from(allMethods);
    }
    
    // Single class: discover methods including inherited ones
    const files = TSCompletion.getProjectSourceFiles();
    const allMethods = new Set<string>();
    let baseClassName: string | null = null;
    
    // First pass: find the class and its methods, and discover base class
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          // Get methods declared in this class
          node.members
            .filter(m => ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name))
            .forEach(m => allMethods.add((m.name as ts.Identifier).text));
          
          // Discover base class from extends clause
          if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
              if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                const extendsType = clause.types[0];
                if (ts.isExpressionWithTypeArguments(extendsType) && ts.isIdentifier(extendsType.expression)) {
                  baseClassName = extendsType.expression.text;
                }
              }
            }
          }
        }
      });
      
      if (allMethods.size > 0) break; // Found the class
    }
    
    // Second pass: if we found a base class, recursively get its methods
    if (baseClassName) {
      const baseMethods = this.getClassMethods(baseClassName);
      baseMethods.forEach(m => allMethods.add(m));
    }
    
    return Array.from(allMethods);
  }

  static getMethodParameters(className: string, methodName: string, paramName?: string): any[] {
    // Support comma-separated class names: "DefaultCLI,DefaultWeb4TSComponent"
    // Try each class until we find the method
    if (className.includes(',')) {
      const classes = className.split(',').map(c => c.trim());
      for (const cls of classes) {
        const params = this.getMethodParameters(cls, methodName, paramName);
        if (params.length > 0) {
          return params;
        }
      }
      return [];
    }
    
    const files = TSCompletion.getProjectSourceFiles();
    let params: string[] = [];
    let defaultValues: Record<string, string> = {};
    let paramMap: Record<string, string> = {};
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              if (
                m.parameters.length === 1 &&
                ts.isIdentifier(m.parameters[0].name) &&
                m.parameters[0].name.text === 'args' &&
                m.parameters[0].type &&
                ts.isArrayTypeNode(m.parameters[0].type)
              ) {
                if (m.body) {
                  m.body.statements.forEach(stmt => {
                    if (
                      ts.isVariableStatement(stmt) &&
                      stmt.declarationList.declarations.length === 1
                    ) {
                      const decl = stmt.declarationList.declarations[0];
                      if (
                        ts.isIdentifier(decl.name) &&
                        decl.initializer &&
                        ts.isBinaryExpression(decl.initializer)
                      ) {
                        const left = decl.initializer.left;
                        const right = decl.initializer.right;
                        if (
                          ts.isElementAccessExpression(left) &&
                          ts.isIdentifier(left.expression) &&
                          left.expression.text === 'args'
                        ) {
                          params.push(decl.name.text);
                          const logical = decl.name.text.replace(/Name$/i, '').toLowerCase();
                          paramMap[logical] = decl.name.text;
                          if (ts.isStringLiteral(right)) {
                            defaultValues[decl.name.text] = right.text;
                          }
                        }
                      }
                    }
                  });
                }
              } else {
                params = m.parameters.map(p => p.name.getText());
              }
            }
          }
        }
      });
    }
    if (paramName) {
      // Try direct match
      if (defaultValues[paramName]) return [defaultValues[paramName]];
      // Try logical match (e.g. 'project' matches 'projectName')
      const logical = paramName.replace(/Name$/i, '').toLowerCase();
      if (paramMap[logical]) {
        const mappedParam = paramMap[logical];
        if (defaultValues[mappedParam]) {
          return [defaultValues[mappedParam]];
        } else {
          // If logical mapping exists but no default value, do not return the param name
          return [];
        }
      }
      // If no mapping or default, do not return the param name
      return [];
    }
    if (params.length > 0) return params;
    return [];
  }

  static getClassDoc(className: string): string {
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      let doc = '';
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          doc = TSCompletion.extractJsDocText(node);
        }
      });
      if (doc) return doc;
    }
    return '';
  }

  static getMethodDoc(className: string, methodName: string): string {
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      let doc = '';
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              doc = TSCompletion.extractJsDocText(m);
            }
          }
        }
      });
      if (doc) return doc;
    }
    return '';
  }

  /**
   * Check if a method has @cliHide annotation
   * Used by DefaultCLI to determine if method should be visually distinguished
   */
  static isMethodHidden(className: string, methodName: string): boolean {
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      let hidden = false;
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              const jsDocText = TSCompletion.extractJsDocText(m);
              hidden = jsDocText.includes('@cliHide');
            }
          }
        }
      });
      if (hidden) return true;
    }
    return false;
  }

  static getParamDoc(className: string, methodName: string, paramName: string): string {
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      let doc = '';
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              // Prefer @param tag matching
              doc = TSCompletion.extractParamJsDoc(m, paramName);
              if (!doc) {
                // Fallback: look for param jsDoc on the parameter declaration
                for (const p of m.parameters) {
                  const pName = p.name.getText();
                  if (pName === paramName) {
                    doc = TSCompletion.extractJsDocText(p);
                    break;
                  }
                }
              }
            }
          }
        }
      });
      if (doc) return doc;
    }
    return '';
  }

  complete(args: string[]): string[] {
    // If first arg is empty string and second is a prefix, return classes matching prefix
    if (args.length === 0) {
      return TSCompletion.getClasses();
    }
    if (args.length === 1 && args[0] === '') {
      return TSCompletion.getClasses();
    }
    if (args.length === 2 && args[0] === '') {
      const prefix = args[1];
      if (!prefix) {
        return TSCompletion.getClasses();
      }
      return TSCompletion.getClasses().filter(c => c.startsWith(prefix));
    }
    if (args.length === 1) {
      const prefix = args[0];
      if (!prefix) {
        return TSCompletion.getClasses();
      }
      const classes = TSCompletion.getClasses();
      if (classes.includes(prefix)) {
        return TSCompletion.getClassMethods(prefix);
      }
      const matchingClasses = classes.filter(c => c.startsWith(prefix));
      if (matchingClasses.length > 0) {
        return matchingClasses;
      } else {
        // Fallback: if no class matches, use default class 'TSsh' and return method name suffixes after prefix
        if (classes.includes('TSsh')) {
          return TSCompletion.getClassMethods('TSsh')
            .filter(m => m.startsWith(prefix) && m.length > prefix.length)
            .map(m => m.slice(prefix.length));
        } else {
          return [];
        }
      }
    }
    if (args.length === 2 && args[1] === "") {
      // If second arg is empty, treat as requesting all methods for the class
      const classes = TSCompletion.getClasses();
      if (classes.includes(args[0])) {
        return TSCompletion.getClassMethods(args[0]);
      }
    }
    if (args.length === 2) {
      // After class and method name, complete all methods starting with that method name (e.g. 'create*').
      // If multiple methods share the prefix (including the exact method), list those methods.
      // If the exact method exists with no other prefixed methods, return its parameters.
      // If no such methods exist, complete the parameters of the method.
      const [className, methodPrefix] = args;
      const methods = TSCompletion.getClassMethods(className);
      const subMethods = methods.filter(m => m.startsWith(methodPrefix));
      if (subMethods.length > 1) {
        return subMethods;
      }
      if (subMethods.length === 1) {
        if (subMethods[0] === methodPrefix) {
          // Method name is complete - smart detection: VALUES vs NAMES
          const params = TSCompletion.getMethodParameters(className, methodPrefix);
          if (params.length > 0) {
            // Check if a completion method exists for first parameter (required or optional)
            const completionMethodName = `${params[0]}ParameterCompletion`;
            const methods = TSCompletion.getClassMethods(className);
            
            if (methods.includes(completionMethodName)) {
              // Completion method exists - return callback hint for dynamic VALUES
              // Bash completion will call back to get actual values
              return [`__CALLBACK__:${params[0]}ParameterCompletion`];
            }
          }
          // No completion method - return parameter NAMES as hints
          return params;
        }
        // Return FULL word for bash completion (not suffix!)
        // Bash compgen needs complete words to match against current input
        return [subMethods[0]];
      }
      // No methods match the prefix; try parameters for the methodPrefix
      const params = TSCompletion.getMethodParameters(className, methodPrefix);
      if (params.length > 0) return params;
      return subMethods;
    }
    if (args.length === 3) {
      const [className, methodPrefix, currentWord] = args;
      
      // Check if method has a completion method for first parameter
      // This handles: web4tscomponent links <Tab> AND web4tscomponent links f<Tab>
      const methods = TSCompletion.getClassMethods(className);
      if (methods.includes(methodPrefix)) {
        const params = TSCompletion.getMethodParameters(className, methodPrefix);
        
        if (params.length > 0) {
          const completionMethodName = `${params[0]}ParameterCompletion`;
          
          if (methods.includes(completionMethodName)) {
            // Completion method exists - return callback hint for dynamic VALUES
            // Bash compgen will filter values based on currentWord (e.g., 'f' matches 'fix')
            return [`__CALLBACK__:${params[0]}ParameterCompletion`];
          }
        }
        
        // No completion method - return parameter NAMES only when currentWord is empty
        if (currentWord === '') {
          return TSCompletion.getMethodParameters(className, methodPrefix);
        }
      }
      
      // Fallback: method chaining logic for non-empty currentWord
      // This handles cases like: web4tscomponent createN<Tab> → createNextPatch
      const values = TSCompletion.getMethodParameters(className, methodPrefix, currentWord);
      if (values.length > 0 && values[0] !== currentWord && values[0] !== undefined && values[0] !== '') {
        return values;
      }
      const fullMethod = methodPrefix + (currentWord.charAt(0).toUpperCase() + currentWord.slice(1));
      if (methods.includes(fullMethod)) {
        return TSCompletion.getMethodParameters(className, fullMethod);
      }
      return [];
    }
    
    // Handle 4+ args: Completion for 2nd, 3rd, ... parameters OR chained methods
    // Example: web4tscomponent on Unit <Tab> → complete 2nd parameter (version)
    // Example: web4tscomponent on Unit 0.3.2.0 tre<Tab> → complete chained method (tree)
    // Example: web4tscomponent on Unit 0.3.2.0 setCICDVersion p<TAB> → complete targetVersion parameter of setCICDVersion
    if (args.length >= 4) {
      const [className, methodName, ...providedParams] = args;
      const currentWord = providedParams[providedParams.length - 1];
      const paramIndex = providedParams.length - 1; // 0-based index of parameter we're completing
      
      // Debug logging
      const logLevel = parseInt(process.env.LOG_LEVEL || '0', 10);
      if (logLevel > 3) {
        console.error('[TSCompletion] Entered 4+ args block');
        console.error(`  args.length: ${args.length}`);
        console.error(`  className: ${className}`);
        console.error(`  methodName: ${methodName}`);
        console.error(`  providedParams: ${JSON.stringify(providedParams)}`);
      }
      
      const methods = TSCompletion.getClassMethods(className);
      
      if (logLevel > 3) {
        console.error(`  methods.includes("${methodName}"): ${methods.includes(methodName)}`);
        console.error(`  total methods found: ${methods.length}`);
      }
      
      if (methods.includes(methodName)) {
        const params = TSCompletion.getMethodParameters(className, methodName);
        
        if (logLevel > 3) {
          console.error('[TSCompletion Chaining Debug]');
          console.error(`  params for ${methodName}: ${JSON.stringify(params)}`);
        }
        
        // ✅ NEW: Detect chained methods in providedParams
        // Scan providedParams to find where a known method name appears
        // That indicates we've switched to completing parameters for the chained method
        let chainedMethodIndex = -1;
        for (let i = 0; i < providedParams.length - 1; i++) {
          if (methods.includes(providedParams[i])) {
            chainedMethodIndex = i;
            if (logLevel > 3) {
              console.error(`  Found chained method at index ${i}: ${providedParams[i]}`);
            }
            break; // Use first chained method found
          }
        }
        
        if (chainedMethodIndex >= 0) {
          // Chained method detected!
          // Example: ["Web4Programmer", "0.2.0.3", "setCICDVersion", "p"]
          // chainedMethodIndex = 2 (setCICDVersion)
          const chainedMethodName = providedParams[chainedMethodIndex];
          const chainedParams = providedParams.slice(chainedMethodIndex + 1); // ["p"]
          const chainedParamIndex = chainedParams.length - 1; // 0
          const chainedCurrentWord = chainedParams[chainedParams.length - 1]; // "p"
          
          if (logLevel > 3) {
            console.error(`  Chained method: ${chainedMethodName}`);
            console.error(`  Chained params: ${JSON.stringify(chainedParams)}`);
            console.error(`  Chained param index: ${chainedParamIndex}`);
          }
          
          // Get parameters for chained method
          const chainedMethodParams = TSCompletion.getMethodParameters(className, chainedMethodName);
          
          if (logLevel > 3) {
            console.error(`  Chained method params: ${JSON.stringify(chainedMethodParams)}`);
          }
          
          if (chainedParamIndex < chainedMethodParams.length) {
            // Still completing chained method parameters
            const completionMethodName = `${chainedMethodParams[chainedParamIndex]}ParameterCompletion`;
            
            if (logLevel > 3) {
              console.error(`  Looking for completion method: ${completionMethodName}`);
            }
            
            if (methods.includes(completionMethodName)) {
              // Completion method exists - return callback hint
              if (logLevel > 3) {
                console.error(`  ✅ Found completion method: ${completionMethodName}`);
              }
              return [`__CALLBACK__:${chainedMethodParams[chainedParamIndex]}ParameterCompletion`];
            }
            
            // No completion method for this parameter - return empty
            if (logLevel > 3) {
              console.error(`  ❌ No completion method found`);
            }
            return [];
          } else {
            // All chained method parameters provided - complete next chained method
            const matchingMethods = methods.filter(m => m.startsWith(chainedCurrentWord));
            if (logLevel > 3) {
              console.error(`  Completing next chained method starting with "${chainedCurrentWord}": ${matchingMethods.length} matches`);
            }
            return matchingMethods;
          }
        }
        
        // No chained method detected - standard parameter completion for first method
        if (logLevel > 3) {
          console.error(`  No chained method detected, using standard completion`);
        }
        
        if (paramIndex < params.length) {
          // Still completing method parameters
          const completionMethodName = `${params[paramIndex]}ParameterCompletion`;
          
          if (methods.includes(completionMethodName)) {
            // Completion method exists - return callback hint
            return [`__CALLBACK__:${params[paramIndex]}ParameterCompletion`];
          }
          
          // No completion method for this parameter - return empty
          return [];
        } else {
          // All parameters provided - complete next chained method
          // Filter methods that start with currentWord
          const matchingMethods = methods.filter(m => m.startsWith(currentWord));
          return matchingMethods;
        }
      }
      
      return [];
    }
    
    return [];
  }

  /**
   * Enhanced method parameter extraction with union type support
   * Web4 pattern: TypeScript AST parsing with union type detection for CLI generation
   * Supports composite class names (comma-separated)
   */
  static getEnhancedMethodParameters(className: string, methodName: string): any[] {
    // Support comma-separated class names: "DefaultCLI,DefaultWeb4TSComponent"
    // Try each class until we find the method
    if (className.includes(',')) {
      const classes = className.split(',').map(c => c.trim());
      for (const cls of classes) {
        const params = this.getEnhancedMethodParameters(cls, methodName);
        if (params.length > 0) {
          return params;
        }
      }
      return [];
    }
    
    const files = TSCompletion.getProjectSourceFiles();
    const parameterInfo: any[] = [];
    
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              // ✅ NEW: Enhanced parameter extraction with union type support
              for (let i = 0; i < m.parameters.length; i++) {
                const param = m.parameters[i];
                const paramName = param.name.getText();
                const paramType = param.type ? param.type.getText() : 'any';
                
                // Extract JSDoc description and annotations for parameter
                const description = TSCompletion.extractParamJsDoc(m, paramName);
                // ✅ FIX: Use full JSDoc text extraction to get @cliDefault annotations
                const jsDoc = TSCompletion.extractEnhancedJsDocText(m);
                const cliAnnotations = TSCompletion.parseCliAnnotations(jsDoc, paramName);
                
                // Detect if parameter has default value (e.g., action: string = '')
                const hasInitializer = param.initializer !== undefined;
                const hasDefault = cliAnnotations.default !== null || hasInitializer;
                
                // Extract default value and strip quotes if present
                let defaultValue = hasInitializer ? param.initializer.getText() : cliAnnotations.default;
                if (defaultValue && typeof defaultValue === 'string') {
                  // Strip surrounding quotes: 'value' or "value" → value
                  defaultValue = defaultValue.replace(/^['"]|['"]$/g, '');
                }
                
                parameterInfo.push({
                  name: paramName,
                  type: paramType,
                  required: !param.questionToken && !hasDefault, // Optional if has ? OR default value
                  description: description || `${paramName} parameter`,
                  default: defaultValue,
                  // ✅ NEW: Union type detection
                  isUnionType: TSCompletion.isUnionType(paramType),
                  unionTypes: TSCompletion.extractUnionTypes(paramType)
                });
              }
            }
          }
        }
      });
    }
    
    return parameterInfo;
  }

  /**
   * Check if type string represents a union type
   * Web4 pattern: Union type detection from TypeScript AST
   */
  private static isUnionType(typeString: string): boolean {
    return typeString.includes(' | ') || typeString.includes('|');
  }

  /**
   * Extract individual types from union type string
   * Web4 pattern: Union type parsing from TypeScript AST
   */
  private static extractUnionTypes(typeString: string): string[] {
    if (!TSCompletion.isUnionType(typeString)) {
      return [typeString];
    }
    
    return typeString.split('|').map(type => type.trim());
  }

  /**
   * Extract CLI annotations from JSDoc (@cliHide, @cliSyntax, etc.)
   * Web4 pattern: Pure TSDoc annotation parsing for zero config CLI generation
   */
  static extractCliAnnotations(className: string, methodName: string, paramName?: string): any {
    // Enhanced file discovery for zero config annotation processing
    const files = TSCompletion.getAllTypeScriptFiles();
    
    for (const file of files) {
      try {
        const src = readFileSync(file, 'utf8');
        const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
        
        const result = TSCompletion.searchClassForAnnotations(sourceFile, className, methodName, paramName);
        if (result) {
          return result;
        }
      } catch (error) {
        // Continue to next file if this one fails
        continue;
      }
    }
    
    return {};
  }

  /**
   * Extract @cliValues annotation for enum parameters
   * Web4 pattern: TSDoc-driven enum value declaration for zero hardcoding
   * @param className Class name to search
   * @param methodName Method name to search (empty string = search all methods)
   * @param paramName Parameter name to extract values for
   * @returns Array of enum values, or empty array if not found
   */
  static extractCliValues(className: string, methodName: string, paramName: string): string[] {
    try {
      const files = TSCompletion.getAllTypeScriptFiles();
      
      for (const file of files) {
        const src = readFileSync(file, 'utf8');
        const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
        
        const values = TSCompletion.searchClassForCliValues(sourceFile, className, methodName, paramName);
        if (values && values.length > 0) {
          return values;
        }
      }
    } catch (error) {
      // Silently fail - no @cliValues found
    }
    
    return [];
  }

  /**
   * Search class for @cliValues annotation
   * Web4 pattern: TSDoc enum value extraction
   */
  private static searchClassForCliValues(
    sourceFile: ts.SourceFile,
    className: string,
    methodName: string,
    paramName: string
  ): string[] | null {
    let result: string[] | null = null;
    
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && 
              member.name && 
              ts.isIdentifier(member.name)) {
            
            // If methodName is empty, search all methods; otherwise match specific method
            if (methodName && member.name.text !== methodName) {
              continue;
            }
            
            // Extract JSDoc tags
            const jsDocs = ts.getJSDocTags(member);
            for (const tag of jsDocs) {
              if (tag.tagName.text === 'cliValues') {
                // Parse space-separated values from comment text
                const comment = typeof tag.comment === 'string' ? tag.comment : '';
                
                // Check if this @cliValues is for our specific parameter
                // Format can be:
                // @cliValues value1 value2 value3  (applies to first/only parameter)
                // @cliValues paramName value1 value2 value3  (applies to specific parameter)
                
                const parts = comment.trim().split(/\s+/).filter(v => v.length > 0);
                
                if (parts.length === 0) continue;
                
                // Check if first part is a parameter name
                if (parts[0] === paramName) {
                  // Format: @cliValues paramName value1 value2...
                  // Skip first token (parameter name), return only enum values
                  result = parts.slice(1);
                  return; // Found it, stop searching
                } else {
                  // ✅ FIX: Check if first part is a DIFFERENT parameter name
                  // If so, this @cliValues is for that OTHER parameter, not ours
                  const firstPartIsOtherParam = member.parameters.some(p => 
                    p.name && ts.isIdentifier(p.name) && p.name.text === parts[0]
                  );
                  
                  if (firstPartIsOtherParam) {
                    // This @cliValues is for a different parameter, skip it
                    continue;
                  }
                  
                  // Check if this method actually has our parameter
                  const hasParam = member.parameters.some(p => 
                    p.name && ts.isIdentifier(p.name) && p.name.text === paramName
                  );
                  
                  if (hasParam) {
                    // Format: @cliValues value1 value2... (no param name prefix)
                    // All parts are values, use them directly
                    result = parts;
                    return; // Found it, stop searching
                  }
                }
              }
            }
          }
        }
      }
    });
    
    return result;
  }

  /**
   * Get all TypeScript files in the component for zero config processing
   */
  private static getAllTypeScriptFiles(): string[] {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const componentRoot = path.resolve(__dirname, '../../..');
    
    const searchDirs = [
      path.join(componentRoot, 'src/ts/layer2'),
      path.join(componentRoot, 'src/ts/layer3'),
      path.join(componentRoot, 'src/ts/layer4'),
      path.join(componentRoot, 'src/ts/layer5')
    ];
    
    let files: string[] = [];
    for (const dir of searchDirs) {
      if (existsSync(dir)) {
        try {
          const dirFiles = readdirSync(dir)
            .filter(f => f.endsWith('.ts'))
            .map(f => path.join(dir, f));
          files = files.concat(dirFiles);
        } catch (error) {
          // Continue if directory can't be read
        }
      }
    }
    
    return files;
  }

  /**
   * Search class for CLI annotations with enhanced JSDoc extraction
   */
  private static searchClassForAnnotations(sourceFile: ts.SourceFile, className: string, methodName: string, paramName?: string): any | null {
    let result: any | null = null;
    
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
        for (const member of node.members) {
          if (ts.isMethodDeclaration(member) && member.name && ts.isIdentifier(member.name) && member.name.text === methodName) {
            // Enhanced JSDoc extraction with better comment detection
            const jsDocText = TSCompletion.extractEnhancedJsDocText(member);
            
            // ALWAYS parse method's JSDoc (contains @cliDefault annotations)
            // Pass paramName to extract parameter-specific values
            result = TSCompletion.parseCliAnnotations(jsDocText, paramName);
            return; // Found the method, stop searching
          }
        }
      }
    });
    
    return result;
  }

  /**
   * Enhanced JSDoc text extraction with better comment detection
   */
  private static extractEnhancedJsDocText(node: ts.Node): string {
    // Get all JSDoc comments for the node
    const jsDocComments = ts.getJSDocCommentsAndTags(node);
    let fullText = '';
    
    for (const comment of jsDocComments) {
      if (ts.isJSDoc(comment)) {
        fullText += comment.getFullText();
      }
    }
    
    // Fallback to original method if enhanced extraction fails
    if (!fullText.trim()) {
      fullText = TSCompletion.extractJsDocText(node);
    }
    
    return fullText;
  }

  /**
   * Parse CLI annotations from JSDoc text
   * Web4 pattern: Zero config annotation parsing
   */
  private static parseCliAnnotations(jsDocText: string, paramName?: string): any {
    return {
      hide: jsDocText.includes('@cliHide'),
      syntax: TSCompletion.extractAnnotationValue(jsDocText, 'cliSyntax', paramName),
      optional: jsDocText.includes('@cliOptional'),
      group: TSCompletion.extractAnnotationValue(jsDocText, 'cliGroup', paramName),
      alias: TSCompletion.extractAnnotationValue(jsDocText, 'cliAlias', paramName),
      default: TSCompletion.extractAnnotationValue(jsDocText, 'cliDefault', paramName)
    };
  }

  /**
   * Extract value from @annotation pattern
   * For @cliDefault, extracts paramName and value (e.g., "@cliDefault version 0.1.0.0")
   */
  private static extractAnnotationValue(text: string, annotation: string, paramName?: string): string | null {
    if (annotation === 'cliDefault' && paramName) {
      // Special handling for @cliDefault paramName value
      // Example: "@cliDefault version 0.1.0.0" -> extract "0.1.0.0" when paramName is "version"
      const regex = new RegExp(`@cliDefault\\s+${paramName}\\s+([^\\s\\n]+)`);
      const match = text.match(regex);
      return match ? match[1] : null;
    }
    
    // Generic annotation extraction (first word after annotation)
    const regex = new RegExp(`@${annotation}\\s+([^\\s\\n]+)`);
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  static start() {
    const args = process.argv.slice(2);
    // Only log args if LOG_LEVEL is 4 or higher
    const logLevel = parseInt(process.env.LOG_LEVEL || '0', 10);
    if (logLevel > 3) {
      console.error('[TSCompletion] args:', JSON.stringify(args));
    }
    const completion = new TSCompletion();
    const results = completion.complete(args);
    if (results.length > 0) {
      // Smart Join (OOSH-inspired):
      // If results contain numbered references (e.g. "1:filename") or any item with spaces,
      // join with NEWLINES to trigger bash line-based completion (preserves spaces).
      // Otherwise join with SPACES for backward compatibility (standard single-word completion).
      const hasNumberedRefs = results.some(r => r.match(/^\d+:/));
      const hasSpaces = results.some(r => r.includes(' '));
      
      if (hasNumberedRefs || hasSpaces) {
        // Multi-LINE mode: each result on its own line
        console.log(results.join('\n'));
      } else {
        // Multi-WORD mode: space-separated for compgen -W (no trailing newline)
        process.stdout.write(results.join(' '));
      }
    }
  }
}

// CLI entry point for completion
// Support both .ts (ts-node) and .js (compiled) execution
if (process.argv[1] && (process.argv[1].endsWith('TSCompletion.ts') || process.argv[1].endsWith('TSCompletion.js'))) {
  TSCompletion.start();
}
