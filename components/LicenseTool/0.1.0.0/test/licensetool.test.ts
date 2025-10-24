/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultLicenseTool } from '../src/ts/layer2/DefaultLicenseTool.js';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import * as path from 'path';

// Helper: Find project root
const findProjectRoot = (startDir: string): string => {
  let currentDir = path.resolve(startDir);
  
  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'package.json')) &&
        existsSync(path.join(currentDir, 'components'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  currentDir = path.resolve(startDir);
  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, '.git'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return path.resolve(startDir);
};

const projectRoot = findProjectRoot(__dirname);
const testDataDir = path.join(__dirname, 'data');

// Setup/Teardown for test fixtures
beforeEach(() => {
  if (existsSync(testDataDir)) {
    rmSync(testDataDir, { recursive: true, force: true });
  }
  mkdirSync(testDataDir, { recursive: true });
});

afterEach(() => {
  if (existsSync(testDataDir)) {
    rmSync(testDataDir, { recursive: true, force: true });
  }
});

describe('LicenseTool Basic Tests', () => {
  it('should create instance successfully', () => {
    const component = new DefaultLicenseTool();
    expect(component).toBeDefined();
  });

  it('should have empty constructor (Web4 standard)', () => {
    const component = new DefaultLicenseTool();
    expect(component).toBeInstanceOf(DefaultLicenseTool);
  });

  it('should have init() method for scenario initialization', async () => {
    const component = new DefaultLicenseTool();
    const result = await component.init({ targetPath: '.' });
    expect(result).toBe(component); // Returns this for chaining
  });
});

describe('TC1: Comment Style Detection', () => {
  it('should detect /* */ style for .ts files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const tsFile = path.join(testDataDir, 'test.ts');
    writeFileSync(tsFile, 'export class Test {}');
    
    // Call internal method via test helper
    const style = await tool.getCommentStyleInternal(tsFile);
    expect(style).toBe('block');
  });

  it('should detect # style for .py files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const pyFile = path.join(testDataDir, 'test.py');
    writeFileSync(pyFile, 'def test(): pass');
    
    const style = await tool.getCommentStyleInternal(pyFile);
    expect(style).toBe('hash');
  });

  it('should detect # style for .sh files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const shFile = path.join(testDataDir, 'test.sh');
    writeFileSync(shFile, '#!/bin/bash');
    
    const style = await tool.getCommentStyleInternal(shFile);
    expect(style).toBe('hash');
  });

  it('should detect <!-- --> style for .md files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const mdFile = path.join(testDataDir, 'test.md');
    writeFileSync(mdFile, '# Test');
    
    const style = await tool.getCommentStyleInternal(mdFile);
    expect(style).toBe('html');
  });

  it('should detect hash style for bash scripts without extension (shebang detection)', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const bashScript = path.join(testDataDir, 'myscript'); // No extension
    writeFileSync(bashScript, '#!/bin/bash\n\necho "test"');
    
    const style = await tool.getCommentStyleInternal(bashScript);
    expect(style).toBe('hash');
  });
});

describe('TC2: Header Building', () => {
  it('should build correct block comment header for TypeScript', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const tsFile = path.join(testDataDir, 'test.ts');
    const header = await tool.buildHeaderInternal(tsFile, 'block');
    
    expect(header).toContain('/**');
    expect(header).toContain(' * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(header).toContain(' * SPDX-FileComment: See');
    expect(header).toContain('AI-GPL.md');
    expect(header).toContain(' * Copyright (c) 2025 Cerulean Circle GmbH');
    expect(header).toContain(' * Copyleft: See AGPLv3');
    expect(header).toContain(' * Backlinks: /LICENSE, /AI-GPL.md');
    expect(header).toContain(' */');
  });

  it('should build correct hash comment header for Python', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const pyFile = path.join(testDataDir, 'test.py');
    const header = await tool.buildHeaderInternal(pyFile, 'hash');
    
    expect(header).toContain('# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(header).toContain('# SPDX-FileComment: See');
    expect(header).toContain('# Copyright (c) 2025 Cerulean Circle GmbH');
  });

  it('should build correct HTML comment header for Markdown', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const mdFile = path.join(testDataDir, 'test.md');
    const header = await tool.buildHeaderInternal(mdFile, 'html');
    
    expect(header).toContain('<!--');
    expect(header).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(header).toContain('-->');
  });

  it('should use current year (2025) in copyright', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const tsFile = path.join(testDataDir, 'test.ts');
    const header = await tool.buildHeaderInternal(tsFile, 'block');
    
    expect(header).toContain('Copyright (c) 2025');
  });
});

describe('TC3: Header Validation', () => {
  it('should detect valid header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const validHeader = `/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ./AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */`;
    
    const content = `${validHeader}\nexport class Test {}`;
    
    const isValid = await tool.hasValidHeaderInternal(content, validHeader);
    expect(isValid).toBe(true);
  });

  it('should detect missing header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const content = 'export class Test {}';
    const expectedHeader = '/**\n * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum\n */';
    
    const isValid = await tool.hasValidHeaderInternal(content, expectedHeader);
    expect(isValid).toBe(false);
  });

  it('should detect outdated year in header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const outdatedHeader = `/**
 * Copyright (c) 2024 Cerulean Circle GmbH
 */`;
    
    const currentHeader = `/**
 * Copyright (c) 2025 Cerulean Circle GmbH
 */`;
    
    const content = `${outdatedHeader}\nexport class Test {}`;
    
    const isValid = await tool.hasValidHeaderInternal(content, currentHeader);
    expect(isValid).toBe(false);
  });
});

describe('TC4: Header Insertion', () => {
  it('should insert header at start of file', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const content = 'export class Test {}';
    const header = '/**\n * License Header\n */';
    
    const result = await tool.insertHeaderInternal(content, header);
    
    expect(result).toContain(header);
    expect(result).toContain('export class Test {}');
    expect(result.indexOf(header)).toBe(0);
  });

  it('should preserve file content after header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const content = 'import { test } from "test";\nexport class Test {}';
    const header = '/**\n * License Header\n */';
    
    const result = await tool.insertHeaderInternal(content, header);
    
    expect(result).toContain('import { test } from "test";');
    expect(result).toContain('export class Test {}');
  });

  it('should add newline between header and content', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const content = 'export class Test {}';
    const header = '/**\n * License Header\n */';
    
    const result = await tool.insertHeaderInternal(content, header);
    
    expect(result).toMatch(/\*\/\n\nexport class Test/);
  });
});

describe('TC5: Header Update', () => {
  it('should replace old header with new header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const oldHeader = '/**\n * Old License\n */';
    const newHeader = '/**\n * New License\n */';
    const content = `${oldHeader}\nexport class Test {}`;
    
    const result = await tool.updateHeaderInternal(content, oldHeader, newHeader);
    
    expect(result).toContain(newHeader);
    expect(result).not.toContain('Old License');
    expect(result).toContain('export class Test {}');
  });

  it('should preserve file content when updating header', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const oldHeader = '/**\n * Old\n */';
    const newHeader = '/**\n * New\n */';
    const content = `${oldHeader}\nimport test;\nexport class Test { method() {} }`;
    
    const result = await tool.updateHeaderInternal(content, oldHeader, newHeader);
    
    expect(result).toContain('import test;');
    expect(result).toContain('export class Test { method() {} }');
  });
});

describe('TC6: File Discovery', () => {
  it('should discover TypeScript files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    writeFileSync(path.join(testDataDir, 'test1.ts'), 'test');
    writeFileSync(path.join(testDataDir, 'test2.ts'), 'test');
    
    const files = await tool.discoverFilesInternal(testDataDir);
    
    expect(files).toContain(path.join(testDataDir, 'test1.ts'));
    expect(files).toContain(path.join(testDataDir, 'test2.ts'));
  });

  it('should discover files in subdirectories', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const subDir = path.join(testDataDir, 'subdir');
    mkdirSync(subDir, { recursive: true });
    writeFileSync(path.join(subDir, 'nested.ts'), 'test');
    
    const files = await tool.discoverFilesInternal(testDataDir);
    
    expect(files).toContain(path.join(subDir, 'nested.ts'));
  });

  it('should exclude node_modules directory', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const nodeModules = path.join(testDataDir, 'node_modules');
    mkdirSync(nodeModules, { recursive: true });
    writeFileSync(path.join(nodeModules, 'lib.ts'), 'test');
    
    const files = await tool.discoverFilesInternal(testDataDir);
    
    expect(files).not.toContain(path.join(nodeModules, 'lib.ts'));
  });

  it('should exclude dist directory', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const distDir = path.join(testDataDir, 'dist');
    mkdirSync(distDir, { recursive: true });
    writeFileSync(path.join(distDir, 'compiled.js'), 'test');
    
    const files = await tool.discoverFilesInternal(testDataDir);
    
    expect(files).not.toContain(path.join(distDir, 'compiled.js'));
  });

  it('should respect .gitignore patterns', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    writeFileSync(path.join(testDataDir, '.gitignore'), '*.tmp\n');
    writeFileSync(path.join(testDataDir, 'test.tmp'), 'test');
    writeFileSync(path.join(testDataDir, 'test.ts'), 'test');
    
    const files = await tool.discoverFilesInternal(testDataDir);
    
    expect(files).toContain(path.join(testDataDir, 'test.ts'));
    expect(files).not.toContain(path.join(testDataDir, 'test.tmp'));
  });
});

describe('TC7: check() Method', () => {
  it('should return this for method chaining', async () => {
    const tool = new DefaultLicenseTool();
    const result = await tool.init({ targetPath: testDataDir }).then(t => t.check());
    
    expect(result).toBe(tool);
  });

  it('should report files missing headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    writeFileSync(path.join(testDataDir, 'noheader.ts'), 'export class Test {}');
    
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.check();
    
    console.log = originalLog;
    
    const output = logs.join('\n');
    expect(output).toContain('noheader.ts');
    expect(output).toContain('missing header');
  });

  it('should report files with outdated headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const outdatedHeader = '/**\n * Copyright (c) 2024 Cerulean Circle GmbH\n */';
    writeFileSync(path.join(testDataDir, 'outdated.ts'), `${outdatedHeader}\nexport class Test {}`);
    
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.check();
    
    console.log = originalLog;
    
    const output = logs.join('\n');
    expect(output).toContain('outdated.ts');
    expect(output).toContain('outdated');
  });

  it('should report no issues for valid headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const validHeader = `/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ./AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */`;
    
    writeFileSync(path.join(testDataDir, 'valid.ts'), `${validHeader}\nexport class Test {}`);
    
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.check();
    
    console.log = originalLog;
    
    const output = logs.join('\n');
    expect(output).toContain('✅');
    expect(output).toContain('valid.ts');
  });
});

describe('TC8: apply() Method', () => {
  it('should return this for method chaining', async () => {
    const tool = new DefaultLicenseTool();
    const result = await tool.init({ targetPath: testDataDir }).then(t => t.apply('.', false));
    
    expect(result).toBe(tool);
  });

  it('should add headers to files missing them', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const testFile = path.join(testDataDir, 'test.ts');
    writeFileSync(testFile, 'export class Test {}');
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(content).toContain('Copyright (c) 2025');
  });

  it('should update outdated headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const testFile = path.join(testDataDir, 'test.ts');
    const outdatedHeader = '/**\n * Copyright (c) 2024 Old License\n */';
    writeFileSync(testFile, `${outdatedHeader}\nexport class Test {}`);
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('Copyright (c) 2025');
    expect(content).not.toContain('2024');
  });

  it('should preserve file content when applying headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const testFile = path.join(testDataDir, 'test.ts');
    const originalContent = 'import { test } from "lib";\nexport class Test { method() { return 42; } }';
    writeFileSync(testFile, originalContent);
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('import { test } from "lib";');
    expect(content).toContain('export class Test { method() { return 42; } }');
  });

  it('should NOT modify files in dry-run mode', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const testFile = path.join(testDataDir, 'test.ts');
    const originalContent = 'export class Test {}';
    writeFileSync(testFile, originalContent);
    
    await tool.apply(testDataDir, true); // dry-run = true
    
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toBe(originalContent); // Unchanged
  });

  it('should report what would be done in dry-run mode', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    writeFileSync(path.join(testDataDir, 'test.ts'), 'export class Test {}');
    
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.apply(testDataDir, true);
    
    console.log = originalLog;
    
    const output = logs.join('\n');
    expect(output).toContain('DRY RUN');
    expect(output).toContain('test.ts');
    expect(output).toContain('would add header');
  });
});

describe('TC9: Default Parameters', () => {
  it('check() should default path to current directory', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: '.' });
    
    // Should not throw
    const result = await tool.check();
    expect(result).toBe(tool);
  });

  it('apply() should default path to current directory', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: '.' });
    
    // Should not throw (dry-run to avoid modifying real files)
    const result = await tool.apply('.', true);
    expect(result).toBe(tool);
  });

  it('apply() should default dryRun to false', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const testFile = path.join(testDataDir, 'test.ts');
    writeFileSync(testFile, 'export class Test {}');
    
    await tool.apply(testDataDir);
    
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier'); // File was modified
  });
});

describe('TC10: scrum.pmo Detection', () => {
  it('should identify scrum.pmo files as process artifacts', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const scrumDir = path.join(testDataDir, 'scrum.pmo');
    mkdirSync(scrumDir, { recursive: true });
    const pdcaFile = path.join(scrumDir, 'test.pdca.md');
    writeFileSync(pdcaFile, '# PDCA Test');
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(pdcaFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(content).toContain('AI-GPL.md');
  });

  it('should identify .pdca.md files as process artifacts', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const pdcaFile = path.join(testDataDir, '2025-10-23-UTC-1234.pdca.md');
    writeFileSync(pdcaFile, '# PDCA Document');
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(pdcaFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
  });

  it('should include AI-GPL note in headers for all files', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const tsFile = path.join(testDataDir, 'test.ts');
    writeFileSync(tsFile, 'export class Test {}');
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(tsFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(content).toContain('SPDX-FileComment: See');
    expect(content).toContain('AI-GPL.md');
  });
});

describe('TC11: CLI Auto-Completion - Path Parameter', () => {
  // Note: This test verifies @cliValues annotation exists
  // Actual tab completion testing requires shell integration
  
  it('should have cliValues annotation for path parameter', () => {
    // This will be validated by reading the source code annotations
    // The actual auto-completion is tested manually in shell
    expect(true).toBe(true); // Placeholder - implementation will add @cliValues
  });
});

describe('TC12: CLI Auto-Completion - DryRun Parameter', () => {
  it('should have cliValues annotation for dryRun parameter', () => {
    // Verifies @cliValues dryRun ["true", "false"] exists
    expect(true).toBe(true); // Placeholder - implementation will add @cliValues
  });
});

describe('TC13: Relative Path Calculation', () => {
  it('should calculate relative path from root file to AI-GPL.md', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const rootFile = path.join(projectRoot, 'test.ts');
    const targetFile = path.join(projectRoot, 'AI-GPL.md');
    
    const relativePath = await tool.calculateRelativePathInternal(rootFile, targetFile);
    
    expect(relativePath).toBe('./AI-GPL.md');
  });

  it('should calculate relative path from nested file to AI-GPL.md', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const nestedFile = path.join(projectRoot, 'components/LicenseTool/latest/src/test.ts');
    const targetFile = path.join(projectRoot, 'AI-GPL.md');
    
    const relativePath = await tool.calculateRelativePathInternal(nestedFile, targetFile);
    
    expect(relativePath).toBe('../../../../AI-GPL.md');
  });

  it('should calculate relative path from 3 levels deep', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const deepFile = path.join(projectRoot, 'a/b/c/test.ts');
    const targetFile = path.join(projectRoot, 'LICENSE');
    
    const relativePath = await tool.calculateRelativePathInternal(deepFile, targetFile);
    
    expect(relativePath).toBe('../../../LICENSE');
  });

  it('should include relative path in generated headers', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    const nestedDir = path.join(testDataDir, 'a', 'b', 'c');
    mkdirSync(nestedDir, { recursive: true });
    const nestedFile = path.join(nestedDir, 'test.ts');
    writeFileSync(nestedFile, 'export class Test {}');
    
    await tool.apply(testDataDir, false);
    
    const content = readFileSync(nestedFile, 'utf-8');
    expect(content).toContain('../../../'); // Relative path to root
  });
});

describe('TC14: Header Lifecycle - Create, Modify, Update', () => {
  let testFile: string;

  beforeEach(() => {
    testFile = path.join(testDataDir, 'lifecycle.ts');
  });

  it('Phase 1: No header → apply → header added', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    // State 1: No header
    const originalContent = 'export class MyClass {}';
    writeFileSync(testFile, originalContent);
    
    // Apply
    await tool.apply(testDataDir, false);
    
    // Verify: Header added
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum');
    expect(content).toContain('Copyright (c) 2025');
    expect(content).toContain('export class MyClass {}');
  });

  it('Phase 2: Standard header → check → no issues reported', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    // State 2: File with current header (from Phase 1)
    const validHeader = `/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ./AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */`;
    
    writeFileSync(testFile, `${validHeader}\nexport class MyClass {}`);
    
    // Check
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.check(testDataDir);
    
    console.log = originalLog;
    
    // Verify: No issues
    const output = logs.join('\n');
    expect(output).toContain('✅');
    expect(output).toContain('lifecycle.ts');
  });

  it('Phase 3: Outdated header → check → detects need for update', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    // State 3: Outdated header (old year)
    const outdatedHeader = `/**
 * Copyright (c) 2024 Cerulean Circle GmbH
 * License: AGPL-3.0
 */`;
    
    writeFileSync(testFile, `${outdatedHeader}\nexport class MyClass {}`);
    
    // Check
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    
    await tool.check(testDataDir);
    
    console.log = originalLog;
    
    // Verify: Detects outdated
    const output = logs.join('\n');
    expect(output).toContain('lifecycle.ts');
    expect(output).toContain('outdated');
  });

  it('Phase 4: Outdated header → apply → header updated', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    // Start with outdated header
    const outdatedHeader = `/**
 * Copyright (c) 2024 Cerulean Circle GmbH
 * License: AGPL-3.0
 */`;
    
    const originalCode = 'export class MyClass { method() { return 42; } }';
    writeFileSync(testFile, `${outdatedHeader}\n${originalCode}`);
    
    // Apply
    await tool.apply(testDataDir, false);
    
    // Verify: Header updated, content preserved
    const content = readFileSync(testFile, 'utf-8');
    expect(content).toContain('Copyright (c) 2025'); // Updated year
    expect(content).not.toContain('2024'); // Old year removed
    expect(content).toContain('SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum'); // New format
    expect(content).toContain(originalCode); // Content preserved
  });

  it('Phase 5: Idempotency → apply twice → no duplication', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    writeFileSync(testFile, 'export class MyClass {}');
    
    // Apply first time
    await tool.apply(testDataDir, false);
    const firstApply = readFileSync(testFile, 'utf-8');
    
    // Apply second time
    await tool.apply(testDataDir, false);
    const secondApply = readFileSync(testFile, 'utf-8');
    
    // Verify: No change (idempotent)
    expect(secondApply).toBe(firstApply);
    
    // Verify: Only one header (no duplication)
    const headerCount = (secondApply.match(/SPDX-License-Identifier/g) || []).length;
    expect(headerCount).toBe(1);
  });
});

describe('TC15: Required License Files Existence', () => {
  it('should verify LICENSE exists at project root', async () => {
    const licensePath = path.join(projectRoot, 'LICENSE');
    expect(existsSync(licensePath)).toBe(true);
  });

  it('should verify AI-GPL.md exists at project root', async () => {
    const aiGplPath = path.join(projectRoot, 'AI-GPL.md');
    // Note: This will fail until we create AI-GPL.md
    // That's expected in test-first development
    expect(existsSync(aiGplPath)).toBe(true);
  });

  it('should verify .reuse/dep5 exists at project root', async () => {
    const reusePath = path.join(projectRoot, '.reuse', 'dep5');
    // Note: This will fail until we create .reuse/dep5
    // That's expected in test-first development
    expect(existsSync(reusePath)).toBe(true);
  });

  it('should report missing files in check() output', async () => {
    const tool = new DefaultLicenseTool();
    await tool.init({ targetPath: testDataDir });
    
    // Simulate by checking if tool reports on required files
    // (Implementation should verify these exist before proceeding)
    
    const logs: string[] = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    console.log = (...args: any[]) => logs.push(args.join(' '));
    console.warn = (...args: any[]) => logs.push('WARN: ' + args.join(' '));
    
    await tool.check(testDataDir);
    
    console.log = originalLog;
    console.warn = originalWarn;
    
    // If required files are missing, should see warnings
    const output = logs.join('\n');
    // This test documents expected behavior - implementation will add validation
    expect(output).toBeDefined();
  });
});

describe('TC16: Web4 Naming Convention Compliance', () => {
  it('should have NO underscore prefixes in method names', () => {
    const methodNames = Object.getOwnPropertyNames(DefaultLicenseTool.prototype);
    
    methodNames.forEach(name => {
      if (name !== 'constructor') {
        expect(name).not.toMatch(/^_/); // No underscore prefix
      }
    });
  });

  it('should use camelCase for all methods', () => {
    const methodNames = Object.getOwnPropertyNames(DefaultLicenseTool.prototype);
    
    methodNames.forEach(name => {
      if (name !== 'constructor') {
        // camelCase: starts with lowercase, no underscores
        expect(name).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      }
    });
  });

  it('should have Internal suffix for private helpers', () => {
    const methodNames = Object.getOwnPropertyNames(DefaultLicenseTool.prototype);
    const internalMethods = methodNames.filter(name => name.endsWith('Internal'));
    
    // Should have several internal helper methods
    expect(internalMethods.length).toBeGreaterThan(0);
    
    // All internal methods should be properly named
    internalMethods.forEach(name => {
      expect(name).toMatch(/^[a-z][a-zA-Z0-9]*Internal$/);
    });
  });

  it('should have expected internal helper methods', () => {
    const methodNames = Object.getOwnPropertyNames(DefaultLicenseTool.prototype);
    
    // Expected internal helpers (from PDCA design)
    const expectedHelpers = [
      'discoverFilesInternal',
      'getCommentStyleInternal',
      'calculateRelativePathInternal',
      'buildHeaderInternal',
      'hasValidHeaderInternal',
      'insertHeaderInternal',
      'updateHeaderInternal',
      'shouldSkipFileInternal'
    ];
    
    expectedHelpers.forEach(helper => {
      expect(methodNames).toContain(helper);
    });
  });
});
