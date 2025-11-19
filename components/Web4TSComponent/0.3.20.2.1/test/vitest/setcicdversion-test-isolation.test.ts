/**
 * Test: setCICDVersion Test Isolation Compliance
 * 
 * Verifies that setCICDVersion respects test isolation and does NOT:
 * - Modify production component symlinks
 * - Create symlinks in production scripts/versions directory
 * - Touch any files outside test/data directory
 * 
 * @pdca 2025-11-10-UTC-2400.setcicdversion-test-isolation-compliance.pdca.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, readlinkSync, readdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

describe('🔒 setCICDVersion Test Isolation Compliance', () => {
  const testDataRoot = join(process.cwd(), 'test', 'data');
  const testComponentsDir = join(testDataRoot, 'components');
  const testScriptsVersionsDir = join(testDataRoot, 'scripts', 'versions');
  
  const productionComponentsDir = join(process.cwd(), 'components');
  const productionScriptsVersionsDir = join(process.cwd(), 'scripts', 'versions');
  
  let component: DefaultWeb4TSComponent;
  let testComponentName: string;
  let testVersion1: string;
  let testVersion2: string;
  
  beforeEach(async () => {
    // Clean test/data
    if (existsSync(testDataRoot)) {
      execSync(`rm -rf ${testDataRoot}/*`);
    }
    
    // Create test component structure
    testComponentName = 'TestCICDComponent';
    testVersion1 = '0.1.0.0';
    testVersion2 = '0.2.0.0';
    
    const testComponentDir = join(testComponentsDir, testComponentName);
    const testVersion1Dir = join(testComponentDir, testVersion1);
    const testVersion2Dir = join(testComponentDir, testVersion2);
    
    execSync(`mkdir -p ${testVersion1Dir}`);
    execSync(`mkdir -p ${testVersion2Dir}`);
    execSync(`mkdir -p ${testScriptsVersionsDir}`);
    
    // Create CLI scripts in component version directories (for createVersionScriptSymlink)
    const cliScript1 = join(testVersion1Dir, 'testcicdcomponent');
    const cliScript2 = join(testVersion2Dir, 'testcicdcomponent');
    execSync(`echo '#!/bin/bash' > ${cliScript1}`);
    execSync(`echo '#!/bin/bash' > ${cliScript2}`);
    execSync(`chmod +x ${cliScript1}`);
    execSync(`chmod +x ${cliScript2}`);
    
    // Initialize component with test isolation model
    component = new DefaultWeb4TSComponent();
    await component.init({
      model: {
        projectRoot: testDataRoot, // Test isolation: project root is test/data
        componentsDirectory: testComponentsDir,
        targetDirectory: testDataRoot,
        testDataDir: testDataRoot,
        component: testComponentName,
        version: testVersion1,
        isTestIsolation: true
      }
    });
  });
  
  afterEach(() => {
    // Clean up test/data
    if (existsSync(testDataRoot)) {
      execSync(`rm -rf ${testDataRoot}/*`);
    }
  });
  
  it('should create symlinks ONLY in test/data, NOT in production', async () => {
    // Capture production state BEFORE
    const productionComponentDir = join(productionComponentsDir, testComponentName);
    const productionDevLinkBefore = join(productionComponentDir, 'dev');
    const productionScriptLinkBefore = join(productionScriptsVersionsDir, 'testcicdcomponent.dev');
    
    const productionDevExists = existsSync(productionDevLinkBefore);
    const productionScriptExists = existsSync(productionScriptLinkBefore);
    
    // Execute setCICDVersion in test isolation
    await component.setCICDVersion('dev', testVersion2);
    
    // VERIFY: Test isolation symlinks CREATED
    const testComponentDir = join(testComponentsDir, testComponentName);
    const testDevLink = join(testComponentDir, 'dev');
    const testScriptLink = join(testScriptsVersionsDir, 'testcicdcomponent.dev');
    
    expect(existsSync(testDevLink), 'dev symlink should exist in test/data').toBe(true);
    expect(readlinkSync(testDevLink), 'dev should point to 0.2.0.0').toBe(testVersion2);
    
    expect(existsSync(testScriptLink), 'script symlink should exist in test/data/scripts/versions').toBe(true);
    expect(readlinkSync(testScriptLink), 'script symlink should point to correct wrapper').toBe(`testcicdcomponent-v${testVersion2}`);
    
    // VERIFY: Production state UNCHANGED
    expect(existsSync(productionDevLinkBefore), 'production dev link state unchanged').toBe(productionDevExists);
    expect(existsSync(productionScriptLinkBefore), 'production script link state unchanged').toBe(productionScriptExists);
    
    // If production links existed before, verify they still point to the same targets
    if (productionDevExists) {
      const productionDevTargetAfter = readlinkSync(productionDevLinkBefore);
      // Should NOT be changed by test isolation operation
      expect(productionDevTargetAfter).not.toBe(testVersion2);
    }
  });
  
  it('should use model.projectRoot for scripts/versions path (test isolation)', async () => {
    // Execute setCICDVersion
    await component.setCICDVersion('test', testVersion1);
    
    // VERIFY: Script symlink created in test/data/scripts/versions (NOT production)
    const testScriptLink = join(testScriptsVersionsDir, 'testcicdcomponent.test');
    const productionScriptLink = join(productionScriptsVersionsDir, 'testcicdcomponent.test');
    
    expect(existsSync(testScriptLink), 'script symlink in test/data').toBe(true);
    expect(existsSync(productionScriptLink), 'NO script symlink in production').toBe(false);
    
    // VERIFY: Path calculation used model.projectRoot (test/data)
    const scriptLinkTarget = readlinkSync(testScriptLink);
    expect(scriptLinkTarget).toBe(`testcicdcomponent-v${testVersion1}`);
    
    // VERIFY: Target wrapper exists in test/data/scripts/versions
    const targetWrapper = join(testScriptsVersionsDir, `testcicdcomponent-v${testVersion1}`);
    expect(existsSync(targetWrapper), 'wrapper exists in test/data').toBe(true);
  });
  
  it('should handle "latest" symlink without creating script symlink', async () => {
    // Execute setCICDVersion with 'latest' (special case: no script symlink)
    await component.setCICDVersion('latest', testVersion2);
    
    // VERIFY: Component symlink created
    const testComponentDir = join(testComponentsDir, testComponentName);
    const testLatestLink = join(testComponentDir, 'latest');
    
    expect(existsSync(testLatestLink), 'latest symlink should exist').toBe(true);
    expect(readlinkSync(testLatestLink)).toBe(testVersion2);
    
    // VERIFY: NO script symlink created for 'latest'
    const testScriptLink = join(testScriptsVersionsDir, 'testcicdcomponent.latest');
    expect(existsSync(testScriptLink), 'NO script symlink for latest').toBe(false);
  });
  
  it('should create version wrapper symlink if missing (test isolation)', async () => {
    // Remove the version wrapper to test auto-creation
    const wrapperName = `testcicdcomponent-v${testVersion2}`;
    const wrapperPath = join(testScriptsVersionsDir, wrapperName);
    
    // Initially, wrapper should not exist
    expect(existsSync(wrapperPath), 'wrapper should not exist initially').toBe(false);
    
    // Execute setCICDVersion (should auto-create wrapper as symlink to component CLI)
    await component.setCICDVersion('prod', testVersion2);
    
    // VERIFY: Wrapper auto-created in test/data/scripts/versions
    expect(existsSync(wrapperPath), 'wrapper should be auto-created in test/data').toBe(true);
    
    // VERIFY: Wrapper is a symlink (not a regular file)
    const stats = await import('fs/promises').then(fs => fs.lstat(wrapperPath));
    expect(stats.isSymbolicLink(), 'wrapper should be a symlink').toBe(true);
    
    // VERIFY: Symlink points to the component CLI script
    const symlinkTarget = readlinkSync(wrapperPath);
    expect(symlinkTarget, 'symlink should point to component CLI').toMatch(/testcicdcomponent/i);
    
    // VERIFY: NOT created in production
    const productionWrapperPath = join(productionScriptsVersionsDir, wrapperName);
    expect(existsSync(productionWrapperPath), 'wrapper should NOT be in production').toBe(false);
  });
  
  it('should respect model.componentsDirectory for component symlinks', async () => {
    // Execute setCICDVersion
    await component.setCICDVersion('dev', testVersion1);
    
    // VERIFY: Symlink created using model.componentsDirectory (test/data/components)
    const testComponentDir = join(testComponentsDir, testComponentName);
    const testDevLink = join(testComponentDir, 'dev');
    
    expect(existsSync(testDevLink), 'symlink in test/data/components').toBe(true);
    expect(testDevLink.startsWith(testComponentsDir), 'path uses model.componentsDirectory').toBe(true);
    
    // VERIFY: NOT in production components directory
    const productionDevLink = join(productionComponentsDir, testComponentName, 'dev');
    const productionDirExists = existsSync(join(productionComponentsDir, testComponentName));
    
    if (productionDirExists) {
      // If production component exists, verify symlink was NOT modified
      const productionSymlinkModified = existsSync(productionDevLink) && 
                                       readlinkSync(productionDevLink) === testVersion1;
      expect(productionSymlinkModified, 'production symlink NOT modified by test').toBe(false);
    }
  });
  
  it('should throw error if target version does not exist (path authority)', async () => {
    // Try to set symlink to non-existent version
    await expect(
      component.setCICDVersion('dev', '9.9.9.9')
    ).rejects.toThrow('Target version 9.9.9.9 does not exist');
    
    // VERIFY: No symlinks created in test or production
    const testDevLink = join(testComponentsDir, testComponentName, 'dev');
    const productionDevLink = join(productionComponentsDir, testComponentName, 'dev');
    
    expect(existsSync(testDevLink), 'NO test symlink on error').toBe(false);
    
    // Production should remain untouched
    if (existsSync(join(productionComponentsDir, testComponentName))) {
      const productionSymlinkExists = existsSync(productionDevLink);
      // If it exists, it should point to something other than our test version
      if (productionSymlinkExists) {
        expect(readlinkSync(productionDevLink)).not.toBe('9.9.9.9');
      }
    }
  });
  
  it('should print test isolation indicator in header', async () => {
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    try {
      await component.setCICDVersion('dev', testVersion2);
      
      // VERIFY: Test isolation indicator present
      const hasTestIsolationIndicator = logs.some(log => 
        log.includes('TEST ISOLATION') || log.includes('⚠️')
      );
      
      expect(hasTestIsolationIndicator, 'should show test isolation indicator').toBe(true);
    } finally {
      console.log = originalLog;
    }
  });
  
  it('should not pollute production scripts/versions with test symlinks', async () => {
    // Get production scripts/versions file list BEFORE
    const productionFilesBefore = existsSync(productionScriptsVersionsDir) 
      ? readdirSync(productionScriptsVersionsDir) 
      : [];
    
    // Execute multiple setCICDVersion operations
    await component.setCICDVersion('dev', testVersion1);
    await component.setCICDVersion('test', testVersion2);
    await component.setCICDVersion('prod', testVersion1);
    
    // Get production scripts/versions file list AFTER
    const productionFilesAfter = existsSync(productionScriptsVersionsDir) 
      ? readdirSync(productionScriptsVersionsDir) 
      : [];
    
    // VERIFY: Production file count unchanged
    expect(productionFilesAfter.length, 'production files unchanged').toBe(productionFilesBefore.length);
    
    // VERIFY: No test-related files in production
    const testRelatedFiles = productionFilesAfter.filter(f => 
      f.includes('testcicdcomponent') || f.includes('TestCICDComponent')
    );
    
    expect(testRelatedFiles.length, 'no test-related files in production').toBe(0);
    
    // VERIFY: All symlinks in test/data
    const testFiles = readdirSync(testScriptsVersionsDir);
    const testSymlinks = testFiles.filter(f => {
      const fullPath = join(testScriptsVersionsDir, f);
      try {
        readlinkSync(fullPath);
        return true;
      } catch {
        return false;
      }
    });
    
    expect(testSymlinks.length, 'symlinks created in test/data').toBeGreaterThan(0);
  });
});

