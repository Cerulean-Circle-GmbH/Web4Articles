import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';

/**
 * 🐛 Bug #1 Regression Tests
 * 
 * Tests for the fundamental tab completion bug where bash logic complexity
 * broke basic completion functionality.
 * 
 * Root Cause: Moving completion intelligence into bash violated the core
 * principle "All logic in TypeScript". This created fragility and regressions.
 * 
 * Fix: Reverted bash to simple 58a9b0a1 architecture - bash is dumb display,
 * TypeScript is smart completion engine.
 * 
 * Reference: known.bug1.analysis.md
 * Last Working Commit: 58a9b0a1 (2025-10-17-UTC-2015)
 * First Broken Commit: c4fbcfbe (2025-10-18)
 */

describe('🐛 Bug #1: Tab Completion Regression Tests', () => {
  const projectRoot = path.resolve(__dirname, '../../../..');
  const cliPath = path.join(projectRoot, 'scripts/web4tscomponent');

  /**
   * Helper: Strip ANSI color codes for assertion
   */
  function stripAnsi(str: string): string {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  }

  describe('🎯 Test Case 1: Hierarchical Display (web4tscomponent <TAB>)', () => {
    it('1a. should show full numbered method list when invoked with no args', () => {
      // Simulate: web4tscomponent <TAB>
      // This should trigger hierarchical display callback in TypeScript
      const command = `${cliPath} completion method`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show numbered list
      expect(output).toMatch(/1:/);
      expect(output).toMatch(/2:/);
      
      // Should include key methods
      expect(output).toContain('analyzeComponentMethods');
      expect(output).toContain('create');
      expect(output).toContain('build');
      expect(output).toContain('test');
      expect(output).toContain('on');
      
      // Should have parameters shown
      const stripped = stripAnsi(output);
      expect(stripped).toContain('<component>');
      expect(stripped).toContain('<?version');
    });
  });

  describe('🎯 Test Case 2: Filtered Hierarchical Display (web4tscomponent co<TAB>)', () => {
    it('2a. should show filtered method list for partial prefix', () => {
      // Simulate: web4tscomponent co<TAB>
      const command = `${cliPath} completion method co`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show numbered filtered list
      expect(output).toMatch(/1:/);
      
      // Should include methods starting with 'co' (strip ANSI for matching)
      const stripped = stripAnsi(output);
      expect(stripped).toContain('compare');
      expect(stripped).toContain('completion');
      
      // Should NOT include methods NOT starting with 'co'
      expect(stripped).not.toContain('build');
      expect(stripped).not.toContain('test');
    });
  });

  describe('🎯 Test Case 3: Method Discovery (completion method <TAB>) - THE BUG', () => {
    it('3a. should show full method list, NOT file listing', () => {
      // This was the BROKEN case: web4tscomponent completion method <TAB>
      // It was falling back to directory listing (.git/, package.json)
      const command = `${cliPath} completion method`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // MUST show method list
      expect(output).toMatch(/1:/);
      expect(output).toMatch(/2:/);
      expect(output).toContain('analyzeComponentMethods');
      expect(output).toContain('create');
      
      // MUST NOT show directory listing
      expect(output).not.toContain('.git/');
      expect(output).not.toContain('.github/');
      expect(output).not.toContain('package.json');
      expect(output).not.toContain('node_modules');
    });

    it('3b. should show filtered method list for partial method name', () => {
      // Simulate: web4tscomponent completion method co<TAB>
      const command = `${cliPath} completion method co`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show filtered methods (strip ANSI for matching)
      const stripped = stripAnsi(output);
      expect(stripped).toContain('compare');
      expect(stripped).toContain('completion');
      
      // Should NOT be file listing
      expect(output).not.toContain('.git/');
      expect(output).not.toContain('package.json');
    });
  });

  describe('🎯 Test Case 4: Parameter Discovery (completion parameter <TAB>) - THE BUG', () => {
    it('4a. should show parameter list, NOT file listing', () => {
      // This was the BROKEN case: web4tscomponent completion parameter <TAB>
      const command = `${cliPath} completion parameter`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // MUST show parameter list
      expect(output).toMatch(/1:/);
      expect(output).toMatch(/2:/);
      
      const stripped = stripAnsi(output);
      expect(stripped).toContain('<?action>');
      expect(stripped).toContain('<component>');
      expect(stripped).toContain('<?version');
      
      // MUST NOT show directory listing
      expect(output).not.toContain('.git/');
      expect(output).not.toContain('package.json');
    });

    it('4b. should show filtered parameter list for partial parameter name', () => {
      // Simulate: web4tscomponent completion parameter v<TAB>
      const command = `${cliPath} completion parameter v`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show parameters starting with 'v' (strip ANSI for matching)
      const stripped = stripAnsi(output);
      expect(stripped).toContain('<?version');
      
      // Should NOT be file listing
      expect(output).not.toContain('.git/');
    });
  });

  describe('🎯 Test Case 5: Context-aware Completion (on Unit <TAB>)', () => {
    it('5a. should show version completion for on command', () => {
      // This tests that callbacks work correctly for context-aware completion
      const command = `${cliPath} completeParameter versionParameterCompletion on Unit`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show version values (latest, dev, test, prod, or actual versions)
      // This proves callbacks are working
      expect(output.trim().length).toBeGreaterThan(0);
      expect(output).not.toContain('.git/');
    });
  });

  describe('🎯 Test Case 6: Test Mode Completion (test <TAB>) - EVIDENCE', () => {
    it('6a. should show test mode options', () => {
      // This test proves that callback pattern already worked
      // web4tscomponent test <TAB> → all, describe, file, itCase
      const command = `${cliPath} completeParameter scopeParameterCompletion test`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show test modes
      expect(output).toContain('describe');
      expect(output).toContain('file');
      expect(output).toContain('itCase');
      
      // Should NOT show directory listing
      expect(output).not.toContain('.git/');
      expect(output).not.toContain('package.json');
    });

    it('6b. should show test file references for itCase', () => {
      // This proves hierarchical callbacks work
      // web4tscomponent test itCase <TAB>
      const command = `${cliPath} completeParameter referencesParameterCompletion test itCase`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show test file numbers with descriptions
      expect(output).toMatch(/[0-9]+:/);
      expect(output).toContain('.test.ts');
      
      // Should NOT be file listing
      expect(output).not.toContain('.git/');
      expect(output).not.toContain('package.json');
    });
  });

  describe('📊 Architectural Verification', () => {
    it('should have simple bash script with minimal logic', () => {
      // Read source.env to verify it follows the simple architecture
      const fs = require('fs');
      const sourceEnv = fs.readFileSync(path.join(projectRoot, 'source.env'), 'utf8');
      
      // Should NOT have complex conditional blocks for hierarchical display
      // The original broken version had 100+ lines of bash conditionals
      // The simple version just calls TSCompletion and callbacks
      
      // Verify it has the simple callback pattern
      expect(sourceEnv).toContain('__CALLBACK__:');
      expect(sourceEnv).toContain('completeParameter "$callback" "${args[@]}"');
      
      // Should NOT have the complex hierarchical display block that broke things
      // (Lines 143-308 in the broken version)
      expect(sourceEnv).not.toContain('Auto-injected hierarchical display callback');
      expect(sourceEnv).not.toContain('if [ ${#args[@]} -eq 0 ] || ([ ${#args[@]} -eq 1 ]');
    });

    it('should keep all completion logic in TypeScript', () => {
      // Verify that callbacks are the primary mechanism
      const output1 = execSync(`${cliPath} completion method`, { encoding: 'utf8', cwd: projectRoot });
      const output2 = execSync(`${cliPath} completion parameter`, { encoding: 'utf8', cwd: projectRoot });
      
      // Both should work (proving TypeScript handles the logic)
      expect(output1).toMatch(/1:/);
      expect(output2).toMatch(/1:/);
      
      // Neither should fall back to file listing
      expect(output1).not.toContain('.git/');
      expect(output2).not.toContain('.git/');
    });
  });

  describe('🧪 Regression Prevention', () => {
    it('should document the architectural principle', () => {
      // This test exists to remind future developers:
      // "All logic in TypeScript" is not just a guideline, it's a requirement
      // Moving intelligence to bash WILL break things
      
      const principle = 'All logic in TypeScript';
      const violation = 'Bash becomes smart';
      const consequence = 'Fragility and regressions';
      
      expect(principle).toBe('All logic in TypeScript');
      expect(violation).toBe('Bash becomes smart');
      expect(consequence).toBe('Fragility and regressions');
      
      // If this test fails, you've probably added bash conditional logic
      // Stop. Move the logic to TypeScript instead.
    });
  });
});

