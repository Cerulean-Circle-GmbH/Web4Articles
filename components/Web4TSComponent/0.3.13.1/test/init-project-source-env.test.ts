import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import { readFile, rm } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DefaultWeb4TSComponent } from '../dist/ts/layer2/DefaultWeb4TSComponent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('initProject creates source.env', () => {
  const testDataDir = path.join(__dirname, '..', 'test', 'data');
  let component: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test directory before each test
    if (existsSync(testDataDir)) {
      await rm(testDataDir, { recursive: true, force: true });
    }
    
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
  });

  afterEach(async () => {
    // Clean up after test
    if (existsSync(testDataDir)) {
      // await rm(testDataDir, { recursive: true, force: true });
    }
  });

  it('should create source.env with correct content', async () => {
    // Act: Initialize project with explicit path
    await component.initProject(testDataDir);

    // Assert: source.env exists
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    expect(existsSync(sourceEnvPath), `source.env should exist at ${sourceEnvPath}`).toBe(true);

    // Assert: source.env has correct content
    const content = await readFile(sourceEnvPath, 'utf-8');
    expect(content).toContain('#!/bin/bash');
    expect(content).toContain('Web4Articles Project Environment Setup');
    expect(content).toContain('WEB4_PROJECT_ROOT');
    expect(content).toContain('_web4_tscompletion');
    expect(content).toContain('_web4_register_completions');
    expect(content).toContain('TypeScript-first, no ENV vars');
  });

  it('should not overwrite existing source.env', async () => {
    // Arrange: Create project first time
    await component.initProject(testDataDir);
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    const originalContent = await readFile(sourceEnvPath, 'utf-8');

    // Act: Initialize again
    await component.initProject(testDataDir);

    // Assert: Content unchanged
    const newContent = await readFile(sourceEnvPath, 'utf-8');
    expect(newContent).toBe(originalContent);
  });

  it('should make source.env executable', async () => {
    // Act: Initialize project
    await component.initProject(testDataDir);

    // Assert: source.env is executable
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    const { stat } = await import('fs/promises');
    const stats = await stat(sourceEnvPath);
    const isExecutable = (stats.mode & 0o111) !== 0;
    expect(isExecutable, 'source.env should be executable').toBe(true);
  });

  it('should have version number aligned with component version', async () => {
    // Get the current component version from directory structure
    const componentDir = path.join(__dirname, '..');
    const componentVersion = path.basename(componentDir);
    
    // Act: Initialize project
    await component.initProject(testDataDir);
    
    // Assert: source.env contains version header
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Check for version header
    expect(content).toContain('# Version:');
    
    // Extract version from source.env
    const versionMatch = content.match(/# Version: ([\d.]+)/);
    expect(versionMatch, 'source.env should contain version number').toBeTruthy();
    
    const templateVersion = versionMatch![1];
    
    // CRITICAL CHECK: Version must match component directory
    expect(templateVersion, 
      `\n\n⚠️  AGENT REMINDER: Template version MISMATCH!\n` +
      `   Template version: ${templateVersion}\n` +
      `   Component version: ${componentVersion}\n` +
      `   Single source of truth: ${componentVersion}\n` +
      `   👉 UPDATE templates/project/source.env.template header manually!\n`
    ).toBe(componentVersion);
  });

  it('should use BRIGHT_CYAN for "web4" in prompt', async () => {
    // Act: Initialize project
    await component.initProject(testDataDir);
    
    // Assert: source.env uses BRIGHT_CYAN for "web4" text
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    const content = await readFile(sourceEnvPath, 'utf-8');
    
    // Check for the colored "web4" in the prompt
    expect(content).toContain('printf "\\nyour ${BRIGHT_CYAN}web4${NO_COLOR} command >');
    
    // Ensure it's not using the old uncolored version
    expect(content).not.toContain('printf "\\nyour web4 command >');
  });
});

