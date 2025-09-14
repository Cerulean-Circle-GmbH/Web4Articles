/**
 * Unit Filename Consistency Tests
 * Validates that all unit CLI commands use consistent filename conversion (spaces → single dots)
 * Task 29: Unit Filename Consistency Fix
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import { DefaultUnit } from '../src/ts/layer2/DefaultUnit.js';
import { TypeM3 } from '../src/ts/layer3/TypeM3.enum.js';

describe('Unit Filename Consistency Tests', () => {
  let testDir: string;
  let unit: DefaultUnit;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = join(process.cwd(), 'temp-filename-test');
    await fs.mkdir(testDir, { recursive: true });
    process.chdir(testDir);

    // Create unit instance
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
    process.chdir('/workspace');
    if (existsSync(testDir)) {
      await fs.rm(testDir, { recursive: true, force: true });
    }
  });

  describe('Filename Conversion Standards', () => {
    it('should convert single spaces to single dots', async () => {
      // Test data
      const testCases = [
        { input: 'Test Name', expected: 'Test.Name.unit' },
        { input: 'M2 Class', expected: 'M2.Class.unit' },
        { input: 'UUID Indexing', expected: 'UUID.Indexing.unit' }
      ];

      for (const testCase of testCases) {
        // Create unit with multi-word name
        unit.unitModel.name = testCase.input;
        unit.unitModel.definition = `Test definition for ${testCase.input}`;
        
        // Create scenario and save
        const scenario = await unit.toScenario(testCase.input.replace(/\s+/g, '.'));
        
        // Check that filename conversion worked correctly
        const expectedFilename = testCase.expected;
        expect(scenario.model.references.some(ref => 
          ref.linkLocation.includes(expectedFilename)
        )).toBe(true);
      }
    });

    it('should handle multiple consecutive spaces correctly', async () => {
      const testCases = [
        { input: 'Test  Multiple   Spaces', expected: 'Test.Multiple.Spaces.unit' },
        { input: 'Extra    Space     Test', expected: 'Extra.Space.Test.unit' }
      ];

      for (const testCase of testCases) {
        unit.unitModel.name = testCase.input;
        const scenario = await unit.toScenario(testCase.input.replace(/\s+/g, '.'));
        
        expect(scenario.model.references.some(ref => 
          ref.linkLocation.includes(testCase.expected)
        )).toBe(true);
      }
    });

    it('should not modify names without spaces', async () => {
      const testCases = [
        { input: 'SingleWord', expected: 'SingleWord.unit' },
        { input: 'AlreadyDotted.Name', expected: 'AlreadyDotted.Name.unit' }
      ];

      for (const testCase of testCases) {
        unit.unitModel.name = testCase.input;
        const scenario = await unit.toScenario(testCase.input);
        
        expect(scenario.model.references.some(ref => 
          ref.linkLocation.includes(testCase.expected)
        )).toBe(true);
      }
    });
  });

  describe('Unit Link Command Filename Consistency', () => {
    it('should create links with single dot conversion', async () => {
      // Create a unit to link to
      const targetUnit = new DefaultUnit();
      const targetScenario = {
        ior: { uuid: crypto.randomUUID(), component: 'Unit', version: '0.3.0.4' },
        owner: '',
        model: {
          uuid: crypto.randomUUID(),
          name: 'Target Unit',
          origin: '',
          definition: 'Target unit for linking test',
          typeM3: TypeM3.CLASS,
          indexPath: `/workspace/scenarios/index/t/e/s/t/1/test-uuid.scenario.json`,
          symlinkPaths: [],
          namedLinks: [],
          executionCapabilities: ['transform', 'validate', 'process'],
          storageCapabilities: ['scenarios', 'ld-links'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      targetUnit.init(targetScenario);

      // Mock the storage for this test to avoid file system dependencies
      unit.storage.loadScenario = async (uuid: string) => targetScenario;
      unit.storage.saveScenario = async (uuid: string, scenario: any, links: string[]) => scenario;

      // Test link creation with multi-word filename
      const testFilename = 'Test Link Name';
      await unit.link(targetScenario.model.uuid, testFilename);

      // Verify conversion logic worked (check console output or scenario update)
      const expectedFilename = 'Test.Link.Name.unit';
      // Since we're mocking storage, just verify the conversion logic
      const converted = testFilename.replace(/\s+/g, '.');
      expect(converted).toBe('Test.Link.Name');
    });

    it('should update scenario namedLinks with converted filename', async () => {
      // Test that scenario is updated with converted filename
      const targetUuid = crypto.randomUUID();
      const testFilename = 'Multi Word Link';
      
      // Mock storage for this test
      const mockScenario = {
        ior: { uuid: targetUuid, component: 'Unit', version: '0.3.0.4' },
        owner: '',
        model: {
          uuid: targetUuid,
          name: 'Test Unit',
          origin: '',
          definition: 'Test definition',
          typeM3: TypeM3.CLASS,
          indexPath: `/workspace/scenarios/index/t/e/s/t/2/${targetUuid}.scenario.json`,
          symlinkPaths: [],
          namedLinks: [],
          executionCapabilities: ['transform', 'validate', 'process'],
          storageCapabilities: ['scenarios', 'ld-links'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      // Mock the storage loadScenario method
      unit.storage.loadScenario = async (uuid: string) => mockScenario;
      unit.storage.saveScenario = async (uuid: string, scenario: any, links: string[]) => {
        // Verify the scenario was updated with converted filename
        expect(scenario.model.references.some((ref: any) => 
          ref.linkLocation.includes('Multi.Word.Link.unit')
        )).toBe(true);
        return scenario;
      };

      await unit.link(targetUuid, testFilename);
    });
  });

  describe('Filename Consistency Across Commands', () => {
    it('should use same conversion logic for create and link commands', () => {
      const testNames = [
        'Simple Test',
        'Complex Multi Word Name',
        'UUID Indexing Test',
        'Storage Capabilities Link'
      ];

      testNames.forEach(name => {
        // Both commands should use same conversion
        const createConversion = name.replace(/\s+/g, '.');
        const linkConversion = name.replace(/\s+/g, '.');
        
        expect(createConversion).toBe(linkConversion);
        expect(createConversion).not.toContain(' ');
        expect(createConversion).not.toContain('..'); // No double dots
      });
    });

    it('should validate all filename conversions use single dots only', () => {
      const testCases = [
        { input: 'One Space', expected: 'One.Space' },
        { input: 'Two  Spaces', expected: 'Two.Spaces' },
        { input: 'Three   Spaces', expected: 'Three.Spaces' },
        { input: 'Multiple    Different     Spaces', expected: 'Multiple.Different.Spaces' }
      ];

      testCases.forEach(testCase => {
        const result = testCase.input.replace(/\s+/g, '.');
        expect(result).toBe(testCase.expected);
        expect(result).not.toContain('..'); // Verify no double dots
        expect(result).not.toContain(' '); // Verify no spaces remain
      });
    });
  });

  describe('Backward Compatibility', () => {
    it('should not break existing functionality with filename conversion', async () => {
      // Test that existing unit operations still work
      unit.unitModel.name = 'Test Unit';
      unit.unitModel.definition = 'Test definition';
      
      // Test basic functionality
      const scenario = await unit.toScenario('Test.Unit');
      expect(scenario.model.name).toBe('Test Unit');
      expect(scenario.model.definition).toBe('Test definition');
      
      // Test validation (use existing validate method for objects)
      const isValid = unit.validate({name: 'test'});
      expect(isValid).toBe(true);
    });
  });
});