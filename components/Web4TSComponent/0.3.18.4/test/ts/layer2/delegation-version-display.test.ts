/**
 * Test: Delegation Version Display
 * 
 * Verifies that printQuickHeader() correctly shows delegation context:
 * - When context exists: Show CALLER (via INFRASTRUCTURE)
 * - When no context: Show THIS component
 * 
 * @pdca 2025-11-10-UTC-1010.pdca.md - Context-aware header display
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';
import { readlinkSync } from 'fs';
import { join } from 'path';

describe('Delegation Version Display', () => {
  let component: DefaultWeb4TSComponent;
  let projectRoot: string;

  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.init();
    projectRoot = component.model.projectRoot;
  });

  it('should show CALLER component (via INFRASTRUCTURE) when context exists', () => {
    // Arrange: Get the actual Web4TSComponent version
    const actualProjectRoot = process.cwd().includes('/test/data') 
      ? process.cwd().split('/test/data')[0] + '/test/data'
      : process.cwd().split('/components/')[0];
    
    const web4tsDir = join(actualProjectRoot, 'components', 'Web4TSComponent');
    const latestSymlink = join(web4tsDir, 'latest');
    const actualVersion = readlinkSync(latestSymlink); // e.g., "0.3.18.4"

    // Act: Simulate IdealMinimalComponent delegating to Web4TSComponent
    const callerComponent = new DefaultWeb4TSComponent();
    callerComponent.init({
      model: {
        component: 'IdealMinimalComponent',
        version: { major: 0, minor: 3, patch: 18, build: 4 } as any,
        componentRoot: join(actualProjectRoot, 'components', 'IdealMinimalComponent', '0.3.18.4'),
        targetDirectory: actualProjectRoot,
        componentsDirectory: join(actualProjectRoot, 'components'),
        projectRoot: actualProjectRoot
      }
    });
    
    // Web4TSComponent (infrastructure) receives the caller as context
    component.model.componentsDirectory = join(actualProjectRoot, 'components');
    component.model.projectRoot = actualProjectRoot;
    component.model.context = callerComponent;

    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
    };

    try {
      // Act: Call printQuickHeader
      (component as any).printQuickHeader();

      // Assert: Should show "IdealMinimalComponent (via Web4TSComponent vX.X.X)"
      const output = logs.join('\n');
      
      // Should show CALLER component name
      expect(output).toContain('IdealMinimalComponent CLI Tool');
      
      // Should show delegation to INFRASTRUCTURE
      expect(output).toContain(`via Web4TSComponent v${actualVersion}`);
      
    } finally {
      console.log = originalLog;
    }
  });

  it('should show THIS component when no context (direct call)', () => {
    // Arrange: Component is Web4TSComponent (direct operation, no delegation)
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

      // Assert: Should show "Web4TSComponent" without "via" text
      const output = logs.join('\n');
      expect(output).toContain('Web4TSComponent CLI Tool');
      expect(output).not.toContain('via');
      
    } finally {
      console.log = originalLog;
    }
  });

  it('should read Web4TSComponent version from latest symlink', () => {
    // This test documents the expected behavior:
    // Read version from latest symlink for delegation display
    
    const actualProjectRoot = process.cwd().includes('/test/data') 
      ? process.cwd().split('/test/data')[0] + '/test/data'
      : process.cwd().split('/components/')[0];
    
    const web4tsDir = join(actualProjectRoot, 'components', 'Web4TSComponent');
    const latestSymlink = join(web4tsDir, 'latest');
    const actualVersion = readlinkSync(latestSymlink);

    // The version should be a valid semantic version
    expect(actualVersion).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
  });
});

