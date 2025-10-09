/**
 * Web4TSComponent Dirtpig Detection Test
 * Prevents agents from contaminating the project root with test components
 * 
 * This test ensures that:
 * 1. No test components exist in the real project components/ directory
 * 2. No broken symlinks point to non-existent test components
 * 3. All test components are properly isolated in test/data/ directories
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('🧽 Dirtpig Detection Tests', () => {
  const projectRoot = path.resolve(__dirname, '../../../..');
  const componentsDir = path.join(projectRoot, 'components');
  const scriptsVersionsDir = path.join(projectRoot, 'scripts/versions');

  it('🚨 DIRTPIG ALARM: Should detect test component contamination in project root', async () => {
    // Get all component directories
    const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Known test component patterns that should NOT exist in project root
    const testPatterns = [
      /^Test.*Component$/i,     // TestXxxComponent
      /^Test.*$/i,              // TestXxx (broad pattern)
      /^.*Test$/i,              // XxxTest  
      /^.*Debug$/i,             // XxxDebug
      /^Debug.*$/i,             // DebugXxx
      /^Mock.*$/i,              // MockXxx
      /^Fake.*$/i,              // FakeXxx
      /^Temp.*$/i,              // TempXxx
      /^Scratch.*$/i,           // ScratchXxx
    ];

    const contaminatedComponents: string[] = [];

    for (const componentName of componentDirs) {
      // Skip legitimate components
      const legitimateComponents = ['Web4Test', 'DemoComponent'];
      if (legitimateComponents.includes(componentName)) continue;

      // Check against test patterns
      for (const pattern of testPatterns) {
        if (pattern.test(componentName)) {
          contaminatedComponents.push(componentName);
          break;
        }
      }
    }

    if (contaminatedComponents.length > 0) {
      const errorMessage = `🚨 DIRTPIG DETECTED! Test components found in project root:\n${contaminatedComponents.map(name => `  - ${name}`).join('\n')}\n\n🧽 Clean up immediately: rm -rf ${contaminatedComponents.map(name => `components/${name}`).join(' ')}`;
      throw new Error(errorMessage);
    }

    expect(contaminatedComponents).toEqual([]);
  });

  it('🔗 SYMLINK ALARM: Should detect broken symlinks to test components', async () => {
    if (!fs.existsSync(scriptsVersionsDir)) {
      // No scripts/versions directory means no symlinks to check
      return;
    }

    const symlinks = fs.readdirSync(scriptsVersionsDir, { withFileTypes: true })
      .filter(dirent => dirent.isSymbolicLink())
      .map(dirent => dirent.name);

    const brokenSymlinks: string[] = [];
    const testSymlinks: string[] = [];

    for (const symlinkName of symlinks) {
      const symlinkPath = path.join(scriptsVersionsDir, symlinkName);
      
      try {
        // Check if symlink target exists
        const targetExists = fs.existsSync(symlinkPath);
        if (!targetExists) {
          brokenSymlinks.push(symlinkName);
        }

        // Check if symlink points to test/data (contamination)
        const realPath = fs.readlinkSync(symlinkPath);
        if (realPath.includes('/test/data/')) {
          testSymlinks.push(`${symlinkName} -> ${realPath}`);
        }
      } catch (error) {
        brokenSymlinks.push(symlinkName);
      }
    }

    const errors: string[] = [];

    if (brokenSymlinks.length > 0) {
      errors.push(`🔗 BROKEN SYMLINKS DETECTED:\n${brokenSymlinks.map(name => `  - ${name}`).join('\n')}`);
    }

    if (testSymlinks.length > 0) {
      errors.push(`🧪 TEST SYMLINKS DETECTED (should be in test/data only):\n${testSymlinks.map(link => `  - ${link}`).join('\n')}`);
    }

    if (errors.length > 0) {
      const cleanupCmd = `rm -f ${[...brokenSymlinks, ...testSymlinks.map(link => link.split(' ->')[0])].map(name => `scripts/versions/${name}`).join(' ')}`;
      throw new Error(`${errors.join('\n\n')}\n\n🧽 Clean up command: ${cleanupCmd}`);
    }

    expect(brokenSymlinks).toEqual([]);
    expect(testSymlinks).toEqual([]);
  });

  it('📊 COMPONENT COUNT: Should maintain stable component count', async () => {
    // Get current component count
    const componentDirs = fs.readdirSync(componentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const componentCount = componentDirs.length;

    // Expected legitimate component count (adjust as real components are added)
    const expectedMinComponents = 20; // Minimum expected legitimate components
    const expectedMaxComponents = 30; // Maximum reasonable for current project

    // Log current components for debugging
    console.log(`📊 Current components (${componentCount}):`, componentDirs.sort().join(', '));

    // Warn if count is suspicious
    if (componentCount < expectedMinComponents) {
      console.warn(`⚠️  Component count (${componentCount}) is below expected minimum (${expectedMinComponents}). Components may have been deleted.`);
    }

    if (componentCount > expectedMaxComponents) {
      console.warn(`⚠️  Component count (${componentCount}) is above expected maximum (${expectedMaxComponents}). Possible test contamination.`);
    }

    // Test should pass but log warnings
    expect(componentCount).toBeGreaterThanOrEqual(expectedMinComponents);
    expect(componentCount).toBeLessThanOrEqual(expectedMaxComponents);
  });

  it('🧪 TEST ISOLATION: Should verify test components are properly isolated', async () => {
    // Check that test/data directories contain test components, not project root
    const testDataDir = path.join(__dirname, '../test/data');
    
    if (!fs.existsSync(testDataDir)) {
      // No test data directory means tests haven't run yet
      return;
    }

    const testDataComponents = path.join(testDataDir, 'components');
    if (!fs.existsSync(testDataComponents)) {
      return;
    }

    const testComponents = fs.readdirSync(testDataComponents, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Test components should exist in test/data, not in project root
    const projectComponents = fs.readdirSync(componentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    const contaminationFound: string[] = [];

    for (const testComponent of testComponents) {
      // Skip legitimate components that exist in both places
      // (e.g., Web4TSComponent testing itself)
      const legitimateComponents = ['Web4TSComponent', 'Unit'];
      if (legitimateComponents.includes(testComponent)) {
        continue;
      }

      if (projectComponents.includes(testComponent)) {
        contaminationFound.push(testComponent);
      }
    }

    if (contaminationFound.length > 0) {
      throw new Error(`🧪 TEST ISOLATION VIOLATION! Test components found in both test/data AND project root:\n${contaminationFound.map(name => `  - ${name}`).join('\n')}\n\n🧽 These should only exist in test/data during tests!`);
    }

    console.log(`✅ Test isolation working: ${testComponents.length} test components properly isolated in test/data`);
    expect(contaminationFound).toEqual([]);
  });
});
