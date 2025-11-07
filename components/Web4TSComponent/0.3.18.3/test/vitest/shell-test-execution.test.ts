/**
 * @fileoverview Test-first design for testShell() feature
 * @pdca 2025-11-07-UTC-0200.pdca.md
 * @phase Phase 2 - Test-First Design
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent';
import * as fs from 'fs';
import * as path from 'path';

describe('testShell() - New Feature Test-First Design', () => {
  let component: DefaultWeb4TSComponent;
  const testDataDir = path.resolve(__dirname, '../data');
  const mockShellTestDir = path.join(testDataDir, 'test-shell-scripts');
  const mockShellScript = path.join(mockShellTestDir, 'test-script.sh');
  
  beforeEach(() => {
    component = new DefaultWeb4TSComponent().init();
    
    // Create mock shell test directory and script
    if (!fs.existsSync(mockShellTestDir)) {
      fs.mkdirSync(mockShellTestDir, { recursive: true });
    }
    
    // Create a simple test shell script
    const scriptContent = `#!/bin/bash
# Mock shell test script
echo "Shell test executed in: $(pwd)"
echo "PROJECT_ROOT: $PROJECT_ROOT"
echo "IS_TEST_ISOLATION: $IS_TEST_ISOLATION"
touch "\${PROJECT_ROOT}/shell-test-executed.marker"
`;
    fs.writeFileSync(mockShellScript, scriptContent, { mode: 0o755 });
  });
  
  afterEach(() => {
    // Clean up mock files
    if (fs.existsSync(mockShellScript)) {
      fs.unlinkSync(mockShellScript);
    }
    if (fs.existsSync(mockShellTestDir)) {
      fs.rmdirSync(mockShellTestDir);
    }
    
    // Clean up any marker files
    const markerFile = path.join(testDataDir, 'shell-test-executed.marker');
    if (fs.existsSync(markerFile)) {
      fs.unlinkSync(markerFile);
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

  it('Test 2: Shell test execution in production mode', async () => {
    // Set production mode (NOT test isolation)
    component.init({
      model: {
        isTestIsolation: false,
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: path.resolve(__dirname, '../../..'),
      }
    });
    
    // This test just verifies the method can be called
    // Actual execution will be mocked/stubbed in implementation
    const result = await component.testShell();
    
    // Verify method chaining works
    expect(result).toBe(component);
  });

  it('Test 3: Shell test execution in isolation mode', async () => {
    // Set test isolation mode
    component.init({
      model: {
        isTestIsolation: true,
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
        targetDirectory: testDataDir,
      }
    });
    
    // Execute shell tests
    const result = await component.testShell();
    
    // Verify method chaining works
    expect(result).toBe(component);
    
    // Verify NO files created in production components/
    const productionComponents = path.resolve(__dirname, '../../../..');
    const hasProductionPollution = fs.readdirSync(productionComponents)
      .some(entry => entry.startsWith('shell-test'));
    expect(hasProductionPollution).toBe(false);
  });

  it('Test 4: Shell test with version parameter', async () => {
    component.init({
      model: {
        isTestIsolation: true,
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
        isTestIsolation: true,
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
        isTestIsolation: true,
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
    
    // Verify NO process.cwd() in testShell method
    expect(methodBody).not.toContain('process.cwd()');
    
    // Verify uses this.model
    expect(methodBody).toContain('this.model');
  });

  it('Test 7: Error handling when no shell tests exist', async () => {
    component.init({
      model: {
        isTestIsolation: true,
        componentRoot: path.resolve(__dirname, '../..'),
        projectRoot: testDataDir,
      }
    });
    
    // Remove shell test directory
    if (fs.existsSync(mockShellTestDir)) {
      fs.rmdirSync(mockShellTestDir, { recursive: true });
    }
    
    // Execute should handle gracefully (not throw)
    const result = await component.testShell();
    
    // Should still return this for chaining
    expect(result).toBe(component);
  });
});

