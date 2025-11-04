/**
 * Test: on() Command - Context Path Initialization
 * 
 * CRITICAL: When loading a component via on(), the CLI must provide ALL
 * calculated paths to the loaded component. This ensures the loaded component
 * can execute commands (like test) using the correct paths.
 * 
 * @pdca 2025-10-31-UTC-2000.on-context-path-initialization.pdca.md
 * @test Phase 1: Failing baseline test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { join } from 'path';
import { existsSync } from 'fs';

describe('on() Command - Context Path Initialization', () => {
  // When running tests, cwd is the component's directory (0.3.17.2)
  // But we need the actual project root (Web4Articles)
  const componentCwd = process.cwd();
  const projectRoot = join(componentCwd, '../../..');  // Go up to Web4Articles
  const componentsDir = join(projectRoot, 'components');
  
  it('CRITICAL: loaded component must receive ALL path context from CLI', async () => {
    const { Web4TSComponentCLI } = await import('../../dist/ts/layer5/Web4TSComponentCLI.js');
    
    const cli = new Web4TSComponentCLI();
    
    // Execute on() to load 0.3.13.2
    await cli.on('Web4TSComponent', '0.3.13.2');
    
    // Access the loaded context (stored in cli.context)
    const loadedComponent = (cli as any).context;
    
    expect(loadedComponent, 'Loaded component should exist').toBeDefined();
    expect(loadedComponent.model, 'Loaded component should have model').toBeDefined();
    
    // ✅ CRITICAL: Loaded component MUST have ALL paths from CLI
    expect(loadedComponent.model.componentRoot, 'componentRoot should be set').toBe(
      join(componentsDir, 'Web4TSComponent', '0.3.13.2')
    );
    expect(loadedComponent.model.projectRoot, 'projectRoot should be set').toBe(projectRoot);
    
    // ❌ THESE WILL FAIL BEFORE FIX:
    expect(loadedComponent.model.componentsDir, 'componentsDir should be set').toBe(componentsDir);
    expect(loadedComponent.model.scriptsDir, 'scriptsDir should be set').toBe(join(projectRoot, 'scripts'));
    expect(loadedComponent.model.scriptsVersionDir, 'scriptsVersionDir should be set').toBe(
      join(projectRoot, 'scripts', 'versions')
    );
    expect(loadedComponent.model.testDataDir, 'testDataDir should be set').toBe(
      join(componentsDir, 'Web4TSComponent', '0.3.13.2', 'test', 'data')
    );
  });
  
  it('CRITICAL: test itCase must use loaded component\'s test directory', async () => {
    const { Web4TSComponentCLI } = await import('../../dist/ts/layer5/Web4TSComponentCLI.js');
    
    const cli = new Web4TSComponentCLI();
    
    // Load 0.3.13.2
    await cli.on('Web4TSComponent', '0.3.13.2');
    
    // Get test directory that would be used
    const loadedComponent = (cli as any).context;
    const expectedTestDir = join(loadedComponent.model.componentRoot, 'test');
    
    // Verify test directory exists for 0.3.13.2
    expect(existsSync(expectedTestDir), `Test directory should exist: ${expectedTestDir}`).toBe(true);
    
    // ✅ CRITICAL: Test itCase should NOT throw "No test files found"
    // This will fail BEFORE fix because it looks in 0.3.17.2/test
    try {
      // Access the CLI's component (which should delegate to context after on())
      const component = (cli as any).component;
      await component.test('itCase');
      // If we get here, the command succeeded (no throw)
      expect(true).toBe(true);
    } catch (error: any) {
      // Should NOT throw "No test files found"
      expect(error.message).not.toContain('No test files found');
      throw error; // Re-throw if it's a different error
    }
  });
  
  it('FUNCTIONAL: getTestDir() uses loaded context when available', async () => {
    const { Web4TSComponentCLI } = await import('../../dist/ts/layer5/Web4TSComponentCLI.js');
    
    const cli = new Web4TSComponentCLI();
    
    // Before on(): getTestDir should use CLI's own component
    const testDirBefore = (cli as any).getTestDir();
    expect(testDirBefore).toBe(join(componentsDir, 'Web4TSComponent', '0.3.17.2', 'test'));
    
    // After on(): getTestDir should use loaded context
    await cli.on('Web4TSComponent', '0.3.13.2');
    const testDirAfter = (cli as any).getTestDir();
    expect(testDirAfter).toBe(join(componentsDir, 'Web4TSComponent', '0.3.13.2', 'test'));
  });
});

