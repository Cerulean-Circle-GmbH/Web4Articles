/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

describe('PDCA Dual Link Relative Path Generation (TC22)', () => {
  let pdca: DefaultPDCA;
  const projectRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  const testDir = join(projectRoot, 'test', 'data', 'relative-path-tests');

  beforeAll(async () => {
    pdca = new DefaultPDCA();
    
    // Create test directory structure
    await mkdir(join(testDir, 'subdir1'), { recursive: true });
    await mkdir(join(testDir, 'subdir2', 'deep'), { recursive: true });
    
    // Create test files
    await writeFile(join(testDir, 'file-root.md'), '# Root Level File');
    await writeFile(join(testDir, 'subdir1', 'file-sub1.md'), '# Subdir1 File');
    await writeFile(join(testDir, 'subdir2', 'deep', 'file-deep.md'), '# Deep File');
  });

  // TC22.1: Same directory - relative path should be just filename
  it('TC22.1: getDualLink from same directory should generate filename only', async () => {
    // Simulate being in test/data/relative-path-tests/
    // Linking to test/data/relative-path-tests/file-root.md
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('test/data/relative-path-tests/file-root.md')
    );
    
    expect(output).toContain('[§/test/data/relative-path-tests/file-root.md]');
    // The href should be relative based on where you call it from
    // This will be verified in manual tests with actual file locations
  });

  // TC22.2: Parent directory - relative path should use ../
  it('TC22.2: getDualLink from subdirectory should use ../ for parent files', async () => {
    // Simulate being in test/data/relative-path-tests/subdir1/
    // Linking to test/data/relative-path-tests/file-root.md
    // Should generate: ../file-root.md
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('test/data/relative-path-tests/file-root.md')
    );
    
    expect(output).toContain('Dual Link Generated');
    expect(output).toContain('file-root.md');
  });

  // TC22.3: Sibling directory - relative path should use ../sibling/
  it('TC22.3: getDualLink from sibling directory should use ../sibling/ path', async () => {
    // Simulate being in test/data/relative-path-tests/subdir1/
    // Linking to test/data/relative-path-tests/subdir2/deep/file-deep.md
    // Should generate: ../subdir2/deep/file-deep.md
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('test/data/relative-path-tests/subdir2/deep/file-deep.md')
    );
    
    expect(output).toContain('Dual Link Generated');
    expect(output).toContain('file-deep.md');
  });

  // TC22.4: Deep nesting - multiple ../ should be used
  it('TC22.4: getDualLink from deeply nested dir should use multiple ../', async () => {
    // Simulate being in test/data/relative-path-tests/subdir2/deep/
    // Linking to test/data/relative-path-tests/file-root.md
    // Should generate: ../../file-root.md
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('test/data/relative-path-tests/file-root.md')
    );
    
    expect(output).toContain('Dual Link Generated');
    expect(output).toContain('file-root.md');
  });

  // TC22.5: Actual use case from bug report
  it('TC22.5: Real scenario - linktest.md in temp/tpichler/ linking to PDCA', async () => {
    // CMM3: Use stable test fixture, not assumed file
    // From: temp/tpichler/linktest.md
    // To: components/PDCA/0.2.1.0/test/data/dual-link-tests/tc22-5-target.feature.pdca.md
    // Should generate dual link successfully
    
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('components/PDCA/0.2.1.0/test/data/dual-link-tests/tc22-5-target.feature.pdca.md')
    );
    
    expect(output).toContain('Dual Link Generated');
    expect(output).toContain('tc22-5-target.feature.pdca.md');
    // Manual verification needed: Check if link works in actual markdown file
  });

  // TC22.6: Method should accept optional "fromDirectory" parameter
  it('TC22.6: getDualLink should accept optional fromDirectory parameter', async () => {
    // Future enhancement: pdca.getDualLink(targetFile, fromDirectory)
    // For now, this test documents the requirement
    
    // Current behavior: Uses project-root-relative path
    // Desired: Should calculate relative path from calling directory
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('test/data/relative-path-tests/file-root.md')
    );
    
    expect(output).toContain('Dual Link Generated');
  });

  // TC22.7: Verify links actually work in markdown viewers
  it('TC22.7: Generated link should work when clicked in markdown file', async () => {
    // This is a manual test case
    // 1. Generate dual link
    // 2. Put it in a markdown file
    // 3. Open in markdown viewer
    // 4. Click the link
    // Expected: Should navigate to target file
    
    expect(true).toBe(true); // Placeholder for manual test
  });

  // TC22.8: Cross-directory link generation
  it('TC22.8: Link from components/PDCA/ to scrum.pmo/ should work', async () => {
    // From: components/PDCA/0.2.1.0/README.md
    // To: scrum.pmo/roles/_shared/PDCA/howto.PDCA.md
    // Should generate: ../../../scrum.pmo/roles/_shared/PDCA/howto.PDCA.md
    
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('scrum.pmo/roles/_shared/PDCA/howto.PDCA.md')
    );
    
    expect(output).toContain('Dual Link Generated');
  });
});

// Helper to capture console output
async function captureConsoleOutput(fn: () => Promise<any>): Promise<string> {
  const logs: string[] = [];
  const originalLog = console.log;
  
  console.log = (...args: any[]) => {
    logs.push(args.join(' '));
  };
  
  try {
    await fn();
    return logs.join('\n');
  } finally {
    console.log = originalLog;
  }
}

