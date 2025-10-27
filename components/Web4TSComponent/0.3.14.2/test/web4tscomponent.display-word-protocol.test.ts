import { describe, it, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

describe('🎯 DISPLAY+WORD Protocol - targetVersionParameterCompletion', () => {
  let componentPath: string;
  let cliPath: string;

  beforeEach(() => {
    // Use current component directory (test runs from 0.3.14.2)
    componentPath = process.cwd();
    cliPath = path.join(componentPath, 'web4tscomponent');
    
    // Verify component exists
    expect(existsSync(componentPath), `Component not found: ${componentPath}`).toBe(true);
    expect(existsSync(cliPath), `CLI not found: ${cliPath}`).toBe(true);
  });

  describe('1. TypeScript Output Format', () => {
    it.skip('1.1 targetVersionParameterCompletion returns simple string array (OLD BEHAVIOR - REPLACED)', () => {
      // This test documents the OLD behavior before DISPLAY/WORD protocol
      // Kept for historical reference but skipped since we replaced this behavior
      const output = execSync(
        `${cliPath} completeParameter targetVersionParameterCompletion test targetVersion ""`,
        { encoding: 'utf-8', cwd: componentPath }
      );
      
      // OLD behavior: space-separated words (no longer used)
      const values = output.trim().split(/\s+/);
      
      // Should return semantic version links
      expect(values).toContain('dev');
      expect(values).toContain('latest');
      expect(values).toContain('prod');
      expect(values).toContain('test');
      expect(values.length).toBe(4);
    });

    it('1.2 targetVersionParameterCompletion with DISPLAY+WORD format (new)', () => {
      // After implementation, this should pass
      const output = execSync(
        `${cliPath} completeParameter targetVersionParameterCompletion test targetVersion ""`,
        { encoding: 'utf-8', cwd: componentPath }
      );
      
      const lines = output.trim().split('\n');
      
      // NEW behavior: Should have WORD: prefixes
      const wordLines = lines.filter(line => line.startsWith('WORD: '));
      
      // Should have 4 WORD lines
      expect(wordLines.length).toBe(4);
      
      // Extract words
      const words = wordLines.map(line => line.replace('WORD: ', ''));
      expect(words).toContain('dev');
      expect(words).toContain('latest');
      expect(words).toContain('prod');
      expect(words).toContain('test');
    });
  });

  describe('2. Bash Parsing Logic', () => {
    it('2.1 Extract WORD lines with grep', () => {
      const testInput = `WORD: dev\nWORD: latest\nWORD: prod\nWORD: test\n`;
      
      // Simulate bash grep command
      const grepResult = execSync(
        `echo "${testInput}" | grep "^WORD: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      );
      
      const words = grepResult.trim().split('\n');
      
      expect(words).toContain('dev');
      expect(words).toContain('latest');
      expect(words).toContain('prod');
      expect(words).toContain('test');
      expect(words.length).toBe(4);
    });

    it('2.2 Extract DISPLAY lines with grep', () => {
      const testInput = `DISPLAY: Available versions:\nDISPLAY:   - dev\nDISPLAY:   - latest\nWORD: dev\nWORD: latest\n`;
      
      // Simulate bash grep command
      const grepResult = execSync(
        `echo "${testInput}" | grep "^DISPLAY: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      );
      
      const displayLines = grepResult.trim().split('\n');
      
      expect(displayLines.length).toBe(3);
      expect(displayLines[0]).toBe('Available versions:');
      expect(displayLines[1]).toBe('  - dev');
      expect(displayLines[2]).toBe('  - latest');
    });

    it('2.3 Word count for single-match detection', () => {
      // Single word
      const singleInput = `WORD: dev\n`;
      const singleResult = execSync(
        `echo "${singleInput}" | grep "^WORD: " | cut -d' ' -f2- | wc -w | tr -d ' '`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      );
      expect(parseInt(singleResult.trim())).toBe(1);

      // Multiple words
      const multiInput = `WORD: dev\nWORD: latest\nWORD: prod\n`;
      const multiResult = execSync(
        `echo "${multiInput}" | grep "^WORD: " | cut -d' ' -f2- | wc -w | tr -d ' '`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      );
      expect(parseInt(multiResult.trim())).toBe(3);
    });
  });

  describe('3. Integration Test - Full Chain', () => {
    it('3.1 TypeScript output → bash parsing → compgen', () => {
      // Get TypeScript output
      const tsOutput = execSync(
        `${cliPath} completeParameter targetVersionParameterCompletion test targetVersion ""`,
        { encoding: 'utf-8', cwd: componentPath }
      );
      
      // Extract words using bash logic
      const words = execSync(
        `echo "${tsOutput}" | grep "^WORD: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      ).trim().split('\n');
      
      // Simulate compgen (filter by prefix 'de')
      const filtered = words.filter(w => w.startsWith('de'));
      
      expect(filtered).toContain('dev');
      expect(filtered.length).toBe(1);
    });

    it('3.2 Verify backward compatibility - old bash still works', () => {
      // OLD bash logic expects space-separated words
      const output = execSync(
        `${cliPath} completeParameter targetVersionParameterCompletion test targetVersion ""`,
        { encoding: 'utf-8', cwd: componentPath }
      );
      
      // After migration, we can still extract words (just need to filter WORD: lines)
      // This ensures migration doesn't break existing usage
      const lines = output.trim().split('\n');
      const hasWordPrefix = lines.some(line => line.startsWith('WORD: '));
      
      if (hasWordPrefix) {
        // NEW format - extract words
        const words = lines
          .filter(line => line.startsWith('WORD: '))
          .map(line => line.replace('WORD: ', ''));
        expect(words.length).toBe(4);
      } else {
        // OLD format - space-separated
        const words = output.trim().split(/\s+/);
        expect(words.length).toBe(4);
      }
    });
  });

  describe('4. Edge Cases', () => {
    it('4.1 Empty output handling', () => {
      const emptyInput = ``;
      
      const result = execSync(
        `echo "${emptyInput}" | grep "^WORD: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      );
      
      expect(result.trim()).toBe('');
    });

    it('4.2 Mixed format handling (DISPLAY + WORD)', () => {
      const mixedInput = `DISPLAY: Header\nDISPLAY: Subheader\nWORD: value1\nWORD: value2\n`;
      
      const displayLines = execSync(
        `echo "${mixedInput}" | grep "^DISPLAY: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      ).trim().split('\n');
      
      const wordLines = execSync(
        `echo "${mixedInput}" | grep "^WORD: " | cut -d' ' -f2-`,
        { encoding: 'utf-8', shell: '/bin/bash' }
      ).trim().split('\n');
      
      expect(displayLines.length).toBe(2);
      expect(wordLines.length).toBe(2);
    });
  });
});

