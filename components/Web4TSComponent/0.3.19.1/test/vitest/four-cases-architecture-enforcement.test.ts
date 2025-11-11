/**
 * Four Cases Architecture Enforcement Test
 * 
 * @pdca 2025-11-03-UTC-2000.pdca.md
 * 
 * CRITICAL: This test MUST catch when old `process.cwd()` patterns are reintroduced.
 * 
 * Validates the 4 critical cases:
 * 1. Production `create` - Component created in projectRoot/components
 * 2. Test `create` - Component created in test/data/components
 * 3. Production `initProject` - Files created in projectRoot
 * 4. Test `initProject` - Files created in test/data
 * 
 * **Path Authority Principle:**
 * - DefaultCLI calculates ALL paths (projectRoot, targetDirectory, componentRoot)
 * - DefaultWeb4TSComponent uses ONLY model state (NEVER calculates paths)
 * - Model-Driven Program Flow (behavior determined by model, not environment)
 * - Environment-Agnostic (NO process.cwd() or process.env in Component)
 * 
 * **If this test fails with "process.cwd() violation" - READ THIS:**
 * 
 * The fix is ALWAYS the same:
 * 1. DO NOT calculate paths in Component methods (create, initProject, etc.)
 * 2. USE this.model.projectRoot (calculated by CLI in init())
 * 3. USE this.model.targetDirectory (calculated by CLI in init())
 * 4. USE this.model.componentRoot (set by Component.init() based on projectRoot)
 * 
 * NEVER do this:
 * ```typescript
 * const projectRoot = process.cwd(); // ❌ WRONG
 * const projectRoot = path.join(process.cwd(), '..'); // ❌ WRONG
 * const projectRoot = this.calculateProjectRoot(); // ❌ WRONG (unless in CLI)
 * ```
 * 
 * ALWAYS do this:
 * ```typescript
 * const projectRoot = this.model.projectRoot; // ✅ CORRECT
 * const targetDir = this.model.targetDirectory; // ✅ CORRECT
 * const componentRoot = this.model.componentRoot; // ✅ CORRECT
 * ```
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { rm, mkdir } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';

// ✅ Web4 Pattern: Use import.meta.url for ESM
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');
const projectRoot = path.join(componentRoot, '../../..');
const testDataDir = path.join(componentRoot, 'test/data');

describe('🔴 Four Cases Architecture Enforcement (CRITICAL)', () => {
  
  beforeAll(async () => {
    // Clean test evidence
    const testComponentsDir = path.join(testDataDir, 'components/ArchTest');
    if (existsSync(testComponentsDir)) {
      await rm(testComponentsDir, { recursive: true, force: true });
    }
    await mkdir(testDataDir, { recursive: true });
  });
  
  describe('CASE 1: Production `create` - Component in projectRoot/components', () => {
    
    it('should create component in projectRoot/components (NOT cwd)', async () => {
      // Save original cwd
      const originalCwd = process.cwd();
      
      try {
        // Change to a DIFFERENT directory (simulate CLI execution from anywhere)
        process.chdir('/tmp');
        
        // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
        const component = new DefaultWeb4TSComponent().init({
          model: { 
            projectRoot: projectRoot,
            targetDirectory: projectRoot 
          }
        });
        
        // Create component - should go to projectRoot, NOT process.cwd()
        const testName = 'ArchTestProd1';
        const testVersion = '0.1.0.0';
        await component.create(testName, testVersion, 'all');
        
        // Verify: Component created in projectRoot (NOT /tmp!)
        const expectedPath = path.join(projectRoot, 'components', testName, testVersion);
        expect(existsSync(expectedPath), 
          `Component MUST be in projectRoot/components, NOT cwd.\n` +
          `Expected: ${expectedPath}\n` +
          `Current cwd: ${process.cwd()}\n` +
          `\n` +
          `❌ VIOLATION: Component is calculating paths from process.cwd()!\n` +
          `✅ FIX: Use this.model.projectRoot instead of process.cwd()`
        ).toBe(true);
        
        // Verify: Component NOT created in /tmp
        const wrongPath = path.join('/tmp', 'components', testName);
        expect(existsSync(wrongPath),
          `Component created in wrong location (cwd=/tmp).\n` +
          `This means create() is using process.cwd() instead of model.projectRoot.\n` +
          `\n` +
          `❌ VIOLATION: Path Authority Principle broken!\n` +
          `✅ FIX: Change create() to use this.model.projectRoot`
        ).toBe(false);
        
        console.log(`   ✅ CASE 1 PASS: Component created in projectRoot (NOT cwd)`);
        
        // Cleanup
        await rm(expectedPath, { recursive: true, force: true });
        
      } finally {
        // Restore cwd
        process.chdir(originalCwd);
      }
    });
  });
  
  describe('CASE 2: Test `create` - Component in test/data/components', () => {
    
    it('should create component in test/data/components (test isolation)', async () => {
      // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
      const component = new DefaultWeb4TSComponent().init({
        model: { 
          projectRoot: testDataDir,
          targetDirectory: testDataDir 
        }
      });
      
      // Create component in test isolation
      const testName = 'ArchTestIsolate1';
      const testVersion = '0.1.0.0';
      await component.create(testName, testVersion, 'all');
      
      // Verify: Component created in test/data/components
      const expectedPath = path.join(testDataDir, 'components', testName, testVersion);
      expect(existsSync(expectedPath),
        `Component MUST be in test/data/components for test isolation.\n` +
        `Expected: ${expectedPath}\n` +
        `\n` +
        `❌ VIOLATION: Test isolation broken!\n` +
        `✅ FIX: Use this.model.targetDirectory for component creation`
      ).toBe(true);
      
      // Verify: Component NOT created in production components/
      const productionPath = path.join(projectRoot, 'components', testName);
      expect(existsSync(productionPath),
        `Component created in PRODUCTION during test!\n` +
        `This is a CRITICAL test isolation violation.\n` +
        `\n` +
        `❌ VIOLATION: create() ignoring model.targetDirectory!\n` +
        `✅ FIX: Use this.model.targetDirectory instead of this.model.projectRoot`
      ).toBe(false);
      
      console.log(`   ✅ CASE 2 PASS: Component created in test/data (isolated)`);
    });
  });
  
  describe('CASE 3: Production `initProject` - Files in projectRoot', () => {
    
    it('should initialize project files in projectRoot (NOT cwd)', async () => {
      // Save original cwd
      const originalCwd = process.cwd();
      
      try {
        // Change to a DIFFERENT directory (simulate CLI execution from anywhere)
        process.chdir('/tmp');
        
        // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
        const component = new DefaultWeb4TSComponent().init({
          model: { 
            projectRoot: projectRoot,
            targetDirectory: projectRoot 
          }
        });
        
        // initProject with '§' (use model.targetDirectory)
        await component.initProject('§', false);
        
        // Verify: Files created in projectRoot (NOT /tmp!)
        const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
        expect(existsSync(tsconfigPath),
          `tsconfig.json MUST be in projectRoot, NOT cwd.\n` +
          `Expected: ${tsconfigPath}\n` +
          `Current cwd: ${process.cwd()}\n` +
          `\n` +
          `❌ VIOLATION: initProject() is using process.cwd()!\n` +
          `✅ FIX: Use this.model.targetDirectory (when targetDir === '§')\n` +
          `      Or use this.model.projectRoot for absolute path`
        ).toBe(true);
        
        // Verify: Files NOT created in /tmp
        const wrongPath = path.join('/tmp', 'tsconfig.json');
        expect(existsSync(wrongPath),
          `Files created in wrong location (cwd=/tmp).\n` +
          `This means initProject() is using process.cwd() instead of model.\n` +
          `\n` +
          `❌ VIOLATION: Path Authority Principle broken!\n` +
          `✅ FIX: Change initProject() to use this.model.targetDirectory`
        ).toBe(false);
        
        console.log(`   ✅ CASE 3 PASS: initProject created files in projectRoot (NOT cwd)`);
        
      } finally {
        // Restore cwd
        process.chdir(originalCwd);
      }
    });
  });
  
  describe('CASE 4: Test `initProject` - Files in test/data', () => {
    
    it('should initialize project files in test/data (test isolation)', async () => {
      // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
      const component = new DefaultWeb4TSComponent().init({
        model: { 
          projectRoot: testDataDir,
          targetDirectory: testDataDir 
        }
      });
      
      // initProject in test isolation
      await component.initProject('§', false);
      
      // Verify: Files created in test/data
      const tsconfigPath = path.join(testDataDir, 'tsconfig.json');
      expect(existsSync(tsconfigPath),
        `tsconfig.json MUST be in test/data for test isolation.\n` +
        `Expected: ${tsconfigPath}\n` +
        `\n` +
        `❌ VIOLATION: Test isolation broken!\n` +
        `✅ FIX: Use this.model.targetDirectory in initProject()`
      ).toBe(true);
      
      console.log(`   ✅ CASE 4 PASS: initProject created files in test/data (isolated)`);
    });
  });
  
  describe('Architecture Validation - No Path Calculations in Component', () => {
    
    it('should detect process.cwd() usage in DefaultWeb4TSComponent.ts', async () => {
      // Read the source file
      const componentSourcePath = path.join(componentRoot, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const sourceCode = readFileSync(componentSourcePath, 'utf8');
      
      // Check for process.cwd() calls
      const cwdMatches = sourceCode.match(/process\.cwd\(\)/g);
      
      expect(cwdMatches, 
        `❌ CRITICAL VIOLATION: Found process.cwd() in DefaultWeb4TSComponent.ts!\n` +
        `\n` +
        `Matches: ${cwdMatches ? cwdMatches.length : 0}\n` +
        `\n` +
        `This violates the Path Authority Principle:\n` +
        `- DefaultCLI calculates ALL paths (Path Authority)\n` +
        `- DefaultWeb4TSComponent uses ONLY model state\n` +
        `\n` +
        `🔧 HOW TO FIX:\n` +
        `\n` +
        `1. Find the process.cwd() call in DefaultWeb4TSComponent.ts\n` +
        `2. Replace with: this.model.projectRoot or this.model.targetDirectory\n` +
        `3. NEVER calculate paths in Component - use model state\n` +
        `\n` +
        `Example:\n` +
        `❌ const projectRoot = process.cwd();\n` +
        `✅ const projectRoot = this.model.projectRoot;\n` +
        `\n` +
        `❌ const projectRoot = path.join(process.cwd(), '..');\n` +
        `✅ const projectRoot = this.model.projectRoot;\n` +
        `\n` +
        `See: @pdca 2025-11-03-UTC-1819.pdca.md (documents this violation)\n` +
        `See: @pdca 2025-11-03-UTC-1828.pdca.md (fix pattern)\n` +
        `See: @pdca 2025-11-03-UTC-2000.pdca.md (lessons learned)`
      ).toBeNull();
      
      console.log(`   ✅ No process.cwd() violations in DefaultWeb4TSComponent.ts`);
    });
    
    it('should detect path calculation methods in DefaultWeb4TSComponent.ts', async () => {
      const componentSourcePath = path.join(componentRoot, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const sourceCode = readFileSync(componentSourcePath, 'utf8');
      
      // Check for path calculation patterns (methods that calculate paths from cwd)
      const calculateProjectRootPattern = /calculateProjectRoot.*\(/;
      const findProjectRootPattern = /findProjectRoot.*\(/;
      const getProjectRootPattern = /getProjectRoot.*\(/;
      
      const violations: string[] = [];
      
      if (calculateProjectRootPattern.test(sourceCode)) {
        violations.push('calculateProjectRoot() - Component should NOT calculate project root');
      }
      if (findProjectRootPattern.test(sourceCode)) {
        violations.push('findProjectRoot() - Component should NOT find project root');
      }
      if (getProjectRootPattern.test(sourceCode)) {
        violations.push('getProjectRoot() - Component should NOT get project root');
      }
      
      expect(violations,
        `❌ VIOLATION: Path calculation methods found in DefaultWeb4TSComponent.ts!\n` +
        `\n` +
        `Violations:\n${violations.map(v => `  - ${v}`).join('\n')}\n` +
        `\n` +
        `Path calculation belongs in DefaultCLI ONLY (Path Authority).\n` +
        `Component should ONLY use model state.\n` +
        `\n` +
        `🔧 HOW TO FIX:\n` +
        `1. Remove path calculation methods from DefaultWeb4TSComponent\n` +
        `2. Use this.model.projectRoot (calculated by CLI)\n` +
        `3. Use this.model.targetDirectory (calculated by CLI)\n` +
        `4. Use this.model.componentRoot (set by Component.init() from projectRoot)`
      ).toHaveLength(0);
      
      console.log(`   ✅ No path calculation methods in DefaultWeb4TSComponent.ts`);
    });
  });
  
  describe('Model Initialization Validation', () => {
    
    it('should require BOTH projectRoot AND targetDirectory in init()', () => {
      const component = new DefaultWeb4TSComponent().init({
        model: { 
          projectRoot: projectRoot,
          targetDirectory: projectRoot 
        }
      });
      
      expect(component.model.projectRoot,
        `❌ VIOLATION: projectRoot not set in model!\n` +
        `\n` +
        `Model must have BOTH projectRoot AND targetDirectory.\n` +
        `See: @pdca 2025-11-03-UTC-1828.pdca.md (SYSTEMATIC TEST TABLE)`
      ).toBeDefined();
      
      expect(component.model.targetDirectory,
        `❌ VIOLATION: targetDirectory not set in model!\n` +
        `\n` +
        `Model must have BOTH projectRoot AND targetDirectory.\n` +
        `See: @pdca 2025-11-03-UTC-1828.pdca.md (SYSTEMATIC TEST TABLE)`
      ).toBeDefined();
      
      console.log(`   ✅ Model initialized with BOTH projectRoot AND targetDirectory`);
    });
  });
  
});

