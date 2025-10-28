/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
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
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('components/PDCA/0.2.1.0/package.json')
    );
    
    expect(output).toContain('Generating Dual Link');
    expect(output).toContain('components/PDCA/0.2.1.0/package.json');
    expect(output).toContain('[GitHub](');
    expect(output).toContain('[§/components/PDCA/0.2.1.0/package.json]');
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
    const absolutePath = join(projectRoot, 'components/PDCA/0.2.1.0/package.json');
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink(absolutePath)
    );
    
    expect(output).toContain('[§/components/PDCA/0.2.1.0/package.json]');
  });

  // TC4: getDualLink - § notation path normalization
  it('TC4: getDualLink should normalize § notation paths', async () => {
    const output = await captureConsoleOutput(() => 
      pdca.getDualLink('§/components/PDCA/0.2.1.0/package.json')
    );
    
    expect(output).toContain('[§/components/PDCA/0.2.1.0/package.json]');
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

  // TC19: fixDualLinks regression - Correct §/ display but wrong relative path
  // This test catches the bug where fixDualLinks failed to detect incorrect relative paths
  // when the display text (§/path) was correct but the actual relative path was wrong
  it('TC19: fixDualLinks should detect and fix incorrect relative paths with correct §/ display', async () => {
    // Create a PDCA in a subdirectory that links to a file in parent directory
    const subDir = join(testDataDir, 'session');
    await mkdir(subDir, { recursive: true });
    
    // Create target file in parent (testDataDir)
    const targetFile = join(testDataDir, 'target-in-parent.md');
    await writeFile(targetFile, '# Target File\n\nIn parent directory.');
    
    // Create PDCA in subdirectory with WRONG relative path (missing ../)
    const pdcaPath = join(subDir, 'test-wrong-relative.pdca.md');
    const wrongContent = `# Test PDCA with Wrong Relative Path

This link has correct §/ display but wrong relative path:
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/03150/components/PDCA/0.3.4.2/test/data/dual-link-tests/target-in-parent.md) | [§/components/PDCA/0.3.4.2/test/data/dual-link-tests/target-in-parent.md](target-in-parent.md)

It should be ../target-in-parent.md but says target-in-parent.md
`;
    
    await writeFile(pdcaPath, wrongContent);
    
    // Run fixDualLinks on this file using component-relative path
    const componentRelativePath = pdcaPath.replace(projectRoot + '/', '');
    const output = await captureConsoleOutput(() =>
      pdca.fixDualLinks(componentRelativePath)
    );
    
    // Should report that it fixed the link
    expect(output).toContain('Fixed') || expect(output).toContain('1 files');
    
    // Read the fixed file
    const fixedContent = await readFile(pdcaPath, 'utf-8');
    
    // Should now have the correct relative path with ../
    expect(fixedContent).toContain('](../target-in-parent.md)');
    expect(fixedContent).not.toMatch(/\]\(target-in-parent\.md\)(?!\))/); // Don't match the one in comment
    
    // Clean up
    await rm(subDir, { recursive: true, force: true });
    await rm(targetFile, { force: true });
  });

  // TC20: DRY verification - Check that code duplication was eliminated
  // This test verifies the DRY refactoring by checking source code patterns
  it('TC20: DRY refactoring should eliminate duplicated version/path logic', async () => {
    // Read the source file
    const sourceFile = join(projectRoot, 'components/PDCA/0.3.4.2/src/ts/layer2/DefaultPDCA.ts');
    const sourceContent = await readFile(sourceFile, 'utf-8');
    
    // Check that getWeb4TSComponent uses this.model.version (DRY pattern)
    expect(sourceContent).toContain('this.model.version'); // Should use model
    
    // Check that constructor discovers version from directory
    expect(sourceContent).toMatch(/new URL\(import\.meta\.url\)/); // Should use import.meta.url
    
    // Count occurrences of package.json reading patterns (should be 0 - version from model!)
    const packageJsonReads = (sourceContent.match(/readFileSync.*package\.json/g) || []).length;
    expect(packageJsonReads).toBe(0); // NO package.json reads needed!
    
    // CRITICAL: Check for CommonJS anti-pattern - MUST BE ZERO!
    const commonsJSUsage = (sourceContent.match(/__dirname|__filename/g) || []).length;
    
    // Report metrics BEFORE assertion
    console.log('📊 DRY Metrics:');
    console.log(`   - Version read from model: ${sourceContent.match(/this\.model\.version/g)?.length || 0} times`);
    console.log(`   - Package.json reads: ${packageJsonReads}`);
    console.log(`   - CommonJS usage (__dirname/__filename): ${commonsJSUsage}`);
    
    // FAIL if CommonJS patterns found
    if (commonsJSUsage > 0) {
      console.log('');
      console.log('❌ TECHNICAL DEBT VIOLATIONS:');
      console.log(`   - Found ${commonsJSUsage} uses of CommonJS __dirname/__filename`);
      console.log('   - ESM requires: new URL(import.meta.url).pathname');
      console.log('   - Fix: Update component generation template in Web4TSComponent');
      console.log('   - NO EXCEPTIONS - This MUST be 0!');
    }
    
    // Hard assertion - NO CommonJS allowed!
    expect(commonsJSUsage).toBe(0); // ESM only! No CommonJS __dirname/__filename
    
    // Verify the pattern: version should come from this.model.version, not repeated calculations
    const modelVersionUses = (sourceContent.match(/this\.model\.version/g) || []).length;
    expect(modelVersionUses).toBeGreaterThan(1); // Should be used in multiple places (DRY win)
    
    // Check for anti-pattern: hardcoded versions should not exist
    expect(sourceContent).not.toMatch(/version:\s*['"]0\.3\.4\.1['"]/); // Old hardcoded version
    
    console.log('');
    console.log('✅ DRY verification PASSED - Code is clean!');
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

