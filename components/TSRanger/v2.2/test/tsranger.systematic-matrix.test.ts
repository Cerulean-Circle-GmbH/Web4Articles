/**
 * TSRanger v2.2 Systematic Test Matrix
 * Based on "3 Degrees of Freedom" Framework (Cluedo Method)
 * 
 * COLUMNS (WHO): Which column/element is active
 * PROMPT (WHERE): What information is displayed  
 * FILTER (HOW): What filter state is active
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';

// Clean ANSI escape codes for parsing
function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

// Extract prompt line for validation
function getPromptLine(output: string): string {
  const lines = output.split(/\r?\n/);
  const firstLine = stripAnsi(lines[0] || '');
  const match = firstLine.match(/\]\s+\S+@\S+\s+(.*)$/);
  return match ? match[1].trim() : '';
}

// Systematic test runner - no NODE_ENV interference
function runSystematicTest(keys: string): string {
  const projectRoot = process.cwd();
  const bin = path.join(projectRoot, 'components/TSRanger/v2.2/sh/tsranger');
  const env = {
    ...process.env,
    TSRANGER_TEST_MODE: '1',
    TSRANGER_TEST_INPUT: keys,
    TS_RANGER_TEST_FINAL_ONLY: '1',
    PS1: '\\u@\\h \\w$'
  };
  // Critical: Remove NODE_ENV to avoid interference
  delete env.NODE_ENV;
  
  const result = spawnSync(bin, ['test', keys], { env, encoding: 'utf8' });
  return result.stdout || '';
}

describe('🎯 TSRanger Systematic Matrix - 3 Degrees of Freedom', () => {

  describe('📊 DEGREE 1: FILTER (HOW) - Core Filter Operations', () => {
    
    it('Matrix[Filter=g, Columns=Classes, Prompt=ClassOnly]: g filter should show GitScrumProject', () => {
      const output = runSystematicTest('g');
      const promptLine = getPromptLine(output);
      
      // FILTER working: should show filtered class
      expect(promptLine).toBe('GitScrumProject');
      // COLUMNS correct: should be in Classes column (no methods)
      expect(promptLine).not.toMatch(/\s+\w/);
    });

    it('Matrix[Filter=te, Columns=Classes, Prompt=ClassOnly]: te filter should show TestClass', () => {
      const output = runSystematicTest('te');
      const promptLine = getPromptLine(output);
      
      // FILTER working: should show filtered class starting with 'te'
      expect(promptLine).toBe('TestClass');
      // COLUMNS correct: should be in Classes column (no methods)
      expect(promptLine).not.toMatch(/\s+\w/);
    });
  });

  describe('📊 DEGREE 2: COLUMNS (WHO) - Navigation & Advancement', () => {
    
    it('Matrix[Filter=te, Columns=Classes→Methods, Prompt=ClassMethod]: CRITICAL te[tab] advancement', () => {
      const output = runSystematicTest('te[tab]');
      const promptLine = getPromptLine(output);
      
      // CRITICAL: This WAS working - must show TestClass + method
      expect(promptLine).toMatch(/^TestClass\s+\w+$/);
      // COLUMNS advanced: should be in Methods column  
      expect(promptLine).toContain('TestClass ');
    });

    it('Matrix[Filter=g, Columns=Classes→Methods, Prompt=ClassMethod]: g[tab] advancement', () => {
      const output = runSystematicTest('g[tab]');
      const promptLine = getPromptLine(output);
      
      // Should show GitScrumProject + method
      expect(promptLine).toMatch(/^GitScrumProject\s+\w+$/);
      // COLUMNS advanced: should be in Methods column
      expect(promptLine).toContain('GitScrumProject ');
    });
  });

  describe('📊 DEGREE 3: PROMPT (WHERE) - Complex Interactions', () => {
    
    it('Matrix[Filter=te, Columns=Classes→Methods→Methods, Prompt=ClassMethod]: REGRESSION te[tab][down][down]', () => {
      const output = runSystematicTest('te[tab][down][down]');
      const promptLine = getPromptLine(output);
      
      // CRITICAL REGRESSION: This WAS working and must be fixed
      // Should show TestClass + some method (after navigating down 2 methods)
      expect(promptLine).toMatch(/^TestClass\s+\w+$/);
      expect(promptLine).toContain('TestClass ');
      // Should NOT be just "Logger" or broken
      expect(promptLine).not.toBe('Logger');
      expect(promptLine).not.toBe('TestClass');
    });

    it('Matrix[Filter=none, Columns=Classes→Methods→Methods, Prompt=ClassMethod]: [down]×N[tab][down][down] equivalence', () => {
      // This should be equivalent to te[tab][down][down] when navigation reaches TestClass
      const output = runSystematicTest('[down][down][down][down][down][down][down][down][down][down][down][tab][down][down]');
      const promptLine = getPromptLine(output);
      
      // Should show some class + method (depending on what class is at that position)
      expect(promptLine).toMatch(/^\w+\s+\w+$/);
      // Should NOT be broken
      expect(promptLine).not.toBe('Logger');
    });
  });

  describe('📊 MATRIX VALIDATION: Key Combinations', () => {
    
    it('SYSTEMATIC: Tab and Right should behave identically', () => {
      const tabOutput = runSystematicTest('te[tab]');
      const rightOutput = runSystematicTest('te[right]');
      
      const tabPrompt = getPromptLine(tabOutput);
      const rightPrompt = getPromptLine(rightOutput);
      
      // DRY Principle: identical behavior
      expect(tabPrompt).toBe(rightPrompt);
    });

    it('SYSTEMATIC: Filter typing should work for all characters', () => {
      const gOutput = runSystematicTest('g');
      const tOutput = runSystematicTest('t');
      const fOutput = runSystematicTest('f');
      
      // All should filter to appropriate classes (not all show "Logger")
      expect(getPromptLine(gOutput)).not.toBe('Logger');
      expect(getPromptLine(tOutput)).not.toBe('Logger'); 
      expect(getPromptLine(fOutput)).not.toBe('Logger');
    });
  });
});
