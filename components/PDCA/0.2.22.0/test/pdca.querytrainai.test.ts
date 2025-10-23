import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA queryTrainAI', () => {
  let pdca: DefaultPDCA;

  beforeAll(() => {
    pdca = new DefaultPDCA();
  });

  describe('TC60: Exact keyword match', () => {
    it('should find getDualLinkRelativePath in how-to-dual-links', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('getDualLinkRelativePath', '');
      });
      
      expect(output).toContain('Found in: how-to-dual-links');
      expect(output).toContain('getDualLinkRelativePath');
    });
  });

  describe('TC61: Concept match', () => {
    it('should find lessons about calculating relative paths', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('calculate relative paths', '');
      });
      
      expect(output).toContain('how-to-dual-links');
      expect(output).toContain('getDualLinkRelativePath');
    });
  });

  describe('TC62: Cross-topic search', () => {
    it('should find "test first" in multiple topics', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('test first', '');
      });
      
      expect(output).toContain('how-to-test-first');
      expect(output).toContain('how-to-feature-development');
    });
  });

  describe('TC63: No matches', () => {
    it('should handle queries with no results', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('quantum physics', '');
      });
      
      expect(output).toContain('No results found');
      expect(output).toContain('Available topics:');
    });
  });

  describe('TC64: Scoped search', () => {
    it('should search only specified topic', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('links', 'how-to-dual-links');
      });
      
      expect(output).toContain('Found in: how-to-dual-links');
      expect(output).not.toContain('how-to-ensure-links');
    });
  });

  describe('TC65: Case insensitive', () => {
    it('should match regardless of case', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('DUAL LINK', '');
      });
      
      expect(output).toContain('how-to-dual-links');
    });
  });

  describe('TC66: Partial word match', () => {
    it('should match partial words', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('verif', '');
      });
      
      expect(output).toMatch(/verification|verify/i);
    });
  });

  describe('TC67: Output format', () => {
    it('should display formatted results', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('test', '');
      });
      
      expect(output).toContain('🔍 trainAI Query Results');
      expect(output).toContain('Query:');
      expect(output).toContain('Found in:');
      expect(output).toContain('💡 Related topics:');
    });
  });

  describe('TC68: DRY - Reuses trainAI infrastructure', () => {
    it('should return same topics as trainAI has', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.queryTrainAI('test', '');
      });
      
      // Should find in same topics that trainAI has
      expect(output).toMatch(/how-to-(test-first|test-workflow|feature-development)/);
    });
  });

  describe('TC69: Method chaining', () => {
    it('should return this for chaining', async () => {
      const result = await pdca.queryTrainAI('test', '');
      expect(result).toBe(pdca);
    });
  });

  // Helper to capture console output
  async function captureConsoleOutput(fn: () => Promise<any>): Promise<string> {
    const originalLog = console.log;
    let output = '';

    console.log = (...args: any[]) => {
      output += args.join(' ') + '\n';
    };

    try {
      await fn();
      return output;
    } finally {
      console.log = originalLog;
    }
  }
});

