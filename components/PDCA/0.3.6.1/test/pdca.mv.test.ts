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
import { execSync } from 'child_process';

// Web4-compliant pattern: Use import.meta.url instead of __dirname
const currentFileUrl = new URL(import.meta.url);
const testDir = path.dirname(currentFileUrl.pathname);

/**
 * Test Suite: mv() Functionality
 * 
 * Purpose: Test the core mv() method that replaces moveFile()
 * 
 * TDD Pattern: These tests are written BEFORE implementation
 * Expected initial state: ALL tests FAIL with "method not found" or similar
 * 
 * Coverage:
 * - TC_MV_01-03: Basic move operations
 * - TC_MV_04-05: Dual link updates and relative link fix
 * - TC_MV_06-07: Error handling
 * - TC_MV_08-10: Edge cases
 */

describe('PDCA mv() - Core File Move + Link Update', () => {
  const projectRoot = path.resolve(testDir, '../../../../');
  const tempTestDir = path.join(testDir, 'temp-mv-tests');
  
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

  /**
   * TC_MV_01: Basic file move within same directory
   * Verifies: mv() moves file successfully
   */
  test('TC_MV_01: mv() - move file within same directory', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create test file
    const sourceDir = path.join(tempTestDir, 'tc01');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const sourceFile = path.join(sourceDir, 'test-file.md');
    const targetFile = path.join(sourceDir, 'test-file-renamed.md');
    
    fs.writeFileSync(sourceFile, '# Test File\n\nContent here.');
    
    // Execute: mv() should move the file
    await pdca.mv(sourceFile, targetFile);
    
    // Verify: Target exists, source doesn't
    expect(fs.existsSync(targetFile)).toBe(true);
    expect(fs.existsSync(sourceFile)).toBe(false);
    expect(fs.readFileSync(targetFile, 'utf-8')).toContain('Content here.');
  });

  /**
   * TC_MV_02: Move file to different directory
   * Verifies: mv() creates target directory if needed
   */
  test('TC_MV_02: mv() - move file to different directory', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const sourceDir = path.join(tempTestDir, 'tc02/source');
    const targetDir = path.join(tempTestDir, 'tc02/target');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const sourceFile = path.join(sourceDir, 'doc.md');
    const targetFile = path.join(targetDir, 'doc.md');
    
    fs.writeFileSync(sourceFile, '# Document\n\nTest content.');
    
    // Execute
    await pdca.mv(sourceFile, targetFile);
    
    // Verify
    expect(fs.existsSync(targetFile)).toBe(true);
    expect(fs.existsSync(sourceFile)).toBe(false);
    expect(fs.existsSync(targetDir)).toBe(true);
  });

  /**
   * TC_MV_03: Dry-run mode does not modify files
   * Verifies: mv() with dryRun='true' simulates move without changes
   */
  test('TC_MV_03: mv() - dry-run does not modify files', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const sourceDir = path.join(tempTestDir, 'tc03');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const sourceFile = path.join(sourceDir, 'file.md');
    const targetFile = path.join(sourceDir, 'file-moved.md');
    
    fs.writeFileSync(sourceFile, '# Content');
    
    // Execute: dry-run
    await pdca.mv(sourceFile, targetFile, 'true');
    
    // Verify: No changes
    expect(fs.existsSync(sourceFile)).toBe(true);
    expect(fs.existsSync(targetFile)).toBe(false);
  });

  /**
   * TC_MV_04: mv() updates dual links in other files
   * Verifies: When file B moves, file A's link to B updates
   * Note: updateLinksToFile only searches PDCA files, so we use .pdca.md extension
   */
  test('TC_MV_04: mv() - updates dual links in referencing files', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: File A links to File B (both PDCA files for link update to work)
    const sourceDir = path.join(tempTestDir, 'tc04/source');
    const targetDir = path.join(tempTestDir, 'tc04/target');
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(targetDir, { recursive: true });
    
    const fileA = path.join(sourceDir, 'file-a.pdca.md');
    const fileB = path.join(sourceDir, 'file-b.pdca.md');
    const fileBMoved = path.join(targetDir, 'file-b.pdca.md');
    
    // File A has dual link to File B (project-root-relative in § notation)
    const fileBProjectPath = `components/PDCA/0.3.6.1/test/temp-mv-tests/tc04/source/file-b.pdca.md`;
    fs.writeFileSync(fileA, `# File A

See also: [GitHub](https://github.com/org/repo/blob/branch/${fileBProjectPath}) | [§/${fileBProjectPath}](./file-b.pdca.md)
`);
    
    fs.writeFileSync(fileB, '# File B\n\nContent.');
    
    // Execute: Move File B
    await pdca.mv(fileB, fileBMoved);
    
    // Verify: File A's link updated to relative path
    const fileAContent = fs.readFileSync(fileA, 'utf-8');
    expect(fileAContent).toContain('../target/file-b.pdca.md');
    expect(fileAContent).not.toContain('./file-b.pdca.md');
  });

  /**
   * TC_MV_05: mv() fixes relative links (TC39 bug fix)
   * Verifies: Links in moved file B get updated to relative paths from new location
   */
  test('TC_MV_05: mv() - fixes relative links in moved file (TC39 bug)', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: File B links to File A, then B moves
    const sourceDir = path.join(tempTestDir, 'tc05/source');
    const targetDir = path.join(tempTestDir, 'tc05/target/subdir');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const fileA = path.join(sourceDir, 'file-a.pdca.md');
    const fileB = path.join(sourceDir, 'file-b.pdca.md');
    const fileBMoved = path.join(targetDir, 'file-b.pdca.md');
    
    const fileAProjectPath = `components/PDCA/0.3.6.1/test/temp-mv-tests/tc05/source/file-a.pdca.md`;
    fs.writeFileSync(fileA, '# File A');
    
    // File B links to A (same directory)
    fs.writeFileSync(fileB, `# File B

Reference: [GitHub](https://github.com/org/repo/blob/branch/${fileAProjectPath}) | [§/${fileAProjectPath}](./file-a.pdca.md)
`);
    
    // Execute: Move B to subdir
    await pdca.mv(fileB, fileBMoved);
    
    // Verify: B's link to A updated to relative path from new location
    const fileBContent = fs.readFileSync(fileBMoved, 'utf-8');
    expect(fileBContent).toContain('../../source/file-a.pdca.md');
    expect(fileBContent).not.toContain('./file-a.pdca.md');
  });

  /**
   * TC_MV_06: Error when source file does not exist
   * Verifies: mv() throws error for non-existent source
   */
  test('TC_MV_06: mv() - error when source does not exist', async () => {
    const pdca = new DefaultPDCA();
    
    const nonExistent = path.join(tempTestDir, 'tc06/nonexistent.md');
    const target = path.join(tempTestDir, 'tc06/target.md');
    
    await expect(pdca.mv(nonExistent, target)).rejects.toThrow();
  });

  /**
   * TC_MV_07: Error when target already exists
   * Verifies: mv() throws error if target file exists
   */
  test('TC_MV_07: mv() - error when target already exists', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Both files exist
    const sourceDir = path.join(tempTestDir, 'tc07');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const source = path.join(sourceDir, 'source.md');
    const target = path.join(sourceDir, 'target.md');
    
    fs.writeFileSync(source, '# Source');
    fs.writeFileSync(target, '# Target');
    
    await expect(pdca.mv(source, target)).rejects.toThrow();
  });

  /**
   * TC_MV_08: PDCA file move
   * Verifies: mv() handles .pdca.md files correctly
   */
  test('TC_MV_08: mv() - handles PDCA files', async () => {
    const pdca = new DefaultPDCA();
    
    const sourceDir = path.join(tempTestDir, 'tc08');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const source = path.join(sourceDir, '2025-10-31-UTC-1234.pdca.md');
    const target = path.join(sourceDir, '2025-10-31-UTC-1235.pdca.md');
    
    fs.writeFileSync(source, '# PDCA Document\n\n## PLAN\n\nContent.');
    
    await pdca.mv(source, target);
    
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.existsSync(source)).toBe(false);
  });

  /**
   * TC_MV_09: Non-PDCA file move
   * Verifies: mv() works with non-PDCA files
   */
  test('TC_MV_09: mv() - handles non-PDCA files', async () => {
    const pdca = new DefaultPDCA();
    
    const sourceDir = path.join(tempTestDir, 'tc09');
    fs.mkdirSync(sourceDir, { recursive: true });
    
    const source = path.join(sourceDir, 'README.md');
    const target = path.join(sourceDir, 'README-old.md');
    
    fs.writeFileSync(source, '# README\n\nDocumentation.');
    
    await pdca.mv(source, target);
    
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.existsSync(source)).toBe(false);
  });

  /**
   * TC_MV_10: Move to same directory (rename only)
   * Verifies: mv() handles rename without directory change
   */
  test('TC_MV_10: mv() - rename in same directory', async () => {
    const pdca = new DefaultPDCA();
    
    const dir = path.join(tempTestDir, 'tc10');
    fs.mkdirSync(dir, { recursive: true });
    
    const source = path.join(dir, 'old-name.md');
    const target = path.join(dir, 'new-name.md');
    
    fs.writeFileSync(source, '# Document');
    
    await pdca.mv(source, target);
    
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.existsSync(source)).toBe(false);
  });
});

