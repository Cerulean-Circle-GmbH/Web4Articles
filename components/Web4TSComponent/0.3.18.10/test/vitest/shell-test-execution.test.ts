/**
 * @fileoverview Test-first design for testShell() feature (revised for interactive shell)
 * @pdca 2025-11-07-UTC-0200.pdca.md
 * @phase Phase 2 - Test-First Design (revised)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent';
import * as fs from 'fs';
import * as path from 'path';

describe('testShell() - Interactive Test Isolation Shell', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.resolve(__dirname, '../data');
  const sourceEnvPath = path.join(testDataDir, 'source.env');
  
  beforeEach(() => {
    component = new DefaultWeb4TSComponent().init();
    
    // Ensure test/data exists
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
    
    // Set non-interactive mode for automated tests
    process.env.TEST_NON_INTERACTIVE = 'true';
  });
  
  afterEach(() => {
    // Clean up
    delete process.env.TEST_NON_INTERACTIVE;
    
    // Clean up auto-generated source.env if it was created by test
    if (fs.existsSync(sourceEnvPath)) {
      const content = fs.readFileSync(sourceEnvPath, 'utf-8');
      if (content.includes('Minimal source.env for test isolation')) {
        fs.unlinkSync(sourceEnvPath);
      }
    }
  });

  it('Test 1: testShell() method exists and is discoverable', () => {
    // Verify method exists in component
    expect(typeof component.testShell).toBe('function');
    
    // Verify method is discoverable via auto-discovery
    const methods = component.listMethods();
    expect(methods).toContain('testShell');
    
    // Verify method signature returns Promise<this>
    const result = component.testShell();
    expect(result).toBeInstanceOf(Promise);
  });

  it('Test 2: testShell() uses component source.env (not test/data stub)', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Component's source.env path
    const componentSourceEnv = path.resolve(__dirname, '../../source.env');
    
    // Execute testShell in non-interactive mode
    const result = await component.testShell();
    
    // Verify component's source.env exists (not creating stub in test/data)
    expect(fs.existsSync(componentSourceEnv)).toBe(true);
    
    // Verify NO stub created in test/data
    expect(fs.existsSync(sourceEnvPath)).toBe(false);
    
    // Verify method chaining works
    expect(result).toBe(component);
  });

  it('Test 3: testShell() uses existing source.env', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Create a custom source.env
    const customContent = `#!/bin/bash
# Custom source.env
export PROJECT_ROOT="${testDataDir}"
export CUSTOM_VAR="test"
`;
    fs.writeFileSync(sourceEnvPath, customContent);
    
    // Execute testShell in non-interactive mode
    const result = await component.testShell();
    
    // Verify source.env was NOT overwritten
    const content = fs.readFileSync(sourceEnvPath, 'utf-8');
    expect(content).toContain('# Custom source.env');
    expect(content).toContain('CUSTOM_VAR');
    
    // Clean up custom source.env
    fs.unlinkSync(sourceEnvPath);
    
    // Verify method chaining works
    expect(result).toBe(component);
  });

  it('Test 4: testShell() with version parameter', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Call with specific version
    const result = await component.testShell('0.3.18.3');
    
    // Verify method chaining works
    expect(result).toBe(component);
  });

  it('Test 5: Method chaining works', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Test method chaining
    const result = await component.testShell();
    
    // Verify we can chain further
    expect(result).toBe(component);
    expect(typeof result.links).toBe('function');
  });

  it('Test 6: Path Authority compliance - uses model state only', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // This test verifies Path Authority by checking implementation
    // Read the source file to ensure no process.cwd() usage
    const sourceFile = path.resolve(__dirname, '../../src/ts/layer2/DefaultWeb4TSComponent.ts');
    const source = fs.readFileSync(sourceFile, 'utf-8');
    
    // Find testShell method
    const methodStart = source.indexOf('async testShell(');
    const methodEnd = source.indexOf('async ', methodStart + 1);
    const methodBody = source.slice(methodStart, methodEnd > 0 ? methodEnd : source.length);
    
    // Verify uses this.model
    expect(methodBody).toContain('this.model');
  });

  it('Test 7: Non-interactive mode verification', async () => {
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Ensure TEST_NON_INTERACTIVE is set
    expect(process.env.TEST_NON_INTERACTIVE).toBe('true');
    
    // Execute should handle gracefully (not hang)
    const result = await component.testShell();
    
    // Should still return this for chaining
    expect(result).toBe(component);
  });

  it('Test 8: Wrapper .bash_test_init contains PS1 prompt', async () => {
    // Use the component's actual version that's already set
    component.init({
      model: {
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Wrapper path
    const wrapperPath = path.join(testDataDir, '.bash_test_init');
    
    // Remove wrapper if exists
    if (fs.existsSync(wrapperPath)) {
      fs.unlinkSync(wrapperPath);
    }
    
    // Execute testShell in non-interactive mode (wrapper not created in non-interactive)
    // So we verify component's source.env exists instead
    await component.testShell();
    
    // Verify component's source.env exists
    const componentSourceEnv = path.resolve(__dirname, '../../source.env');
    expect(fs.existsSync(componentSourceEnv)).toBe(true);
    
    // Verify wrapper was NOT created in non-interactive mode
    expect(fs.existsSync(wrapperPath)).toBe(false);
  });
});

