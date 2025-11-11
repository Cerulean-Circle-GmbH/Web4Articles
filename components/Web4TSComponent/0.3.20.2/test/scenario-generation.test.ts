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
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Scenario Generation (NEW in 0.3.20.2)', () => {
  let web4ts: DefaultWeb4TSComponent;
  let testComponentName: string;
  let testComponentVersion: string;
  let projectRoot: string;
  let componentDir: string;

  beforeEach(async () => {
    // Initialize Web4TSComponent
    web4ts = new DefaultWeb4TSComponent();
    await web4ts.init();

    // Test component details
    testComponentName = 'ScenarioTestComponent';
    testComponentVersion = '0.1.0.0';
    
    // Calculate paths
    projectRoot = web4ts.model.projectRoot;
    componentDir = path.join(projectRoot, 'components', testComponentName, testComponentVersion);

    // Clean up any existing test component
    try {
      await fs.rm(path.join(projectRoot, 'components', testComponentName), { recursive: true, force: true });
    } catch (e) {
      // Ignore if doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up test component
    try {
      await fs.rm(path.join(projectRoot, 'components', testComponentName), { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  it('should create {Component}.component.json file', async () => {
    // ACT: Create component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    // ASSERT: Component.json exists
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const exists = fsSync.existsSync(scenarioPath);
    expect(exists).toBe(true);
  });

  it('should contain Web4TSComponent IOR (not created component)', async () => {
    // ACT: Create component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

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

    // ACT: Create component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

    // ASSERT: Component.json matches Web4TSComponent's own scenario
    const scenarioPath = path.join(componentDir, `${testComponentName}.component.json`);
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const componentScenario = JSON.parse(scenarioContent);

    expect(componentScenario.ior).toEqual(web4tsScenario.ior);
    expect(componentScenario.owner).toBe(web4tsScenario.owner);
    expect(componentScenario.model.uuid).toBe(web4tsScenario.model.uuid);
  });

  it('should have encrypted owner field with base64', async () => {
    // ACT: Create component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

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
    // ACT: Create component
    await web4ts.create(testComponentName, testComponentVersion, 'all');

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
