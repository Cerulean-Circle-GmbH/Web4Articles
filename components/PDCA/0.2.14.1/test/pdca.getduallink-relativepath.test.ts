/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import * as path from 'path';

describe('PDCA getDualLinkRelativePath', () => {
  let pdca: DefaultPDCA;
  let projectRoot: string;

  beforeAll(async () => {
    pdca = new DefaultPDCA();
    // Find project root (where components/ and scripts/ exist)
    let currentDir = __dirname;
    while (!require('fs').existsSync(path.join(currentDir, 'components')) ||
           !require('fs').existsSync(path.join(currentDir, 'scripts'))) {
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        throw new Error('Could not find project root');
      }
      currentDir = parentDir;
    }
    projectRoot = currentDir;
  });

  describe('TC50: Same directory', () => {
    it('should calculate relative path within same directory', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath('docs/file.md', 'docs/other.md');
      });
      
      expect(output).toContain('Relative Path: other.md');
    });
  });

  describe('TC51: Parent directory', () => {
    it('should calculate path to parent directory', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath('docs/sub/file.md', 'docs/other.md');
      });
      
      expect(output).toContain('Relative Path: ../other.md');
    });
  });

  describe('TC52: Deep subdirectory to root', () => {
    it('should calculate path from deep subdirectory to root', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath(
          'scrum.pmo/project/session/file.md',
          'articles/target.md'
        );
      });
      
      expect(output).toContain('Relative Path: ../../../articles/target.md');
    });
  });

  describe('TC53: Sibling directories', () => {
    it('should calculate path between sibling directories', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath('docs/fileA.md', 'src/fileB.md');
      });
      
      expect(output).toContain('Relative Path: ../src/fileB.md');
    });
  });

  describe('TC54: Project-root-relative paths', () => {
    it('should handle project-root-relative paths', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath('docs/file.md', 'src/other.md');
      });
      
      expect(output).toContain('Relative Path: ../src/other.md');
    });
  });

  describe('TC55: Absolute paths', () => {
    it('should normalize absolute paths', async () => {
      const fromAbs = path.join(projectRoot, 'docs/file.md');
      const toAbs = path.join(projectRoot, 'src/other.md');
      
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath(fromAbs, toAbs);
      });
      
      expect(output).toContain('Relative Path: ../src/other.md');
    });
  });

  describe('TC56: CLI output format', () => {
    it('should display clean, formatted output', async () => {
      const output = await captureConsoleOutput(async () => {
        await pdca.getDualLinkRelativePath('docs/file.md', 'src/other.md');
      });
      
      expect(output).toContain('🧭 Relative Path Calculation');
      expect(output).toContain('📁 From:');
      expect(output).toContain('📁 To:');
      expect(output).toContain('✨ Relative Path:');
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

