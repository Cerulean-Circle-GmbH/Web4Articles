/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import { DefaultWeb4Programmer } from '../src/ts/layer2/DefaultWeb4Programmer.js';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import * as path from 'path';

describe('Web4Programmer Basic Tests', () => {
  it('should create instance successfully', () => {
    const component = new DefaultWeb4Programmer();
    expect(component).toBeDefined();
  });

  it('should have empty constructor (Web4 standard)', () => {
    const component = new DefaultWeb4Programmer();
    expect(component).toBeInstanceOf(DefaultWeb4Programmer);
  });
});

describe('Web4Programmer CLI Location Resilience', () => {
  it('should work when called from scripts/ directory', () => {
    // Find project root ONCE by walking up from test file location
    // This MUST match the logic in DefaultWeb4TSComponent.findProjectRootFrom()
    const findProjectRoot = (startDir: string): string => {
      let currentDir = path.resolve(startDir);
      
      // First priority: Look for package.json + components/ directory
      // This is MORE SPECIFIC and will correctly identify test/data or project root
      while (currentDir !== path.dirname(currentDir)) {
        if (existsSync(path.join(currentDir, 'package.json')) &&
            existsSync(path.join(currentDir, 'components'))) {
          return currentDir;
        }
        currentDir = path.dirname(currentDir);
      }
      
      // Fallback: Look for .git (for projects without components/ dir)
      currentDir = path.resolve(startDir);
      while (currentDir !== path.dirname(currentDir)) {
        if (existsSync(path.join(currentDir, '.git'))) {
          return currentDir;
        }
        currentDir = path.dirname(currentDir);
      }
      
      return path.resolve(startDir);
    };
    
    // Discover project root once, then use absolute paths everywhere
    const projectRoot = findProjectRoot(__dirname);
    const scriptsDir = path.join(projectRoot, 'scripts');
    const cliScriptPath = path.join(scriptsDir, 'web4programmer');
    
    // Verify CLI script symlink exists in scripts/
    expect(existsSync(cliScriptPath)).toBe(true);
    
    // Test: Run CLI from scripts/ directory
    // This verifies location-resilient symlink resolution works correctly
    try {
      const result = execSync('./web4programmer', {
        cwd: scriptsDir,
        encoding: 'utf-8',
        timeout: 10000
      });
      
      expect(result).toContain('Web4Programmer CLI Tool');
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

describe('Web4Programmer on() Method - Component Context Loading', () => {
  it('should load component context successfully', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    // Load Web4Programmer 0.2.0.3 as context
    await programmer.on('Web4Programmer', '0.2.0.3');
    
    // Verify context is stored (internal check via any)
    const context = (programmer as any).model;
    expect(context.name).toBe('Web4Programmer');
    expect(context.contextComponent).toBe('Web4Programmer');
    expect(context.contextVersion).toBe('0.2.0.3');
    expect(context.contextPath).toContain('Web4Programmer/0.2.0.3');
  });

  it('should resolve symlink to actual version', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    // Load using 'latest' symlink
    await programmer.on('Web4Programmer', 'latest');
    
    const context = (programmer as any).model;
    // Should resolve to actual version number, not 'latest'
    expect(context.contextVersion).toMatch(/\d+\.\d+\.\d+\.\d+/);
    expect(context.contextVersion).not.toBe('latest');
  });

  it('should error on non-existent component', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    await expect(async () => {
      await programmer.on('NonExistentComponent', '1.0.0.0');
    }).rejects.toThrow('Component directory not found');
  });
});

describe('Web4Programmer needsUpgradeCheck() Method', () => {
  it('should check upgrade status without errors', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    // Load context first
    await programmer.on('Web4Programmer', '0.2.0.3');
    
    // Should complete without throwing
    await expect(async () => {
      await programmer.needsUpgradeCheck();
    }).not.toThrow();
  });

  it('should require component context', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    // Should error without context
    await expect(async () => {
      await programmer.needsUpgradeCheck();
    }).rejects.toThrow('need a component context first');
  });
});

describe('Web4Programmer migrateFrom() Method', () => {
  it('should demonstrate migration pattern', async () => {
    const programmer = new DefaultWeb4Programmer();
    
    // Should complete successfully
    const result = await programmer.migrateFrom('0.1.0.0');
    
    // Should return this for chaining
    expect(result).toBe(programmer);
  });
});
