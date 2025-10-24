/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
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
 * Helper function to clean up test data content
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

describe('🔄 Lifecycle Methods Tests', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    await cleanupTestDataContent(testDataDir);
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
    await web4ts.initProject();
  });

  afterEach(async () => {
    await cleanupTestDataContent(testDataDir);
  });

  describe('▶️ start() Method', () => {
    it('should REQUIRE context (throws without context)', async () => {
      // Act & Assert
      await expect(web4ts.start()).rejects.toThrow('No component context loaded');
    });

    it('should provide helpful error message when context missing', async () => {
      // Act & Assert
      await expect(web4ts.start()).rejects.toThrow('Use "on <component> <version>" first');
    });

    it.skip('should work WITH context (starts target component)', async () => {
      // Complex npm integration - requires full ecosystem
      await web4ts.create('StartTestComponent', '0.1.0.0');
      await web4ts.on('StartTestComponent', '0.1.0.0');
      await expect(web4ts.start()).resolves.not.toThrow();
    });

    it.skip('should return this for chaining WITH context - npm integration', async () => {
      await web4ts.create('ChainTest', '0.1.0.0');
      await web4ts.on('ChainTest', '0.1.0.0');
      const result = await web4ts.start();
      expect(result).toBe(web4ts);
    });

    it.skip('should execute start.sh script when available - npm integration', async () => {
      await web4ts.create('ScriptTest', '0.1.0.0');
      await web4ts.on('ScriptTest', '0.1.0.0');
      await web4ts.start();
      expect(true).toBe(true);
    });

    it.skip('should handle components without start script gracefully - npm integration', async () => {
      await web4ts.create('NoScriptTest', '0.1.0.0');
      await web4ts.on('NoScriptTest', '0.1.0.0');
      await expect(web4ts.start()).resolves.not.toThrow();
    });

    it.skip('should support method chaining pattern - npm integration', async () => {
      await web4ts.create('ChainPattern', '0.1.0.0');
      const result = await web4ts.on('ChainPattern', '0.1.0.0');
      await result.start();
      expect(result).toBe(web4ts);
    });

    it.skip('should execute npm start for target component', async () => {
      // Complex integration test - skip for now
      await web4ts.create('DualTest', '0.1.0.0');
      await web4ts.on('DualTest', '0.1.0.0');
      await web4ts.start();
      expect(true).toBe(true);
    });
  });

  describe('🧹 clean() Method', () => {
    it('should REQUIRE context (throws without context)', async () => {
      // Act & Assert
      await expect(web4ts.clean()).rejects.toThrow('No component context loaded');
    });

    it('should provide helpful error message when context missing', async () => {
      // Act & Assert
      await expect(web4ts.clean()).rejects.toThrow('Use "on <component> <version>" first');
    });

    it.skip('should work WITH context (cleans target component)', async () => {
      // Arrange
      await web4ts.create('CleanTestComponent', '0.1.0.0');
      await web4ts.on('CleanTestComponent', '0.1.0.0');
      
      // Build first to create artifacts
      await web4ts.build();
      
      const componentPath = path.join(testDataDir, 'components', 'CleanTestComponent', '0.1.0.0');
      const distPath = path.join(componentPath, 'dist');
      
      // Verify dist exists after build
      expect(existsSync(distPath)).toBe(true);
      
      // Act
      await web4ts.clean();
      
      // Assert: dist should be removed
      expect(existsSync(distPath)).toBe(false);
    });

    it('should return this for chaining WITH context', async () => {
      // Arrange
      await web4ts.create('ChainCleanTest', '0.1.0.0');
      await web4ts.on('ChainCleanTest', '0.1.0.0');
      
      // Act
      const result = await web4ts.clean();
      
      // Assert
      expect(result).toBe(web4ts);
    });

    it.skip('should remove dist directory when present', async () => {
      // Arrange
      await web4ts.create('DistTest', '0.1.0.0');
      await web4ts.on('DistTest', '0.1.0.0');
      
      // Build to create dist
      await web4ts.build();
      
      const componentPath = path.join(testDataDir, 'components', 'DistTest', '0.1.0.0');
      const distPath = path.join(componentPath, 'dist');
      
      expect(existsSync(distPath)).toBe(true);
      
      // Act
      await web4ts.clean();
      
      // Assert
      expect(existsSync(distPath)).toBe(false);
    });

    it('should handle components without dist directory gracefully', async () => {
      // Arrange
      await web4ts.create('NoDistTest', '0.1.0.0');
      await web4ts.on('NoDistTest', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'NoDistTest', '0.1.0.0');
      const distPath = path.join(componentPath, 'dist');
      
      // Ensure no dist directory
      expect(existsSync(distPath)).toBe(false);
      
      // Act & Assert: Should handle gracefully
      await expect(web4ts.clean()).resolves.not.toThrow();
    });

    it.skip('should support method chaining pattern', async () => {
      // Arrange
      await web4ts.create('ChainClean', '0.1.0.0');
      
      // Act: Chain operations
      const result = await web4ts.on('ChainClean', '0.1.0.0');
      await result.build();
      await result.clean();
      
      // Assert
      expect(result).toBe(web4ts);
    });

    it.skip('should work for build-clean-build cycle', async () => {
      // Arrange
      await web4ts.create('CycleTest', '0.1.0.0');
      await web4ts.on('CycleTest', '0.1.0.0');
      
      const componentPath = path.join(testDataDir, 'components', 'CycleTest', '0.1.0.0');
      const distPath = path.join(componentPath, 'dist');
      
      // Build → Clean → Build cycle
      await web4ts.build();
      expect(existsSync(distPath)).toBe(true);
      
      await web4ts.clean();
      expect(existsSync(distPath)).toBe(false);
      
      await web4ts.build();
      expect(existsSync(distPath)).toBe(true);
      
      // Assert: Full cycle works
      expect(true).toBe(true);
    });
  });
});
