/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA';
import * as fs from 'fs';
import * as path from 'path';

// Web4-compliant pattern: Use import.meta.url instead of __dirname
const currentFileUrl = new URL(import.meta.url);
const testDir = path.dirname(currentFileUrl.pathname);

/**
 * Test Suite: moveFile() Backward Compatibility
 * 
 * Purpose: Verify moveFile() properly delegates to mv()
 * 
 * Background:
 * - moveFile() is deprecated (replaced by mv())
 * - Maintained as wrapper for backward compatibility
 * - All functionality tested in pdca.mv.test.ts (10 comprehensive tests)
 * - These tests verify delegation works correctly
 * 
 * TC39 Documentation:
 * - Bug: moveFile had relative link calculation issue
 * - Fixed: 2025-11-03 via mv() implementation
 * - Source: 2025-10-31-UTC-1113.pdca.md
 * 
 * Implementation:
 * - moveFile() = 3 lines that call this.mv()
 * - DRY pattern: Single source of truth in mv()
 */

describe('PDCA moveFile - Backward Compatibility Wrapper', () => {
  const tempTestDir = path.join(testDir, 'temp-movefile-tests');
  
  beforeAll(() => {
    // Create temp test directory
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    // Cleanup temp directory
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  test('TC39: moveFile is deprecated but functional (backward compatibility)', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create test file
    const tc39Dir = path.join(tempTestDir, 'tc39');
    fs.mkdirSync(tc39Dir, { recursive: true });
    const oldPath = path.join(tc39Dir, 'old-file.md');
    const newPath = path.join(tc39Dir, 'new-file.md');
    fs.writeFileSync(oldPath, '# Test File\n\nContent here.');
    
    // Execute: moveFile should delegate to mv()
    await pdca.moveFile(oldPath, newPath);
    
    // Verify: File moved (mv() functionality works)
    expect(fs.existsSync(oldPath)).toBe(false);
    expect(fs.existsSync(newPath)).toBe(true);
    
    // Cleanup
    fs.rmSync(tc39Dir, { recursive: true, force: true });
  });

  test('TC30: moveFile delegates to mv() - basic move', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create test file
    const tc30Dir = path.join(tempTestDir, 'tc30');
    fs.mkdirSync(tc30Dir, { recursive: true });
    const oldPath = path.join(tc30Dir, 'file-a.md');
    const newPath = path.join(tc30Dir, 'file-b.md');
    fs.writeFileSync(oldPath, '# Test\n\nContent.');
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(fs.existsSync(oldPath)).toBe(false);
    expect(fs.existsSync(newPath)).toBe(true);
    
    // Cleanup
    fs.rmSync(tc30Dir, { recursive: true, force: true });
  });

  test('TC31: moveFile with dryRun parameter (delegation test)', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const tc31Dir = path.join(tempTestDir, 'tc31');
    fs.mkdirSync(tc31Dir, { recursive: true });
    const oldPath = path.join(tc31Dir, 'file.md');
    const newPath = path.join(tc31Dir, 'file-renamed.md');
    fs.writeFileSync(oldPath, 'Content');
    
    // Execute: Dry run
    await pdca.moveFile(oldPath, newPath, 'true');
    
    // Verify: File NOT moved in dry run
    expect(fs.existsSync(oldPath)).toBe(true);
    expect(fs.existsSync(newPath)).toBe(false);
    
    // Cleanup
    fs.rmSync(tc31Dir, { recursive: true, force: true });
  });

  test('TC32: moveFile returns this (method chaining)', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const tc32Dir = path.join(tempTestDir, 'tc32');
    fs.mkdirSync(tc32Dir, { recursive: true });
    const oldPath = path.join(tc32Dir, 'test.md');
    const newPath = path.join(tc32Dir, 'test-moved.md');
    fs.writeFileSync(oldPath, 'Test');
    
    // Execute and verify method chaining
    const result = await pdca.moveFile(oldPath, newPath);
    expect(result).toBe(pdca);
    
    // Cleanup
    fs.rmSync(tc32Dir, { recursive: true, force: true });
  });

  test('TC33: moveFile with subdirectory move', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const tc33Dir = path.join(tempTestDir, 'tc33');
    const subDir = path.join(tc33Dir, 'subdir');
    fs.mkdirSync(subDir, { recursive: true });
    const oldPath = path.join(tc33Dir, 'file.md');
    const newPath = path.join(subDir, 'file.md');
    fs.writeFileSync(oldPath, '# Content');
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(fs.existsSync(oldPath)).toBe(false);
    expect(fs.existsSync(newPath)).toBe(true);
    
    // Cleanup
    fs.rmSync(tc33Dir, { recursive: true, force: true });
  });
});
