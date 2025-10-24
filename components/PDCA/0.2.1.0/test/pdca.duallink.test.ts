/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import { existsSync } from 'fs';
import { readFile, writeFile, mkdir, rm } from 'fs/promises';
import { execSync } from 'child_process';
import { join } from 'path';

describe('PDCA Dual Link Functionality', () => {
  let pdca: DefaultPDCA;
  const testDataDir = join(process.cwd(), 'test', 'data', 'dual-link-tests');
  const projectRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();

  beforeAll(async () => {
    pdca = new DefaultPDCA();
    
    // Create test data directory
    await mkdir(testDataDir, { recursive: true });
    
    // Create test PDCAs with various link formats (TC26)
    const testPDCAs = [
      {
        name: 'valid-link.pdca.md',
        content: `# Test PDCA with Valid Link

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/target-file.md) | [§/test/data/target-file.md](test/data/target-file.md)
`
      },
      {
        name: 'outdated-branch.pdca.md',
        content: `# Test PDCA with Outdated Branch

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/old-branch/test/data/target-file.md) | [§/test/data/target-file.md](test/data/target-file.md)
`
      },
      {
        name: 'wrong-github-path.pdca.md',
        content: `# Test PDCA with Wrong GitHub Path

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/old/path/target-file.md) | [§/test/data/target-file.md](test/data/target-file.md)
`
      },
      {
        name: 'missing-section-notation.pdca.md',
        content: `# Test PDCA Missing § Notation

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/target-file.md) | [test/data/target-file.md](test/data/target-file.md)
`
      },
      {
        name: 'absolute-path.pdca.md',
        content: `# Test PDCA with Absolute Path

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/target-file.md) | [§/test/data/target-file.md](/full/absolute/path/target-file.md)
`
      },
      {
        name: 'different-file.pdca.md',
        content: `# Test PDCA Linking to Different File

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/other-file.md) | [§/test/data/other-file.md](test/data/other-file.md)
`
      },
      {
        name: 'multiple-links.pdca.md',
        content: `# Test PDCA with Multiple Links

First link: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/target-file.md) | [§/test/data/target-file.md](test/data/target-file.md)

Second link: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/old/test/data/target-file.md) | [§/test/data/target-file.md](test/data/target-file.md)
`
      }
    ];

    for (const testPDCA of testPDCAs) {
      await writeFile(join(testDataDir, testPDCA.name), testPDCA.content);
    }

    // Create target test file
    await writeFile(join(testDataDir, 'target-file.md'), '# Test Target File\n\nThis is a test file.');
    await writeFile(join(testDataDir, 'other-file.md'), '# Other Test File\n\nThis is a different file.');
  });

  afterAll(async () => {
    // Cleanup is handled by vitest.config.ts exclusion - test/data/ is not cleaned
  });

  // TC1: getDualLink - File exists and is pushed
  it('TC1: getDualLink should generate dual link for existing pushed file', async () => {
    // CMM3: Use stable test fixture, not assumed file
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md')
    );
    
    expect(output).toContain('Generating Dual Link');
    expect(output).toContain('components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md');
    expect(output).toContain('[GitHub](');
    expect(output).toContain('[§/components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md]');
  });

  // TC2: getDualLink - File does not exist
  it('TC2: getDualLink should report error for non-existent file', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('non-existent-file.md')
    );
    
    expect(output).toContain('Error');
    expect(output).toContain('does not exist');
  });

  // TC3: getDualLink - Absolute path normalization
  it('TC3: getDualLink should normalize absolute paths', async () => {
    // CMM3: Use stable test fixture with absolute path
    const absolutePath = join(projectRoot, 'components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md');
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink(absolutePath)
    );
    
    expect(output).toContain('[§/components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md]');
  });

  // TC4: getDualLink - § notation path normalization
  it('TC4: getDualLink should normalize § notation paths', async () => {
    // CMM3: Use stable test fixture with § notation
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('§/components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md')
    );
    
    expect(output).toContain('[§/components/PDCA/0.2.1.0/test/data/dual-link-tests/stable-target.md]');
  });

  // TC11: findPDCAsLinking - Find PDCAs with valid links
  it('TC11: findPDCAsLinking should find PDCAs linking to target file', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.findPDCAsLinking('test/data/dual-link-tests/target-file.md')
    );
    
    expect(output).toContain('Finding PDCAs');
    expect(output).toContain('Scanning');
    expect(output).toContain('PDCA');
  });

  // TC12: findPDCAsLinking - No PDCAs found
  it('TC12: findPDCAsLinking should report when no PDCAs link to file', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.findPDCAsLinking('test/data/dual-link-tests/no-links-to-this.md')
    );
    
    expect(output).toContain('No PDCAs found');
  });

  // TC14: ensureValidLinks - All links already valid
  it('TC14: ensureValidLinks should report when all links are valid', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.ensureValidLinks('components/PDCA/0.2.1.0/package.json', 'true')
    );
    
    expect(output).toContain('Ensuring Valid Dual Links');
    expect(output).toContain('DRY RUN');
    expect(output).toContain('Summary');
  });

  // TC15: ensureValidLinks - Dry run mode
  it('TC15: ensureValidLinks dry-run should not modify files', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.ensureValidLinks('test/data/dual-link-tests/target-file.md', 'true')
    );
    
    expect(output).toContain('DRY RUN MODE');
    expect(output).toContain('No changes will be made');
  });

  // TC16: ensureValidLinks - File does not exist
  it('TC16: ensureValidLinks should report error for non-existent file', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.ensureValidLinks('non-existent-file.md', 'true')
    );
    
    expect(output).toContain('Error');
    expect(output).toContain('does not exist');
  });

  // TC18: CLI Auto-completion - filePathParameterCompletion
  it('TC18: filePathParameterCompletion should return file suggestions', async () => {
    const results = await pdca.filePathParameterCompletion(['getDualLink', 'components/']);
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  // TC19: findPDCAsLinking - Scans all .md files (not just .pdca.md)
  it('TC19: findPDCAsLinking should scan all .md files including non-PDCA markdown', async () => {
    // Create a regular .md file (not .pdca.md) with a dual link
    const regularMdPath = join(testDataDir, 'regular-markdown.md');
    const regularMdContent = `# Regular Markdown File

This is not a PDCA file but should still be scanned.

**Dual Link:**
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/dual-link-tests/target-file.md) | [§/test/data/dual-link-tests/target-file.md](test/data/dual-link-tests/target-file.md)
`;
    await writeFile(regularMdPath, regularMdContent);
    
    const output = await captureConsoleOutput(() => 
      pdca.findPDCAsLinking('test/data/dual-link-tests/target-file.md')
    );
    
    expect(output).toContain('Scanning');
    expect(output).toContain('markdown files');
    // Should find the regular .md file we just created
    expect(output).toContain('regular-markdown.md');
  });

  // TC20: updateLinksToFile - Updates links in all .md files
  it('TC20: updateLinksToFile should update links in all .md files (dry-run)', async () => {
    // Create a regular .md file with a link that needs updating
    const regularMdPath = join(testDataDir, 'needs-update.md');
    const regularMdContent = `# File with Outdated Link

[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/test/data/old-path.md) | [§/test/data/old-path.md](test/data/old-path.md)
`;
    await writeFile(regularMdPath, regularMdContent);
    
    const output = await captureConsoleOutput(() => 
      pdca.updateLinksToFile('test/data/old-path.md', 'test/data/new-path.md', 'true')
    );
    
    expect(output).toContain('DRY RUN');
    expect(output).toContain('Would update');
    expect(output).toContain('needs-update.md');
  });

  // TC21: ensureValidLinks - Validates links in all .md files
  it('TC21: ensureValidLinks should validate links across all .md files', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.ensureValidLinks('components/PDCA/0.2.1.0/package.json', 'true')
    );
    
    expect(output).toContain('Scanning');
    expect(output).toContain('markdown files');
    expect(output).toContain('Summary');
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

