/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

// TestFileParser - Parse test files to extract describe/it structure for selective test execution
// Used by CLI to provide numbered test selection with tab completion

import { readFileSync, readdirSync, statSync } from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';
import { DefaultColors } from './DefaultColors.js';

export interface TestFile {
  name: string;
  relativePath: string;
  absolutePath: string;
}

export interface DescribeBlock {
  name: string;
  line: number;
  fullName: string; // For nested describes: "parent > child"
}

export interface ItCase {
  name: string;
  line: number;
  describe: string; // Parent describe name
}

export class TestFileParser {
  
  static scanTestFiles(testDir: string): TestFile[] {
    const files: TestFile[] = [];
    
    try {
      const entries = readdirSync(testDir);
      
      for (const entry of entries) {
        const fullPath = path.join(testDir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isFile() && entry.endsWith('.test.ts')) {
          files.push({
            name: entry,
            relativePath: entry,
            absolutePath: fullPath,
          });
        }
      }
      
      // Sort alphabetically
      files.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error(`❌ Failed to scan test directory: ${testDir}`, error);
    }
    
    return files;
  }

  
  static parseDescribeBlocks(filePath: string): DescribeBlock[] {
    const describes: DescribeBlock[] = [];
    
    try {
      const sourceCode = readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
      );
      
      const describeStack: string[] = []; // Track nested describe names
      
      const visit = (node: ts.Node) => {
        // Check if this is a describe() call
        if (this.isDescribeCall(node)) {
          const callExpr = node as ts.CallExpression;
          const nameArg = callExpr.arguments[0];
          
          if (ts.isStringLiteral(nameArg)) {
            const describeName = nameArg.text;
            const line = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1;
            
            // Build full hierarchical name
            const fullName = describeStack.length > 0
              ? `${describeStack.join(' > ')} > ${describeName}`
              : describeName;
            
            describes.push({
              name: describeName,
              line,
              fullName,
            });
            
            // Push onto stack for nested describes
            describeStack.push(describeName);
            
            // Visit children (for nested describes)
            ts.forEachChild(node, visit);
            
            // Pop from stack when done
            describeStack.pop();
            return; // Don't continue traversing this subtree again
          }
        }
        
        // Continue traversing
        ts.forEachChild(node, visit);
      };
      
      visit(sourceFile);
    } catch (error) {
      console.error(`❌ Failed to parse describe blocks from: ${filePath}`, error);
    }
    
    return describes;
  }

  
  static parseItCases(filePath: string, describeIndex?: number): ItCase[] {
    const itCases: ItCase[] = [];
    
    try {
      const sourceCode = readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile(
        filePath,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
      );
      
      let currentDescribe: string = '(top-level)';
      let describeCount = -1; // Track which describe we're in
      const describeStack: string[] = [];
      
      const visit = (node: ts.Node) => {
        // Track describe blocks
        if (this.isDescribeCall(node)) {
          const callExpr = node as ts.CallExpression;
          const nameArg = callExpr.arguments[0];
          
          if (ts.isStringLiteral(nameArg)) {
            const describeName = nameArg.text;
            describeCount++;
            const prevDescribe = currentDescribe;
            currentDescribe = describeName;
            describeStack.push(describeName);
            
            // Visit children
            ts.forEachChild(node, visit);
            
            // Restore
            currentDescribe = prevDescribe;
            describeStack.pop();
            return;
          }
        }
        
        // Check if this is an it() call
        if (this.isItCall(node)) {
          // Only include if no filter, or if we're in the target describe
          if (describeIndex === undefined || describeCount === describeIndex) {
            const callExpr = node as ts.CallExpression;
            const nameArg = callExpr.arguments[0];
            
            if (ts.isStringLiteral(nameArg)) {
              const itName = nameArg.text;
              const line = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart()).line + 1;
              
              itCases.push({
                name: itName,
                line,
                describe: describeStack.length > 0 ? describeStack.join(' > ') : '(top-level)',
              });
            }
          }
        }
        
        // Continue traversing
        ts.forEachChild(node, visit);
      };
      
      visit(sourceFile);
    } catch (error) {
      console.error(`❌ Failed to parse it cases from: ${filePath}`, error);
    }
    
    return itCases;
  }

  
  private static isDescribeCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) return false;
    
    const expr = node.expression;
    
    // Simple: describe()
    if (ts.isIdentifier(expr) && expr.text === 'describe') {
      return true;
    }
    
    // Property access: describe.skip(), describe.only()
    if (ts.isPropertyAccessExpression(expr) &&
        ts.isIdentifier(expr.expression) &&
        expr.expression.text === 'describe') {
      return true;
    }
    
    return false;
  }

  
  private static isItCall(node: ts.Node): boolean {
    if (!ts.isCallExpression(node)) return false;
    
    const expr = node.expression;
    
    // Simple: it() or test()
    if (ts.isIdentifier(expr) && (expr.text === 'it' || expr.text === 'test')) {
      return true;
    }
    
    // Property access: it.skip(), it.only(), test.skip(), test.only()
    if (ts.isPropertyAccessExpression(expr) &&
        ts.isIdentifier(expr.expression) &&
        (expr.expression.text === 'it' || expr.expression.text === 'test')) {
      return true;
    }
    
    return false;
  }

  
  static formatFilesForCompletion(files: TestFile[]): string[] {
    return files.map((f, i) => `${i + 1}:${f.name}`);
  }

  
  static getAllFilesHierarchical(testDir: string): {
    display: string[];
    tokens: string[];
  } {
    const files = TestFileParser.scanTestFiles(testDir);
    const display: string[] = [];
    const tokens: string[] = [];

    // ANSI color codes (use centralized Colors)
    const colors = DefaultColors.getInstance();
    const cyan = colors.toolName;  // Use toolName for cyan bold
    const reset = colors.reset;

    const lines: string[] = [];
    files.forEach((file, fileIndex) => {
      const fileNum = fileIndex + 1;
      const token = `${fileNum}`;
      lines.push(`${cyan}${fileNum}:${reset}\t${file.name}`);
      tokens.push(token);
    });

    // Return as single string with newlines to trigger OOSH multi-line mode
    display.push(lines.join('\n'));

    return { display, tokens };
  }

  
  static formatDescribesForCompletion(describes: DescribeBlock[]): string[] {
    return describes.map((d, i) => `${i + 1}:${d.name}`);
  }

  
  static formatItCasesForCompletion(itCases: ItCase[]): string[] {
    return itCases.map((it, i) => `${i + 1}:${it.name}`);
  }

  
  static getFileByNumber(files: TestFile[], num: number): TestFile | undefined {
    return files[num - 1];
  }

  
  static getDescribeByNumber(describes: DescribeBlock[], num: number): DescribeBlock | undefined {
    return describes[num - 1];
  }

  
  static getItCaseByNumber(itCases: ItCase[], num: number): ItCase | undefined {
    return itCases[num - 1];
  }

  
  static getAllItCasesHierarchical(testDir: string): {
    display: string[];
    tokens: string[];
  } {
    const files = TestFileParser.scanTestFiles(testDir);
    const display: string[] = [];
    const tokens: string[] = [];

    // ANSI color codes (use centralized Colors)
    const colors = DefaultColors.getInstance();
    const cyan = colors.toolName;
    const green = colors.descriptions;
    const yellow = colors.parameters;
    const reset = colors.reset;

    files.forEach((file, fileIndex) => {
      const fileNum = fileIndex + 1;
      const describes = TestFileParser.parseDescribeBlocks(file.absolutePath);

      if (describes.length === 0) {
        return; // Skip files with no describe blocks
      }

      // Add file header (colored file number)
      display.push(`${cyan}${fileNum}:${reset}\t${file.name}`);

      // Add describe blocks with their it cases
      describes.forEach((desc, descIndex) => {
        const letter = String.fromCharCode('a'.charCodeAt(0) + descIndex);
        display.push(`    ${cyan}${fileNum}${letter})${reset} ${desc.name}`);
        
        // Get it cases for this describe block
        const itCases = TestFileParser.parseItCases(file.absolutePath, descIndex);
        
        itCases.forEach((itCase, itIndex) => {
          const itNum = itIndex + 1;
          const token = `${fileNum}${letter}${itNum}`;
          display.push(`           ${cyan}${fileNum}${green}${letter}${yellow}${itNum})${reset} ${itCase.name}`);
          tokens.push(token);
        });
      });
    });

    return { display, tokens };
  }
  static getAllDescribesHierarchical(testDir: string): {
    display: string[];
    tokens: string[];
  } {
    const files = TestFileParser.scanTestFiles(testDir);
    const display: string[] = [];
    const tokens: string[] = [];

    // ANSI color codes (use centralized Colors)
    const colors = DefaultColors.getInstance();
    const cyan = colors.toolName;
    const green = colors.descriptions;
    const reset = colors.reset;

    files.forEach((file, fileIndex) => {
      const fileNum = fileIndex + 1;
      const describes = TestFileParser.parseDescribeBlocks(file.absolutePath);

      if (describes.length === 0) {
        return; // Skip files with no describe blocks
      }

      // Add file header (colored file number)
      display.push(`${cyan}${fileNum}:${reset}  ${file.name}`);

      // Add describe blocks with letter indices
      describes.forEach((desc, descIndex) => {
        const letter = String.fromCharCode('a'.charCodeAt(0) + descIndex);
        display.push(`      ${green}${letter})${reset} ${desc.name}`);
        tokens.push(`${fileNum}${letter}`);
      });
    });

    return { display, tokens };
  }

  
  static parseDescribeReference(ref: string): { fileNum: number; describeIndex: number } | null {
    const match = ref.match(/^(\d+)([a-z])$/);
    if (!match) return null;

    const fileNum = parseInt(match[1], 10);
    const describeIndex = match[2].charCodeAt(0) - 'a'.charCodeAt(0);

    return { fileNum, describeIndex };
  }

  
  static getDescribeByReference(testDir: string, ref: string): { file: TestFile; describe: DescribeBlock } | null {
    const parsed = TestFileParser.parseDescribeReference(ref);
    if (!parsed) return null;

    const files = TestFileParser.scanTestFiles(testDir);
    const file = files[parsed.fileNum - 1];
    if (!file) return null;

    const describes = TestFileParser.parseDescribeBlocks(file.absolutePath);
    const describe = describes[parsed.describeIndex];
    if (!describe) return null;

    return { file, describe };
  }
}

