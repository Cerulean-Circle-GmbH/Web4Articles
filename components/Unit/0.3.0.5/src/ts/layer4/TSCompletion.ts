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
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      let found: string[] = [];
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          found = node.members
            .filter(m => ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name))
            .map(m => (m.name as ts.Identifier).text);
        }
      });
      if (found.length > 0) return found;
    }
    return [];
  }

  static getMethodParameters(className: string, methodName: string, paramName?: string): any[] {
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
          return TSCompletion.getMethodParameters(className, methodPrefix);
        }
        return [subMethods[0].slice(methodPrefix.length)];
      }
      // No methods match the prefix; try parameters for the methodPrefix
      const params = TSCompletion.getMethodParameters(className, methodPrefix);
      if (params.length > 0) return params;
      return subMethods;
    }
    if (args.length === 3) {
      // If the second arg + third arg matches a method, complete its parameters
      const [className, methodPrefix, subMethodOrParam] = args;
      // First, try to complete default value for the parameter of the methodPrefix
      const values = TSCompletion.getMethodParameters(className, methodPrefix, subMethodOrParam);
      if (values.length > 0 && values[0] !== subMethodOrParam && values[0] !== undefined && values[0] !== '') {
        return values;
      }
      const methods = TSCompletion.getClassMethods(className);
      const fullMethod = methodPrefix + (subMethodOrParam.charAt(0).toUpperCase() + subMethodOrParam.slice(1));
      if (methods.includes(fullMethod)) {
        return TSCompletion.getMethodParameters(className, fullMethod);
      }
      return [];
    }
    return [];
  }

  /**
   * Enhanced method parameter extraction with union type support
   * Web4 pattern: TypeScript AST parsing with union type detection for CLI generation
   */
  static getEnhancedMethodParameters(className: string, methodName: string): any[] {
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
                
                // Extract JSDoc description for parameter
                const description = TSCompletion.extractParamJsDoc(m, paramName);
                
                parameterInfo.push({
                  name: paramName,
                  type: paramType,
                  required: !param.questionToken, // Optional if has ? token
                  description: description || `${paramName} parameter`,
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
    const files = TSCompletion.getProjectSourceFiles();
    
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
      
      ts.forEachChild(sourceFile, node => {
        if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
          for (const m of node.members) {
            if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
              const jsDocText = TSCompletion.extractJsDocText(m);
              
              if (paramName) {
                // Extract parameter-specific annotations
                const paramDoc = TSCompletion.extractParamJsDoc(m, paramName);
                return TSCompletion.parseCliAnnotations(paramDoc);
              } else {
                // Extract method-level annotations
                return TSCompletion.parseCliAnnotations(jsDocText);
              }
            }
          }
        }
      });
    }
    
    return {};
  }

  /**
   * Parse CLI annotations from JSDoc text
   * Web4 pattern: Zero config annotation parsing
   */
  private static parseCliAnnotations(jsDocText: string): any {
    return {
      hide: jsDocText.includes('@cliHide'),
      syntax: TSCompletion.extractAnnotationValue(jsDocText, 'cliSyntax'),
      optional: jsDocText.includes('@cliOptional'),
      group: TSCompletion.extractAnnotationValue(jsDocText, 'cliGroup'),
      alias: TSCompletion.extractAnnotationValue(jsDocText, 'cliAlias'),
      default: TSCompletion.extractAnnotationValue(jsDocText, 'cliDefault')
    };
  }

  /**
   * Extract value from @annotation pattern
   */
  private static extractAnnotationValue(text: string, annotation: string): string | null {
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
      console.log(results.join(' '));
    }
  }
}

// CLI entry point for completion
if (process.argv[1] && process.argv[1].endsWith('TSCompletion.ts')) {
  TSCompletion.start();
}
