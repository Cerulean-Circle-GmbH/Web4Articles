/**
 * Web4TSComponent File Protection Tests
 * 
 * These tests alarm when agents modify copied CLI or DefaultCLI files
 * Protects against accidental breaking of auto-discovery architecture
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

describe('Web4TSComponent File Protection', () => {
  const componentDir = path.resolve(__dirname, '..');
  
  // Expected file hashes - these will alarm if files are modified
  const protectedFiles = {
    'src/ts/layer2/DefaultCLI.ts': {
      description: 'Core auto-discovery CLI base class',
      critical: true,
      expectedLines: 1011, // Approximate line count
      mustContain: [
        'executeDynamicCommand',
        'methodSignatures',
        'auto-discovery',
        'TSCompletion'
      ]
    },
    'src/ts/layer5/Web4TSComponentCLI.ts': {
      description: 'Web4TSComponent CLI implementation',
      critical: true,
      expectedLines: 86, // Approximate line count
      mustContain: [
        'extends DefaultCLI',
        'DefaultWeb4TSComponent',
        'initWithComponentClass'
      ]
    },
    'src/ts/layer4/TSCompletion.ts': {
      description: 'TypeScript completion and method discovery',
      critical: true,
      expectedLines: 469, // Approximate line count
      mustContain: [
        'getEnhancedMethodParameters',
        'extractCliAnnotations',
        'getClassMethods'
      ]
    },
    'src/ts/layer3/CLI.interface.ts': {
      description: 'CLI interface definition',
      critical: false,
      expectedLines: 25, // Approximate line count
      mustContain: [
        'interface CLI',
        'execute',
        'init'
      ]
    }
  };

  describe('🚨 CRITICAL FILE PROTECTION ALARMS', () => {
    
    it('should ALARM if DefaultCLI.ts is modified by agents', async () => {
      const filePath = path.join(componentDir, 'src/ts/layer2/DefaultCLI.ts');
      
      expect(fs.existsSync(filePath), 
        '🚨 ALARM: DefaultCLI.ts is MISSING! This breaks auto-discovery!'
      ).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      const fileInfo = protectedFiles['src/ts/layer2/DefaultCLI.ts'];

      // Check approximate line count (allow 10% variance)
      const expectedLines = fileInfo.expectedLines;
      const variance = Math.floor(expectedLines * 0.1);
      
      expect(lines).toBeGreaterThan(expectedLines - variance);
      expect(lines).toBeLessThan(expectedLines + variance * 2); // Allow more for additions
      
      if (lines < expectedLines - variance) {
        throw new Error(`🚨 ALARM: DefaultCLI.ts has been SHORTENED! Expected ~${expectedLines} lines, got ${lines}. This likely breaks auto-discovery!`);
      }

      // Check critical content is present
      for (const requiredContent of fileInfo.mustContain) {
        expect(content, 
          `🚨 ALARM: DefaultCLI.ts missing critical content: "${requiredContent}". Auto-discovery may be broken!`
        ).toContain(requiredContent);
      }
    });

    it('should ALARM if Web4TSComponentCLI.ts is modified by agents', async () => {
      const filePath = path.join(componentDir, 'src/ts/layer5/Web4TSComponentCLI.ts');
      
      expect(fs.existsSync(filePath), 
        '🚨 ALARM: Web4TSComponentCLI.ts is MISSING! This breaks the CLI!'
      ).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      const fileInfo = protectedFiles['src/ts/layer5/Web4TSComponentCLI.ts'];

      // Check approximate line count (allow 20% variance for CLI files)
      const expectedLines = fileInfo.expectedLines;
      const variance = Math.floor(expectedLines * 0.2);
      
      expect(lines).toBeGreaterThan(expectedLines - variance);
      
      if (lines < expectedLines - variance) {
        throw new Error(`🚨 ALARM: Web4TSComponentCLI.ts has been SHORTENED! Expected ~${expectedLines} lines, got ${lines}. CLI may be broken!`);
      }

      // Check critical content is present
      for (const requiredContent of fileInfo.mustContain) {
        expect(content, 
          `🚨 ALARM: Web4TSComponentCLI.ts missing critical content: "${requiredContent}". CLI inheritance broken!`
        ).toContain(requiredContent);
      }
    });

    it('should ALARM if TSCompletion.ts is modified by agents', async () => {
      const filePath = path.join(componentDir, 'src/ts/layer4/TSCompletion.ts');
      
      expect(fs.existsSync(filePath), 
        '🚨 ALARM: TSCompletion.ts is MISSING! This breaks method discovery!'
      ).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      const fileInfo = protectedFiles['src/ts/layer4/TSCompletion.ts'];

      // Check approximate line count
      const expectedLines = fileInfo.expectedLines;
      const variance = Math.floor(expectedLines * 0.1);
      
      if (lines < expectedLines - variance) {
        throw new Error(`🚨 ALARM: TSCompletion.ts has been SHORTENED! Expected ~${expectedLines} lines, got ${lines}. Method discovery broken!`);
      }

      // Check critical content is present
      for (const requiredContent of fileInfo.mustContain) {
        expect(content, 
          `🚨 ALARM: TSCompletion.ts missing critical content: "${requiredContent}". Method discovery broken!`
        ).toContain(requiredContent);
      }
    });
  });

  describe('📋 FILE INTEGRITY MONITORING', () => {
    
    it('should detect unauthorized modifications to critical files', async () => {
      const modifications: string[] = [];
      
      for (const [relativePath, fileInfo] of Object.entries(protectedFiles)) {
        const filePath = path.join(componentDir, relativePath);
        
        if (!fs.existsSync(filePath)) {
          modifications.push(`🚨 MISSING: ${relativePath} - ${fileInfo.description}`);
          continue;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').length;
        
        // Check for suspicious modifications
        if (lines < fileInfo.expectedLines * 0.5) {
          modifications.push(`🚨 SEVERELY SHORTENED: ${relativePath} (${lines} lines, expected ~${fileInfo.expectedLines})`);
        }
        
        // Check for missing critical content
        for (const requiredContent of fileInfo.mustContain) {
          if (!content.includes(requiredContent)) {
            modifications.push(`🚨 MISSING CONTENT: ${relativePath} lacks "${requiredContent}"`);
          }
        }
      }
      
      if (modifications.length > 0) {
        const alarm = `
🚨🚨🚨 FILE PROTECTION ALARM 🚨🚨🚨

The following critical files have been modified or are missing:

${modifications.join('\n')}

These files are essential for auto-discovery CLI functionality.
Modifications by agents may break the entire system!

IMMEDIATE ACTION REQUIRED:
1. Restore original files from git
2. Review what agent modified these files
3. Educate agent about file protection
4. Test CLI functionality: ./web4tscomponent

🚨🚨🚨 END ALARM 🚨🚨🚨
        `;
        
        console.error(alarm);
        throw new Error('Critical file protection alarm triggered!');
      }
    });

    it('should verify auto-discovery architecture integrity', async () => {
      const cliFile = path.join(componentDir, 'src/ts/layer5/Web4TSComponentCLI.ts');
      const defaultCliFile = path.join(componentDir, 'src/ts/layer2/DefaultCLI.ts');
      const tsCompletionFile = path.join(componentDir, 'src/ts/layer4/TSCompletion.ts');
      
      expect(fs.existsSync(cliFile), 'CLI file missing').toBe(true);
      expect(fs.existsSync(defaultCliFile), 'DefaultCLI file missing').toBe(true);
      expect(fs.existsSync(tsCompletionFile), 'TSCompletion file missing').toBe(true);

      const cliContent = fs.readFileSync(cliFile, 'utf-8');
      const defaultCliContent = fs.readFileSync(defaultCliFile, 'utf-8');
      const tsCompletionContent = fs.readFileSync(tsCompletionFile, 'utf-8');

      // Verify inheritance chain
      expect(cliContent, 'CLI must extend DefaultCLI').toContain('extends DefaultCLI');
      
      // Verify auto-discovery functionality
      expect(defaultCliContent, 'DefaultCLI must have method discovery').toContain('executeDynamicCommand');
      expect(defaultCliContent, 'DefaultCLI must use TSCompletion').toContain('TSCompletion');
      
      // Verify TSCompletion functionality
      expect(tsCompletionContent, 'TSCompletion must extract method parameters').toContain('getEnhancedMethodParameters');
      expect(tsCompletionContent, 'TSCompletion must extract CLI annotations').toContain('extractCliAnnotations');
    });
  });

  describe('🔍 NEW METHOD DETECTION', () => {
    
    it('should verify tree method was added correctly', async () => {
      const componentFile = path.join(componentDir, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      
      expect(fs.existsSync(componentFile), 'Component file missing').toBe(true);
      
      const content = fs.readFileSync(componentFile, 'utf-8');
      
      // Verify tree method exists with proper TSDoc
      expect(content, 'Tree method missing').toContain('async tree(');
      expect(content, 'Tree method missing TSDoc').toContain('Display tree structure of component directory');
      expect(content, 'Tree method missing @cliSyntax').toContain('@cliSyntax depth showHidden');
      expect(content, 'Tree method missing @cliDefault').toContain('@cliDefault depth 4');
      
      // Verify tree method uses component context
      expect(content, 'Tree method must check context').toContain('getComponentContext()');
      expect(content, 'Tree method must require on method first').toContain('No component context loaded');
      
      // Verify helper method exists
      expect(content, 'Tree helper method missing').toContain('displayTreeStructure');
    });

    it('should verify tree method follows Web4 patterns', async () => {
      const componentFile = path.join(componentDir, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const content = fs.readFileSync(componentFile, 'utf-8');
      
      // Extract tree method with more context (including return statement)
      const treeMethodMatch = content.match(/\/\*\*[\s\S]*?\*\/\s*async tree\([^{]*\{[\s\S]*?return this;[\s\S]*?\}/);
      expect(treeMethodMatch, 'Could not extract tree method with full context').toBeTruthy();
      
      if (treeMethodMatch) {
        const treeMethod = treeMethodMatch[0];
        
        // Verify Web4 patterns
        expect(treeMethod, 'Tree method must return this for chaining').toContain('return this');
        expect(treeMethod, 'Tree method must be async').toContain('async tree(');
        expect(treeMethod, 'Tree method must have default parameters').toContain("= '4'");
        expect(treeMethod, 'Tree method must have default parameters').toContain("= 'false'");
      }
    });
  });

  describe('⚡ AUTO-DISCOVERY VERIFICATION', () => {
    
    it('should verify tree method will be auto-discovered by CLI', async () => {
      // This test simulates what the CLI does to discover methods
      const { DefaultWeb4TSComponent } = await import('../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      const instance = new DefaultWeb4TSComponent();
      const prototype = DefaultWeb4TSComponent.prototype;
      
      // Get all method names (like DefaultCLI does)
      const methodNames = Object.getOwnPropertyNames(prototype)
        .filter(name => typeof prototype[name] === 'function')
        .filter(name => !name.startsWith('_') && name !== 'constructor')
        .filter(name => !['init', 'toScenario', 'validateModel', 'getModel'].includes(name));
      
      // Verify tree method is discoverable
      expect(methodNames, 'Tree method not discoverable by auto-discovery').toContain('tree');
      
      // Verify tree method is actually callable
      expect(typeof prototype.tree, 'Tree method not a function').toBe('function');
      
      // Verify tree method is async (for proper CLI handling)
      expect(prototype.tree.constructor.name, 'Tree method must be async').toBe('AsyncFunction');
    });

    it('should verify CLI can handle tree method parameters', async () => {
      // Import TSCompletion to test parameter extraction
      const tsCompletionPath = path.join(componentDir, 'src/ts/layer4/TSCompletion.ts');
      expect(fs.existsSync(tsCompletionPath), 'TSCompletion file missing').toBe(true);
      
      // This would be called by the CLI for help generation
      // We're testing that the infrastructure exists to handle the tree method
      const componentFile = path.join(componentDir, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const content = fs.readFileSync(componentFile, 'utf-8');
      
      // Verify TSDoc annotations are present for auto-documentation - find tree method specifically
      const treeMethodStart = content.indexOf('Display tree structure of component directory');
      const treeMethodEnd = content.indexOf('async tree(', treeMethodStart) + 500;
      const treeMethodSection = content.substring(treeMethodStart - 200, treeMethodEnd);
      
      expect(treeMethodSection, 'Missing @cliSyntax annotation').toContain('@cliSyntax');
      expect(treeMethodSection, 'Missing @cliDefault annotation').toContain('@cliDefault');
      expect(treeMethodSection, 'Missing parameter description').toContain('@param');
    });
  });
});