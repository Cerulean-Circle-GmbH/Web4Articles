/**
 * Black-box integration tests for bash completion
 * 
 * These tests verify completion behavior at the shell level,
 * ensuring the entire completion pipeline works correctly.
 * 
 * @pdca 2025-11-05-UTC-0027-completion-test-suite.pdca.md
 * @cmm CMM3 - Objective, reproducible verification
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

describe('Bash Completion - Black Box Integration', () => {
  const projectRoot = join(__dirname, '../../../..');

  // Helper functions available to all tests
  const runCompletion = (cword: number, ...words: string[]): string => {
    const cmd = `cd ${projectRoot} && source source.env && web4tscomponent shCompletion ${cword} ${words.join(' ')} 2>&1`;
    return execSync(cmd, { encoding: 'utf-8', shell: '/bin/bash' });
  };

  const stripAnsi = (text: string): string => {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  };

  // @pdca 2025-11-05-UTC-2100.pdca.md - REMOVED outdated bash wrapper test
  // The old test-completion.sh script is outdated and causes line editing errors.
  // All real completion tests are below in the describe blocks.

  describe('Individual Completion Scenarios', () => {
    it('should complete single method match with documentation', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: METHOD');
      expect(clean).toContain('📖 Documentation:');
      expect(clean).toContain('Load component context for delegation');
      expect(clean).toContain('WORD: on');
    });

    it('should complete multiple method matches with filter', () => {
      const output = runCompletion(1, 'web4tscomponent', 'set');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: METHOD');
      expect(clean).toContain('1: set');
      expect(clean).toContain('2: setCICDVersion');
      expect(clean).toContain('WORD: set');
      expect(clean).toContain('WORD: setCICDVersion');
    });

    it('should complete component parameter for "on" command', () => {
      const output = runCompletion(2, 'web4tscomponent', 'on', '');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: PARAMETER of on');
      expect(clean).toContain('Parameter: <component>');
      expect(clean).toContain('Callback: DefaultCLI.componentParameterCompletion()');
      expect(clean).toContain('WORD: PDCA');
      expect(clean).toContain('WORD: Web4TSComponent');
    });

    it('should complete semantic version parameter for "setCICDVersion"', () => {
      const output = runCompletion(2, 'web4tscomponent', 'setCICDVersion', '');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: PARAMETER of setCICDVersion');
      expect(clean).toContain('Parameter: <targetVersion>');
      expect(clean).toContain('Callback: DefaultWeb4TSComponent.targetVersionParameterCompletion()');
      expect(clean).toContain('WORD: dev');
      expect(clean).toContain('WORD: latest');
      expect(clean).toContain('WORD: prod');
      expect(clean).toContain('WORD: test');
    });

    it('should complete method after "on" command (method chaining)', () => {
      const output = runCompletion(4, 'web4tscomponent', 'on', 'IdealMinimalComponent', 'latest', 'li');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: METHOD (after \'on IdealMinimalComponent');
      expect(clean).toContain('📖 Documentation:');
      expect(clean).toContain('WORD: links');
    });

    it('should show colored output with ANSI escape codes', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');

      // Verify ANSI color codes are present in the completion output
      // Note: Output may include source.env messages, so we check for presence, not exact match
      expect(output).toMatch(/\x1b\[36m/); // Cyan (diagnostic labels)
      expect(output).toMatch(/\x1b\[1;37m/); // White bold (method names)
      expect(output).toMatch(/\x1b\[0;32m/); // Green (documentation)
      expect(output).toMatch(/\x1b\[0m/); // Reset
      
      // Verify colored output is in the DISPLAY lines (not just source.env)
      expect(output).toContain('DISPLAY: \x1b[36m📊 Completing:');
    });

    it('should display correct diagnostic text for METHOD completion', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: METHOD');
      expect(clean).not.toContain('📊 Completing: PARAMETER');
    });

    it('should display correct diagnostic text for PARAMETER completion', () => {
      const output = runCompletion(2, 'web4tscomponent', 'on', '');
      const clean = stripAnsi(output);

      expect(clean).toContain('📊 Completing: PARAMETER of on');
      expect(clean).not.toContain('📊 Completing: METHOD');
    });

    it('should show single-match documentation for parameter completion', () => {
      const output = runCompletion(2, 'web4tscomponent', 'on', '');
      const clean = stripAnsi(output);

      // Should show method documentation BEFORE parameter completion info
      expect(clean).toContain('on <component> <?version>');
      expect(clean).toContain('📖 Documentation:');
      expect(clean).toContain('Load component context for delegation');
      expect(clean).toContain('📊 Completing: PARAMETER of on');
    });

    it('should show colored signature for single-match methods', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');

      // Verify colored signature is present
      // The signature appears in the DISPLAY output with method name
      expect(output).toContain('DISPLAY: on'); // Method name in signature
      expect(output).toMatch(/\x1b\[1;37m/); // White bold for method
      expect(output).toMatch(/\x1b\[1;36m/); // Cyan for separator
    });
  });

  describe('Regression Prevention', () => {
    it('should not show "METHOD" when completing parameters', () => {
      const output = runCompletion(2, 'web4tscomponent', 'on', '');
      const clean = stripAnsi(output);

      // This was a bug in earlier versions
      expect(clean).not.toContain('📊 Completing: METHOD');
      expect(clean).toContain('📊 Completing: PARAMETER');
    });

    it('should show documentation for single-match methods', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      // This was missing in earlier versions
      expect(clean).toContain('📖 Documentation:');
      expect(clean).toContain('Load component context for delegation');
    });

    it('should extract single WORD from multi-line documentation', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      // Should have exactly one WORD line for single-match
      const wordLines = clean.match(/^WORD: /gm);
      expect(wordLines).toHaveLength(1);
      expect(clean).toContain('WORD: on');
    });

    it('should call correct callback for parameter completion', () => {
      const output = runCompletion(2, 'web4tscomponent', 'on', '');
      const clean = stripAnsi(output);

      // Verify correct callback is identified
      expect(clean).toContain('Callback: DefaultCLI.componentParameterCompletion()');
    });

    it('should call correct callback for semantic version completion', () => {
      const output = runCompletion(2, 'web4tscomponent', 'setCICDVersion', '');
      const clean = stripAnsi(output);

      // Verify correct callback is identified
      expect(clean).toContain('Callback: DefaultWeb4TSComponent.targetVersionParameterCompletion()');
    });
  });

  describe('CMM3 Compliance', () => {
    it('should be objective - output is observable shell behavior', () => {
      // Test verifies actual shell output, not internal implementation
      const output = runCompletion(1, 'web4tscomponent', 'on');
      expect(output).toBeTruthy();
      expect(typeof output).toBe('string');
    });

    it('should be reproducible - same input produces same output', () => {
      const output1 = runCompletion(1, 'web4tscomponent', 'on');
      const output2 = runCompletion(1, 'web4tscomponent', 'on');

      const clean1 = stripAnsi(output1);
      const clean2 = stripAnsi(output2);

      expect(clean1).toBe(clean2);
    });

    it('should be verifiable - pass/fail criteria are clear', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      // Clear pass criteria: contains expected strings
      const hasMethodLabel = clean.includes('📊 Completing: METHOD');
      const hasDocumentation = clean.includes('📖 Documentation:');
      const hasWord = clean.includes('WORD: on');

      expect(hasMethodLabel && hasDocumentation && hasWord).toBe(true);
    });

    it('should complete all file numbers for test file command', () => {
      // @pdca 2025-11-05-UTC-1616 - Regression test for hierarchical file completion
      const output = runCompletion(3, 'web4tscomponent', 'test', 'file', '');
      const clean = stripAnsi(output);

      // Verify diagnostic output
      expect(clean).toContain('📊 Completing: PARAMETER of test');
      expect(clean).toContain('Parameter: <references>');
      expect(clean).toContain('Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');

      // Verify ALL file numbers are present (not just "1:")
      // At minimum, check for first 5 files
      expect(clean).toContain('WORD: 1');
      expect(clean).toContain('WORD: 2');
      expect(clean).toContain('WORD: 3');
      expect(clean).toContain('WORD: 4');
      expect(clean).toContain('WORD: 5');

      // Count WORD lines to ensure multiple tokens are generated
      const wordMatches = clean.match(/WORD: \d+/g);
      expect(wordMatches).toBeTruthy();
      expect(wordMatches!.length).toBeGreaterThan(10); // Should have many files
    });

    it('should complete itCase with test case references (not filenames)', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for itCase completion token extraction
      const output = runCompletion(3, 'web4tscomponent', 'test', 'itCase', '');
      const clean = stripAnsi(output);

      // Verify diagnostic output
      expect(clean).toContain('📊 Completing: PARAMETER of test');
      expect(clean).toContain('Parameter: <references>');
      expect(clean).toContain('Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');

      // Verify itCase tokens are present (format: XaY like "1a1", "18a12")
      // CRITICAL: Must be tokens, NOT filenames like "web4tscomponent.test.ts"
      expect(clean).toContain('WORD: 1a1');
      expect(clean).toContain('WORD: 1a2');
      expect(clean).toContain('WORD: 18a12'); // Example from real test suite

      // Verify NO filenames are in WORD lines
      // WORD lines should only contain itCase references (digits+letter+digits)
      const wordLines = clean.split('\n').filter((line: string) => line.startsWith('WORD: '));
      const hasFilenames = wordLines.some((line: string) => line.includes('.test.ts'));
      expect(hasFilenames).toBe(false); // Must NOT have filenames in completion

      // Verify pattern: all WORD lines should match itCase format (e.g., "18a12")
      const itCasePattern = /^WORD: \d+[a-z]\d+$/;
      const allValidItCaseTokens = wordLines.every((line: string) => itCasePattern.test(line));
      expect(allValidItCaseTokens).toBe(true);

      // Count itCase tokens to ensure many are present
      const itCaseMatches = clean.match(/WORD: \d+[a-z]\d+/g);
      expect(itCaseMatches).toBeTruthy();
      expect(itCaseMatches!.length).toBeGreaterThan(50); // Should have many test cases
    });

    it('should complete describe with describe tokens (not filenames)', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for describe completion
      const output = runCompletion(3, 'web4tscomponent', 'test', 'describe', '');
      const clean = stripAnsi(output);

      // Verify diagnostic output
      expect(clean).toContain('📊 Completing: PARAMETER of test');
      expect(clean).toContain('Parameter: <references>');

      // Verify describe tokens are present (format: Xa like "1a", "18a")
      expect(clean).toContain('WORD: 1a');
      expect(clean).toContain('WORD: 18a');

      // Verify NO filenames are in WORD lines
      const wordLines = clean.split('\n').filter((line: string) => line.startsWith('WORD: '));
      const hasFilenames = wordLines.some((line: string) => line.includes('.test.ts'));
      expect(hasFilenames).toBe(false);

      // Count describe tokens
      const describeMatches = clean.match(/WORD: \d+[a-z]$/gm);
      expect(describeMatches).toBeTruthy();
      expect(describeMatches!.length).toBeGreaterThan(100); // Many describe blocks
    });

    it('should filter describe completion by prefix', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for describe prefix filtering
      const output = runCompletion(3, 'web4tscomponent', 'test', 'describe', '4');
      const clean = stripAnsi(output);

      // Should show tokens starting with "4"
      expect(clean).toContain('WORD: 4a');
      expect(clean).toContain('WORD: 4b');
      expect(clean).toContain('WORD: 40a');
      expect(clean).toContain('WORD: 42a');
      expect(clean).toContain('WORD: 43a');

      // Should NOT show tokens not starting with "4"
      expect(clean).not.toContain('WORD: 1a');
      expect(clean).not.toContain('WORD: 18a');
    });

    it('should complete component methods (upgrade, test, build)', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for method completion including component methods
      const output = runCompletion(1, 'web4tscomponent', '');
      const clean = stripAnsi(output);

      // Verify component methods are present
      expect(clean).toContain('WORD: upgrade');
      expect(clean).toContain('WORD: test');
      expect(clean).toContain('WORD: build');
      expect(clean).toContain('WORD: create');
      expect(clean).toContain('WORD: clean');

      // Count total methods (should be many)
      const wordMatches = clean.match(/WORD: \w+/g);
      expect(wordMatches).toBeTruthy();
      expect(wordMatches!.length).toBeGreaterThan(50); // Many methods available
    });

    it('should filter methods by prefix', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for method prefix filtering
      const output = runCompletion(1, 'web4tscomponent', 'up');
      const clean = stripAnsi(output);

      // Should show methods starting with "up"
      expect(clean).toContain('WORD: upgrade');
      expect(clean).toContain('WORD: updateBuildSystem');

      // Should NOT show unrelated methods
      expect(clean).not.toContain('WORD: test');
      expect(clean).not.toContain('WORD: build');
      expect(clean).not.toContain('WORD: create');
    });

    it('should exclude test/data files from file completion (vitest exclude)', () => {
      // @pdca 2025-11-05-UTC-1900 - Regression test for vitest exclude pattern filtering
      const output = runCompletion(3, 'web4tscomponent', 'test', 'file', '');
      const clean = stripAnsi(output);

      // Count file tokens - should be 33 (not 43)
      const wordMatches = clean.match(/WORD: \d+$/gm);
      expect(wordMatches).toBeTruthy();
      expect(wordMatches!.length).toBe(33); // Excludes test/data/**, test/logs/**

      // Verify no display of test/data paths (they shouldn't be in DISPLAY either)
      expect(clean).not.toContain('test/data/components');
      expect(clean).not.toContain('ArchTestIsolate1');
    });
  });
});

