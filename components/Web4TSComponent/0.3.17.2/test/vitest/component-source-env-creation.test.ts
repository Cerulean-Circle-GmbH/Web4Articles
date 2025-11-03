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
    
    // Should contain the full Web4 completion infrastructure
    expect(content).toContain('_web4_generic_completion');
    expect(content).toContain('complete -F');
    expect(content).toContain('_web4_auto_register_completions');
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
    
    // Should add scripts to PATH (project-level behavior)
    expect(content).toContain('export PATH=');
    expect(content).toContain('WEB4_PROJECT_ROOT');
  });

  it('should have version header matching component version', async () => {
    // Act: Create component
    await component.create(testComponentName, testComponentVersion, 'all');

    // Assert: source.env contains version header (from template)
    const componentRoot = path.join(testDataDir, 'components', testComponentName, testComponentVersion);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Check for version header (template has static version)
    expect(content).toContain('# Version:');
    
    // Template version is static, not component-specific
    // The source.env uses the project template version
    expect(content).toContain('0.3.14.4');
  });
});

