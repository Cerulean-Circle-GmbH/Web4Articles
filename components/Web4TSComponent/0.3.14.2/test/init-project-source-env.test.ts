/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

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

  it('should not overwrite existing source.env when already up to date', async () => {
    // Arrange: Create project first time
    await component.initProject(testDataDir);
    const sourceEnvPath = path.join(testDataDir, 'source.env');
    const originalContent = await readFile(sourceEnvPath, 'utf-8');

    // Act: Initialize again (file is already up to date)
    await component.initProject(testDataDir);

    // Assert: Content unchanged (same as template)
    const newContent = await readFile(sourceEnvPath, 'utf-8');
    expect(newContent).toBe(originalContent);
  });

  it('should DETECT when project source.env is outdated (template is newer)', async () => {
    // This test verifies the DETECTION mechanism, not the auto-fix
    // If this test fails, it means you need to run: web4tscomponent initProject
    
    // __dirname is test/, so go up 4 levels: test/ -> 0.3.13.2/ -> Web4TSComponent/ -> components/ -> Web4Articles/
    const projectRoot = path.join(__dirname, '../../../..');
    const sourceEnvPath = path.join(projectRoot, 'source.env');
    const templatePath = path.join(__dirname, '../templates/project/source.env.template');
    
    // Skip test if source.env doesn't exist yet (fresh project)
    if (!existsSync(sourceEnvPath)) {
      console.log('ℹ️  source.env does not exist yet - run initProject to create it');
      return;
    }
    
    // Get timestamps
    const { stat } = await import('fs/promises');
    const sourceEnvStats = await stat(sourceEnvPath);
    const templateStats = await stat(templatePath);
    
    // ASSERTION: Project file should NOT be older than template
    // If it is, the project needs updating
    const projectFileIsOlder = sourceEnvStats.mtime < templateStats.mtime;
    
    expect(projectFileIsOlder, 
      `\n\n⚠️  PROJECT source.env IS OUTDATED!\n` +
      `   Project file: ${sourceEnvPath}\n` +
      `   Template:     ${templatePath}\n` +
      `   Project mtime: ${sourceEnvStats.mtime.toISOString()}\n` +
      `   Template mtime: ${templateStats.mtime.toISOString()}\n\n` +
      `   🔧 FIX: Run the following command to update:\n` +
      `   web4tscomponent initProject\n\n` +
      `   This will sync your project's source.env with the latest template.\n`
    ).toBe(false);
  });

  it('should FAIL when project source.env has DIFFERENT content than template', async () => {
    // This detects when you've manually edited source.env
    // You MUST update the template to persist your changes!
    // NOTE: We use CONTENT comparison here, not timestamp, because initProject
    // always writes a newer timestamp than the template when syncing.
    
    const projectRoot = path.join(__dirname, '../../../..');
    const sourceEnvPath = path.join(projectRoot, 'source.env');
    const templatePath = path.join(__dirname, '../templates/project/source.env.template');
    
    // Skip test if source.env doesn't exist yet (fresh project)
    if (!existsSync(sourceEnvPath)) {
      console.log('ℹ️  source.env does not exist yet - run initProject to create it');
      return;
    }
    
    // Read both files
    const projectContent = await readFile(sourceEnvPath, 'utf-8');
    const templateContent = await readFile(templatePath, 'utf-8');
    
    // ASSERTION: Project file content should match template content
    // If different, user made manual changes that MUST be persisted in template
    const contentsDiffer = projectContent !== templateContent;
    
    expect(contentsDiffer, 
      `\n\n⚠️  CRITICAL: Project source.env has DIFFERENT CONTENT than template!\n` +
      `   Project file: ${sourceEnvPath}\n` +
      `   Template:     ${templatePath}\n\n` +
      `   📝 REQUIRED ACTION: You made manual changes to source.env!\n` +
      `   These changes will be LOST when template is deployed to other projects.\n\n` +
      `   🔧 FIX: Update the template to persist your changes:\n` +
      `   1. Compare files to see what changed:\n` +
      `      diff ${sourceEnvPath} ${templatePath}\n` +
      `   2. Copy your changes to the template: ${templatePath}\n` +
      `   3. Rebuild: npm run build\n` +
      `   4. Re-sync: web4tscomponent initProject\n\n` +
      `   This ensures your changes are in the SINGLE SOURCE OF TRUTH (template).\n` +
      `   For comprehensive multi-file sync checks, see test file 18.\n`
    ).toBe(false);
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

