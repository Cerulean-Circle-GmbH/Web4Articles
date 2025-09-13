/**
 * Unit Component Acceptance Tests
 * Automated tests equivalent to manual acceptance tests from Task 14
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { DefaultUnit } from '../src/ts/layer2/DefaultUnit.js';
import { TypeM3 } from '../src/ts/layer3/TypeM3.enum.js';

describe('Unit Component Acceptance Tests', () => {
  let testDir: string;
  let unit: DefaultUnit;
  
  beforeEach(async () => {
    // Create temporary test directory
    testDir = join(process.cwd(), 'test-temp');
    await fs.mkdir(testDir, { recursive: true });
    
    // Initialize unit with empty scenario (Web4 pattern)
    unit = new DefaultUnit();
    const emptyScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Unit', version: '0.3.0.4' },
      owner: '',
      model: {
        uuid: crypto.randomUUID(),
        name: '',
        origin: '',
        definition: '',
        typeM3: TypeM3.CLASS,
        indexPath: '',
        symlinkPaths: [],
        namedLinks: [],
        executionCapabilities: ['transform', 'validate', 'process'],
        storageCapabilities: ['scenarios', 'ld-links'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    unit.init(emptyScenario);
  });

  afterEach(async () => {
    // Clean up test directory
    if (existsSync(testDir)) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  describe('Central Storage Integration', () => {
    it('should save scenarios to central /workspace/scenarios/index/ location', async () => {
      // Change to test directory
      process.chdir(testDir);
      
      // Create unit scenario
      const scenario = await unit.toScenario('test-unit');
      
      // Verify scenario was saved to central storage, not local temp
      const expectedPath = `/workspace/scenarios/index/${scenario.ior.uuid.slice(0, 5).split('').join('/')}/${scenario.ior.uuid}.scenario.json`;
      expect(existsSync(expectedPath)).toBe(true);
      
      // Verify scenario is NOT in local temp directory
      const localPath = join(testDir, 'scenarios');
      expect(existsSync(localPath)).toBe(false);
    });

    it('should create LD links with correct {name}.unit filename format', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('acceptance-test');
      
      // Verify LD link created with correct filename
      const linkPath = join(testDir, 'acceptance-test.unit');
      expect(existsSync(linkPath)).toBe(true);
      
      // Verify it's a symbolic link
      const stats = await fs.lstat(linkPath);
      expect(stats.isSymbolicLink()).toBe(true);
    });

    it('should create LD links pointing to central storage with relative paths', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('relative-test');
      
      // Read the symbolic link target
      const linkPath = join(testDir, 'relative-test.unit');
      const linkTarget = await fs.readlink(linkPath);
      
      // Verify it uses relative path (contains ../scenarios/index/)
      expect(linkTarget).toMatch(/\.\.\/scenarios\/index\//);
      
      // Verify the link points to the correct scenario file
      expect(linkTarget).toContain(scenario.ior.uuid);
      expect(linkTarget).toMatch(/\.scenario\.json$/);
    });

    it('should populate references array with relative location and filename', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('references-test');
      
      // Verify references array is populated
      expect(scenario.model.references).toHaveLength(1);
      
      const reference = scenario.model.references[0];
      expect(reference.linkLocation).toContain('references-test.unit');
      expect(reference.linkTarget).toContain(scenario.ior.uuid);
      expect(reference.syncStatus).toBe('SYNCED');
    });
  });

  describe('Web4 Scenario Format Compliance', () => {
    it('should use lowercase "ior" field (not "IOR")', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('format-test');
      
      // Verify lowercase ior field exists
      expect(scenario.ior).toBeDefined();
      expect(scenario.ior.uuid).toBeDefined();
      expect(scenario.ior.component).toBe('unit');
      expect(scenario.ior.version).toBe('0.3.0.5');
      
      // Verify no uppercase IOR field
      expect((scenario as any).IOR).toBeUndefined();
    });

    it('should use semantic versioning format (not "v1.0")', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('version-test');
      
      // Verify semantic versioning format
      expect(scenario.ior.version).toBe('0.3.0.5');
      expect(scenario.ior.version).not.toBe('v1.0');
      expect(scenario.ior.version).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });

    it('should use JSON string owner format (not base64)', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('owner-test');
      
      // Verify owner is JSON string, not base64
      expect(typeof scenario.owner).toBe('string');
      expect(scenario.owner).toMatch(/^\{.*\}$/); // JSON string format
      
      // Verify it's not base64 encoded
      expect(scenario.owner).not.toMatch(/^[A-Za-z0-9+/]+=*$/);
      
      // Verify JSON can be parsed
      const ownerData = JSON.parse(scenario.owner);
      expect(ownerData.user).toBeDefined();
      expect(ownerData.uuid).toBeDefined();
      expect(ownerData.timestamp).toBeDefined();
    });

    it('should have single model field containing unitIndex data', async () => {
      process.chdir(testDir);
      
      const scenario = await unit.toScenario('model-test');
      
      // Verify model field contains all unitIndex data
      expect(scenario.model).toBeDefined();
      expect(scenario.model.uuid).toBeDefined();
      expect(scenario.model.indexPath).toBeDefined();
      expect(scenario.model.symlinkPaths).toBeDefined();
      expect(scenario.model.namedLinks).toBeDefined();
      expect(scenario.model.executionCapabilities).toBeDefined();
      expect(scenario.model.storageCapabilities).toBeDefined();
      
      // Verify no separate unitIndex field
      expect((scenario as any).unitIndex).toBeUndefined();
    });
  });

  describe('Unit Functionality', () => {
    it('should add execution capabilities correctly', () => {
      const testCapability = 'test-capability';
      unit.addExecutionCapability(testCapability);
      
      expect(unit.getModel().executionCapabilities).toContain(testCapability);
    });

    it('should transform data with unit metadata', () => {
      const testData = { test: 'data' };
      const result = unit.transform(testData) as any;
      
      expect(result.transformed).toEqual(testData);
      expect(result.by).toBe(unit.getModel().uuid);
      expect(result.timestamp).toBeDefined();
    });

    it('should validate objects correctly', () => {
      expect(unit.validate({ valid: 'object' })).toBe(true);
      expect(unit.validate(null)).toBe(false);
      expect(unit.validate(undefined)).toBe(false);
    });
  });
});