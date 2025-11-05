/**
 * Baseline Tests - Phase 0: Scenario Pattern
 * Testing toScenario() and scenario-based initialization
 * 
 * @pdca 2025-10-28-UTC-0934.pdca.md:494 - Phase 0: Baseline Tests
 * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - Test isolation
 * @baseline 0.3.14.4
 * @target 0.3.17.0
 */

import { describe, it, expect } from 'vitest';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';
import { createTestComponent } from '../helpers/testHelpers.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Web4 Pattern: Module-level path calculation for tests
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../../..');
const testDataPath = path.join(componentRoot, 'test/data');

/**
 * Test Scenario Pattern - MUST be GREEN
 * @pdca 2025-10-28-UTC-0934.pdca.md:506
 */
describe('DefaultWeb4TSComponent - Scenario Pattern', () => {
  /**
   * Test 1: toScenario returns valid structure
   * @pdca 2025-10-28-UTC-0934.pdca.md:553
   * @test toScenarioStructure
   */
  it('toScenario returns valid scenario structure', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(scenario).toBeDefined();
    expect(scenario).toHaveProperty('ior');
    expect(scenario).toHaveProperty('owner');
    expect(scenario).toHaveProperty('model');
  });

  /**
   * Test 2: IOR contains required fields
   * @pdca 2025-10-28-UTC-0934.pdca.md:561
   * @test iorStructure
   */
  it('scenario IOR contains uuid, component, version', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(scenario.ior).toHaveProperty('uuid');
    expect(scenario.ior).toHaveProperty('component');
    expect(scenario.ior).toHaveProperty('version');
    
    expect(scenario.ior.component).toBe('Web4TSComponent');
    expect(scenario.ior.version).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });

  /**
   * Test 3: Owner data is string
   * @pdca 2025-10-28-UTC-0934.pdca.md:569
   * @test ownerDataFormat
   */
  it('scenario owner is a string (for encryption)', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(typeof scenario.owner).toBe('string');
    expect(scenario.owner.length).toBeGreaterThan(0);
  });

  /**
   * Test 4: Model contains component state
   * @pdca 2025-10-28-UTC-0934.pdca.md:577
   * @test modelContainsState
   */
  it('scenario model contains component state', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(scenario.model).toBeDefined();
    expect(scenario.model).toHaveProperty('uuid');
    expect(scenario.model).toHaveProperty('component');
    expect(scenario.model).toHaveProperty('version');
  });

  /**
   * Test 5: Scenario can be named
   * @pdca 2025-10-28-UTC-0934.pdca.md:585
   * @test scenarioNaming
   */
  it('toScenario accepts optional name parameter', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    
    // Should not throw with name parameter
    const scenario = await component.toScenario('test-scenario');
    expect(scenario).toBeDefined();
  });

  /**
   * Test 6: UUIDs match across IOR and model
   * @pdca 2025-10-28-UTC-0934.pdca.md:593
   * @test uuidConsistency
   */
  it('scenario IOR and model have same UUID', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(scenario.ior.uuid).toBe(scenario.model.uuid);
  });

  /**
   * Test 7: Scenario is serializable
   * @pdca 2025-10-28-UTC-0934.pdca.md:601
   * @test scenarioSerializable
   */
  it('scenario can be JSON stringified', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario = await component.toScenario();
    
    expect(() => JSON.stringify(scenario)).not.toThrow();
    
    const json = JSON.stringify(scenario);
    expect(json.length).toBeGreaterThan(0);
    
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('ior');
    expect(parsed).toHaveProperty('owner');
    expect(parsed).toHaveProperty('model');
  });

  /**
   * Test 8: Multiple toScenario calls produce consistent results
   * @pdca 2025-10-28-UTC-0934.pdca.md:609
   * @test scenarioConsistency
   */
  it('multiple toScenario calls have same component data', async () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const scenario1 = await component.toScenario();
    const scenario2 = await component.toScenario();
    
    // Same component, same version
    expect(scenario1.ior.component).toBe(scenario2.ior.component);
    expect(scenario1.ior.version).toBe(scenario2.ior.version);
    expect(scenario1.model.component).toBe(scenario2.model.component);
    expect(scenario1.model.version).toBe(scenario2.model.version);
  });
});

