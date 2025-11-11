/**
 * Black-box integration tests for bash completion
 * 
 * @pdca 2025-11-05-UTC-2100.pdca.md - Rewritten to test actual completion behavior
 * @cmm CMM3 - Objective, reproducible verification
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

describe('Bash Completion - Black Box Integration', () => {
  const projectRoot = join(__dirname, '../../../..');

  const runCompletion = (cword: number, ...words: string[]): string => {
    const cmd = `cd ${projectRoot} && source source.env && web4tscomponent shCompletion ${cword} ${words.join(' ')} 2>&1`;
    return execSync(cmd, { encoding: 'utf-8', shell: '/bin/bash' });
  };

  const stripAnsi = (text: string): string => {
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  };

  describe('Method Completion', () => {
    it('should complete "on" method with documentation', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);

      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('on');
      expect(clean).toContain('Documentation:');
      expect(clean).toContain('Load component context for delegation');
    });

    it('should complete methods starting with "set"', () => {
      const output = runCompletion(1, 'web4tscomponent', 'set');
      const clean = stripAnsi(output);

      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('setTargetDirectory');
    });
  });

  describe('Test Completion (CMM3 - Regression Prevention)', () => {
    it('should complete test file numbers', () => {
      const output = runCompletion(3, 'web4tscomponent', 'test', 'file', '');
      const clean = stripAnsi(output);

      // Should show completion diagnostics
      expect(clean).toContain('DISPLAY: 📊 Completing: PARAMETER of test');
      expect(clean).toContain('DISPLAY: Parameter: <references>');
      expect(clean).toContain('DISPLAY: Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');
      
      // Completion shows numbered files
      expect(clean).toMatch(/DISPLAY: \d+:/); // DISPLAY format
      expect(clean).toMatch(/WORD: \d+/); // WORD format for bash
    });

    it('should complete test itCase with tokens (not filenames)', () => {
      const output = runCompletion(3, 'web4tscomponent', 'test', 'itCase', '18');
      const clean = stripAnsi(output);

      // Should show completion diagnostics
      expect(clean).toContain('DISPLAY: 📊 Completing: PARAMETER of test');
      expect(clean).toContain('DISPLAY: Parameter: <references>');
      expect(clean).toContain('DISPLAY: Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');
      // WORD lines should have tokens (18b1), not filenames
      expect(clean).toMatch(/WORD: \d+[a-z]\d+/); // Format: WORD: 18b1
      // WORD lines must not have .test.ts
      const wordLines = clean.split('\n').filter(l => l.startsWith('WORD:'));
      wordLines.forEach(line => {
        expect(line).not.toContain('.test.ts');
      });
    });

    it('should complete test describe with tokens (not filenames)', () => {
      const output = runCompletion(3, 'web4tscomponent', 'test', 'describe', '18');
      const clean = stripAnsi(output);

      // Should show completion diagnostics
      expect(clean).toContain('DISPLAY: 📊 Completing: PARAMETER of test');
      expect(clean).toContain('DISPLAY: Parameter: <references>');
      expect(clean).toContain('DISPLAY: Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');
      // WORD lines should have tokens (18a), not filenames
      expect(clean).toMatch(/WORD: \d+[a-z]/); // Format: WORD: 18a
      // WORD lines must not have .test.ts
      const wordLines = clean.split('\n').filter(l => l.startsWith('WORD:'));
      wordLines.forEach(line => {
        expect(line).not.toContain('.test.ts');
      });
    });

    it('should show completion diagnostics for test file', () => {
      const output = runCompletion(3, 'web4tscomponent', 'test', 'file', '');
      const clean = stripAnsi(output);

      // Should show completion diagnostics
      expect(clean).toContain('DISPLAY: 📊 Completing: PARAMETER of test');
      expect(clean).toContain('DISPLAY: Parameter: <references>');
      expect(clean).toContain('DISPLAY: Callback: DefaultWeb4TSComponent.referencesParameterCompletion()');
      // Should have WORD lines for bash
      expect(clean).toMatch(/WORD: \d+/);
    });
  });

  describe('Component Method Completion', () => {
    it('should complete upgrade method', () => {
      const output = runCompletion(1, 'web4tscomponent', 'up');
      const clean = stripAnsi(output);

      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('upgrade');
    });

    it('should complete build method', () => {
      const output = runCompletion(1, 'web4tscomponent', 'bu');
      const clean = stripAnsi(output);

      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('build');
    });
    
    it('should complete test method', () => {
      const output = runCompletion(1, 'web4tscomponent', 'te');
      const clean = stripAnsi(output);

      expect(clean).toContain('Completing: METHOD');
      expect(clean).toContain('test');
    });

    it('should output WORD line for single-match method (bash auto-complete)', () => {
      const output = runCompletion(1, 'web4tscomponent', 'upgr');
      const clean = stripAnsi(output);

      // Regression: Single match with documentation must output WORD line for bash
      expect(clean).toContain('WORD: upgrade');
      // Should NOT extract words from documentation
      expect(clean).not.toContain('WORD: WITHOUT');
      expect(clean).not.toContain('WORD: WITH');
      expect(clean).not.toContain('WORD: Performs');
    });
  });

  describe('CMM3 Compliance', () => {
    it('should be objective - output is observable shell behavior', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      
      // We can observe the output
      expect(typeof output).toBe('string');
      expect(output.length).toBeGreaterThan(0);
    });

    it('should be reproducible - same input produces same output', () => {
      const output1 = runCompletion(1, 'web4tscomponent', 'on');
      const output2 = runCompletion(1, 'web4tscomponent', 'on');
      
      // Strip timestamps and dynamic content for comparison
      const clean1 = stripAnsi(output1).replace(/\d{4}-\d{2}-\d{2}/g, 'DATE');
      const clean2 = stripAnsi(output2).replace(/\d{4}-\d{2}-\d{2}/g, 'DATE');
      
      expect(clean1).toBe(clean2);
    });

    it('should be verifiable - pass/fail criteria are clear', () => {
      const output = runCompletion(1, 'web4tscomponent', 'on');
      const clean = stripAnsi(output);
      
      // Clear criteria: output must contain method name
      expect(clean).toContain('on');
      
      // Clear criteria: output must contain documentation
      expect(clean).toContain('Documentation:');
    });
  });
});
