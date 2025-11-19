/**
 * Scenario Generation Tests for Web4TSComponent.create()
 * 
 * @pdca 2025-11-11-UTC-2012.refactor-create-scenario-generation-radical-oop.pdca.md
 * 
 * CORRECTED: Scenario file contains Web4TSComponent's OWN scenario (same as `info`),
 * NOT metadata about the created component.
 * 
 * Test-First Pattern:
 * - Run against 0.3.20.1: EXPECT FAIL (feature doesn't exist)
 * - Run against 0.3.20.2: EXPECT PASS (feature implemented)
 * 
 * TEST ISOLATION: All components created in test/data (NOT production!)
 * Follows IdealMinimalComponent test pattern for proper isolation.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

describe('Scenario Generation (NEW in 0.3.20.2)', () => {
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '..');
  const testDataDir = path.join(componentRoot, 'test/data');
  
  const testComponentName = 'ScenarioTestComponent';
  const versionMatch = componentRoot.match(/(\d+\.\d+\.\d+\.\d+)$/);
  const testVersion = versionMatch ? versionMatch[1] : '0.0.0.0';
  
  // ✅ Component created in test/data, NOT production
  const componentDir = path.join(testDataDir, 'components', testComponentName, testVersion);

  /**
   * Evidence-Based Testing Pattern:
   * - beforeAll: Clean + Setup test/data with Web4TSComponent
   * - Tests run: Verify scenario generation
   * - afterAll: DO NOTHING (keep evidence for inspection)
   */
  beforeAll(async () => {
    // Clean old test component
    const scenarioTestDir = path.join(testDataDir, 'components', testComponentName);
    if (fsSync.existsSync(scenarioTestDir)) {
      await fs.rm(scenarioTestDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old evidence: test/data/components/${testComponentName}`);
    }
    
    // ✅ SYSTEMATIC: Use initProject to setup test/data
    const componentPath = path.join(componentRoot, 'dist/ts/layer2/DefaultWeb4TSComponent.js');
    const { DefaultWeb4TSComponent } = await import(componentPath);
    const component = new DefaultWeb4TSComponent().init({ projectRoot: componentRoot });
    await component.initProject(testDataDir);
    console.log(`   ✅ Test isolation environment initialized via initProject`);
    
    // ✅ CRITICAL: Copy Web4TSComponent into test/data
    const web4tsSourceDir = componentRoot;
    const web4tsTestDataDir = path.join(testDataDir, 'components/Web4TSComponent');
    const web4tsTestVersionDir = path.join(web4tsTestDataDir, testVersion);
    
    // Clean old Web4TSComponent copy
    if (fsSync.existsSync(web4tsTestDataDir)) {
      await fs.rm(web4tsTestDataDir, { recursive: true, force: true });
    }
    
    // Copy Web4TSComponent to test/data using rsync (excludes test/data to avoid circular copy)
    await fs.mkdir(web4tsTestDataDir, { recursive: true });
    execSync(`rsync -a --exclude='test/data' "${web4tsSourceDir}/" "${web4tsTestVersionDir}/"`, {
      stdio: 'pipe'
    });
    console.log(`   📦 Copied Web4TSComponent ${testVersion} to test/data`);
    
    // Create symlinks (latest, dev, test)
    const symlinkTargets = ['latest', 'dev', 'test'];
    for (const linkName of symlinkTargets) {
      const linkPath = path.join(web4tsTestDataDir, linkName);
      if (fsSync.existsSync(linkPath)) {
        await fs.rm(linkPath, { force: true });
      }
      await fs.symlink(testVersion, linkPath, 'dir');
      console.log(`   🔗 Created symlink: Web4TSComponent/${linkName} → ${testVersion}`);
    }
    
    // ✅ Create web4tscomponent CLI symlink in test/data/scripts
    const scriptsDir = path.join(testDataDir, 'scripts');
    const web4tsComponentCLILink = path.join(scriptsDir, 'web4tscomponent');
    if (fsSync.existsSync(web4tsComponentCLILink)) {
      await fs.rm(web4tsComponentCLILink, { force: true });
    }
    await fs.symlink('../components/Web4TSComponent/latest/web4tscomponent', web4tsComponentCLILink);
    console.log(`   🔗 Created CLI symlink: scripts/web4tscomponent`);
    
    // NOW create the test component IN TEST ISOLATION
    const { DefaultWeb4TSComponent: TestComponent } = await import(path.join(componentRoot, 'dist/ts/layer2/DefaultWeb4TSComponent.js'));
    const testWeb4ts = new TestComponent().init({
      model: { 
        projectRoot: testDataDir,
        targetDirectory: testDataDir 
      }
    });
    
    await testWeb4ts.create(testComponentName, testVersion, 'all');
    console.log(`   ✅ ${testComponentName} created in test isolation: ${componentDir}`);
    console.log(`   📂 Evidence persists at: ${testDataDir}`);
  });

  // ✅ NO afterAll - evidence persists for inspection

  it('should create {Component}.component.json file in test/data', async () => {
    // ASSERT: Component.json exists in test isolation
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const exists = fsSync.existsSync(scenarioPath);
    expect(exists).toBe(true);
  });

  it('should contain Web4TSComponent IOR (not created component)', async () => {
    // ASSERT: Scenario IOR is Web4TSComponent, NOT the created component
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const scenario = JSON.parse(scenarioContent);

    expect(scenario.ior).toBeDefined();
    expect(scenario.ior.component).toBe('Web4TSComponent'); // Generating component!
    expect(scenario.ior.version).toBe(testVersion);
  });

  it('should have encrypted owner field with base64', async () => {
    // ASSERT: Owner field is base64 encoded
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const scenario = JSON.parse(scenarioContent);

    expect(scenario.owner).toBeDefined();
    expect(scenario.owner).toMatch(/^[A-Za-z0-9+/]+=*$/); // base64 pattern
    
    // Verify it can be decoded (valid base64)
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    expect(() => JSON.parse(decoded)).not.toThrow();
  });

  it('should contain Web4TSComponent model data', async () => {
    // ASSERT: Model contains Web4TSComponent data (not created component data)
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const scenario = JSON.parse(scenarioContent);

    expect(scenario.model).toBeDefined();
    expect(scenario.model.component).toBe('Web4TSComponent');
    expect(scenario.model.version).toBeDefined();
    expect(scenario.model.componentRoot).toContain('Web4TSComponent');
  });

  it('should NOT contaminate production components directory', async () => {
    // ASSERT: ScenarioTestComponent does NOT exist in production
    const productionDir = path.join(componentRoot, '../../..', 'components', testComponentName);
    const existsInProduction = fsSync.existsSync(productionDir);
    expect(existsInProduction).toBe(false);
  });
});
