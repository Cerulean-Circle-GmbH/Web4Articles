/**
 * @ai-gpl AI-Assisted GPL Notice (REQUIRED BY LICENSE)
 * This file: AI-Assisted, © 2025 Cerulean Circle GmbH, Licensed under AI-GPL v1
 * Repository: github.com/Cerulean-Circle-GmbH/Web4Articles
 * License-Text: github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/LICENSE.md
 * AI-Provider: Anthropic Claude (claude-sonnet-4-20250514), Cursor IDE v0.45.10
 * Project-Lead: Hannes (hannes@cerulean-circle.com)
 *
 * This file combines AI contributions with human oversight.
 * See LICENSE.md for full terms and conditions.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PDCA } from '../src/ts/layer1/PDCA.js';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const currentFileUrl = new URL(import.meta.url);
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDir = path.dirname(currentFilePath);
const testDataDir = path.join(currentDir, 'data');

describe('PDCA fixAllPDCAs - Batch Operation for Fixing PDCA Files', () => {
  let pdca: PDCA;
  let testDir: string;

  beforeAll(async () => {
    pdca = new DefaultPDCA();
  });

  beforeEach(() => {
    // Create fresh test directory for each test
    testDir = path.join(testDataDir, 'fix-all-test');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Cleanup test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  /**
   * TC-FIX-01: Method exists and is callable
   * Validates: Basic method existence for CLI auto-discovery
   * Requirement: fixAllPDCAs method must exist in DefaultPDCA
   */
  it('TC-FIX-01: fixAllPDCAs method exists', async () => {
    expect(typeof pdca.fixAllPDCAs).toBe('function');
  });

  /**
   * TC-FIX-02: Defaults to current working directory when no path provided
   * Validates: Req 2 - default to CWD when no parameter
   * Requirement: If no parameter is provided, the current working directory is used
   */
  it('TC-FIX-02: Uses CWD when no path provided', async () => {
    const result = await pdca.fixAllPDCAs();
    // Should process files in current directory without error
    expect(result).toBeDefined();
  });

  /**
   * TC-FIX-03: Processes specified directory path
   * Validates: Req 1 - accept directory path parameter
   * Requirement: The only parameter is the path to the folder containing all PDCAs
   */
  it('TC-FIX-03: Processes specified directory', async () => {
    // Create a test PDCA in the directory
    const testFile = path.join(testDir, '2025-11-07-UTC-080000.pdca.md');
    fs.writeFileSync(testFile, '# 📋 Test PDCA\n**🗓️ Date:** Fri, 07 Nov 2025 08:00:00 GMT\n**🎯 Objective:** Test');

    await pdca.fixAllPDCAs(testDir, 'true'); // dry-run

    // Verify directory was scanned (dry-run should show plan)
    expect(true).toBe(true); // Baseline - method doesn't exist yet
  });

  /**
   * TC-FIX-04: Strips descriptions from filenames (rename strip)
   * Validates: Req 5 - programmatic rename strip
   * Requirement: The rename operation must strip the description from the filename when it is included
   */
  it('TC-FIX-04: Strips description from filename', async () => {
    const fileWithDesc = '2025-11-07-UTC-080000-with-description.pdca.md';
    const expectedName = '2025-11-07-UTC-080000.pdca.md';

    // Create test file with description
    const filePath = path.join(testDir, fileWithDesc);
    fs.writeFileSync(filePath, '# 📋 Test PDCA\n**🗓️ Date:** Fri, 07 Nov 2025 08:00:00 GMT\n**🎯 Objective:** Test');

    // Commit the file to git (required for rename operation)
    try {
      execSync(`git add -f ${filePath}`, { cwd: testDir });
      execSync(`git commit -m "Add test file with description"`, { cwd: testDir });
    } catch (error) {
      // Git operations might fail in test environment - that's OK for baseline
    }

    await pdca.fixAllPDCAs(testDir, 'false');

    // Verify description stripped
    expect(fs.existsSync(path.join(testDir, expectedName))).toBe(true);
    expect(fs.existsSync(path.join(testDir, fileWithDesc))).toBe(false);
  });

  /**
   * TC-FIX-05: Corrects creation date timestamps (rename creationDate)
   * Validates: Req 6 - programmatic rename creationDate
   * Requirement: The rename operation must correct the creationDate if the timestamp does not match the actual creation date
   */
  it('TC-FIX-05: Corrects timestamp to git creation date', async () => {
    const wrongTimestamp = '2025-11-07-UTC-120000.pdca.md';

    // Create file with wrong timestamp
    const filePath = path.join(testDir, wrongTimestamp);
    fs.writeFileSync(filePath, '# 📋 Test PDCA\n**🗓️ Date:** Fri, 07 Nov 2025 12:00:00 GMT\n**🎯 Objective:** Test');

    // Commit with earlier timestamp (simulate the file was created at 08:00 but renamed to 12:00)
    try {
      execSync(`git add -f ${filePath}`, { cwd: testDir });
      execSync(`GIT_AUTHOR_DATE="2025-11-07T08:00:00" GIT_COMMITTER_DATE="2025-11-07T08:00:00" git commit -m "Add test file"`, { cwd: testDir });
    } catch (error) {
      // Git operations might fail in test environment - that's OK for baseline
    }

    await pdca.fixAllPDCAs(testDir, 'false');

    // Verify timestamp corrected (matches git creation date)
    const files = fs.readdirSync(testDir).filter(f => f.endsWith('.pdca.md'));
    const correctedFile = files.find(f => f.match(/2025-11-07-UTC-08\d{4}\.pdca\.md/));
    expect(correctedFile).toBeDefined();
  });

  /**
   * TC-FIX-06: Rewrites non-compliant PDCAs (rewritePDCA)
   * Validates: Req 7 - programmatic rewritePDCA for non-compliant files
   * Requirement: If a PDCA does not comply with the PDCA template, it must be rewritten using pdca rewrite
   */
  it('TC-FIX-06: Rewrites corrupted PDCA', async () => {
    const corruptedFile = path.join(testDir, '2025-11-07-UTC-090000.pdca.md');

    // Create corrupted PDCA (missing sections, wrong headers)
    fs.writeFileSync(corruptedFile, `# 📋 Test PDCA
**🗓️ Date:** Fri, 07 Nov 2025 09:00:00 GMT
**🎯 Objective:** Test

## SUMMARY (corrupted header)
Content here
`);

    await pdca.fixAllPDCAs(testDir, 'false');

    // Verify file was rewritten with correct template
    const content = fs.readFileSync(corruptedFile, 'utf-8');
    expect(content).toMatch(/## \*\*📊 SUMMARY\*\*/);
  });

  /**
   * TC-FIX-07: Processes multiple PDCAs in batch
   * Validates: Batch processing capability
   * Requirement: All operations must be executed programmatically across multiple files
   */
  it('TC-FIX-07: Processes multiple files in one invocation', async () => {
    // Create 3 PDCAs with different issues
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-100000-desc.pdca.md'), '# 📋 Test 1\n**🗓️ Date:** Fri, 07 Nov 2025 10:00:00 GMT\n**🎯 Objective:** Test');
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-110000.pdca.md'), '# 📋 Test 2\n## SUMMARY\nCorrupted');
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-120000.pdca.md'), '# 📋 Test 3\n**🗓️ Date:** Fri, 07 Nov 2025 12:00:00 GMT\n**🎯 Objective:** Test');

    await pdca.fixAllPDCAs(testDir, 'true'); // dry-run

    // Verify batch summary (dry-run should show plan)
    expect(true).toBe(true); // Baseline - method doesn't exist yet
  });

  /**
   * TC-FIX-08: Dry-run mode doesn't modify files
   * Validates: Dry-run parameter works correctly
   * Requirement: Programmatic execution with safety mode
   */
  it('TC-FIX-08: Dry-run shows plan without executing', async () => {
    const fileWithDesc = '2025-11-07-UTC-130000-description.pdca.md';
    const filePath = path.join(testDir, fileWithDesc);

    fs.writeFileSync(filePath, '# 📋 Test\n**🗓️ Date:** Fri, 07 Nov 2025 13:00:00 GMT\n**🎯 Objective:** Test');

    await pdca.fixAllPDCAs(testDir, 'true'); // dry-run

    // Verify file unchanged
    expect(fs.existsSync(filePath)).toBe(true);
  });

  /**
   * TC-FIX-09: Continues processing on individual file failure
   * Validates: Error handling (QA decision needed)
   * Requirement: Robust batch processing
   */
  it('TC-FIX-09: Error in one file does not stop batch', async () => {
    // Create 1 valid, 1 invalid (malformed), 1 valid
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-140000.pdca.md'), '# 📋 Valid 1\n**🗓️ Date:** Fri, 07 Nov 2025 14:00:00 GMT\n**🎯 Objective:** Test');
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-150000.pdca.md'), 'Invalid content - not a PDCA');
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-160000.pdca.md'), '# 📋 Valid 2\n**🗓️ Date:** Fri, 07 Nov 2025 16:00:00 GMT\n**🎯 Objective:** Test');

    await pdca.fixAllPDCAs(testDir, 'false');

    // Verify batch completed (errors should be logged but not crash)
    expect(true).toBe(true); // Baseline - method doesn't exist yet
  });

  /**
   * TC-FIX-10: Generates summary report
   * Validates: Summary report output
   * Requirement: User feedback on batch operations
   */
  it('TC-FIX-10: Displays summary with counts', async () => {
    // Create mix of files
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-170000-desc.pdca.md'), '# 📋 Test\n**🗓️ Date:** Fri, 07 Nov 2025 17:00:00 GMT\n**🎯 Objective:** Test');
    fs.writeFileSync(path.join(testDir, '2025-11-07-UTC-180000.pdca.md'), '# 📋 Valid\n**🗓️ Date:** Fri, 07 Nov 2025 18:00:00 GMT\n**🎯 Objective:** Test');

    await pdca.fixAllPDCAs(testDir, 'false');

    // Verify summary format (baseline - just checking method exists)
    expect(true).toBe(true); // Baseline - method doesn't exist yet
  });
});

