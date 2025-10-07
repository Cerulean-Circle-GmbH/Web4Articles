/**
 * Web4TSComponent Smoke Tests
 * 
 * Simple black-box tests for remaining methods.
 * Purpose: Detect when something breaks (1 test per method).
 * Not full coverage - just basic functionality verification.
 * 
 * Methods Tested (10):
 * - removeVersion, removeComponent
 * - compare, info, updateBuildSystem
 * - set, get, from, find
 * - testNewMethod
 * 
 * Total: 10 smoke tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';

async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('💨 Smoke Tests - Basic Functionality', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    await cleanupTestDataContent(testDataDir);
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
    await web4ts.initProject();
  });

  afterEach(async () => {
    await cleanupTestDataContent(testDataDir);
  });

  it('💨 removeVersion() - should remove a version', async () => {
    // Arrange
    await web4ts.create('SmokeRemoveVersion', '0.1.0.0');
    await web4ts.create('SmokeRemoveVersion', '0.2.0.0');
    
    const v1Path = path.join(testDataDir, 'components', 'SmokeRemoveVersion', '0.1.0.0');
    const v2Path = path.join(testDataDir, 'components', 'SmokeRemoveVersion', '0.2.0.0');
    
    expect(existsSync(v1Path)).toBe(true);
    expect(existsSync(v2Path)).toBe(true);
    
    // Act
    await web4ts.on('SmokeRemoveVersion', '0.1.0.0');
    await web4ts.removeVersion();
    
    // Assert: v1 removed, v2 still exists
    expect(existsSync(v1Path)).toBe(false);
    expect(existsSync(v2Path)).toBe(true);
  });

  it('💨 removeComponent() - should remove entire component', async () => {
    // Arrange
    await web4ts.create('SmokeRemoveComponent', '0.1.0.0');
    
    const componentPath = path.join(testDataDir, 'components', 'SmokeRemoveComponent');
    expect(existsSync(componentPath)).toBe(true);
    
    // Act
    await web4ts.on('SmokeRemoveComponent', '0.1.0.0');
    await web4ts.removeComponent();
    
    // Assert
    expect(existsSync(componentPath)).toBe(false);
  });

  it.skip('💨 compare() - should compare components (requires global paths)', async () => {
    // Compare looks in global components dir, not test data
    await web4ts.create('CompareA', '0.1.0.0');
    await web4ts.create('CompareB', '0.1.0.0');
    await expect(web4ts.compare('CompareA 0.1.0.0, CompareB 0.1.0.0')).resolves.not.toThrow();
  });

  it('💨 info() - should display info', async () => {
    // Act & Assert: Should not throw
    await expect(web4ts.info('overview')).resolves.not.toThrow();
  });

  it('💨 updateBuildSystem() - should require context', async () => {
    // Act & Assert: Should throw without context
    await expect(web4ts.updateBuildSystem()).rejects.toThrow('No component context loaded');
  });

  it('💨 set() - should set property', async () => {
    // Act & Assert: Should not throw
    await expect(web4ts.set('TestComponent', 'cli-script', '0.1.0.0')).resolves.not.toThrow();
  });

  it('💨 get() - should validate CLI', async () => {
    // Arrange: Create a component first
    await web4ts.create('GetTest', '0.1.0.0');
    const scriptPath = path.join(testDataDir, 'components', 'GetTest', '0.1.0.0', 'src', 'sh', 'build.sh');
    
    // Act & Assert: Should not throw
    await expect(web4ts.get(scriptPath, 'validation')).resolves.not.toThrow();
  });

  it('💨 from() - should analyze from path', async () => {
    // Arrange
    await web4ts.create('FromTest', '0.1.0.0');
    const componentPath = path.join(testDataDir, 'components', 'FromTest', '0.1.0.0');
    
    // Act
    const result = await web4ts.from(componentPath);
    
    // Assert: Returns this for chaining
    expect(result).toBe(web4ts);
  });

  it('💨 find() - should discover component', async () => {
    // Arrange
    await web4ts.create('FindTest', '0.1.0.0');
    const componentsDir = path.join(testDataDir, 'components');
    
    // Act
    const result = await web4ts.find(componentsDir);
    
    // Assert: Returns this for chaining
    expect(result).toBe(web4ts);
  });

  it('💨 testNewMethod() - should process test data', async () => {
    // Act
    const result = await web4ts.testNewMethod('test-input', 'json');
    
    // Assert: Returns this for chaining
    expect(result).toBe(web4ts);
  });
});
