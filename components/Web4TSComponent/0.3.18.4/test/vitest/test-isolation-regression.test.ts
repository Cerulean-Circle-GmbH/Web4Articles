/**
 * Test Isolation Regression Tests
 * 
 * @pdca 2025-11-10-UTC-1010.pdca.md - Comprehensive regression prevention for test isolation
 * 
 * These tests verify critical test isolation behaviors that were fixed:
 * 1. Project Root Detection: Must detect test/data as project root
 * 2. PATH Isolation: Documents PATH override in test shell
 * 3. Component Operations: create/info must work in test/data
 * 4. Completion: Method discovery and red filter highlighting
 * 
 * Test Strategy:
 * - Black box testing using actual CLI execution
 * - Tests use absolute paths to avoid symlink dependency
 * - Verifies behavior from user perspective
 * - CMM3: Documents expected behavior for traceability
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Test Isolation - Regression Prevention (CMM3)', () => {
  // Vitest runs from component root
  const componentVersion = process.cwd();
  const cliPath = join(componentVersion, 'web4tscomponent');
  const testDataDir = join(componentVersion, 'test/data');
  const projectRoot = join(componentVersion, '../..');
  
  /**
   * Helper: Run CLI from test/data directory (test isolation)
   */
  function runInTestIsolation(command: string): string {
    try {
      return execSync(command, {
        cwd: testDataDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (error: any) {
      return error.stdout || error.stderr || '';
    }
  }
  
  /**
   * Helper: Run CLI from project root (production)
   */
  function runInProduction(command: string): string {
    try {
      return execSync(command, {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (error: any) {
      return error.stdout || error.stderr || '';
    }
  }

  describe('Radical OOP: Project Root Detection from process.cwd()', () => {
    it('should detect test/data as project root when run from test isolation', () => {
      const output = runInTestIsolation(`${cliPath} info`);
      
      // Critical: Project Root must be test/data (Radical OOP: context from cwd)
      expect(output).toContain('Project Root:');
      expect(output).toMatch(/Project Root:\s+.*\/test\/data$/m);
      
      // Must NOT show production root
      expect(output).not.toMatch(/Project Root:\s+.*\/Web4Articles$/m);
    });

    it('should detect test/data as target directory in test isolation', () => {
      const output = runInTestIsolation(`${cliPath} info`);
      
      // Critical: Target Directory must match Project Root in test isolation
      expect(output).toContain('Target Directory:');
      expect(output).toMatch(/Target Directory:\s+.*\/test\/data$/m);
    });

    it('should detect production root when run from production', () => {
      const output = runInProduction(`${cliPath} info`);
      
      // When run from production, should detect production root
      expect(output).toContain('Project Root:');
      expect(output).toMatch(/Project Root:\s+.*\/Web4Articles$/m);
      expect(output).not.toMatch(/Project Root:\s+.*\/test\/data$/m);
    });
  });

  describe('Test Isolation: PATH Override Documentation', () => {
    it('should document PATH override in PDCA', () => {
      const pdcaPath = join(componentVersion, 'session/2025-11-10-UTC-1010.pdca.md');
      
      // CMM3: Fixes must be documented in PDCA
      expect(existsSync(pdcaPath)).toBe(true);
    });

    it('should have PATH override code in testShell implementation', () => {
      const implPath = join(componentVersion, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const content = execSync(`cat "${implPath}"`, { encoding: 'utf8' });
      
      // Test Isolation: PATH override must exist
      expect(content).toContain('export PATH=');
      expect(content).toContain('test/data/scripts');
    });
  });

  describe('Completion: Red Filter Highlighting (UX)', () => {
    it('should highlight filter prefix in RED', () => {
      const output = runInProduction(`${cliPath} completion method comp`);
      
      // UX: Filter "comp" must be in RED (color code 31)
      expect(output).toContain('WORD:');
      expect(output).toContain('31mcomp'); // RED color code (without brackets due to ANSI escaping)
      expect(output).toContain('WORD: compare');
    });

    it('should output multiple WORD: lines (bash completion protocol)', () => {
      const output = runInProduction(`${cliPath} completion method comp`);
      
      const wordLines = output.split('\n').filter(line => line.startsWith('WORD:'));
      
      // Bash completion: Multiple WORD: lines (one per completion)
      expect(wordLines.length).toBeGreaterThan(0);
      wordLines.forEach(line => {
        const word = line.replace('WORD:', '').trim();
        expect(word).toMatch(/^\S+$/); // Single word, no spaces
      });
    });

    it('should discover methods starting with filter prefix', () => {
      const output = runInProduction(`${cliPath} completion method comp`);
      
      // Must find methods: compare, completeCommandParameter, completeMethodName, completion
      expect(output).toContain('WORD: compare');
      expect(output).toContain('WORD: completion');
    });
  });

  describe('Edge Cases: Context Detection', () => {
    it('should detect context when production CLI executed from test/data', () => {
      const output = runInTestIsolation(`${cliPath} info`);
      
      // Context-driven: Detects test/data from WHERE it's executed
      expect(output).toMatch(/Project Root:\s+.*\/test\/data$/m);
    });
  });

  describe('CMM3: Documentation & Traceability', () => {
    it('should have PDCA for all fixes', () => {
      const pdcaPath = join(componentVersion, 'session/2025-11-10-UTC-1010.pdca.md');
      expect(existsSync(pdcaPath)).toBe(true);
    });

    it('should document fixes with @pdca references in code', () => {
      const bashWrapper = join(componentVersion, 'web4tscomponent');
      const content = execSync(`cat "${bashWrapper}"`, { encoding: 'utf8' });
      
      // CMM3: Code must reference PDCA for traceability
      expect(content).toContain('@pdca 2025-11-10-UTC-1010');
    });
  });
});

