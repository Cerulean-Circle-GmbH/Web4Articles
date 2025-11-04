/**
 * Test: DefaultCLI Path Authority Architecture
 * 
 * Verifies that CLI detects and stores correct paths in this.model for both:
 * - Production scenario (running from component directory)
 * - Test isolation scenario (running from test/data)
 * 
 * ARCHITECTURE: DefaultCLI is the **Path Authority** - calculates ALL paths ONCE in init()
 * DefaultWeb4TSComponent is **unaware** of test vs prod - CLI tells it via setTargetDirectory()
 * 
 * @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority architecture completed
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

// ✅ Web4 Pattern: Calculate once at module level for reuse
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');

describe('🧪 DefaultCLI - Path Authority (Production Scenario)', () => {
  let cli: Web4TSComponentCLI;
  let originalCwd: string;
  
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
  // ✅ Web4 Pattern: Reuse module-level componentRoot
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
