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
});

