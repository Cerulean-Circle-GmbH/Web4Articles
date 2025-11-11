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
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

describe('Scenario Generation (NEW in 0.3.20.2)', () => {
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '..');
  const testDataDir = path.join(componentRoot, 'test/data');
  
  let web4ts: DefaultWeb4TSComponent;
  const testComponentName = 'ScenarioTestComponent';
  const testComponentVersion = '0.1.0.0';
  
  // ✅ Component created in test/data, NOT production
  const componentDir = path.join(testDataDir, 'components', testComponentName, testComponentVersion);

  beforeAll(async () => {
    // ✅ Initialize test isolation environment (like IdealMinimalComponent test)
    await fs.mkdir(testDataDir, { recursive: true });
    
    // Clean up any previous test component
    try {
      await fs.rm(path.join(testDataDir, 'components', testComponentName), { recursive: true, force: true });
    } catch (e) {
      // Ignore if doesn't exist
    }

    // Initialize Web4TSComponent with test/data as targetDirectory
    web4ts = new DefaultWeb4TSComponent();
    await web4ts.init();
    
    // Set targetDirectory to test/data
    web4ts.model.targetDirectory = testDataDir;
    
    // Create the test component IN TEST ISOLATION
    await web4ts.create(testComponentName, testComponentVersion, 'all');
    
    console.log(`   ✅ ${testComponentName} created in test isolation: ${componentDir}`);
    console.log(`   📂 Evidence persists at: ${testDataDir}`);
  });

  it('should create {Component}.component.json file', async () => {
    // ASSERT: Component.json exists (created in beforeAll)
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
    expect(scenario.ior.version).toBe(web4ts.model.version.toString());
  });

  it('should be identical to web4tscomponent info scenario', async () => {
    // ARRANGE: Get Web4TSComponent's own scenario
    const web4tsScenario = await web4ts.toScenario();

    // ASSERT: Component.json matches Web4TSComponent's own scenario
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const componentScenario = JSON.parse(scenarioContent);

    expect(componentScenario.ior).toEqual(web4tsScenario.ior);
    // Owner timestamps will differ - compare structure, not exact match
    const ownerData = JSON.parse(Buffer.from(componentScenario.owner, 'base64').toString('utf-8'));
    const web4tsOwnerData = JSON.parse(Buffer.from(web4tsScenario.owner, 'base64').toString('utf-8'));
    expect(ownerData.model.uuid).toBe(web4tsOwnerData.model.uuid);
    expect(componentScenario.model.uuid).toBe(web4tsScenario.model.uuid);
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
});
