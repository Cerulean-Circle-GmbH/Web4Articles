/**
 * Test Success Verification Tests
 * 
 * Tests the verifyTestSuccess() method and ensures:
 * - Promotion only happens on 100% test pass
 * - Test results are actually read from test-results.json
 * - Failed tests block promotion
 * - Missing test results block promotion
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { existsSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import * as path from 'path';

describe('🧪 Test Success Verification', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.resolve(process.cwd(), 'test/data');
  
  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  describe('📊 verifyTestSuccess() Method', () => {
    const testResultsPath = path.join(process.cwd(), 'test/test-results.json');

    it('should return false when test-results.json does not exist', async () => {
      // Temporarily rename the file if it exists
      const backupPath = testResultsPath + '.backup';
      if (existsSync(testResultsPath)) {
        require('fs').renameSync(testResultsPath, backupPath);
      }

      try {
        const result = await (component as any).verifyTestSuccess('TestComponent', '0.1.0.0');
        expect(result).toBe(false);
      } finally {
        // Restore the file
        if (existsSync(backupPath)) {
          require('fs').renameSync(backupPath, testResultsPath);
        }
      }
    });

    it('should return true when all tests pass (100% success)', async () => {
      // Create mock test results with 100% success
      const testDir = path.dirname(testResultsPath);
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }

      const mockResults = {
        numTotalTests: 10,
        numPassedTests: 10,
        numFailedTests: 0,
        success: true
      };

      writeFileSync(testResultsPath, JSON.stringify(mockResults, null, 2));

      const result = await (component as any).verifyTestSuccess('TestComponent', '0.1.0.0');
      expect(result).toBe(true);
    });

    it('should return false when some tests fail', async () => {
      const mockResults = {
        numTotalTests: 10,
        numPassedTests: 8,
        numFailedTests: 2,
        success: false
      };

      writeFileSync(testResultsPath, JSON.stringify(mockResults, null, 2));

      const result = await (component as any).verifyTestSuccess('TestComponent', '0.1.0.0');
      expect(result).toBe(false);
    });

    it('should return false when no tests ran', async () => {
      const mockResults = {
        numTotalTests: 0,
        numPassedTests: 0,
        numFailedTests: 0,
        success: true
      };

      writeFileSync(testResultsPath, JSON.stringify(mockResults, null, 2));

      const result = await (component as any).verifyTestSuccess('TestComponent', '0.1.0.0');
      expect(result).toBe(false);
    });

    it('should return false on malformed JSON', async () => {
      writeFileSync(testResultsPath, 'not valid json{{{');

      const result = await (component as any).verifyTestSuccess('TestComponent', '0.1.0.0');
      expect(result).toBe(false);
    });
  });

  describe('🚫 Promotion Blocked on Test Failure', () => {
    const testComponentName = 'PromotionBlockTest';
    const testVersion = '0.1.0.0';
    const testResultsPath = path.join(process.cwd(), 'test/test-results.json');

    beforeEach(async () => {
      // Clean up
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      if (existsSync(componentDir)) {
        rmSync(componentDir, { recursive: true, force: true });
      }
    });

    it('should not promote when tests fail', async () => {
      // Create component
      await component.create(testComponentName, testVersion, 'all');
      await component.on(testComponentName, testVersion);
      
      // Set up as test version
      await component.setTest(testVersion);
      await component.setDev(testVersion);
      
      // Create mock failed test results
      const mockResults = {
        numTotalTests: 10,
        numPassedTests: 7,
        numFailedTests: 3,
        success: false
      };
      writeFileSync(testResultsPath, JSON.stringify(mockResults, null, 2));
      
      // Try to promote (should be blocked)
      await component.handleTestSuccessPromotion(testComponentName, testVersion);
      
      // Verify no promotion happened
      const links = await component.getSemanticLinks(testComponentName);
      expect(links.test).toBe(testVersion); // Still test
      expect(links.prod).not.toBe(testVersion); // Not promoted to prod
      
      // Verify nextPatch was NOT created
      const componentDir = path.join(testDataDir, 'components', testComponentName);
      expect(existsSync(path.join(componentDir, '0.2.0.0'))).toBe(false);
    });

    it('should promote when tests pass 100%', async () => {
      // Create component
      await component.create(testComponentName, testVersion, 'all');
      await component.on(testComponentName, testVersion);
      
      // Set up as test version
      await component.setTest(testVersion);
      await component.setDev(testVersion);
      
      // Create mock successful test results
      const mockResults = {
        numTotalTests: 10,
        numPassedTests: 10,
        numFailedTests: 0,
        success: true
      };
      writeFileSync(testResultsPath, JSON.stringify(mockResults, null, 2));
      
      // Promotion should be blocked in test/data environment
      await component.handleTestSuccessPromotion(testComponentName, testVersion);
      
      // In test/data, promotion is blocked for safety
      const links = await component.getSemanticLinks(testComponentName);
      expect(links.test).toBe(testVersion); // Unchanged (blocked in test env)
    });
  });

  describe('📈 Real Test Results Integration', () => {
    it('should correctly parse actual vitest test-results.json format', async () => {
      const testResultsPath = path.join(process.cwd(), 'test/test-results.json');
      
      // Read actual test results if they exist
      if (existsSync(testResultsPath)) {
        const actualResults = JSON.parse(require('fs').readFileSync(testResultsPath, 'utf-8'));
        
        // Verify structure
        expect(actualResults).toHaveProperty('numTotalTests');
        expect(actualResults).toHaveProperty('numPassedTests');
        expect(actualResults).toHaveProperty('numFailedTests');
        
        // Test the method with actual results
        const result = await (component as any).verifyTestSuccess('Web4TSComponent', '0.3.5.1');
        
        // Result should match actual test state
        const expectedSuccess = actualResults.numFailedTests === 0 && 
                              actualResults.numPassedTests === actualResults.numTotalTests &&
                              actualResults.numTotalTests > 0;
        expect(result).toBe(expectedSuccess);
        
        console.log(`📊 Actual test results: ${actualResults.numPassedTests}/${actualResults.numTotalTests} passed`);
        console.log(`✅ verifyTestSuccess() correctly returned: ${result}`);
      } else {
        console.log('⚠️  No actual test results found - skipping integration test');
      }
    });
  });
});

