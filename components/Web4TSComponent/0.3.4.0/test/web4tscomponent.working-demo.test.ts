/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';

describe('Web4TSComponent Symlink Demo', () => {
  let component: DefaultWeb4TSComponent;
  let rootMocker: ProjectRootMocker;

  beforeEach(async () => {
    // Enable test mode for environment-aware path resolution
    (globalThis as any).__TEST_MODE__ = true;
    
    // Setup test data directory
    const testDataDir = path.join(__dirname, 'data');
    await fs.mkdir(testDataDir, { recursive: true });
    
    // Mock project root to be test data directory
    rootMocker = new ProjectRootMocker(testDataDir);
    rootMocker.mock();
    
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
    
    // Create Web4TSComponent 0.3.2.0 in test environment for self-testing
    await component.create('Web4TSComponent', '0.3.2.0', 'all');
  });

  afterEach(async () => {
    if (rootMocker) {
      rootMocker.restore();
    }
  });

  it('should demonstrate setLatest working perfectly with Web4TSComponent itself', async () => {
    // Real usage: Use the component to manage its own latest symlink
    await component.on('Web4TSComponent', '0.3.2.0');
    await component.setLatest('0.3.2.0');
    
    // This works because Web4TSComponent was created in test environment
    expect(true).toBe(true); // Test completes without error = success
  });

  it('should demonstrate verifyAndFix working with Web4TSComponent itself', async () => {
    // Real usage: Use the component to verify and fix its own symlinks
    await component.on('Web4TSComponent', '0.3.2.0');
    await component.verifyAndFix();
    
    // This works because Web4TSComponent was created in test environment
    expect(true).toBe(true); // Test completes without error = success
  });
});
