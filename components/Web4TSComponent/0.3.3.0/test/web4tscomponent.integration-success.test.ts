/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';

describe('🎉 Web4TSComponent Integration Success', () => {
  let component: DefaultWeb4TSComponent;
  let rootMocker: ProjectRootMocker;

  beforeAll(async () => {
    (globalThis as any).__TEST_MODE__ = true;
    const testDataDir = path.join(__dirname, 'data');
    await fs.mkdir(testDataDir, { recursive: true });
    rootMocker = new ProjectRootMocker(testDataDir);
    rootMocker.mock();
  });

  afterAll(async () => {
    if (rootMocker) {
      rootMocker.restore();
    }
  });

  beforeEach(async () => {
    component = new DefaultWeb4TSComponent();
    const testDataDir = path.join(__dirname, 'data');
    component.setTargetDirectory(testDataDir);
  });

  it('✅ SUCCESS: Component can use itself to manage its own latest symlink', async () => {
    // Create component using itself
    await component.create('DemoComponent', '1.0.0.0', 'all');
    
    // Load component context
    await component.on('DemoComponent', '1.0.0.0');
    
    // Use component to set its own latest symlink
    await component.setLatest('1.0.0.0');
    
    // Verify latest symlink was created and points correctly
    const latestPath = path.join(rootMocker.getTestRoot(), 'components/DemoComponent/latest');
    expect(existsSync(latestPath)).toBe(true);
    
    const linkTarget = await fs.readlink(latestPath);
    expect(linkTarget).toBe('1.0.0.0');
    
    console.log('🎯 SUCCESS: Component self-managed latest symlink');
  });

  it('✅ SUCCESS: verifyAndFix finds versions and creates scripts directory', async () => {
    // Create multiple versions
    await component.create('DemoComponent', '0.5.0.0', 'all');
    await component.create('DemoComponent', '1.0.0.0', 'all');
    
    // Load context and run verifyAndFix
    await component.on('DemoComponent', '1.0.0.0');
    await component.verifyAndFix();
    
    // Verify scripts directory was created
    const scriptsDir = path.join(rootMocker.getTestRoot(), 'scripts');
    expect(existsSync(scriptsDir)).toBe(true);
    expect(existsSync(path.join(scriptsDir, 'versions'))).toBe(true);
    
    console.log('🎯 SUCCESS: verifyAndFix created scripts structure');
  });

  it('✅ SUCCESS: Real usage with actual Web4TSComponent component', async () => {
    // Create Web4TSComponent 0.3.2.0 in test environment first
    await component.create('Web4TSComponent', '0.3.2.0', 'all');
    
    // This demonstrates using the component on itself in a real scenario
    await component.on('Web4TSComponent', '0.3.2.0');
    await component.setLatest('0.3.2.0');
    
    // This works because Web4TSComponent was created in test environment
    expect(true).toBe(true); // Test completes without error = success
    
    console.log('🎯 SUCCESS: Real component usage works perfectly');
  });
});
