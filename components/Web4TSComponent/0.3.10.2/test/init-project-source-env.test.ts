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
  const testDataDir = path.join(__dirname, '..', 'test', 'data', 'init-source-env-test');
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
      await rm(testDataDir, { recursive: true, force: true });
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
    expect(content).toContain('Web4 Project Environment Setup');
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
});

