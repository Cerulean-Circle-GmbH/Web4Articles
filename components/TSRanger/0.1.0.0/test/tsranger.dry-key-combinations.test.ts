import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

function runScripted(keys: string): string {
  const projectRoot = process.cwd();
  const bin = path.join(projectRoot, 'components/TSRanger/v2.2/sh/tsranger');
  const env = { 
    ...process.env, 
    TSRANGER_TEST_MODE: '1', 
    TSRANGER_TEST_INPUT: keys, 
    TS_RANGER_TEST_FINAL_ONLY: '1',
    PS1: '\\u@\\h \\w$'
  };
  const res = spawnSync(bin, ['test', keys], { env, encoding: 'utf8' });
  return res.stdout || '';
}

function stripAnsi(s: string): string {
  return s.replace(/\x1B\[[0-9;]*m/g, '');
}

describe('TSRanger Legitimate Bug Detection - Unambiguous Tests Only', () => {
  // ✅ LEGITIMATE TEST #1: DRY Principle Violation - Retreat Keys Not Identical
  describe('[left] and [ShiftTab] identical retreat behavior', () => {
    it('[left] and [ShiftTab] produce identical output for retreat', () => {
      // First advance to have something to retreat from
      const baseKeys = '[down][down][tab]';
      const leftOut = runScripted(baseKeys + '[left]');
      const shiftTabOut = runScripted(baseKeys + '[shifttab]');
      
      const leftClean = stripAnsi(leftOut);
      const shiftTabClean = stripAnsi(shiftTabOut);
      
      // Both should produce identical output (DRY principle)
      expect(leftClean).toBe(shiftTabClean);
    });
  });

  // ✅ LEGITIMATE TEST #2: DRY Principle Violation - All Retreat Keys Should Be Identical  
  describe('DRY principle verification - shared methods produce identical outputs', () => {
    it('All retreat keys produce identical results', () => {
      const setupKeys = '[down][down][tab]'; // Create advancement to retreat from
      
      const leftOut = runScripted(setupKeys + '[left]');
      const shiftTabOut = runScripted(setupKeys + '[shifttab]');
      
      const leftClean = stripAnsi(leftOut);
      const shiftTabClean = stripAnsi(shiftTabOut);
      
      // DRY principle: shared methods must produce identical outputs
      expect(leftClean).toBe(shiftTabClean);
    });
  });

  // ✅ LEGITIMATE TEST #3: Filter Clearing Bug - g[right][down][left] Should Clear Filter
  describe('Regression prevention - complex sequences', () => {
    it('Filter clearing sequence: g[right][down][left] - should clear class filter', () => {
      // User requirement: "no filter should be set on class"
      const out = runScripted('g[right][down][left]');
      const cleanOutput = stripAnsi(out);
      const lines = cleanOutput.split(/\r?\n/);
      
      // Check column headers to verify filter state - get the LAST occurrence (final state)
      const classesLines = lines.filter(l => l.includes('[Classes]'));
      const classesHeader = classesLines[classesLines.length - 1] || '';
      
      // User requirement: "no filter should be set on class" - should show [Classes] without any filter
      expect(classesHeader).not.toMatch(/\[Classes\]\s+\([^)]+\)/); // Should NOT have filter parentheses like (GitScrumProject)
      
      // Verify sequence completed successfully (no crash/hang)
      expect(out.length).toBeGreaterThan(100);
      expect(cleanOutput).toMatch(/Classes|Methods|Params|Docs/); // UI structure intact
    });
  });
});
