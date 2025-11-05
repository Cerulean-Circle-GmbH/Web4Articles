import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readdirSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Web4 Pattern: Module-level constants
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');
const projectRoot = path.join(componentRoot, '../../..');

describe('🔴 Test Isolation Compliance (CMM3 Automated)', () => {
  describe('No Nested Components Directories', () => {
    it('should NOT have components/ inside any version directory', async () => {
      // ❌ CRITICAL VIOLATION: components/Web4TSComponent/0.3.17.1/components MUST NOT EXIST
      // This indicates process.cwd() was used instead of proper test/data isolation
      
      const violations: string[] = [];
      
      // Scan all component version directories
      const versionDirs = await glob('components/*/*', { 
        cwd: projectRoot,
        onlyDirectories: true 
      });
      
      for (const versionDir of versionDirs) {
        const fullPath = path.join(projectRoot, versionDir);
        const nestedComponentsPath = path.join(fullPath, 'components');
        
        if (existsSync(nestedComponentsPath)) {
          // Check if it has actual content (not just empty dir)
          try {
            const entries = readdirSync(nestedComponentsPath);
            if (entries.length > 0) {
              violations.push(`${versionDir}/components (${entries.length} entries)`);
            }
          } catch {
            // Permission denied or similar - skip
          }
        }
      }
      
      expect(
        violations,
        `Found nested components/ directories (test isolation violation):\n${violations.join('\n')}`
      ).toHaveLength(0);
    });
    
    it('should have test/data as the ONLY test creation location', () => {
      // Verify test isolation directory exists and is used correctly
      const testDataPath = path.join(componentRoot, 'test/data');
      
      expect(existsSync(testDataPath), 'test/data must exist for test isolation').toBe(true);
      
      // Verify test/data has components directory (correct location)
      const testComponentsPath = path.join(testDataPath, 'components');
      expect(
        existsSync(testComponentsPath),
        'test/data/components should exist (proper test isolation)'
      ).toBe(true);
    });
  });
  
  describe('init() Requires targetDirectory', () => {
    it('should throw error when init() called without targetDirectory in scenario', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      // ❌ After fix: This should FAIL FAST
      // BEFORE: Uses process.cwd() (dangerous!)
      // AFTER: Throws error requiring explicit targetDirectory
      
      expect(() => {
        const component = new DefaultWeb4TSComponent().init();
        // Should not reach here - init() must fail without targetDirectory
      }).toThrow(/targetDirectory is required/i);
    });
    
    it('should work when init() called WITH targetDirectory in scenario', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      const testDataPath = path.join(componentRoot, 'test/data');
      
      // ✅ Correct pattern: Always provide targetDirectory explicitly
      const component = new DefaultWeb4TSComponent().init({
        model: {
          targetDirectory: testDataPath
        }
      });
      
      expect(component.model.targetDirectory).toBe(testDataPath);
    });
  });
});
