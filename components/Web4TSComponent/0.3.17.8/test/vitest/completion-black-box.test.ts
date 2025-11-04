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
  const testScript = join(__dirname, '../sh/test-completion.sh');

  // Helper functions available to all tests
  const runCompletion = (cword: number, ...words: string[]): string => {
    const cmd = `cd ${projectRoot} && source source.env && web4tscomponent shCompletion ${cword} ${words.join(' ')} 2>&1`;
    return execSync(cmd, { encoding: 'utf-8', shell: '/bin/bash' });
  };

  const stripAnsi = (text: string): string => {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  };

  it('should run all completion tests successfully', () => {
    // Execute the shell test script
    const result = execSync(`bash ${testScript}`, {
      cwd: projectRoot,
      encoding: 'utf-8',
      env: {
        ...process.env,
        PATH: process.env.PATH,
      },
    });

    // Verify all tests passed
    expect(result).toContain('Test Results: 7 passed, 0 failed');
    expect(result).toContain('✅ All tests passed!');
    expect(result).not.toContain('❌ FAIL');
  });

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
  });
});

