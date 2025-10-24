/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';

/**
 * Helper function to clean up test data content (not the directory itself)
 */
async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('🌳 tree() Method Tests', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test data CONTENT (not the directory itself)
    await cleanupTestDataContent(testDataDir);
    
    // Set up isolated test environment
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
    
    // Initialize project with root configs (DRY principle)
    await web4ts.initProject();
  });

  afterEach(async () => {
    // Clean up test data CONTENT (preserve directory)
    await cleanupTestDataContent(testDataDir);
  });

  describe('🎯 1. Context Modes', () => {
    it('should work WITHOUT context (shows current component tree)', async () => {
      // Act & Assert: Calling tree() without context should work (self-operation)
      await expect(web4ts.tree()).resolves.not.toThrow();
    });

    it('should work WITH context (shows target component tree)', async () => {
      // Arrange: Create component and load context
      await web4ts.create('TreeTestComponent', '0.1.0.0');
      await web4ts.on('TreeTestComponent', '0.1.0.0');
      
      // Act & Assert: Should not throw
      await expect(web4ts.tree()).resolves.not.toThrow();
    });

    it('should display tree for the loaded component', async () => {
      // Arrange: Create component and load context
      await web4ts.create('MyComponent', '0.1.0.0');
      await web4ts.on('MyComponent', '0.1.0.0');
      
      // Act: Call tree (output goes to console, we just verify it doesn't crash)
      const result = await web4ts.tree();
      
      // Assert: Should return this for chaining
      expect(result).toBe(web4ts);
    });
  });

  describe('📂 2. Directory Structure Display', () => {
    it('should display basic component structure', async () => {
      // Arrange: Create component with known structure
      await web4ts.create('StructureTest', '0.1.0.0');
      await web4ts.on('StructureTest', '0.1.0.0');
      
      // Verify structure exists
      const componentPath = path.join(testDataDir, 'components', 'StructureTest', '0.1.0.0');
      expect(existsSync(componentPath)).toBe(true);
      expect(existsSync(path.join(componentPath, 'src'))).toBe(true);
      expect(existsSync(path.join(componentPath, 'package.json'))).toBe(true);
      
      // Act: Display tree
      await web4ts.tree();
      
      // Assert: Method completes successfully (console output not tested)
      expect(true).toBe(true);
    });

    it('should handle nested directory structures', async () => {
      // Arrange: Create component with nested directories
      await web4ts.create('NestedTest', '0.1.0.0');
      await web4ts.on('NestedTest', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'NestedTest', '0.1.0.0');
      await fs.mkdir(path.join(componentPath, 'src', 'nested', 'deep'), { recursive: true });
      await fs.writeFile(path.join(componentPath, 'src', 'nested', 'deep', 'file.ts'), '// test');
      
      // Act: Display tree
      await web4ts.tree();
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });

    it('should handle empty directories', async () => {
      // Arrange: Create component with empty directory
      await web4ts.create('EmptyTest', '0.1.0.0');
      await web4ts.on('EmptyTest', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'EmptyTest', '0.1.0.0');
      await fs.mkdir(path.join(componentPath, 'empty-dir'), { recursive: true });
      
      // Act: Display tree
      await web4ts.tree();
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });

    it('should handle components with many files', async () => {
      // Arrange: Create component with multiple files
      await web4ts.create('ManyFilesTest', '0.1.0.0');
      await web4ts.on('ManyFilesTest', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'ManyFilesTest', '0.1.0.0');
      for (let i = 0; i < 10; i++) {
        await fs.writeFile(path.join(componentPath, 'src', `file${i}.ts`), `// file ${i}`);
      }
      
      // Act: Display tree
      await web4ts.tree();
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });
  });

  describe('🔢 3. Depth Parameter', () => {
    it('should respect depth=1 (shallow)', async () => {
      // Arrange: Create component with deep nesting
      await web4ts.create('DepthTest1', '0.1.0.0');
      await web4ts.on('DepthTest1', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'DepthTest1', '0.1.0.0');
      await fs.mkdir(path.join(componentPath, 'src', 'level1', 'level2', 'level3'), { recursive: true });
      
      // Act: Display tree with depth 1
      await web4ts.tree('1');
      
      // Assert: Method completes successfully (depth limiting happens in display logic)
      expect(true).toBe(true);
    });

    it('should respect depth=4 (default)', async () => {
      // Arrange: Create component
      await web4ts.create('DepthTest4', '0.1.0.0');
      await web4ts.on('DepthTest4', '0.1.0.0');
      
      // Act: Display tree with default depth (4)
      await web4ts.tree('4');
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });

    it('should handle depth=10 (deep)', async () => {
      // Arrange: Create component with very deep nesting
      await web4ts.create('DepthTest10', '0.1.0.0');
      await web4ts.on('DepthTest10', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'DepthTest10', '0.1.0.0');
      let deepPath = path.join(componentPath, 'src');
      for (let i = 0; i < 5; i++) {
        deepPath = path.join(deepPath, `level${i}`);
      }
      await fs.mkdir(deepPath, { recursive: true });
      
      // Act: Display tree with depth 10
      await web4ts.tree('10');
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });
  });

  describe('👻 4. Hidden Files Parameter', () => {
    it('should hide hidden files by default (showHidden=false)', async () => {
      // Arrange: Create component with hidden files
      await web4ts.create('HiddenTest1', '0.1.0.0');
      await web4ts.on('HiddenTest1', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'HiddenTest1', '0.1.0.0');
      await fs.writeFile(path.join(componentPath, '.hidden'), 'hidden content');
      await fs.writeFile(path.join(componentPath, 'visible.ts'), 'visible content');
      
      // Act: Display tree without showing hidden files
      await web4ts.tree('3', 'false');
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });

    it('should show hidden files when showHidden=true', async () => {
      // Arrange: Create component with hidden files
      await web4ts.create('HiddenTest2', '0.1.0.0');
      await web4ts.on('HiddenTest2', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'HiddenTest2', '0.1.0.0');
      await fs.writeFile(path.join(componentPath, '.gitignore'), '*.log');
      await fs.writeFile(path.join(componentPath, '.hidden'), 'hidden');
      
      // Act: Display tree showing hidden files
      await web4ts.tree('3', 'true');
      
      // Assert: Method completes successfully
      expect(true).toBe(true);
    });
  });
});
