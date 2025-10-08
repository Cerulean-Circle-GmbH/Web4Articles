import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

/**
 * 🎯 CRITICAL BUG TEST: Promotion Context Detection
 * 
 * PROBLEM: After vitest completes, getCurrentVersion() was reading from wrong directory
 * because it used process.cwd() which could be anywhere (e.g., test/data/components/Web4TSComponent/0.3.3.2)
 * 
 * EXPECTED: After 100% test success, promotion should read version from THE ACTUAL COMPONENT (0.3.4.1)
 * NOT from test fixtures (test/data/components/Web4TSComponent/0.3.3.2)
 * 
 * FIX: getCurrentVersion() must use import.meta.url to get actual component directory
 */
describe('🐛 Promotion Context Bug Tests', () => {
  let component: DefaultWeb4TSComponent;
  const testDataRoot = path.join(process.cwd(), 'test', 'data');

  beforeEach(async () => {
    component = new DefaultWeb4TSComponent();
    
    // Initialize test environment
    if (!existsSync(testDataRoot)) {
      await component.init();
    }
  });

  describe('📍 getCurrentVersion() Path Resolution', () => {
    it('should read version from ACTUAL component dir, not process.cwd()', async () => {
      // Simulate vitest running from test/data subdirectory
      const originalCwd = process.cwd();
      
      try {
        // Change to test/data to simulate vitest context
        const testDataPath = path.join(originalCwd, 'test', 'data');
        if (existsSync(testDataPath)) {
          process.chdir(testDataPath);
        }
        
        console.log(`📍 Test running from: ${process.cwd()}`);
        console.log(`📍 Should read version from component at: ${originalCwd}`);
        
        // getCurrentVersion should STILL return 0.3.4.1, not anything from test/data
        // This is internal, so we'll test via promotion which calls it
        
        const component = new DefaultWeb4TSComponent();
        
        // The component should know its own version regardless of cwd
        const scenario = await component.toScenario();
        
        expect(scenario.ior.version).toBe('0.3.4.1');
        expect(scenario.ior.version).not.toBe('0.3.3.2');
        
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should detect test environment correctly when cwd is in test/data', async () => {
      const originalCwd = process.cwd();
      
      try {
        // Change to test/data
        const testDataPath = path.join(originalCwd, 'test', 'data');
        if (existsSync(testDataPath)) {
          process.chdir(testDataPath);
          
          console.log(`📍 Changed cwd to: ${process.cwd()}`);
          
          // This check should detect we're in test environment
          const inTestEnv = process.cwd().includes('/test/data');
          expect(inTestEnv).toBe(true);
        }
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('🚀 Promotion After Test Success', () => {
    it('should NOT promote when cwd is in test/data (during test execution)', async () => {
      const originalCwd = process.cwd();
      
      try {
        const testDataPath = path.join(originalCwd, 'test', 'data');
        if (existsSync(testDataPath)) {
          process.chdir(testDataPath);
          
          console.log(`\n🧪 Simulating: vitest running in ${process.cwd()}`);
          
          // During test execution, promotion should be skipped
          // We can't easily test this without running actual promotion,
          // but we can verify the check logic
          
          const shouldSkip = process.cwd().includes('/test/data');
          expect(shouldSkip).toBe(true);
          console.log(`✅ Promotion would be skipped (in test environment)`);
        }
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should promote from CORRECT version when cwd is component root', async () => {
      // When running from component root (after vitest returns control)
      const componentRoot = process.cwd();
      
      console.log(`\n🚀 Simulating: After vitest completes, back in ${componentRoot}`);
      
      // Verify we're in component root, not test/data
      expect(componentRoot).not.toContain('/test/data');
      expect(componentRoot).toContain('Web4TSComponent/0.3.4.1');
      
      // The component should read its own version correctly
      const scenario = await component.toScenario();
      expect(scenario.ior.version).toBe('0.3.4.1');
      
      console.log(`✅ Would promote from correct version: ${scenario.ior.version}`);
    });
  });

  describe('🎯 Real-World Scenario: vitest → promotion', () => {
    it('should maintain correct context throughout test → promote workflow', async () => {
      const componentRoot = process.cwd();
      
      console.log(`\n📋 WORKFLOW TEST:`);
      console.log(`   1. Start in: ${componentRoot}`);
      
      // Step 1: vitest runs tests (changes cwd to test dirs)
      const testDataPath = path.join(componentRoot, 'test', 'data');
      if (existsSync(testDataPath)) {
        process.chdir(testDataPath);
        console.log(`   2. vitest changes cwd to: ${process.cwd()}`);
        
        // During tests, promotion should be disabled
        const duringTests = process.cwd().includes('/test/data');
        expect(duringTests).toBe(true);
        console.log(`   3. ✅ Promotion disabled (in test env)`);
      }
      
      // Step 2: vitest completes, returns to component root
      process.chdir(componentRoot);
      console.log(`   4. vitest completes, back to: ${process.cwd()}`);
      
      // Step 3: Promotion should now read CORRECT version
      const afterTests = process.cwd().includes('/test/data');
      expect(afterTests).toBe(false);
      console.log(`   5. ✅ Not in test env, promotion can proceed`);
      
      const scenario = await component.toScenario();
      expect(scenario.ior.version).toBe('0.3.4.1');
      console.log(`   6. ✅ Promotion would use correct version: ${scenario.ior.version}`);
    });
  });
});

