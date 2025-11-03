/**
 * Component-Level source.env Creation Tests
 * 
 * Verifies that component creation includes source.env file in componentRoot
 * for local shell tab completion and PATH setup.
 * 
 * @pdca 2025-11-03-HHMM.pdca.md - Test-first implementation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DefaultWeb4TSComponent } from '../../dist/ts/layer2/DefaultWeb4TSComponent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Component Creation - source.env in componentRoot', () => {
  const testDataDir = path.join(__dirname, '../data');
  const testComponentName = 'TestSourceEnvComponent';
  const testComponentVersion = '0.1.0.0';
  let component: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test directory before each test
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
    
    component = new DefaultWeb4TSComponent();
    await component.init(); // Initialize model first
    component.setTargetDirectory(testDataDir);
    
    // Initialize project first (creates project-level configs)
    await component.initProject(testDataDir);
  });

  afterEach(async () => {
    // Clean up after test
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
  });

  it('should create source.env in componentRoot during component creation', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env exists in componentRoot
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    
    expect(existsSync(sourceEnvPath), 
      `source.env should exist at ${sourceEnvPath}`
    ).toBe(true);
  });

  it('should have component-specific tab completion in source.env', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env contains component-specific completion
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Should contain component CLI name (lowercase)
    const cliName = testComponentName.toLowerCase().replace(/\s+/g, '');
    expect(content).toContain(cliName);
    
    // Should contain tab completion registration
    expect(content).toContain('_web4_generic_completion');
    expect(content).toContain('complete -F');
  });

  it('should make component source.env executable', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env is executable
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    const { stat } = await import('fs/promises');
    const stats = await stat(sourceEnvPath);
    const isExecutable = (stats.mode & 0o111) !== 0;
    
    expect(isExecutable, 'component source.env should be executable').toBe(true);
  });

  it('should have correct PATH setup for component CLI', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env sets up PATH correctly
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Should add component to PATH
    expect(content).toContain('export PATH=');
    expect(content).toContain('COMPONENT_DIR');
  });

  it('should have version header matching component version', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env contains version header
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Check for version header
    expect(content).toContain('# Version:');
    
    // Extract version from source.env
    const versionMatch = content.match(/# Version: ([\d.]+)/);
    expect(versionMatch, 'component source.env should contain version number').toBeTruthy();
    
    const sourceEnvVersion = versionMatch![1];
    
    // Version should match component version
    expect(sourceEnvVersion).toBe(testComponentVersion);
  });
});

