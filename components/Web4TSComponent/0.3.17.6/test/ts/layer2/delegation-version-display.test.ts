/**
 * Test: Delegation Version Display Bug Fix
 * 
 * Bug: Line 436 of DefaultWeb4TSComponent.ts has hardcoded '0.3.17.3'
 * Expected: Should read actual Web4TSComponent version dynamically
 * 
 * This test verifies that when PDCA delegates to Web4TSComponent,
 * the displayed version matches the actual Web4TSComponent version,
 * not a hardcoded stale value.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';
import { readFileSync, readlinkSync } from 'fs';
import { join } from 'path';

describe('Delegation Version Display', () => {
  let component: DefaultWeb4TSComponent;
  let projectRoot: string;

  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.init();
    projectRoot = component.model.projectRoot;
  });

  it('should display actual Web4TSComponent version, not hardcoded 0.3.17.3', () => {
    // Arrange: Get the actual Web4TSComponent version
    // Use absolute path since we know the project structure
    const actualProjectRoot = process.cwd().includes('/test/data') 
      ? process.cwd().split('/test/data')[0] + '/test/data'
      : process.cwd().split('/components/')[0];
    
    const web4tsDir = join(actualProjectRoot, 'components', 'Web4TSComponent');
    const latestSymlink = join(web4tsDir, 'latest');
    const actualVersion = readlinkSync(latestSymlink); // e.g., "0.3.17.4" or "0.3.17.5"

    // Act: Simulate delegation by setting context to a different component
    // Follow Path Authority: CLI calculates paths and stores in model
    const pdcaComponent = new DefaultWeb4TSComponent();
    pdcaComponent.init({
      model: {
        component: 'PDCA',
        version: { major: 0, minor: 3, patch: 17, build: 4 } as any,
        componentRoot: join(actualProjectRoot, 'components', 'PDCA', '0.3.17.4'),
        targetDirectory: actualProjectRoot,
        // Path Authority: CLI provides these calculated paths
        componentsDir: join(actualProjectRoot, 'components'),
        projectRoot: actualProjectRoot
      }
    });
    
    // Set component to also have Path Authority paths
    component.model.componentsDir = join(actualProjectRoot, 'components');
    component.model.projectRoot = actualProjectRoot;
    component.model.context = pdcaComponent;

    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    try {
      // Act: Call printQuickHeader (line 417-442)
      (component as any).printQuickHeader();

      // Assert: Output should contain actual version, not hardcoded 0.3.17.3
      const output = logs.join('\n');
      
      // Bug check: Should NOT show hardcoded 0.3.17.3
      expect(output).not.toContain('via Web4TSComponent v0.3.17.3');
      
      // Correct behavior: Should show actual version from symlink
      expect(output).toContain(`via Web4TSComponent v${actualVersion}`);
      
    } finally {
      console.log = originalLog;
    }
  });

  it('should not show delegation info when component IS Web4TSComponent', () => {
    // Arrange: Component is Web4TSComponent (self-operation, no delegation)
    component.model.context = null; // No delegation

    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    try {
      // Act
      (component as any).printQuickHeader();

      // Assert: Should NOT show "via Web4TSComponent" when it IS Web4TSComponent
      const output = logs.join('\n');
      expect(output).not.toContain('via Web4TSComponent');
      
    } finally {
      console.log = originalLog;
    }
  });

  it('should read Web4TSComponent version from package.json when available', () => {
    // This test documents the expected fix:
    // Read version from package.json instead of hardcoding
    
    const actualProjectRoot = process.cwd().includes('/test/data') 
      ? process.cwd().split('/test/data')[0] + '/test/data'
      : process.cwd().split('/components/')[0];
    
    const web4tsDir = join(actualProjectRoot, 'components', 'Web4TSComponent');
    const latestSymlink = join(web4tsDir, 'latest');
    const actualVersion = readlinkSync(latestSymlink);
    const packageJsonPath = join(web4tsDir, actualVersion, 'package.json');
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const expectedVersion = packageJson.version;

    // The version from package.json should match the directory name
    expect(expectedVersion).toBe(actualVersion);
  });
});

