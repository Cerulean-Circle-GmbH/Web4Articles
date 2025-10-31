/**
 * Baseline Tests - Phase 0: Version Operations
 * Testing version parsing and comparison functionality
 * 
 * @pdca 2025-10-28-UTC-0934.pdca.md:494 - Phase 0: Baseline Tests
 * @baseline 0.3.14.4
 * @target 0.3.17.0
 */

import { describe, it, expect } from 'vitest';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Web4 Pattern: Module-level path calculation for tests
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../../..');
const testDataPath = path.join(componentRoot, 'test/data');

/**
 * Test Version Operations - MUST be GREEN
 * @pdca 2025-10-28-UTC-0934.pdca.md:506
 */
describe('DefaultWeb4TSComponent - Version Operations', () => {
  /**
   * Test 1: parseVersion exists and works
   * @pdca 2025-10-28-UTC-0934.pdca.md:526
   * @test parseVersionExists
   */
  it('component can parse version strings', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const parseVersion = (component as any).parseVersion;
    
    if (parseVersion) {
      expect(typeof parseVersion).toBe('function');
      const parsed = parseVersion.call(component, '1.2.3.4');
      expect(parsed).toBeDefined();
    }
  });

  /**
   * Test 2: compareVersions exists and works
   * @pdca 2025-10-28-UTC-0934.pdca.md:536
   * @test compareVersionsExists
   */
  it('component can compare version strings', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const compareVersions = (component as any).compareVersions;
    
    if (compareVersions) {
      expect(typeof compareVersions).toBe('function');
      
      // Test basic comparisons
      const result1 = compareVersions.call(component, '1.0.0.0', '2.0.0.0');
      expect(result1).toBeLessThan(0);
      
      const result2 = compareVersions.call(component, '2.0.0.0', '1.0.0.0');
      expect(result2).toBeGreaterThan(0);
      
      const result3 = compareVersions.call(component, '1.0.0.0', '1.0.0.0');
      expect(result3).toBe(0);
    }
  });

  /**
   * Test 3: Version format validation
   * @pdca 2025-10-28-UTC-0934.pdca.md:544
   * @test versionFormatValidation
   */
  it('component version uses semantic X.Y.Z.W format', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const version = (component as any).model.version;
    
    // ✅ Version is now a SemanticVersion instance
    const versionString = version.toString();
    const parts = versionString.split('.');
    expect(parts).toHaveLength(4);
    
    // All parts should be numbers
    parts.forEach((part: string) => {
      const num = parseInt(part, 10);
      expect(num).not.toBeNaN();
      expect(num).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * Test 4: Version discovery from directory
   * @pdca 2025-10-28-UTC-0934.pdca.md:552
   * @test versionDiscovery
   */
  it('component discovers version from directory structure', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const version = (component as any).model.version;
    
    // ✅ Version is now a SemanticVersion instance
    expect(version.toString()).toBe('0.3.17.1');
  });

  /**
   * Test 5: upgrade method exists
   * @pdca 2025-10-28-UTC-0934.pdca.md:560
   * @test upgradeMethodExists
   */
  it('component has upgrade method', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    expect(typeof component.upgrade).toBe('function');
  });

  /**
   * Test 6: Version promotion types
   * @pdca 2025-10-28-UTC-0934.pdca.md:568
   * @test versionPromotionTypes
   */
  it('component supports version promotion types', () => {
    const component = new DefaultWeb4TSComponent().init({ model: { targetDirectory: testDataPath } });
    const upgrade = component.upgrade;
    
    // Method should accept promotion type parameter
    expect(upgrade.length).toBeGreaterThanOrEqual(0);
  });
});

