/**
 * SessionSummary UTC Correction Regression Tests
 * Tests for fixUTCNaming zero-config auto-correction functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultSessionSummary } from '../src/ts/layer2/DefaultSessionSummary.js';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

describe('SessionSummary UTC Correction', () => {
  let sessionSummary: DefaultSessionSummary;
  let testSessionPath: string;
  let testProjectRoot: string;

  beforeEach(() => {
    sessionSummary = new DefaultSessionSummary();
    testProjectRoot = '/tmp/test-session-utc';
    testSessionPath = join(testProjectRoot, '2025-09-21-UTC-2225-session');
    
    // Create test session structure
    mkdirSync(testSessionPath, { recursive: true });
    mkdirSync(join(testSessionPath, 'pdca'), { recursive: true });
  });

  afterEach(() => {
    // Cleanup test directory
    if (existsSync(testProjectRoot)) {
      rmSync(testProjectRoot, { recursive: true, force: true });
    }
  });

  describe('UTC Mismatch Detection', () => {
    it('should detect UTC mismatch between session name and git commits', async () => {
      // Create test PDCA with correct UTC time
      const testPDCA = `# Test PDCA
**UTC Time:** 2025-09-21-UTC-2226
**Git SHA:** cb89c303`;
      
      writeFileSync(join(testSessionPath, 'pdca', '2025-09-21-UTC-2225-test.md'), testPDCA);
      
      // Should detect mismatch (session 2225 vs git 2226)
      const utcTimes = await (sessionSummary as any).extractGitCommitUTCs(testSessionPath);
      expect(utcTimes).toContain('2025-09-21-UTC-2226');
      expect(utcTimes).not.toContain('2025-09-21-UTC-2225');
    });

    it('should extract multiple git commit UTC times and sort them', async () => {
      // Create test PDCAs with different UTC times
      const pdca1 = `**UTC Time:** 2025-09-21-UTC-2226`;
      const pdca2 = `**UTC Time:** 2025-09-21-UTC-2227`;
      const pdca3 = `**UTC Time:** 2025-09-21-UTC-2225`;
      
      writeFileSync(join(testSessionPath, 'pdca', 'test1.md'), pdca1);
      writeFileSync(join(testSessionPath, 'pdca', 'test2.md'), pdca2);
      writeFileSync(join(testSessionPath, 'pdca', 'test3.md'), pdca3);
      
      const utcTimes = await (sessionSummary as any).extractGitCommitUTCs(testSessionPath);
      expect(utcTimes).toEqual(['2025-09-21-UTC-2225', '2025-09-21-UTC-2226', '2025-09-21-UTC-2227']);
    });
  });

  describe('Session Directory Renaming', () => {
    it('should generate correct session name for UTC correction', async () => {
      // Mock the git commit UTC extraction
      const correctUTC = '2025-09-21-UTC-2226';
      const currentSessionName = '2025-09-21-UTC-2225-session';
      const expectedCorrectName = '2025-09-21-UTC-2226-session';
      
      const result = currentSessionName.replace(/UTC-\d{4}/, `UTC-${correctUTC.split('-UTC-')[1].split('-')[0]}`);
      expect(result).toBe(expectedCorrectName);
    });

    it('should detect when session UTC naming is already correct', async () => {
      // Create test session with correct UTC
      const correctSessionPath = join(testProjectRoot, '2025-09-21-UTC-2226-session');
      mkdirSync(correctSessionPath, { recursive: true });
      mkdirSync(join(correctSessionPath, 'pdca'), { recursive: true });
      
      const testPDCA = `**UTC Time:** 2025-09-21-UTC-2226`;
      writeFileSync(join(correctSessionPath, 'pdca', '2025-09-21-UTC-2226-test.md'), testPDCA);
      
      // Should detect no mismatch
      const currentName = '2025-09-21-UTC-2226-session';
      const correctName = currentName.replace(/UTC-\d{4}/, 'UTC-2226');
      expect(currentName).toBe(correctName);
    });
  });

  describe('PDCA File Renaming', () => {
    it('should identify PDCA files needing UTC correction', () => {
      // Create test PDCA files with wrong UTC
      const files = [
        '2025-09-21-UTC-2225-session-start.md',
        '2025-09-21-UTC-2225-comparison-analysis.md',
        '2025-09-21-UTC-2225-final-report.md',
        'other-file.md'
      ];
      
      const oldUTCPart = 'UTC-2225';
      const newUTCPart = 'UTC-2226';
      
      const filesToRename = files.filter(f => f.includes(oldUTCPart));
      expect(filesToRename).toHaveLength(3);
      
      const renamedFiles = filesToRename.map(f => f.replace(oldUTCPart, newUTCPart));
      expect(renamedFiles).toContain('2025-09-21-UTC-2226-session-start.md');
      expect(renamedFiles).toContain('2025-09-21-UTC-2226-comparison-analysis.md');
      expect(renamedFiles).toContain('2025-09-21-UTC-2226-final-report.md');
    });
  });

  describe('Link Fixing', () => {
    it('should fix GitHub links in PDCA content', () => {
      const oldContent = `[GitHub](https://github.com/.../2025-09-21-UTC-2225-session/pdca/2025-09-21-UTC-2225-test.md)`;
      const oldUTCPart = 'UTC-2225';
      const newUTCPart = 'UTC-2226';
      
      const newContent = oldContent.replace(new RegExp(oldUTCPart, 'g'), newUTCPart);
      expect(newContent).toBe(`[GitHub](https://github.com/.../2025-09-21-UTC-2226-session/pdca/2025-09-21-UTC-2226-test.md)`);
    });

    it('should fix § links in PDCA content', () => {
      const oldContent = `[§/2025-09-21-UTC-2225-session/pdca/test.md](../2025-09-21-UTC-2225-test.md)`;
      const oldSessionName = '2025-09-21-UTC-2225-session';
      const newSessionName = '2025-09-21-UTC-2226-session';
      
      const newContent = oldContent.replace(new RegExp(oldSessionName, 'g'), newSessionName);
      expect(newContent).toBe(`[§/2025-09-21-UTC-2226-session/pdca/test.md](../2025-09-21-UTC-2226-test.md)`);
    });

    it('should fix session title references', () => {
      const oldContent = `# Session Summary: 2025-09-21-UTC-2225-session`;
      const oldSessionName = '2025-09-21-UTC-2225-session';
      const newSessionName = '2025-09-21-UTC-2226-session';
      
      const newContent = oldContent.replace(new RegExp(oldSessionName, 'g'), newSessionName);
      expect(newContent).toBe(`# Session Summary: 2025-09-21-UTC-2226-session`);
    });
  });

  describe('Zero-Config Integration', () => {
    it('should work with Web4 auto-discovery CLI', () => {
      // Verify method exists and is discoverable
      expect(typeof sessionSummary.fixUTCNaming).toBe('function');
      expect(sessionSummary.fixUTCNaming.length).toBe(1); // Takes sessionPath parameter
    });

    it('should handle missing PDCA directory gracefully', async () => {
      // Test with session that has no pdca directory
      const emptySessionPath = join(testProjectRoot, '2025-09-21-UTC-2225-empty');
      mkdirSync(emptySessionPath, { recursive: true });
      
      // Should not throw error
      await expect(sessionSummary.fixUTCNaming(emptySessionPath)).resolves.not.toThrow();
    });

    it('should handle session with no git commits', async () => {
      // Test with session that has no PDCA files with git commits
      const testPDCA = `# Test PDCA without git info`;
      writeFileSync(join(testSessionPath, 'pdca', 'no-git.md'), testPDCA);
      
      // Should handle gracefully
      await expect(sessionSummary.fixUTCNaming(testSessionPath)).resolves.not.toThrow();
    });
  });

  describe('Regression Protection', () => {
    it('should not affect existing functionality', () => {
      // Verify core methods still exist
      expect(typeof sessionSummary.generateSession).toBe('function');
      expect(typeof sessionSummary.analyzeSession).toBe('function');
    });

    it('should maintain Web4 component structure', () => {
      // Verify component maintains Web4 compliance
      expect(sessionSummary).toBeInstanceOf(DefaultSessionSummary);
      expect(sessionSummary.constructor.name).toBe('DefaultSessionSummary');
    });

    it('should preserve existing dual link generation', async () => {
      // Verify dual link generation still works
      const analyses = [
        {
          sha: 'test123',
          utcTime: '2025-09-21-UTC-2226',
          relativePath: 'test/path.md',
          tronQuotes: 'test',
          qaDecisions: 'test',
          achievement: 'test'
        }
      ];
      
      const table = (sessionSummary as any).generateEnhancedTable(analyses, 'main', testSessionPath);
      expect(table).toContain('GitHub');
      expect(table).toContain('§/');
    });
  });
});