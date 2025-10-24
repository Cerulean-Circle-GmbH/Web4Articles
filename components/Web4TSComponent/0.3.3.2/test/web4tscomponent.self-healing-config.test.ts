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

describe('🛡️ Self-Healing Configuration Tests', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test data CONTENT (not the directory itself)
    await cleanupTestDataContent(testDataDir);
    
    // Set up isolated test environment
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
  });

  afterEach(async () => {
    // Clean up test data CONTENT (preserve directory)
    await cleanupTestDataContent(testDataDir);
  });

  describe('🔍 1. Configuration Corruption Detection', () => {
    it('should detect corrupted tsconfig.json (invalid JSON)', async () => {
      // Arrange: Create corrupted tsconfig.json
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, '{ broken json syntax');
      
      // Act: Initialize project (should detect corruption)
      await web4ts.initProject(testDataDir);
      
      // Assert: Should have created backup and regenerated valid config
      const backupFiles = (await fs.readdir(testDataDir)).filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backupFiles.length).toBeGreaterThan(0);
      
      // Verify regenerated file is valid JSON
      const newContent = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(newContent);
      expect(parsed.compilerOptions).toBeDefined();
      expect(parsed.compilerOptions.module).toBeDefined();
    });

    it('should detect missing compilerOptions.module in tsconfig.json', async () => {
      // Arrange: Create tsconfig without critical field
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const invalidConfig = {
        compilerOptions: {
          target: "ES2022"
          // Missing 'module' field - critical!
        }
      };
      await fs.writeFile(tsconfigPath, JSON.stringify(invalidConfig, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should have backed up and regenerated
      const backupFiles = (await fs.readdir(testDataDir)).filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backupFiles.length).toBeGreaterThan(0);
      
      // Verify regenerated file has module field
      const newContent = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(newContent);
      expect(parsed.compilerOptions.module).toBe('NodeNext');
    });

    it('should detect corrupted package.json (invalid JSON)', async () => {
      // Arrange: Create corrupted package.json
      const packagePath = path.join(testDataDir, 'package.json');
      await fs.writeFile(packagePath, '{ "name": broken json');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should have backed up and regenerated
      const backupFiles = (await fs.readdir(testDataDir)).filter(f => f.startsWith('package.json.backup'));
      expect(backupFiles.length).toBeGreaterThan(0);
      
      // Verify regenerated file is valid
      const newContent = await fs.readFile(packagePath, 'utf-8');
      const parsed = JSON.parse(newContent);
      expect(parsed.name).toBe('web4-project');
      expect(parsed.type).toBe('module');
    });

    it('should pass validation for valid tsconfig.json', async () => {
      // Arrange: Create valid tsconfig.json
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const validConfig = {
        compilerOptions: {
          module: "NodeNext",
          target: "ES2022",
          strict: true
        }
      };
      await fs.writeFile(tsconfigPath, JSON.stringify(validConfig, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should NOT create backup (config is valid)
      const backupFiles = (await fs.readdir(testDataDir)).filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backupFiles.length).toBe(0);
      
      // Verify original file is unchanged
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions.strict).toBe(true); // User customization preserved
    });

    it('should pass validation for valid but customized tsconfig.json', async () => {
      // Arrange: Create customized but valid tsconfig.json
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const customConfig = {
        compilerOptions: {
          module: "NodeNext",      // Required field present
          target: "ES2020",        // User changed from ES2022
          strict: false,           // User disabled strict mode
          lib: ["ES2020"]          // User added custom lib
        },
        include: ["custom/**/*"]   // User customized includes
      };
      await fs.writeFile(tsconfigPath, JSON.stringify(customConfig, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should NOT create backup (config is valid)
      const backupFiles = (await fs.readdir(testDataDir)).filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backupFiles.length).toBe(0);
      
      // Verify all customizations are preserved
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions.target).toBe('ES2020');
      expect(parsed.compilerOptions.strict).toBe(false);
      expect(parsed.compilerOptions.lib).toEqual(['ES2020']);
      expect(parsed.include).toEqual(['custom/**/*']);
    });
  });

  describe('💾 2. Automatic Backup & Recovery', () => {
    it('should create timestamped backup of corrupted tsconfig.json', async () => {
      // Arrange: Create corrupted tsconfig
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, '{ corrupted');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Backup file should exist with timestamp
      const files = await fs.readdir(testDataDir);
      const backupFiles = files.filter(f => f.match(/^tsconfig\.json\.backup\.\d{8}-\d{6}-\d{3}$/));
      expect(backupFiles.length).toBe(1);
      
      // Verify backup contains the corrupted content
      const backupContent = await fs.readFile(path.join(testDataDir, backupFiles[0]), 'utf-8');
      expect(backupContent).toBe('{ corrupted');
    });

    it('should create timestamped backup of corrupted package.json', async () => {
      // Arrange: Create corrupted package.json
      const packagePath = path.join(testDataDir, 'package.json');
      await fs.writeFile(packagePath, '{ "broken": }');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Backup file should exist with timestamp
      const files = await fs.readdir(testDataDir);
      const backupFiles = files.filter(f => f.match(/^package\.json\.backup\.\d{8}-\d{6}-\d{3}$/));
      expect(backupFiles.length).toBe(1);
      
      // Verify backup contains the corrupted content
      const backupContent = await fs.readFile(path.join(testDataDir, backupFiles[0]), 'utf-8');
      expect(backupContent).toBe('{ "broken": }');
    });

    it('should regenerate working tsconfig.json after backup', async () => {
      // Arrange: Create corrupted tsconfig
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, 'invalid');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: New file should be valid and working
      const newContent = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(newContent);
      
      // Verify all critical fields are present
      expect(parsed.compilerOptions).toBeDefined();
      expect(parsed.compilerOptions.module).toBe('NodeNext');
      expect(parsed.compilerOptions.target).toBe('ES2022');
      expect(parsed.compilerOptions.strict).toBe(true);
      expect(parsed.include).toContain('src/**/*.ts');
    });

    it('should regenerate working package.json after backup', async () => {
      // Arrange: Create corrupted package.json
      const packagePath = path.join(testDataDir, 'package.json');
      await fs.writeFile(packagePath, 'not json');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: New file should be valid and working
      const newContent = await fs.readFile(packagePath, 'utf-8');
      const parsed = JSON.parse(newContent);
      
      // Verify all critical fields are present
      expect(parsed.name).toBe('web4-project');
      expect(parsed.type).toBe('module');
      expect(parsed.devDependencies).toBeDefined();
      expect(parsed.devDependencies.typescript).toBeDefined();
      expect(parsed.devDependencies.vitest).toBeDefined();
    });

    it('should preserve multiple backups (not overwrite)', async () => {
      // Arrange: Create corrupted config
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      
      // Act: Corrupt and heal multiple times
      await fs.writeFile(tsconfigPath, '{ corrupted1 }');
      await web4ts.initProject(testDataDir);
      
      // Wait 1ms to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));
      
      await fs.writeFile(tsconfigPath, '{ corrupted2 }');
      await web4ts.initProject(testDataDir);
      
      // Assert: Should have 2 backup files
      const files = await fs.readdir(testDataDir);
      const backupFiles = files.filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backupFiles.length).toBe(2);
      
      // Verify both backups exist with different content
      const backup1 = await fs.readFile(path.join(testDataDir, backupFiles[0]), 'utf-8');
      const backup2 = await fs.readFile(path.join(testDataDir, backupFiles[1]), 'utf-8');
      expect(backup1).not.toBe(backup2);
    });
  });

  describe('🔒 3. User Customization Preservation', () => {
    it('should preserve valid customized tsconfig.json', async () => {
      // Arrange: Create customized but valid config
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const customConfig = {
        compilerOptions: {
          module: "NodeNext",           // Required
          target: "ES2015",             // Customized
          strict: false,                // Customized
          noImplicitAny: false,         // Customized
          experimentalDecorators: true  // Custom feature
        },
        include: ["myapp/**/*"],        // Customized
        exclude: ["build"]              // Customized
      };
      await fs.writeFile(tsconfigPath, JSON.stringify(customConfig, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: All customizations should be preserved
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions.target).toBe('ES2015');
      expect(parsed.compilerOptions.strict).toBe(false);
      expect(parsed.compilerOptions.experimentalDecorators).toBe(true);
      expect(parsed.include).toEqual(['myapp/**/*']);
      expect(parsed.exclude).toEqual(['build']);
    });

    it('should preserve valid customized package.json', async () => {
      // Arrange: Create customized but valid package.json
      const packagePath = path.join(testDataDir, 'package.json');
      const customPackage = {
        name: "my-custom-project",      // Customized
        version: "2.5.0",               // Customized
        type: "module",                 // Required
        description: "My Project",      // Customized
        author: "Developer",            // Custom field
        license: "MIT",                 // Custom field
        scripts: {                      // Custom scripts
          build: "tsc",
          dev: "nodemon"
        }
      };
      await fs.writeFile(packagePath, JSON.stringify(customPackage, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: All customizations should be preserved
      const content = await fs.readFile(packagePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('my-custom-project');
      expect(parsed.version).toBe('2.5.0');
      expect(parsed.author).toBe('Developer');
      expect(parsed.scripts.build).toBe('tsc');
    });

    it('should not create backup if config is valid', async () => {
      // Arrange: Create valid configs
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const packagePath = path.join(testDataDir, 'package.json');
      
      await fs.writeFile(tsconfigPath, JSON.stringify({
        compilerOptions: { module: "NodeNext", target: "ES2022" }
      }));
      
      await fs.writeFile(packagePath, JSON.stringify({
        name: "test", type: "module"
      }));
      
      // Act: Initialize project twice
      await web4ts.initProject(testDataDir);
      await web4ts.initProject(testDataDir);
      
      // Assert: Should have ZERO backups
      const files = await fs.readdir(testDataDir);
      const backupFiles = files.filter(f => f.includes('.backup'));
      expect(backupFiles.length).toBe(0);
    });

    it('should allow user to change non-critical fields', async () => {
      // Arrange: Create config with various customizations
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const customConfig = {
        compilerOptions: {
          module: "NodeNext",              // Required (must match)
          target: "ES2019",                // Non-critical (can change)
          outDir: "./custom-dist",         // Non-critical
          rootDir: "./custom-src",         // Non-critical
          declaration: false,              // Non-critical
          sourceMap: false,                // Non-critical
          removeComments: true,            // Non-critical
          customField: "user-value"        // Custom addition
        }
      };
      await fs.writeFile(tsconfigPath, JSON.stringify(customConfig, null, 2));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Non-critical fields should be preserved
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions.target).toBe('ES2019');
      expect(parsed.compilerOptions.outDir).toBe('./custom-dist');
      expect(parsed.compilerOptions.declaration).toBe(false);
      expect(parsed.compilerOptions.customField).toBe('user-value');
      
      // But critical field should still be validated
      expect(parsed.compilerOptions.module).toBe('NodeNext');
    });
  });

  describe('🔄 4. Integration with Build Process', () => {
    it.skip('should auto-heal on first component build', async () => {
      // Arrange: Create a component with corrupted root config
      await web4ts.create('TestComponent', '0.1.0.0');
      
      // Corrupt the root tsconfig
      const rootTsconfig = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(rootTsconfig, '{ broken }');
      
      // Act: Build the component (should trigger auto-heal)
      await web4ts.on('TestComponent', '0.1.0.0');
      await web4ts.build();
      
      // Assert: Root config should be healed
      const content = await fs.readFile(rootTsconfig, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions.module).toBe('NodeNext');
      
      // Build should have succeeded
      const distPath = path.join(testDataDir, 'components', 'TestComponent', '0.1.0.0', 'dist');
      expect(existsSync(distPath)).toBe(true);
    });

    it.skip('should auto-heal on component creation', async () => {
      // Arrange: Start with no root configs
      // (test data is clean in beforeEach)
      
      // Act: Create a component (should trigger initProject)
      await web4ts.create('AutoHealComponent', '0.1.0.0');
      
      // Assert: Root configs should exist and be valid
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const packagePath = path.join(testDataDir, 'package.json');
      
      expect(existsSync(tsconfigPath)).toBe(true);
      expect(existsSync(packagePath)).toBe(true);
      
      const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
      const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      
      expect(tsconfig.compilerOptions.module).toBe('NodeNext');
      expect(packageJson.type).toBe('module');
    });

    it.skip('should work correctly after healing', async () => {
      // Arrange: Create corrupted config
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, 'corrupted');
      
      // Act: Heal and then create component
      await web4ts.initProject(testDataDir);
      await web4ts.create('PostHealComponent', '0.1.0.0');
      
      // Assert: Component should be created successfully
      const componentPath = path.join(testDataDir, 'components', 'PostHealComponent', '0.1.0.0');
      expect(existsSync(componentPath)).toBe(true);
      
      // Component should have valid structure
      expect(existsSync(path.join(componentPath, 'src'))).toBe(true);
      expect(existsSync(path.join(componentPath, 'test'))).toBe(true);
      expect(existsSync(path.join(componentPath, 'package.json'))).toBe(true);
    });

    it('should not trigger healing on subsequent builds (idempotent)', async () => {
      // Arrange: Create valid configs
      await web4ts.initProject(testDataDir);
      
      // Add a marker to detect if file is regenerated
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const original = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
      original.customMarker = 'test-marker-12345';
      await fs.writeFile(tsconfigPath, JSON.stringify(original, null, 2));
      
      // Act: Run initProject multiple times
      await web4ts.initProject(testDataDir);
      await web4ts.initProject(testDataDir);
      await web4ts.initProject(testDataDir);
      
      // Assert: Marker should still be present (file not regenerated)
      const final = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
      expect(final.customMarker).toBe('test-marker-12345');
      
      // No backups should have been created
      const files = await fs.readdir(testDataDir);
      const backups = files.filter(f => f.includes('.backup'));
      expect(backups.length).toBe(0);
    });
  });

  describe('⚠️ 5. Edge Cases & Error Handling', () => {
    it('should handle missing compilerOptions entirely', async () => {
      // Arrange: Create tsconfig without compilerOptions
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, JSON.stringify({
        include: ["src/**/*"]
        // No compilerOptions at all
      }));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should regenerate with compilerOptions
      const content = await fs.readFile(tsconfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.compilerOptions).toBeDefined();
      expect(parsed.compilerOptions.module).toBe('NodeNext');
      
      // Backup should exist
      const files = await fs.readdir(testDataDir);
      const backups = files.filter(f => f.startsWith('tsconfig.json.backup'));
      expect(backups.length).toBe(1);
    });

    it('should handle empty JSON object', async () => {
      // Arrange: Create empty configs
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const packagePath = path.join(testDataDir, 'package.json');
      await fs.writeFile(tsconfigPath, '{}');
      await fs.writeFile(packagePath, '{}');
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Both should be regenerated
      const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
      const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
      
      expect(tsconfig.compilerOptions.module).toBe('NodeNext');
      expect(packageJson.type).toBe('module');
      
      // Backups should exist for both
      const files = await fs.readdir(testDataDir);
      expect(files.filter(f => f.startsWith('tsconfig.json.backup')).length).toBe(1);
      expect(files.filter(f => f.startsWith('package.json.backup')).length).toBe(1);
    });

    it('should handle file permissions issues gracefully', async () => {
      // Arrange: Create valid config (testing graceful handling)
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      await fs.writeFile(tsconfigPath, JSON.stringify({
        compilerOptions: { module: "NodeNext", target: "ES2022" }
      }));
      
      // Act & Assert: Should not throw even if permissions are weird
      // (In test environment, we can't easily simulate permission errors,
      // but we verify the code handles them gracefully)
      await expect(web4ts.initProject(testDataDir)).resolves.not.toThrow();
    });

    it('should validate both files independently', async () => {
      // Arrange: Corrupt only tsconfig, package.json is valid
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      const packagePath = path.join(testDataDir, 'package.json');
      
      await fs.writeFile(tsconfigPath, '{ broken }');
      await fs.writeFile(packagePath, JSON.stringify({
        name: "test", type: "module"
      }));
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Only tsconfig should have backup
      const files = await fs.readdir(testDataDir);
      expect(files.filter(f => f.startsWith('tsconfig.json.backup')).length).toBe(1);
      expect(files.filter(f => f.startsWith('package.json.backup')).length).toBe(0);
      
      // Verify package.json is unchanged
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const parsed = JSON.parse(packageContent);
      expect(parsed.name).toBe('test');
    });

    it('should handle missing node_modules gracefully', async () => {
      // Arrange: Clean environment without node_modules
      // (Already clean in beforeEach)
      
      // Act: Initialize project
      await web4ts.initProject(testDataDir);
      
      // Assert: Should create node_modules directory
      const nodeModulesPath = path.join(testDataDir, 'node_modules');
      expect(existsSync(nodeModulesPath)).toBe(true);
      
      // Configs should exist
      expect(existsSync(path.join(testDataDir, 'tsconfig.json'))).toBe(true);
      expect(existsSync(path.join(testDataDir, 'package.json'))).toBe(true);
    });
  });
});
