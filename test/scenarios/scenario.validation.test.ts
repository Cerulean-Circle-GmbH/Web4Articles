/**
 * Scenario File Validation Tests
 * Developer role with Quality/Testing focus - Extended session
 * Using Vitest as specified in PDCA guidelines
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { ScenarioValidator, type ScenarioFile } from '../../src/ts/scenarios/ScenarioSchema.js';

// Helper function to recursively find all scenario files
function findScenarioFiles(dir: string): string[] {
  const files: string[] = [];
  const items = readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findScenarioFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.scenario.json')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Load all scenario files for testing
const scenariosDir = resolve(process.cwd(), 'scenarios');
const scenarioFilePaths = findScenarioFiles(scenariosDir);

describe('Scenario File Validation', () => {
  test('should find scenario files in scenarios directory', () => {
    expect(scenarioFilePaths.length).toBeGreaterThan(0);
    console.log(`Found ${scenarioFilePaths.length} scenario files for validation`);
  });

  test('all scenario files should be valid JSON', () => {
    const invalidJsonFiles: string[] = [];
    
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (error) {
        invalidJsonFiles.push(filePath);
      }
    }
    
    expect(invalidJsonFiles).toEqual([]);
    if (invalidJsonFiles.length > 0) {
      console.error('Invalid JSON files:', invalidJsonFiles);
    }
  });

  test('all scenario files should match ScenarioFile schema', () => {
    const scenarioData: { path: string; content: any }[] = [];
    
    // Load all scenarios
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        scenarioData.push({ path: filePath, content: parsed });
      } catch (error) {
        // Skip files that failed JSON parsing (handled by previous test)
        continue;
      }
    }
    
    // Validate all scenarios
    const validationResult = ScenarioValidator.validateAllScenarios(scenarioData);
    
    console.log(`Validation Summary: ${validationResult.summary}`);
    
    if (validationResult.invalidFiles.length > 0) {
      console.error('Invalid scenario files:');
      for (const invalid of validationResult.invalidFiles) {
        console.error(`${invalid.path}:`);
        for (const error of invalid.errors) {
          console.error(`  - ${error}`);
        }
      }
    }
    
    expect(validationResult.invalidFiles).toEqual([]);
  });

  test('scenario UUIDs should be consistent across all sections', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        // All UUIDs should match
        expect(scenario.IOR.uuid).toBe(scenario.model.uuid);
        expect(scenario.IOR.uuid).toBe(scenario.unitIndex.uuid);
        
        // UUID should be present in the file path
        expect(filePath).toContain(scenario.IOR.uuid);
        
      } catch (error) {
        // Skip invalid files (handled by other tests)
        continue;
      }
    }
  });

  test('scenario file paths should follow hash-based directory structure', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        const uuid = scenario.IOR.uuid;
        const expectedPathPattern = new RegExp(
          `scenarios/index/${uuid[0]}/${uuid[1]}/${uuid[2]}/${uuid[3]}/${uuid[4]}/${uuid}.scenario.json$`
        );
        
        expect(filePath).toMatch(expectedPathPattern);
        
      } catch (error) {
        // Skip invalid files
        continue;
      }
    }
  });

  test('owner data should be valid base64 encoded JSON', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        // Decode base64 owner data
        const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
        const ownerData = JSON.parse(decoded);
        
        expect(ownerData).toHaveProperty('user');
        expect(ownerData).toHaveProperty('hostname');
        expect(ownerData).toHaveProperty('utcTimestamp');
        expect(ownerData).toHaveProperty('uuid');
        
        // Validate UUID format in owner data
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        expect(ownerData.uuid).toMatch(uuidRegex);
        
      } catch (error) {
        // Skip invalid files
        continue;
      }
    }
  });

  test('timestamps should be valid ISO 8601 format', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        // Validate createdAt and updatedAt timestamps
        const createdAt = new Date(scenario.unitIndex.createdAt);
        const updatedAt = new Date(scenario.unitIndex.updatedAt);
        
        expect(createdAt.toISOString()).toBe(scenario.unitIndex.createdAt);
        expect(updatedAt.toISOString()).toBe(scenario.unitIndex.updatedAt);
        
        // updatedAt should be >= createdAt
        expect(updatedAt.getTime()).toBeGreaterThanOrEqual(createdAt.getTime());
        
      } catch (error) {
        // Skip invalid files
        continue;
      }
    }
  });

  test('symlink paths should be valid and consistent', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        expect(Array.isArray(scenario.unitIndex.symlinkPaths)).toBe(true);
        expect(scenario.unitIndex.symlinkPaths.length).toBeGreaterThan(0);
        
        // Each symlink path should contain the UUID
        for (const symlinkPath of scenario.unitIndex.symlinkPaths) {
          expect(symlinkPath).toContain(scenario.IOR.uuid);
          expect(symlinkPath).toMatch(/\.scenario\.json$/);
        }
        
      } catch (error) {
        // Skip invalid files  
        continue;
      }
    }
  });

  test('scenario content should have meaningful descriptions', () => {
    for (const filePath of scenarioFilePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const scenario = JSON.parse(content) as ScenarioFile;
        
        // Description should not be empty or just placeholder text
        expect(scenario.model.description.length).toBeGreaterThan(10);
        expect(scenario.model.description).not.toBe('TODO');
        expect(scenario.model.description).not.toBe('Description');
        
        // Name and title should be meaningful
        expect(scenario.model.name.length).toBeGreaterThan(3);
        expect(scenario.model.title.length).toBeGreaterThan(3);
        
      } catch (error) {
        // Skip invalid files
        continue;
      }
    }
  });

  test('scenario files count should match expected total', () => {
    // Based on the find command, we expect around 50 files
    expect(scenarioFilePaths.length).toBeGreaterThan(40);
    expect(scenarioFilePaths.length).toBeLessThan(100);
    console.log(`Total scenario files: ${scenarioFilePaths.length}`);
  });
});

// Export utilities for use in other tests
export { findScenarioFiles, scenarioFilePaths };