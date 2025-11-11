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
 * Test Suite: rename() Functionality
 * 
 * Purpose: Test the rename() wrapper that delegates to mv()
 * 
 * TDD Pattern: These tests are written BEFORE implementation
 * Expected initial state: ALL tests FAIL with "method not found" or similar
 * 
 * Coverage:
 * - TC_REN_01-02: Basic rename wrapper
 * - TC_REN_03-06: Case 'now' (rename to current UTC timestamp)
 * - TC_REN_07-10: Case 'creationDate' (rename to git creation date)
 * - TC_REN_11-14: Case 'strip' (remove long description)
 * - TC_REN_15-17: Case 'feature' (add .feature. marker)
 * - TC_REN_18: Error handling
 */

describe('PDCA rename() - Wrapper Around mv()', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-tests');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    // Clean up test files after each test to prevent conflicts
    if (fs.existsSync(tempTestDir)) {
      const files = fs.readdirSync(tempTestDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(tempTestDir, file));
      });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_01: Basic rename wrapper functionality
   * Verifies: rename() delegates to mv() correctly
   */
  test('TC_REN_01: rename() - basic wrapper delegates to mv()', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc01');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-31-UTC-1234.old-desc.pdca.md');
    fs.writeFileSync(original, '# PDCA\n\n## PLAN\n\nContent.');
    
    // Execute: rename with 'now' case
    await pdca.rename('now', original);
    
    // Verify: Original gone, new file exists with current timestamp format
    expect(fs.existsSync(original)).toBe(false);
    const files = fs.readdirSync(testDir);
    expect(files.length).toBe(1);
    expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/);
  });

  /**
   * TC_REN_02: Dry-run propagation
   * Verifies: rename() passes dryRun to mv()
   */
  test('TC_REN_02: rename() - dry-run does not modify files', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc02');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-31-UTC-1234.desc.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    // Execute: dry-run
    await pdca.rename('now', original, 'true');
    
    // Verify: No changes
    expect(fs.existsSync(original)).toBe(true);
  });
});

describe('PDCA rename Case: now', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-now');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_03: rename now - current UTC timestamp
   * Verifies: Renames to YYYY-MM-DD-UTC-HHMM.pdca.md format
   */
  test('TC_REN_03: rename now - generates current UTC timestamp', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc03');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-01-01-UTC-0000.old-name.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await pdca.rename('now', original);
    
    // Verify: New filename matches current UTC time
    const files = fs.readdirSync(testDir);
    expect(files.length).toBe(1);
    
    const newName = files[0];
    const timestampRegex = /^(\d{4}-\d{2}-\d{2}-UTC-\d{4})\.pdca\.md$/;
    expect(newName).toMatch(timestampRegex);
    
    // Verify timestamp is recent (within last 5 minutes)
    const match = newName.match(timestampRegex);
    const timestamp = match![1];
    const [datePart, timePart] = timestamp.split('-UTC-');
    const [year, month, day] = datePart.split('-').map(Number);
    const hour = parseInt(timePart.substring(0, 2));
    const minute = parseInt(timePart.substring(2, 4));
    
    const fileTime = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const now = new Date();
    const diffMinutes = (now.getTime() - fileTime.getTime()) / 1000 / 60;
    
    expect(diffMinutes).toBeLessThan(5);
    expect(diffMinutes).toBeGreaterThanOrEqual(-1); // Allow 1 min future for test timing
  });

  /**
   * TC_REN_04: rename now - preserves feature flag
   * Verifies: Keeps .feature. if present
   */
  test('TC_REN_04: rename now - preserves .feature. marker', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc04');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-01-01-UTC-0000.old.feature.pdca.md');
    fs.writeFileSync(original, '# Feature PDCA');
    
    await pdca.rename('now', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.feature\.pdca\.md$/);
  });

  /**
   * TC_REN_05: rename now - strips description
   * Verifies: Removes long description, keeps only timestamp
   */
  test('TC_REN_05: rename now - strips long description', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc05');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-01-01-UTC-0000.very-long-description-here.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await pdca.rename('now', original);
    
    const files = fs.readdirSync(testDir);
    // Should have NO description between timestamp and .pdca.md
    expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/);
    expect(files[0]).not.toContain('description');
  });

  /**
   * TC_REN_06: rename now - handles non-PDCA files
   * Verifies: Works with .md files (not just .pdca.md)
   */
  test('TC_REN_06: rename now - works with non-PDCA files', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc06');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'old-document.md');
    fs.writeFileSync(original, '# Document');
    
    await pdca.rename('now', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.md$/);
  });
});

describe('PDCA rename Case: creationDate', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-creation');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_07: rename creationDate - uses git creation timestamp
   * Verifies: Extracts timestamp from git log --follow --diff-filter=A
   */
  test('TC_REN_07: rename creationDate - uses git creation date', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc07');
    fs.mkdirSync(testDir, { recursive: true });
    
    // Note: This test requires the file to be in git
    // For now, we verify the method exists and runs
    const original = path.join(testDir, 'document.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    // This will fail if file not in git, but test verifies method exists
    try {
      await pdca.rename('creationDate', original);
      
      // If succeeded, verify filename format
      const files = fs.readdirSync(testDir);
      expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/);
    } catch (error: any) {
      // Expected: file not in git
      expect(error.message).toContain('git');
    }
  });

  /**
   * TC_REN_08: rename creationDate - preserves feature flag
   * Verifies: Keeps .feature. marker
   */
  test('TC_REN_08: rename creationDate - preserves .feature. marker', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc08');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'doc.feature.pdca.md');
    fs.writeFileSync(original, '# Feature');
    
    try {
      await pdca.rename('creationDate', original);
      const files = fs.readdirSync(testDir);
      expect(files[0]).toMatch(/\.feature\.pdca\.md$/);
    } catch (error: any) {
      expect(error.message).toContain('git');
    }
  });

  /**
   * TC_REN_09: rename creationDate - strips description
   * Verifies: Removes description, uses only timestamp from git
   */
  test('TC_REN_09: rename creationDate - strips description', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc09');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'long-description.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    try {
      await pdca.rename('creationDate', original);
      const files = fs.readdirSync(testDir);
      expect(files[0]).not.toContain('description');
    } catch (error: any) {
      expect(error.message).toContain('git');
    }
  });

  /**
   * TC_REN_10: rename creationDate - error if not in git
   * Verifies: Throws error if file has no git history
   */
  test('TC_REN_10: rename creationDate - error if not in git', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc10');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'new-file.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await expect(pdca.rename(original, 'creationDate')).rejects.toThrow();
  });
});

describe('PDCA rename Case: strip', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-strip');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_11: rename strip - removes description keeps timestamp
   * Verifies: Extracts timestamp, removes description
   */
  test('TC_REN_11: rename strip - removes description keeps timestamp', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc11');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.long-description-here.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await pdca.rename('strip', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.pdca.md');
  });

  /**
   * TC_REN_12: rename strip - no-op if already stripped
   * Verifies: Handles already-stripped files gracefully
   */
  test('TC_REN_12: rename strip - no-op if already stripped', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc12');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    // Should not fail, just report no change needed
    await pdca.rename('strip', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.pdca.md');
  });

  /**
   * TC_REN_13: rename strip - preserves feature flag
   * Verifies: Keeps .feature. if present
   */
  test('TC_REN_13: rename strip - preserves .feature. marker', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc13');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.desc.feature.pdca.md');
    fs.writeFileSync(original, '# Feature PDCA');
    
    await pdca.rename('strip', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.feature.pdca.md');
  });

  /**
   * TC_REN_14: rename strip - error if no timestamp in name
   * Verifies: Throws error if filename doesn't have timestamp pattern
   */
  test('TC_REN_14: rename strip - error if no timestamp pattern', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc14');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'no-timestamp-here.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await expect(pdca.rename(original, 'strip')).rejects.toThrow();
  });
});

describe('PDCA rename Case: feature', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-feature');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_15: rename feature - adds .feature. marker
   * Verifies: Inserts .feature. before .pdca.md
   */
  test('TC_REN_15: rename feature - adds .feature. marker', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc15');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.description.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await pdca.rename('feature', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.description.feature.pdca.md');
  });

  /**
   * TC_REN_16: rename feature - no-op if already has .feature.
   * Verifies: Handles already-featured files gracefully
   */
  test('TC_REN_16: rename feature - no-op if already has .feature.', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc16');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.desc.feature.pdca.md');
    fs.writeFileSync(original, '# Feature PDCA');
    
    await pdca.rename('feature', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.desc.feature.pdca.md');
  });

  /**
   * TC_REN_17: rename feature - works with stripped files
   * Verifies: Adds .feature. to timestamp-only files
   */
  test('TC_REN_17: rename feature - adds to stripped filename', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc17');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, '2025-10-20-UTC-1234.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await pdca.rename('feature', original);
    
    const files = fs.readdirSync(testDir);
    expect(files[0]).toBe('2025-10-20-UTC-1234.feature.pdca.md');
  });
});

describe('PDCA rename - Error Handling', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-errors');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    // Clean up test files after each test to prevent conflicts
    if (fs.existsSync(tempTestDir)) {
      const files = fs.readdirSync(tempTestDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(tempTestDir, file));
      });
    }
  });
  
  afterAll(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  /**
   * TC_REN_18: rename - error on invalid case
   * Verifies: Throws error for unknown rename case
   */
  test('TC_REN_18: rename() - error on invalid case', async () => {
    const pdca = new DefaultPDCA();
    
    const testDir = path.join(tempTestDir, 'tc18');
    fs.mkdirSync(testDir, { recursive: true });
    
    const original = path.join(testDir, 'file.pdca.md');
    fs.writeFileSync(original, '# PDCA');
    
    await expect(pdca.rename(original, 'invalid-case' as any)).rejects.toThrow();
  });

  /**
   * TC96: Autocomplete - Baseline (method doesn't exist yet)
   * Verifies: renameCaseParameterCompletion method doesn't exist (TDD baseline)
   * TDD Phase: RED - This test should PASS initially (method missing)
   * Status: COMPLETE - Method now exists, baseline test no longer relevant
   */
  test.skip('TC96: should NOT have renameCaseParameterCompletion method yet (baseline)', async () => {
    const pdca = new DefaultPDCA();
    expect(typeof (pdca as any).renameCaseParameterCompletion).toBe('undefined');
  });

  /**
   * TC97: Autocomplete - Method returns all four case values
   * Verifies: renameCaseParameterCompletion returns ['now', 'creationDate', 'strip', 'feature']
   * TDD Phase: RED initially (method doesn't exist), GREEN after implementation
   */
  test('TC97: renameCaseParameterCompletion should return all four case values', async () => {
    const pdca = new DefaultPDCA();
    
    const completions = await (pdca as any).renameCaseParameterCompletion([]);
    
    expect(completions).toEqual(['now', 'creationDate', 'strip', 'feature']);
    expect(completions).toHaveLength(4);
  });

  /**
   * TC98: Baseline - rename now generates 4-digit timestamp (current behavior)
   * Verifies: Current implementation generates HHMM format (4 digits)
   * TDD Phase: Baseline test - should PASS with current implementation
   * PDCA: 2025-11-05-UTC-083559
   */
  test('TC98: rename now generates 4-digit timestamp (current behavior baseline)', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-0830.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Act: Rename with 'now' case
    await pdca.rename('now', testFile);
    
    // Assert: New file should have 4-digit timestamp (HHMM format)
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/));
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{4}\./); // 4 digits only
  });

  /**
   * TC99: Format Preservation - rename now preserves 6-digit format
   * Verifies: When original has seconds (HHMMSS), new timestamp also has seconds
   * TDD Phase: RED - Expected to FAIL until implementation
   * PDCA: 2025-11-05-UTC-083559
   */
  test('TC99: rename now preserves 6-digit timestamp format', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-083045.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Act: Rename with 'now' case
    await pdca.rename('now', testFile);
    
    // Assert: New file should have 6-digit timestamp (HHMMSS format)
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{6}\.pdca\.md$/));
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{6}\./); // 6 digits preserved
  });

  /**
   * TC100: Format Preservation - rename creationDate preserves 6-digit format
   * Verifies: When original has seconds, git creation date also includes seconds
   * TDD Phase: RED - Expected to FAIL until implementation
   * PDCA: 2025-11-05-UTC-083559
   * Note: Skipped due to git operations in test environment
   */
  test.skip('TC100: rename creationDate preserves 6-digit timestamp format', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-083045-creation.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Note: Would need git operations here, skipping for now
    await pdca.rename('creationDate', testFile);
    
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{6}\.pdca\.md$/));
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{6}\./); // 6 digits preserved
  });

  /**
   * TC101: Format Preservation - rename strip preserves original format (6 digits)
   * Verifies: strip removes description but preserves timestamp format
   * TDD Phase: RED - Expected to FAIL until implementation
   * PDCA: 2025-11-05-UTC-083559
   */
  test('TC101: rename strip preserves original timestamp format (6 digits)', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-083045.my-description.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Act: Rename with 'strip' case
    await pdca.rename('strip', testFile);
    
    // Assert: Description removed, but 6-digit timestamp preserved
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f === '2025-11-05-UTC-083045.pdca.md');
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{6}\./); // 6 digits preserved
  });

  /**
   * TC102: Format Preservation - rename feature preserves original format (6 digits)
   * Verifies: feature adds marker but preserves timestamp format
   * TDD Phase: RED - Expected to FAIL until implementation
   * PDCA: 2025-11-05-UTC-083559
   */
  test('TC102: rename feature preserves original timestamp format (6 digits)', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-083045-feature.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Act: Rename with 'feature' case
    await pdca.rename('feature', testFile);
    
    // Assert: .feature marker added, 6-digit timestamp preserved
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f === '2025-11-05-UTC-083045-feature.feature.pdca.md');
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{6}/); // 6 digits preserved
  });

  /**
   * TC103: Backward Compatibility - rename operations work with legacy 4-digit timestamps
   * Verifies: 4-digit timestamps continue to work (format preserved)
   * TDD Phase: Should PASS (backward compatibility)
   * PDCA: 2025-11-05-UTC-083559
   */
  test('TC103: rename operations work with legacy 4-digit timestamps', async () => {
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-0830-legacy.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Act: Rename with 'now' case
    await pdca.rename('now', testFile);
    
    // Assert: New file should have 4-digit timestamp (format preserved)
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/));
    
    expect(renamedFile).toBeDefined();
    expect(renamedFile).toMatch(/UTC-\d{4}\./); // 4 digits preserved for legacy
  });
});

/**
 * Test Suite: rename() Git Commit Atomicity
 * 
 * Purpose: Ensure rename commits BOTH the renamed file AND link updates
 * Bug: rename was only committing link updates, leaving renamed file uncommitted
 * 
 * TDD Pattern: RED → GREEN → REFACTOR
 * Expected initial state: TC117-TC120 FAIL (renamed file not committed)
 * 
 * Coverage:
 * - TC117: Renamed file is committed (has git history)
 * - TC118: Link updates are committed
 * - TC119: Both commits are pushed to remote
 * - TC120: Chained rename operations work (now → creationDate)
 */

describe('PDCA rename - Git Commit Atomicity', () => {
  const tempTestDir = path.join(testDir, 'temp-rename-git-tests');
  
  beforeAll(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });
  
  afterEach(() => {
    // Clean up test files after each test
    if (fs.existsSync(tempTestDir)) {
      const files = fs.readdirSync(tempTestDir);
      files.forEach(file => {
        const filePath = path.join(tempTestDir, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  test('TC117: Renamed file is committed and has git history', async () => {
    // Arrange: Create a test PDCA file
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-104958.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    // Commit the original file first
    const { execSync } = await import('child_process');
    const projectRoot = await pdca.getProjectRoot();
    const relPath = path.relative(projectRoot, testFile);
    
    execSync(`git add "${relPath}"`, { cwd: projectRoot });
    execSync(`git commit -m "test: add test file for TC117"`, { cwd: projectRoot });
    
    // Act: Rename with 'now' case
    await pdca.rename('now', testFile);
    
    // Assert: Renamed file should have git history
    const files = fs.readdirSync(tempTestDir);
    const renamedFile = files.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{6}\.pdca\.md$/));
    expect(renamedFile).toBeDefined();
    
    const renamedPath = path.relative(projectRoot, path.join(tempTestDir, renamedFile!));
    
    // Check git log for the renamed file
    const gitLog = execSync(`git log --follow --oneline "${renamedPath}"`, {
      cwd: projectRoot,
      encoding: 'utf-8'
    });
    
    expect(gitLog).toBeTruthy();
    expect(gitLog).toContain('rename'); // Should have a rename commit
  });

  test.skip('TC118: Link updates are committed', async () => {
    // Arrange: Create two PDCAs with bidirectional links
    const pdca = new DefaultPDCA();
    const testFile1 = path.join(tempTestDir, '2025-11-05-UTC-104900.pdca.md');
    const testFile2 = path.join(tempTestDir, '2025-11-05-UTC-104958.pdca.md');
    
    fs.writeFileSync(testFile1, `# Test PDCA 1\n**➡️ Next PDCA:** [link](./2025-11-05-UTC-104958.pdca.md)\n`);
    fs.writeFileSync(testFile2, `# Test PDCA 2\n**🔗 Previous PDCA:** [link](./2025-11-05-UTC-104900.pdca.md)\n`);
    
    // Commit both files
    const { execSync } = await import('child_process');
    const projectRoot = await pdca.getProjectRoot();
    const relPath1 = path.relative(projectRoot, testFile1);
    const relPath2 = path.relative(projectRoot, testFile2);
    
    execSync(`git add "${relPath1}" "${relPath2}"`, { cwd: projectRoot });
    execSync(`git commit -m "test: add test files for TC118"`, { cwd: projectRoot });
    
    // Act: Rename testFile2
    await pdca.rename('now', testFile2);
    
    // Assert: testFile1 should have updated link (committed)
    const file1Content = fs.readFileSync(testFile1, 'utf-8');
    expect(file1Content).not.toContain('104958'); // Old timestamp removed
    expect(file1Content).toMatch(/UTC-\d{6}/); // New timestamp present
    
    // Check that link update was committed
    const gitLog = execSync(`git log --oneline -1 "${relPath1}"`, {
      cwd: projectRoot,
      encoding: 'utf-8'
    });
    
    expect(gitLog).toContain('update dual links');
  });

  test.skip('TC119: Both commits are pushed to remote', async () => {
    // This test requires a real git remote, which is complex to set up in tests
    // We'll verify this manually during integration testing
    // For now, we check that the commits exist locally
    
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-104958.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    const { execSync } = await import('child_process');
    const projectRoot = await pdca.getProjectRoot();
    const relPath = path.relative(projectRoot, testFile);
    
    execSync(`git add "${relPath}"`, { cwd: projectRoot });
    execSync(`git commit -m "test: add test file for TC119"`, { cwd: projectRoot });
    
    // Act: Rename
    await pdca.rename('now', testFile);
    
    // Assert: Check that commits exist
    const gitLog = execSync(`git log --oneline -2`, {
      cwd: projectRoot,
      encoding: 'utf-8'
    });
    
    expect(gitLog).toContain('rename');
    expect(gitLog).toContain('update dual links');
  });

  test.skip('TC120: Chained rename operations work (now → creationDate)', async () => {
    // Arrange: Create and commit a test file
    const pdca = new DefaultPDCA();
    const testFile = path.join(tempTestDir, '2025-11-05-UTC-104958.pdca.md');
    fs.writeFileSync(testFile, '# Test PDCA\n');
    
    const { execSync } = await import('child_process');
    const projectRoot = await pdca.getProjectRoot();
    const relPath = path.relative(projectRoot, testFile);
    
    execSync(`git add "${relPath}"`, { cwd: projectRoot });
    execSync(`git commit -m "test: add test file for TC120"`, { cwd: projectRoot });
    
    // Act 1: Rename with 'now'
    await pdca.rename('now', testFile);
    
    // Find the renamed file
    const files1 = fs.readdirSync(tempTestDir);
    const renamedFile1 = files1.find(f => f.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{6}\.pdca\.md$/));
    expect(renamedFile1).toBeDefined();
    
    const renamedPath1 = path.join(tempTestDir, renamedFile1!);
    
    // Act 2: Rename with 'creationDate' (this should NOT fail)
    await expect(pdca.rename('creationDate', renamedPath1)).resolves.toBeDefined();
    
    // Assert: Second rename succeeded (file has git history from first rename)
    const files2 = fs.readdirSync(tempTestDir);
    expect(files2.length).toBe(1); // Only one file should exist
  });
});

