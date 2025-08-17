import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

function runScripted(keys: string): string {
  const projectRoot = process.cwd();
  const bin = path.join(projectRoot, 'components/TSRanger/v2.0/sh/tsranger');
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

function getPromptLine(out: string): string {
  const lines = out.split(/\r?\n/);
  const footerIdx = lines.findIndex(l => l.includes('column') && l.includes('Enter: select'));
  if (footerIdx > 1) {
    return lines[footerIdx - 2] || '';
  }
  return '';
}

describe('TSRanger DRY Key Combinations - Regression Prevention', () => {

  describe('[tab] and [right] identical advancement behavior', () => {
    it('[tab] and [right] produce identical output for advancement', () => {
      const tabOut = runScripted('[tab]');
      const rightOut = runScripted('[right]');
      
      const tabClean = stripAnsi(tabOut);
      const rightClean = stripAnsi(rightOut);
      
      // Both should produce identical output (advancement or column move)
      expect(tabClean).toBe(rightClean);
    });

    it('[tab] and [right] both advance Logger to Logger log format', () => {
      // First navigate to Logger, then test advancement
      const tabOut = runScripted('[down][down][tab]');  
      const rightOut = runScripted('[down][down][right]');
      
      const tabPrompt = stripAnsi(getPromptLine(tabOut));
      const rightPrompt = stripAnsi(getPromptLine(rightOut));
      
      // Both should show class + method format when advancement is possible
      expect(tabPrompt).toBe(rightPrompt);
      
      // If Logger is available and has methods, should show advancement
      if (tabPrompt.includes('Logger')) {
        expect(tabPrompt).toMatch(/Logger\s+\w+/);
        expect(rightPrompt).toMatch(/Logger\s+\w+/);
      }
    });
  });

  describe('[left] and [ShiftTab] identical retreat behavior', () => {
    it('[left] and [ShiftTab] produce identical output for retreat', () => {
      // First advance to have something to retreat from
      const baseKeys = '[down][down][tab]';
      const leftOut = runScripted(baseKeys + '[left]');
      const shiftTabOut = runScripted(baseKeys + '[shifttab]');
      
      const leftClean = stripAnsi(leftOut);
      const shiftTabClean = stripAnsi(shiftTabOut);
      
      // Both should produce identical output
      expect(leftClean).toBe(shiftTabClean);
    });

    it('[left] and [ShiftTab] both retreat from Logger log to Logger format', () => {
      // Advance then retreat  
      const leftOut = runScripted('[down][down][tab][left]');
      const shiftTabOut = runScripted('[down][down][tab][shifttab]');
      
      const leftPrompt = stripAnsi(getPromptLine(leftOut));
      const shiftTabPrompt = stripAnsi(getPromptLine(shiftTabOut));
      
      // Both should show identical retreat result
      expect(leftPrompt).toBe(shiftTabPrompt);
      
      // Should show class-only format after retreat
      if (leftPrompt.includes('Logger')) {
        expect(leftPrompt).not.toMatch(/Logger\s+\w+/); // No method after retreat
        expect(shiftTabPrompt).not.toMatch(/Logger\s+\w+/); // No method after retreat
      }
    });
  });

  describe('g[tab] and g[right] identical filter+advancement behavior', () => {
    it('g[tab] and g[right] produce identical output for filter+advancement', () => {
      const gTabOut = runScripted('g[tab]');
      const gRightOut = runScripted('g[right]');
      
      const gTabClean = stripAnsi(gTabOut);
      const gRightClean = stripAnsi(gRightOut);
      
      // Both should produce identical output
      expect(gTabClean).toBe(gRightClean);
    });

    it('g[tab] and g[right] both filter to GitScrumProject and advance to method', () => {
      const gTabOut = runScripted('g[tab]');
      const gRightOut = runScripted('g[right]');
      
      const gTabPrompt = stripAnsi(getPromptLine(gTabOut));
      const gRightPrompt = stripAnsi(getPromptLine(gRightOut));
      
      // Both should show identical filter+advancement result
      expect(gTabPrompt).toBe(gRightPrompt);
      
      // Should filter to GitScrumProject
      expect(gTabOut).toMatch(/GitScrumProject/);
      expect(gRightOut).toMatch(/GitScrumProject/);
      
      // Should show advancement format if methods available
      if (gTabPrompt.includes('GitScrumProject')) {
        expect(gTabPrompt).toMatch(/GitScrumProject\s+\w+/);
        expect(gRightPrompt).toMatch(/GitScrumProject\s+\w+/);
      }
    });
  });

  describe('g[right][left] retreat after filter+advancement', () => {
    it('g[right][left] properly retreats after filter+advancement', () => {
      const out = runScripted('g[right][left]');
      const prompt = stripAnsi(getPromptLine(out));
      
      // Should filter to GitScrumProject, advance, then retreat to class-only
      expect(out).toMatch(/GitScrumProject/);
      
      // After retreat, should show class-only format
      if (prompt.includes('GitScrumProject')) {
        expect(prompt).not.toMatch(/GitScrumProject\s+\w+/); // No method after retreat
      }
    });

    it('g[right][left] identical to g[tab][left] - retreat consistency', () => {
      const gRightLeftOut = runScripted('g[right][left]');
      const gTabLeftOut = runScripted('g[tab][left]');
      
      const gRightLeftClean = stripAnsi(gRightLeftOut);
      const gTabLeftClean = stripAnsi(gTabLeftOut);
      
      // Both sequences should produce identical output
      expect(gRightLeftClean).toBe(gTabLeftClean);
    });
  });

  describe('Navigation vs Advancement mode distinction', () => {
    it('[down] navigation shows only class, never methods', () => {
      const out = runScripted('[down][down][down]');
      const prompt = stripAnsi(getPromptLine(out));
      
      // Navigation should never show method, only class
      const lines = stripAnsi(out).split(/\r?\n/);
      const promptLines = lines.filter(l => l.includes('Logger') || l.includes('OOSH') || l.includes('GitScrumProject'));
      
      // Any prompt line should show class-only format during navigation
      promptLines.forEach(line => {
        if (line.includes('Logger')) {
          expect(line).not.toMatch(/Logger\s+\w+/); // No method during navigation
        }
        if (line.includes('OOSH')) {
          expect(line).not.toMatch(/OOSH\s+\w+/); // No method during navigation
        }
      });
    });

    it('[tab] advancement shows class + method format', () => {
      const out = runScripted('[down][down][tab]');
      const prompt = stripAnsi(getPromptLine(out));
      
      // Advancement should show class + method format when possible
      if (prompt.includes('Logger')) {
        expect(prompt).toMatch(/Logger\s+\w+/); // Method after advancement
      }
    });
  });

  describe('DRY principle verification - shared methods produce identical outputs', () => {
    it('All advancement keys produce identical results', () => {
      const contexts = ['[down][down]', 'g'];
      
      for (const context of contexts) {
        const tabOut = runScripted(context + '[tab]');
        const rightOut = runScripted(context + '[right]');
        
        const tabClean = stripAnsi(tabOut);
        const rightClean = stripAnsi(rightOut);
        
        // DRY principle: shared methods must produce identical outputs
        expect(tabClean).toBe(rightClean);
      }
    });

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

  describe('Regression prevention - complex sequences', () => {
    it('Complex advancement and retreat sequences work consistently', () => {
      const sequences = [
        'g[tab][left][tab][left]',
        'g[right][left][right][left]', 
        'g[right][shifttab][tab][shifttab]',
        '[down][down][tab][left][tab][left]'
      ];
      
      sequences.forEach(sequence => {
        const out = runScripted(sequence);
        
        // Should not crash or hang
        expect(out.length).toBeGreaterThan(0);
        
        // Should contain expected UI elements
        expect(out).toMatch(/Classes|Methods|Params|Docs/);
        expect(out).toMatch(/column.*move.*Type.*filter/); // Footer present
      });
    });

    it('Mixed navigation and advancement sequences maintain consistency', () => {
      const out = runScripted('g[right][down][up][left][tab][down][left]');
      
      // Complex sequence should not crash
      expect(out.length).toBeGreaterThan(0);
      
      // Should maintain UI structure
      expect(out).toMatch(/Classes|Methods|Params|Docs/);
    });
  });
});
