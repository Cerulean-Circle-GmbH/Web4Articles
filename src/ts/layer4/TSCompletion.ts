// TypeScript Completion Backend for oosh CLI
// Implements Completion interface for dynamic tab completion

export interface Completion {
  complete(args: string[]): string[];
}


import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

function getProjectSourceFiles(): string[] {
  // Scan src/ts/layer2 and src/ts/layer3 for .ts files
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const dirs = [
    path.resolve(__dirname, '../layer2'),
    path.resolve(__dirname, '../layer3'),
  ];
  let files: string[] = [];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      files = files.concat(
        fs.readdirSync(dir)
          .filter(f => f.endsWith('.ts'))
          .map(f => path.join(dir, f))
      );
    }
  }
  return files;
}

function getClasses(): string[] {
  const files = getProjectSourceFiles();
  const classNames: Set<string> = new Set();
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name) {
        classNames.add(node.name.text);
      }
    });
  }
  return Array.from(classNames);
}

function getClassMethods(className: string): string[] {
  const files = getProjectSourceFiles();
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
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

function getMethodParameters(className: string, methodName: string): string[] {
  const files = getProjectSourceFiles();
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    let params: string[] = [];
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name && node.name.text === className) {
        for (const m of node.members) {
          if (ts.isMethodDeclaration(m) && m.name && ts.isIdentifier(m.name) && m.name.text === methodName) {
            params = m.parameters.map(p => p.name.getText());
          }
        }
      }
    });
    if (params.length > 0) return params;
  }
  return [];
}

export class TSCompletion implements Completion {
  complete(args: string[]): string[] {
    // Step 1: No args, suggest available classes
    if (args.length === 0) {
      return getClasses();
    }
    // Step 2: Class provided, suggest methods
    if (args.length === 1) {
      return getClassMethods(args[0]);
    }
    // Step 3: Class + method, suggest parameters
    if (args.length === 2) {
      return getMethodParameters(args[0], args[1]);
    }
    // Step 4: Class + method + param, suggest default value (not implemented generically)
    // Could be extended to parse JSDoc or code for default values
    return [];
  }
}

// CLI entry point for completion
if (process.argv[1] && process.argv[1].endsWith('TSCompletion.ts')) {
  const args = process.argv.slice(2);
  const completion = new TSCompletion();
  const results = completion.complete(args);
  if (results.length > 0) {
    console.log(results.join(' '));
  }
}
