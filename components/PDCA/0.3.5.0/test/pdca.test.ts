/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';

// Web4-compliant pattern: Use import.meta.url instead of __dirname
const currentFileUrl = new URL(import.meta.url);
const testDir = path.dirname(currentFileUrl.pathname);

describe('PDCA Basic Tests', () => {
  it('should create instance successfully', () => {
    const component = new DefaultPDCA();
    expect(component).toBeDefined();
  });

  it('should have empty constructor (Web4 standard)', () => {
    const component = new DefaultPDCA();
    expect(component).toBeInstanceOf(DefaultPDCA);
  });
});

describe('PDCA CLI Location Resilience', () => {
  it('should work when called from scripts/ directory', () => {
    // Find project root ONCE by walking up from test file location
    // This MUST match the logic in DefaultWeb4TSComponent.findProjectRootFrom()
    const findProjectRoot = (startDir: string): string => {
      let currentDir = path.resolve(startDir);
      
      // Look for Web4Articles project root by finding scripts/ directory
      // This is more reliable than looking for package.json + components/
      // because components themselves have package.json and may have test/data/components/
      while (currentDir !== path.dirname(currentDir)) {
        const hasScripts = existsSync(path.join(currentDir, 'scripts'));
        const hasComponents = existsSync(path.join(currentDir, 'components'));
        if (hasScripts && hasComponents) {
          return currentDir;
        }
        currentDir = path.dirname(currentDir);
      }
      
      throw new Error('Could not find Web4Articles project root');
    };
    
    // Discover project root once, then use absolute paths everywhere
    const projectRoot = findProjectRoot(testDir);
    const scriptsDir = path.join(projectRoot, 'scripts');
    const cliScriptPath = path.join(scriptsDir, 'pdca');
    
    // Verify CLI script symlink exists in scripts/
    expect(existsSync(cliScriptPath)).toBe(true);
    
    // Test: Run CLI from scripts/ directory
    // This verifies location-resilient symlink resolution works correctly
    try {
      const result = execSync('./pdca', {
        cwd: scriptsDir,
        encoding: 'utf-8',
        timeout: 10000
      });
      
      expect(result).toContain('PDCA CLI Tool');
      console.log('   ✅ CLI works from scripts/ directory (location-resilient)');
    } catch (error: any) {
      console.error('   ❌ CLI FAILED from scripts/ directory');
      console.error('   Error:', error.message);
      console.error('\n🔴 BUG: CLI script is NOT location-resilient!');
      console.error('   The CLI script needs proper symlink resolution logic.');
      throw new Error(`CLI script failed from scripts/ directory: ${error.message}`);
    }
  });
});
