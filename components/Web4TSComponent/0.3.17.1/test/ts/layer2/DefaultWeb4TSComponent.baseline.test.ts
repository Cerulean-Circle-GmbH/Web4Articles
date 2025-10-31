/**
 * Baseline Tests - Phase 0: Component Lifecycle
 * Testing DefaultWeb4TSComponent core functionality
 * 
 * @pdca 2025-10-28-UTC-0934.pdca.md:494 - Phase 0: Baseline Tests
 * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - Test isolation
 * @baseline 0.3.14.4
 * @target 0.3.17.0
 */

import { describe, it, expect } from 'vitest';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';
import { createTestComponent } from '../helpers/testHelpers.js';

/**
 * Test Component Lifecycle - MUST be GREEN
 * @pdca 2025-10-28-UTC-0934.pdca.md:506
 */
describe('DefaultWeb4TSComponent - Baseline Lifecycle', () => {
  /**
   * Test 1: Component instantiation
   * @pdca 2025-10-28-UTC-0934.pdca.md:526
   * @test componentInstantiation
   */
  it('component constructor creates instance', () => {
    const component = createTestComponent();
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(DefaultWeb4TSComponent);
  });

  /**
   * Test 2: Component has model
   * @pdca 2025-10-28-UTC-0934.pdca.md:536
   * @test componentHasModel
   */
  it('component has model after construction', () => {
    const component = createTestComponent();
    const model = (component as any).model;
    expect(model).toBeDefined();
    expect(model).toHaveProperty('uuid');
    expect(model).toHaveProperty('component');
    expect(model).toHaveProperty('version');
  });

  /**
   * Test 3: Component name
   * @pdca 2025-10-28-UTC-0934.pdca.md:544
   * @test componentName
   */
  it('component has correct name', () => {
    const component = createTestComponent();
    const model = (component as any).model;
    expect(model.component).toBe('Web4TSComponent');
  });

  /**
   * Test 4: Component version format
   * @pdca 2025-10-28-UTC-0934.pdca.md:552
   * @test componentVersionFormat
   */
  it('component version follows X.Y.Z.W format', () => {
    const component = createTestComponent();
    const model = (component as any).model;
    const version = model.version;
    
    // ✅ Version is now a SemanticVersion instance
    expect(typeof version).toBe('object');
    expect(version.toString()).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });

  /**
   * Test 5: Component UUID
   * @pdca 2025-10-28-UTC-0934.pdca.md:560
   * @test componentUUID
   */
  it('component generates valid UUID', () => {
    const component = createTestComponent();
    const model = (component as any).model;
    const uuid = model.uuid;
    
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
    // UUID format (loose check)
    expect(uuid).toMatch(/^[a-f0-9-]+$/i);
  });

  /**
   * Test 6: toScenario method exists
   * @pdca 2025-10-28-UTC-0934.pdca.md:568
   * @test toScenarioExists
   */
  it('component has toScenario method', () => {
    const component = createTestComponent();
    expect(typeof component.toScenario).toBe('function');
  });

  /**
   * Test 7: build method exists
   * @pdca 2025-10-28-UTC-0934.pdca.md:576
   * @test buildMethodExists
   */
  it('component has build method', () => {
    const component = createTestComponent();
    expect(typeof component.build).toBe('function');
  });

  /**
   * Test 8: test method exists
   * @pdca 2025-10-28-UTC-0934.pdca.md:584
   * @test testMethodExists
   */
  it('component has test method', () => {
    const component = createTestComponent();
    expect(typeof component.test).toBe('function');
  });

  /**
   * Test 9: clean method exists
   * @pdca 2025-10-28-UTC-0934.pdca.md:592
   * @test cleanMethodExists
   */
  it('component has clean method', () => {
    const component = createTestComponent();
    expect(typeof component.clean).toBe('function');
  });

  /**
   * Test 11: Multiple instances are independent
   * @pdca 2025-10-28-UTC-0934.pdca.md:608
   * @test multipleInstancesIndependent
   */
  it('multiple component instances have different UUIDs', () => {
    const component1 = createTestComponent();
    const component2 = createTestComponent();
    
    const uuid1 = (component1 as any).model.uuid;
    const uuid2 = (component2 as any).model.uuid;
    
    expect(uuid1).not.toBe(uuid2);
  });
});

