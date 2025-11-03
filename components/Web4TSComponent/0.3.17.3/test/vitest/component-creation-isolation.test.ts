/**
 * Component Creation Test Isolation
 * 
 * Tests that web4tscomponent create works in test isolation (./test/data)
 * using the delegation pattern - created components delegate to Web4TSComponent master.
 * 
 * Test-first development: Written before implementation to validate requirements.
 * 
 * @pdca 2025-10-29-UTC-1227.test-isolation-create.pdca.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm, mkdir } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

describe('🧪 Component Creation Test Isolation', () => {
  // ✅ Web4 Pattern: No underscore naming, use fileURLToPath for ESM
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '../..');
  const testDataDir = path.join(componentRoot, 'test/data');
  const testComponentName = 'TestIsolatedComponent';
  const testVersion = '0.1.0.0';
  // Component will be created at: targetDirectory/components/TestIsolatedComponent/0.1.0.0
  // So we set targetDirectory to testDataDir parent to get: testDataDir/components/TestIsolatedComponent/0.1.0.0
  const testComponentPath = path.join(testDataDir, 'components', testComponentName, testVersion);

  /**
   * Evidence-Based Testing Pattern (2025-10-30-UTC-0832.test-evidence-persistence.pdca.md):
   * 
   * - beforeAll: Clean OLD evidence (fresh start)
   * - Tests run: Create components in test/data
   * - afterAll: DO NOTHING (keep evidence for inspection)
   * - Next run: beforeAll cleans again
   * 
   * test/data becomes a testable alternate isolated project root.
   * After tests run, you can cd into test/data and inspect/test manually.
   */
  beforeAll(async () => {
    // Clean old evidence before tests (fresh start)
    const testComponentsDir = path.join(testDataDir, 'components');
    if (existsSync(testComponentsDir)) {
      await rm(testComponentsDir, { recursive: true, force: true });
      console.log(`   🧹 Cleaned old evidence: test/data/components/`);
    }
    
    // Ensure test/data directory exists
    if (!existsSync(testDataDir)) {
      await mkdir(testDataDir, { recursive: true });
    }
  });

  // ✅ NO afterAll - evidence persists for inspection

  it('should create component in test/data using targetDirectory', async () => {
    // Import dynamically to avoid module-level import issues
    const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
    
    // ✅ Test Isolation Pattern (2025-10-30-UTC-0832.test-evidence-persistence.pdca.md):
    // Component uses targetDirectory in init() for test isolation
    // Evidence persists after test for manual inspection
    // test/data becomes a testable alternate isolated project root
    // @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md - init() requires targetDirectory
    
    // Create component instance with test isolation
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    const component = new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: testDataDir,
        targetDirectory: testDataDir 
      }
    });
    
    // Create component in test isolation
    await component.create(testComponentName, testVersion, 'all');
    
    // Verify: Component created in test/data/components/, not in production components/
    expect(existsSync(testComponentPath)).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'package.json'))).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'src/ts'))).toBe(true);
    expect(existsSync(path.join(testComponentPath, 'src/sh'))).toBe(true);
    
    console.log(`   ✅ Component created in test isolation: ${testComponentPath}`);
    console.log(`   📂 Evidence persists at: ${testDataDir}`);
  });

  it('should use delegation pattern - created component delegates to Web4TSComponent', async () => {
    // Verify delegation: Component should have getWeb4TSComponent() method for delegation
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    
    expect(existsSync(defaultComponentPath)).toBe(true);
    
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Check composition-based delegation pattern (NOT inheritance)
    expect(content).toContain('getWeb4TSComponent'); // Lazy delegation loader
    expect(content).toContain('DefaultWeb4TSComponent'); // Imports Web4TSComponent for delegation
    expect(content).toContain(`class Default${testComponentName}`);
    expect(content).toContain(`implements ${testComponentName}`); // Implements own interface
    
    console.log(`   ✅ Delegation pattern verified: composition-based delegation to Web4TSComponent`);
  });

  it('should have all Web4TSComponent features via delegation', async () => {
    // Verify that the component delegates to Web4TSComponent for operations
    const defaultComponentPath = path.join(testComponentPath, `src/ts/layer2/Default${testComponentName}.ts`);
    const content = await readFile(defaultComponentPath, 'utf-8');
    
    // Verify delegation methods exist for key operations
    expect(content).toContain('async test('); // Has test method
    expect(content).toContain('async build('); // Has build method  
    expect(content).toContain('async clean('); // Has clean method
    expect(content).toContain('async tree('); // Has tree method
    expect(content).toContain('async links('); // Has links method
    
    // ✅ NEW: Verify DRY helper pattern for delegation (not direct web4ts calls)
    // @pdca 2025-11-03-UTC-1200.pdca.md - DRY OOP pattern for context delegation
    expect(content).toContain('delegateToWeb4TS'); // Has DRY helper method
    expect(content).toContain('return this.delegateToWeb4TS'); // Uses DRY helper
    
    console.log(`   ✅ Delegation methods verified (test, build, clean, tree, links) using DRY helper`);
  });

  it('should have proper CLI with auto-discovery', async () => {
    // Verify CLI was created with correct naming pattern
    const cliPath = path.join(testComponentPath, `src/ts/layer5/${testComponentName}CLI.ts`);
    expect(existsSync(cliPath)).toBe(true);
    
    const cliContent = await readFile(cliPath, 'utf-8');
    
    // Verify CLI has executeDynamicCommand (auto-discovery)
    expect(cliContent).toContain('executeDynamicCommand');
    
    console.log(`   ✅ CLI with auto-discovery created`);
  });

  it('should have build system (scripts)', async () => {
    // Verify build scripts exist
    const buildScript = path.join(testComponentPath, 'src/sh/build.sh');
    const testScript = path.join(testComponentPath, 'src/sh/test.sh');
    const cleanScript = path.join(testComponentPath, 'src/sh/clean.sh');
    
    expect(existsSync(buildScript)).toBe(true);
    expect(existsSync(testScript)).toBe(true);
    expect(existsSync(cleanScript)).toBe(true);
    
    console.log(`   ✅ Build system scripts created`);
  });

  it('should have proper TypeScript configuration', async () => {
    // Verify tsconfig.json exists and extends root
    const tsconfigPath = path.join(testComponentPath, 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);
    
    const tsconfigContent = await readFile(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // Should extend root tsconfig (DRY principle)
    expect(tsconfig.extends).toBeDefined();
    
    console.log(`   ✅ TypeScript configuration with extends pattern`);
  });

  it('should NOT create component in production components/ directory', () => {
    // Verify component was NOT created in production path (at project root)
    const productionComponentRoot = path.join(componentRoot, '../../..');
    const productionPath = path.join(productionComponentRoot, 'components', testComponentName, testVersion);
    
    expect(existsSync(productionPath)).toBe(false);
    
    console.log(`   ✅ Component NOT created in production (test isolation working)`);
  });
});

