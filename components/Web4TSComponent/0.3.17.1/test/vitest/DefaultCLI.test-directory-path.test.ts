/**
 * Test: DefaultCLI Test Directory Path Calculation
 * 
 * Verifies that CLI detects and stores correct paths in this.model for both:
 * - Production scenario (running from component directory)
 * - Test isolation scenario (running from test/data)
 * 
 * CRITICAL: DefaultCLI is the **Path Authority** - detects ALL paths ONCE in init()
 * DefaultWeb4TSComponent is **unaware** of test vs prod - CLI tells it via setTargetDirectory()
 * 
 * CRITICAL BUG: web4tscomponent test file currently breaks because path is doubled:
 * Expected: /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.17.1/test
 * Actual:   /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.17.1/components/Web4TSComponent/0.3.17.1/test
 * 
 * @pdca 2025-10-30-UTC-0859.pdca.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';
import * as path from 'path';
import * as fs from 'fs';

describe('🧪 DefaultCLI - Path Authority (Production Scenario)', () => {
  let cli: Web4TSComponentCLI;
  let originalCwd: string;
  const componentRoot = path.join(__dirname, '../..');
  
  beforeEach(() => {
    // Save original cwd
    originalCwd = process.cwd();
    
    // Change to component root (simulate production: web4tscomponent test file)
    process.chdir(componentRoot);
    
    // Create CLI instance with proper initialization
    cli = new Web4TSComponentCLI();
    cli.init();
  });
  
  afterEach(() => {
    // Restore original cwd
    process.chdir(originalCwd);
  });

  it('should detect projectRoot correctly in production', () => {
    const model = (cli as any).model;
    
    // In production, project root should be the main Web4Articles directory
    expect(model.projectRoot).toBe(path.join(componentRoot, '../../..'));
    expect(model.projectRoot).toContain('Web4Articles');
    expect(model.projectRoot).not.toContain('/test/data');
    
    console.log(`   ✅ Production projectRoot: ${model.projectRoot}`);
  });

  it('should detect component context correctly in production', () => {
    const model = (cli as any).model;
    
    // Should detect Web4TSComponent and version
    expect(model.componentName).toBe('Web4TSComponent');
    expect(model.componentVersion).toMatch(/^0\.3\.\d+\.\d+$/);
    expect(model.componentPath).toBe(componentRoot);
    
    console.log(`   ✅ Component: ${model.componentName} ${model.componentVersion}`);
    console.log(`   ✅ Component path: ${model.componentPath}`);
  });

  it('should calculate test directory correctly in production', () => {
    const model = (cli as any).model;
    
    // Test directory should be component/test
    expect(model.testDirectory).toBe(path.join(componentRoot, 'test'));
    
    // Verify: Path should NOT be doubled
    expect(model.testDirectory).not.toContain('/components/Web4TSComponent/0.3.17.1/components/Web4TSComponent/0.3.17.1');
    
    // Verify test directory exists
    expect(fs.existsSync(model.testDirectory)).toBe(true);
    
    console.log(`   ✅ Test directory: ${model.testDirectory}`);
  });

  it('should mark isTestIsolation as false in production', () => {
    const model = (cli as any).model;
    
    expect(model.isTestIsolation).toBe(false);
    
    console.log(`   ✅ Test isolation: ${model.isTestIsolation}`);
  });

  it('should provide test directory via getTestDir() without recalculation', () => {
    // getTestDir() should simply return stored value
    const testDir = (cli as any).getTestDir();
    const model = (cli as any).model;
    
    // Should return the same value stored in model
    expect(testDir).toBe(model.testDirectory);
    expect(testDir).toBe(path.join(componentRoot, 'test'));
    
    console.log(`   ✅ getTestDir() returns stored value: ${testDir}`);
  });

  it('should tell DefaultWeb4TSComponent the correct project root', () => {
    const model = (cli as any).model;
    
    // CLI should set targetDirectory on component
    if (model.component) {
      const componentModel = model.component.model;
      expect(componentModel.targetDirectory).toBe(model.projectRoot);
      
      console.log(`   ✅ Component targetDirectory set: ${componentModel.targetDirectory}`);
    }
  });
});

describe('🧪 DefaultCLI - Path Authority (Test Isolation Scenario)', () => {
  let cli: Web4TSComponentCLI;
  let originalCwd: string;
  const componentRoot = path.join(__dirname, '../..');
  const testIsolationRoot = path.join(componentRoot, 'test/data');
  const testComponentPath = path.join(testIsolationRoot, 'components/TestIsolatedComponent/0.1.0.0');
  
  beforeEach(() => {
    // Save original cwd
    originalCwd = process.cwd();
    
    // Ensure test isolation component exists
    if (!fs.existsSync(testComponentPath)) {
      throw new Error(`Test isolation component not found: ${testComponentPath}. Run component-creation-isolation.test.ts first.`);
    }
    
    // Change to test isolation component (simulate: testisolatedcomponent test file)
    process.chdir(testComponentPath);
    
    // Create CLI instance with proper initialization
    cli = new Web4TSComponentCLI();
    cli.init();
  });
  
  afterEach(() => {
    // Restore original cwd
    process.chdir(originalCwd);
  });

  it('should detect projectRoot as test/data in test isolation', () => {
    const model = (cli as any).model;
    
    // In test isolation, project root should be test/data
    expect(model.projectRoot).toBe(testIsolationRoot);
    expect(model.projectRoot).toContain('/test/data');
    expect(model.projectRoot).not.toContain('/test/data/components');
    
    console.log(`   ✅ Test isolation projectRoot: ${model.projectRoot}`);
  });

  it('should detect component context correctly in test isolation', () => {
    const model = (cli as any).model;
    
    // Should detect TestIsolatedComponent and version
    expect(model.componentName).toBe('TestIsolatedComponent');
    expect(model.componentVersion).toBe('0.1.0.0');
    expect(model.componentPath).toBe(testComponentPath);
    
    console.log(`   ✅ Component: ${model.componentName} ${model.componentVersion}`);
    console.log(`   ✅ Component path: ${model.componentPath}`);
  });

  it('should calculate test directory correctly in test isolation', () => {
    const model = (cli as any).model;
    
    // Test directory should be test/data/components/TestIsolatedComponent/0.1.0.0/test
    expect(model.testDirectory).toBe(path.join(testComponentPath, 'test'));
    
    // Verify: Path should NOT be doubled
    expect(model.testDirectory).not.toContain('/test/data/components/TestIsolatedComponent/0.1.0.0/components/TestIsolatedComponent/0.1.0.0');
    
    console.log(`   ✅ Test directory: ${model.testDirectory}`);
  });

  it('should mark isTestIsolation as true in test isolation', () => {
    const model = (cli as any).model;
    
    expect(model.isTestIsolation).toBe(true);
    
    console.log(`   ✅ Test isolation: ${model.isTestIsolation}`);
  });

  it('should provide same test directory via getTestDir() without recalculation', () => {
    // getTestDir() should simply return stored value
    const testDir = (cli as any).getTestDir();
    const model = (cli as any).model;
    
    // Should return the same value stored in model
    expect(testDir).toBe(model.testDirectory);
    expect(testDir).toBe(path.join(testComponentPath, 'test'));
    
    console.log(`   ✅ getTestDir() returns stored value: ${testDir}`);
  });

  it('should tell DefaultWeb4TSComponent the correct test/data project root', () => {
    const model = (cli as any).model;
    
    // CLI should set targetDirectory on component to test/data (not main project root)
    if (model.component) {
      const componentModel = model.component.model;
      expect(componentModel.targetDirectory).toBe(model.projectRoot);
      expect(componentModel.targetDirectory).toBe(testIsolationRoot);
      
      console.log(`   ✅ Component targetDirectory set: ${componentModel.targetDirectory}`);
    }
  });

  it('should handle SAME component operations in both scenarios identically', () => {
    // This test verifies the key principle:
    // DefaultWeb4TSComponent is UNAWARE of test vs prod
    // It just operates on whatever targetDirectory the CLI sets
    
    const model = (cli as any).model;
    
    if (model.component) {
      // Component should have targetDirectory set
      expect(model.component.model.targetDirectory).toBeDefined();
      
      // Component's resolveComponentPath should use targetDirectory
      // In test isolation: test/data
      // In production: project root
      // Component doesn't care which - it just uses what CLI set
      const componentTargetDir = model.component.model.targetDirectory;
      expect(componentTargetDir).toBe(model.projectRoot);
      
      console.log(`   ✅ Component operates on CLI-provided path: ${componentTargetDir}`);
    }
  });
});

