/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA trainAI Web4 Principles', () => {
  let pdca: DefaultPDCA;

  beforeAll(() => {
    pdca = new DefaultPDCA();
  });

  describe('TC70: DRY Principle Teaching', () => {
    it('should teach DRY for dependencies (symlinked node_modules)', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('DRY: Symlink node_modules');
      expect(output).toContain('never duplicate dependencies');
    });

    it('should teach DRY for configuration', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('DRY: Extend tsconfig.json from project root');
    });

    it('should teach DRY for code', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('DRY: Reuse existing methods');
      expect(output).toContain('never copy-paste logic');
    });

    it('should warn against CMM2 violations', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('NEVER create real node_modules directories in components');
    });
  });

  describe('TC71: Radical OOP Teaching', () => {
    it('should teach empty constructor pattern', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Radical OOP: Empty constructors');
      expect(output).toContain('no parameters');
    });

    it('should teach scenario-based initialization', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('init(scenario)');
      expect(output).toContain('All config via init(scenario) method');
    });

    it('should explain why radical OOP matters', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Zero-dependency instantiation');
      expect(output).toContain('testability');
    });

    it('should identify anti-patterns', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('NEVER use constructor parameters');
      expect(output).toContain('breaks radical OOP');
    });
  });

  describe('TC72: Method Chaining Teaching', () => {
    it('should teach return Promise<this> pattern', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Method Chaining: Always return Promise<this>');
    });

    it('should explain fluent API benefits', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('fluent API');
      expect(output).toContain('component.method1().method2()');
    });

    it('should explain CLI chaining benefits', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('CLI chaining');
      expect(output).toContain('pdca method1 param1 method2');
    });
  });

  describe('TC73: Auto-Discovery Teaching', () => {
    it('should teach auto-discovery principle', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Auto-Discovery: Add method');
      expect(output).toContain('CLI command appears');
    });

    it('should teach @cliSyntax annotation', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('@cliSyntax');
      expect(output).toContain('parameter order');
    });

    it('should teach @cliValues annotation', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('@cliValues');
      expect(output).toContain('tab completion');
    });

    it('should teach @cliHide annotation', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('@cliHide');
      expect(output).toContain('internal methods');
    });

    it('should warn against manual CLI editing', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('NEVER manually edit CLI files');
      expect(output).toContain('auto-generated');
    });
  });

  describe('TC74: Verification Checklist Completeness', () => {
    it('should have at least 20 verification checklist items', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      // Count checklist items (marked with [ ])
      const checklistMatches = output.match(/\[\s*\]\s*\d+\./g);
      const checklistCount = checklistMatches ? checklistMatches.length : 0;

      expect(checklistCount).toBeGreaterThanOrEqual(20);
    });

    it('should include DRY in verification checklist', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Understands DRY principle');
      expect(output).toContain('symlinks');
    });

    it('should include Radical OOP in verification checklist', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('radical OOP');
      expect(output).toContain('empty constructor');
    });

    it('should include Method Chaining in verification checklist', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('Promise<this>');
      expect(output).toContain('method chaining');
    });

    it('should include Auto-Discovery in verification checklist', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('@cliSyntax');
      expect(output).toContain('@cliValues');
      expect(output).toContain('@cliHide');
    });

    it('should include CMM2 violation recognition', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.trainAI('how-to-component');
      });

      expect(output).toContain('CMM2 violations');
      expect(output).toContain('real node_modules');
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

