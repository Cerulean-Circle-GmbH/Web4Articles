/**
 * initProject § Path Resolution Test
 * 
 * Verifies that initProject § correctly identifies the project root
 * in all scenarios (production from project root, from component dir, test isolation).
 * 
 * @pdca 2025-11-03-UTC-1811.pdca.md - Fix initProject § path resolution bug
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import { rm, mkdir, readFile } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');
const projectRoot = path.join(componentRoot, '../../..');
const testDataDir = path.join(componentRoot, 'test/data');

describe('🔧 initProject § Path Resolution', () => {
  beforeAll(async () => {
    // Clean test/data before tests
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
    await mkdir(testDataDir, { recursive: true });
  });

  afterAll(async () => {
    // Clean up project root files created by tests
    const projectTsConfig = path.join(projectRoot, 'tsconfig.json');
    const projectPackageJson = path.join(projectRoot, 'package.json');
    const projectSourceEnv = path.join(projectRoot, 'source.env');
    
    // Only delete if they were created by tests (check if they're test artifacts)
    // We'll leave them for now to avoid breaking actual project files
    console.log(`   📝 Note: Project root files left for manual inspection`);
  });

  describe('Test 1: Production - From Project Root', () => {
    it('should initialize at project root when invoked with § from project root', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      // Simulate CLI initialization from project root
      // CLI would call: new DefaultWeb4TSComponent().init({ model: { targetDirectory: projectRoot } })
      const component = new DefaultWeb4TSComponent().init({
        model: { targetDirectory: projectRoot }
      });
      
      // User runs: web4tscomponent initProject § force
      // This should initialize at projectRoot, NOT at componentRoot
      await component.initProject('§', true);
      
      // Verify files created at project root
      const projectTsConfig = path.join(projectRoot, 'tsconfig.json');
      const projectPackageJson = path.join(projectRoot, 'package.json');
      const projectSourceEnv = path.join(projectRoot, 'source.env');
      
      expect(existsSync(projectTsConfig), 'tsconfig.json should exist at project root').toBe(true);
      expect(existsSync(projectPackageJson), 'package.json should exist at project root').toBe(true);
      expect(existsSync(projectSourceEnv), 'source.env should exist at project root').toBe(true);
      
      // Read tsconfig to verify it's the PROJECT tsconfig (not component tsconfig)
      const tsconfig = JSON.parse(await readFile(projectTsConfig, 'utf-8'));
      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.outDir).toBe('./dist'); // Project tsconfig has outDir
      
      console.log(`   ✅ Test 1: Initialized at project root: ${projectRoot}`);
    });
  });

  describe('Test 2: Production - From Component Directory', () => {
    it('should walk up to project root when invoked with § from component directory', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      // Simulate CLI initialization from component directory
      // (This happens when user runs web4tscomponent from component dir)
      const component = new DefaultWeb4TSComponent().init({
        model: { targetDirectory: componentRoot } // CLI initialized from component dir
      });
      
      // Change process.cwd to component directory to simulate real scenario
      const originalCwd = process.cwd();
      process.chdir(componentRoot);
      
      try {
        // User runs: web4tscomponent initProject § force
        // Should walk UP to find project root (has .git + package.json + components/)
        await component.initProject('§', true);
        
        // Verify files created at project root, NOT component root
        const projectTsConfig = path.join(projectRoot, 'tsconfig.json');
        const projectPackageJson = path.join(projectRoot, 'package.json');
        
        expect(existsSync(projectTsConfig), 'tsconfig.json should exist at project root').toBe(true);
        expect(existsSync(projectPackageJson), 'package.json should exist at project root').toBe(true);
        
        // Verify it's the PROJECT config
        const tsconfig = JSON.parse(await readFile(projectTsConfig, 'utf-8'));
        expect(tsconfig.compilerOptions.outDir).toBe('./dist');
        
        console.log(`   ✅ Test 2: Walked up from component dir to project root`);
      } finally {
        process.chdir(originalCwd); // Restore original cwd
      }
    });
  });

  describe('Test 3: Test Isolation - Explicit Path', () => {
    it('should initialize at explicit path (test/data) when provided', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      // Test isolation: Explicitly pass test/data path
      const component = new DefaultWeb4TSComponent().init({
        model: { targetDirectory: testDataDir }
      });
      
      // Pass explicit path (NOT §)
      await component.initProject(testDataDir, true);
      
      // Verify files created at test/data
      const testTsConfig = path.join(testDataDir, 'tsconfig.json');
      const projectTsConfig = path.join(projectRoot, 'tsconfig.json');
      
      expect(existsSync(testTsConfig), 'tsconfig.json should exist at test/data').toBe(true);
      expect(testTsConfig).not.toBe(projectTsConfig);
      
      console.log(`   ✅ Test 3: Initialized at test isolation: ${testDataDir}`);
    });
  });

  describe('Test 4: Verify § Symbol Dynamic Behavior', () => {
    it('§ should mean "calculate NOW" not "use stored value"', async () => {
      const { DefaultWeb4TSComponent } = await import('../../src/ts/layer2/DefaultWeb4TSComponent.js');
      
      // Initialize with WRONG targetDirectory
      const component = new DefaultWeb4TSComponent().init({
        model: { targetDirectory: '/tmp/wrong/path' }
      });
      
      // Change to project root
      const originalCwd = process.cwd();
      process.chdir(projectRoot);
      
      try {
        // initProject § should IGNORE stored targetDirectory and calculate from cwd
        await component.initProject('§', true);
        
        // Should initialize at project root (cwd), NOT /tmp/wrong/path
        const projectTsConfig = path.join(projectRoot, 'tsconfig.json');
        const wrongTsConfig = path.join('/tmp/wrong/path', 'tsconfig.json');
        
        expect(existsSync(projectTsConfig), 'tsconfig.json should exist at project root').toBe(true);
        expect(existsSync(wrongTsConfig), 'tsconfig.json should NOT exist at wrong path').toBe(false);
        
        console.log(`   ✅ Test 4: § dynamically calculated from cwd, ignored stored value`);
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});

