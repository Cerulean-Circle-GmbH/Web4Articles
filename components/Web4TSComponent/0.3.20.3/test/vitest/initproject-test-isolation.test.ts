/**
 * InitProject Test Isolation Test
 * 
 * Verifies that initProject correctly handles test isolation context:
 * - Detects /test/data path as test isolation
 * - Creates minimal package.json (type: "module")
 * - Creates ESM tsconfig.json
 * - Creates scripts/ directory
 * - Creates components/ directory
 * - Does NOT create source.env (handled by test environment)
 * 
 * @pdca 2025-11-10-UTC-1430.systematic-initproject-test-isolation.pdca.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm, mkdir } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

describe('🧪 initProject Test Isolation', () => {
  const currentFileUrl = new URL(import.meta.url);
  const currentFilePath = fileURLToPath(currentFileUrl);
  const testDir = path.dirname(currentFilePath);
  const componentRoot = path.resolve(testDir, '../..');
  const testDataDir = path.join(componentRoot, 'test', 'data-initproject-test');
  
  beforeAll(async () => {
    // Clean test/data before test
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
    await mkdir(testDataDir, { recursive: true });
    
    // Run initProject on test/data path
    const componentPath = path.join(componentRoot, 'dist/ts/layer2/DefaultWeb4TSComponent.js');
    const { DefaultWeb4TSComponent } = await import(componentPath);
    const component = new DefaultWeb4TSComponent().init({ projectRoot: componentRoot });
    await component.initProject(testDataDir);
  });
  
  afterAll(async () => {
    // Clean up after test
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
  });
  
  it('should detect test isolation mode from path', async () => {
    // Implicit check: if package.json is minimal, detection worked
    const packageJsonPath = path.join(testDataDir, 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    expect(packageJson.name).toBe('web4-test-isolation');
  });
  
  it('should create package.json with type: module', async () => {
    const packageJsonPath = path.join(testDataDir, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
    expect(packageJson.type).toBe('module');
    expect(packageJson.name).toBe('web4-test-isolation');
    expect(packageJson.description).toContain('NOT production');
  });
  
  it('should create ESM tsconfig.json', async () => {
    const tsConfigPath = path.join(testDataDir, 'tsconfig.json');
    expect(existsSync(tsConfigPath)).toBe(true);
    
    const tsConfig = JSON.parse(await readFile(tsConfigPath, 'utf-8'));
    expect(tsConfig.compilerOptions.module).toBe('ES2022');
    expect(tsConfig.compilerOptions.target).toBe('ES2022');
    expect(tsConfig.compilerOptions.moduleResolution).toBe('node');
  });
  
  it('should create scripts directory', async () => {
    const scriptsPath = path.join(testDataDir, 'scripts');
    expect(existsSync(scriptsPath)).toBe(true);
  });
  
  it('should create components directory', async () => {
    const componentsPath = path.join(testDataDir, 'components');
    expect(existsSync(componentsPath)).toBe(true);
  });
  
  it('should create node_modules directory', async () => {
    const nodeModulesPath = path.join(testDataDir, 'node_modules');
    expect(existsSync(nodeModulesPath)).toBe(true);
  });
  
  it('should NOT create source.env in test isolation', async () => {
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    expect(existsSync(sourceEnvPath)).toBe(false);
  });
  
  it('should create all required directories in one call', async () => {
    // Verify all expected files and directories exist
    const expectedPaths = [
      path.join(testDataDir, 'package.json'),
      path.join(testDataDir, 'tsconfig.json'),
      path.join(testDataDir, 'scripts'),
      path.join(testDataDir, 'components'),
      path.join(testDataDir, 'node_modules'),
    ];
    
    for (const expectedPath of expectedPaths) {
      expect(existsSync(expectedPath)).toBe(true);
    }
  });
  
  it('should NOT create source.env (production-only file)', async () => {
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    expect(existsSync(sourceEnvPath)).toBe(false);
  });
});

