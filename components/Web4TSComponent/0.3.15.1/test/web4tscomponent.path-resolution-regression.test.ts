/**
 * Path Resolution Regression Test Suite
 * 
 * Tests to demonstrate and prevent the critical path resolution bug
 * where process.cwd() replaced targetDirectory, causing path duplication
 * and CLI command failures.
 * 
 * Expected: All tests FAIL on 0.3.15.1 (demonstrates current bug)
 * Expected: All tests PASS after fix (validates solution works)
 * 
 * @author CMM3 Test-First Development Pattern
 * @since 2025-10-27
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';

// Utility function for async CLI command execution
const execAsync = (command: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const stdout = execSync(command, { 
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: 'pipe'
      });
      resolve({ stdout, stderr: '' });
    } catch (error: any) {
      resolve({ 
        stdout: error.stdout || '', 
        stderr: error.stderr || error.message || 'Unknown error'
      });
    }
  });
};

describe('Path Resolution Regression Tests (0.3.13.2 → 0.3.15.1 Bug)', () => {
  
  // TC01: Core path resolution must not duplicate paths
  it('TC01: should resolve project root without path duplication', async () => {
    const component = new DefaultWeb4TSComponent();
    const projectRoot = component.findProjectRoot();
    
    // Baseline expectation: Clean path to Web4Articles root
    expect(projectRoot).toBe('/Users/Shared/Workspaces/2cuGitHub/Web4Articles');
    expect(projectRoot).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
    expect(projectRoot).not.toContain('Web4TSComponent/0.3.15.1');
    
    // Should end with Web4Articles, not component directory
    expect(projectRoot.endsWith('Web4Articles')).toBe(true);
    expect(projectRoot.endsWith('0.3.15.1')).toBe(false);
  });

  // TC02: Project root resolution must match baseline behavior
  it('TC02: should find project root from component instance', () => {
    const component = new DefaultWeb4TSComponent();
    const root = component.findProjectRoot();
    
    // CRITICAL: Must resolve to Web4Articles project root, not component dir
    expect(root).toMatch(/Web4Articles$/);
    expect(root).not.toMatch(/components\/Web4TSComponent/);
    expect(root).not.toMatch(/0\.3\.15\.1/);
  });

  // TC03: CLI commands must work without "Component not found" errors
  it('TC03: should execute CLI commands without path resolution failures', async () => {
    const result = await execAsync('./web4tscomponent on Web4TSComponent 0.3.2.0 tree');
    
    // Baseline expectations: successful component context loading
    expect(result.stdout).toContain('✅ Component context loaded: Web4TSComponent 0.3.2.0');
    expect(result.stdout).toContain('📁 Tree structure for Web4TSComponent 0.3.2.0');
    
    // CRITICAL: Should NOT contain path duplication errors
    expect(result.stderr).not.toContain('Component not found');
    expect(result.stderr).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
    expect(result.stdout).toContain('Web4TSComponent');
  });

  // TC04: Links command must show clean paths without duplication
  it('TC04: should show version links without path duplication', async () => {
    const result = await execAsync('./web4tscomponent links');
    
    // Should show version links successfully
    expect(result.stdout).toContain('Available versions:');
    expect(result.stdout).toMatch(/Available versions:\s*\d+/i);
    
    // CRITICAL: Should NOT show path duplication in error messages
    expect(result.stderr).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
    expect(result.stdout).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
  });

  // TC05: Test file discovery (25 files vs 1)
  it('TC05: should discover all test files not just one', async () => {
    const result = await execAsync('./web4tscomponent test file');
    
    // Count actual test files in output
    const fileCount = (result.stdout.match(/\.test\./g) || []).length;
    
    // Baseline expectation: Should find 22+ test files (0.3.13.2 found 22)
    expect(fileCount).toBeGreaterThan(20); 
    expect(fileCount).not.toBe(1); // Current bug: only finds 1
    
    // Should show usage instructions
    expect(result.stdout).toContain('💡 Usage: web4tscomponent test file');
  });

  // TC06: Cross-component path resolution (PDCA switching)
  it('TC06: should switch to PDCA component context identical to 0.3.13.2', async () => {
    const result = await execAsync('./web4tscomponent on PDCA 0.3.2.1 tree');
    
    // Baseline expectations: successful cross-component switching
    expect(result.stdout).toContain('✅ Component context loaded: PDCA 0.3.2.1');
    expect(result.stdout).toContain('Path: /Users/Shared/Workspaces/2cuGitHub/Web4Articles/components/PDCA/0.3.2.1');
    expect(result.stdout).toContain('📁 Tree structure for PDCA 0.3.2.1:');
    expect(result.stdout).toContain('├── session/');
    expect(result.stdout).toContain('├── src/');
    expect(result.stdout).toContain('├── test/');
    expect(result.stdout).toContain('└── pdca');
    
    // CRITICAL: Should NOT contain path duplication when switching components
    expect(result.stdout).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
    expect(result.stderr).not.toContain('Component not found');
  });

  // TC07: Current component tree display
  it('TC07: should show current component tree identical to 0.3.13.2', async () => {
    const result = await execAsync('./web4tscomponent tree');
    
    // Baseline expectations: current component tree display
    expect(result.stdout).toContain('📁 Tree structure for Web4TSComponent');
    expect(result.stdout).toContain('/Web4Articles/components/Web4TSComponent/');
    expect(result.stdout).toContain('├── dist/');
    expect(result.stdout).toContain('├── session/');
    expect(result.stdout).toContain('├── src/');
    expect(result.stdout).toContain('├── test/');
    expect(result.stdout).toContain('└── web4tscomponent');
    
    // Should show proper structure without path duplication
    expect(result.stdout).not.toContain('/components/Web4TSComponent/0.3.15.1/components/');
  });

  // TC08: Test isolation still works (should pass independently)
  it('TC08: should handle test isolation path resolution correctly', async () => {
    const component = new DefaultWeb4TSComponent();
    
    // Test isolation: when targetDirectory is explicitly set to test/data
    component.setTargetDirectory('/test/data');
    const path = component.resolveComponentPath('TestComponent', '1.0.0');
    
    // This should still work correctly (test isolation architecture)
    expect(path).toBe('/test/data/components/TestComponent/1.0.0');
  });
});
