// TypeScript Completion Backend for oosh CLI
// Implements Completion interface for dynamic tab completion



import type { Completion } from '../layer3/Completion.ts' with { type: 'typescript' };
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

export class TSCompletion implements Completion {
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

  static getMethodParameters(className: string, methodName: string): string[] {
    const files = TSCompletion.getProjectSourceFiles();
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
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

  complete(args: string[]): string[] {
    if (args.length === 0) {
      return TSCompletion.getClasses();
    }
    if (args.length === 1) {
      return TSCompletion.getClassMethods(args[0]);
    }
    if (args.length === 2) {
      return TSCompletion.getMethodParameters(args[0], args[1]);
    }
    return [];
  }

  static start() {
    const args = process.argv.slice(2);
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
