/**
 * Test Isolation Delegation Runtime Test
 * 
 * @description Verifies that Radical OOP delegation fixes work correctly in test isolation:
 *              - idealminimalcomponent links shows CORRECT test isolation paths
 *              - idealminimalcomponent tree shows ITS tree structure (not Web4TSComponent's)
 *              - idealminimalcomponent info shows correct delegation header with test isolation mode
 * 
 * @approach Black-box CLI execution testing in test/data environment
 * @target test/data/components/IdealMinimalComponent/0.3.18.6 (created by idealminimalcomponent-creation-isolation.test.ts)
 * @pdca 2025-11-10-UTC-1400.eliminate-functional-helpers-make-model-driven.pdca.md
 * 
 * @prerequisites Run idealminimalcomponent-creation-isolation.test.ts first to populate test/data
 * 
 * @cmm3 Automated verification of Radical OOP delegation in test isolation
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');
const testDataDir = path.join(componentRoot, 'test/data');

// Extract current version from componentRoot path
const versionMatch = componentRoot.match(/(\d+\.\d+\.\d+\.\d+)$/);
const currentVersion = versionMatch ? versionMatch[1] : '0.0.0.0';

const testComponentPath = path.join(testDataDir, 'components/IdealMinimalComponent', currentVersion);
const testComponentCLI = path.join(testComponentPath, 'idealminimalcomponent');

/**
 * Execute CLI command in test isolation context
 */
function executeCLIInTestIsolation(command: string): { stdout: string; stderr: string; exitCode: number } {
  try {
    // Execute from test/data directory (project root for test isolation)
    const stdout = execSync(command, {
      cwd: testDataDir,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 30000,
      shell: process.env.SHELL || '/bin/bash',
      env: {
        ...process.env,
        // Use test isolation PATH
        PATH: `${path.join(testDataDir, 'scripts')}:${process.env.PATH}`
      }
    });
    return { stdout, stderr: '', exitCode: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout?.toString() || '',
      stderr: error.stderr?.toString() || '',
      exitCode: error.status || 1
    };
  }
}

describe('🧪 Test Isolation Delegation Runtime Verification', () => {
  // Prerequisite check
  it('PREREQUISITE: test/data/components/IdealMinimalComponent exists', () => {
    expect(existsSync(testComponentPath)).toBe(true);
    expect(existsSync(testComponentCLI)).toBe(true);
    console.log(`   ✅ Test component exists: ${testComponentPath}`);
  });

  describe('📍 Path Authority in Test Isolation', () => {
    it('should show TEST ISOLATION MODE in header', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('TEST ISOLATION MODE');
      expect(result.stdout).toContain(`Web4TSComponent v${currentVersion}`);
      console.log(`   ✅ Header shows TEST ISOLATION MODE`);
    });

    it('should show delegation info in header (via Web4TSComponent)', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('IdealMinimalComponent CLI Tool');
      expect(result.stdout).toContain('via Web4TSComponent');
      console.log(`   ✅ Header shows delegation: "via Web4TSComponent v${currentVersion}"`);
    });

    it('should show correct PROJECT ROOT in test isolation', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      // Project Root should be test/data (not production root)
      expect(result.stdout).toContain('Project Root:');
      expect(result.stdout).toContain('/test/data');
      expect(result.stdout).not.toContain('Project Root:     /Users/Shared/Workspaces/temp/Web4Articles\n');
      console.log(`   ✅ Project Root is test/data path`);
    });
  });

  describe('🔗 links Command - Radical OOP Delegation', () => {
    it('should show IdealMinimalComponent links (NOT Web4TSComponent links)', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} links`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Semantic Version Links for IdealMinimalComponent');
      expect(result.stdout).not.toContain('Semantic Version Links for Web4TSComponent');
      console.log(`   ✅ Shows IdealMinimalComponent links (not Web4TSComponent)`);
    });

    it('should search in CORRECT test isolation path', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} links`);
      
      expect(result.exitCode).toBe(0);
      // Should show "Searching in: .../test/data/components/IdealMinimalComponent"
      expect(result.stdout).toContain('📂 Searching in:');
      expect(result.stdout).toContain('/test/data/components/IdealMinimalComponent');
      expect(result.stdout).not.toContain('/components/IdealMinimalComponent\n'); // Production path
      console.log(`   ✅ Searches in test isolation path`);
    });

    it('should find available versions in test isolation', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} links`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('📊 Available versions:');
      // Should find at least the current version
      expect(result.stdout).toMatch(/📊 Available versions: [1-9]\d*/);
      console.log(`   ✅ Finds versions in test isolation`);
    });
  });

  describe('🌳 tree Command - Radical OOP Delegation', () => {
    it('should show IdealMinimalComponent tree (NOT Web4TSComponent tree)', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} tree 2`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Tree structure for IdealMinimalComponent');
      expect(result.stdout).not.toContain('Tree structure for Web4TSComponent');
      console.log(`   ✅ Shows IdealMinimalComponent tree (not Web4TSComponent)`);
    });

    it('should show CORRECT test isolation path in tree', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} tree 2`);
      
      expect(result.exitCode).toBe(0);
      // Should show test/data path, not production path
      expect(result.stdout).toContain('/test/data/components/IdealMinimalComponent');
      // Should NOT show production path (Web4Articles/components/IdealMinimalComponent directly, without test/data)
      expect(result.stdout).not.toMatch(/Web4Articles\/components\/IdealMinimalComponent\/[\d.]+\n/);
      console.log(`   ✅ Tree shows test isolation path`);
    });

    it('should show IdealMinimalComponent directories (src, test, etc)', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} tree 2`);
      
      expect(result.exitCode).toBe(0);
      // Should show IdealMinimalComponent structure
      expect(result.stdout).toMatch(/src/);
      expect(result.stdout).toMatch(/package\.json/);
      console.log(`   ✅ Tree shows IdealMinimalComponent structure`);
    });
  });

  describe('📊 info Command - Model-Driven Display', () => {
    it('should show IdealMinimalComponent identity (not Web4TSComponent)', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Component:    IdealMinimalComponent');
      expect(result.stdout).not.toContain('Component:    Web4TSComponent');
      console.log(`   ✅ Shows IdealMinimalComponent identity`);
    });

    it('should show Target Root in TEST ISOLATION', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Target Root:');
      expect(result.stdout).toContain('/test/data/components/IdealMinimalComponent');
      console.log(`   ✅ Target Root is test isolation path`);
    });

    it('should NOT show production paths in test isolation', () => {
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      // Make sure no production Web4Articles path (without /test/data) appears
      const productionPathPattern = /\/Users\/Shared\/Workspaces\/temp\/Web4Articles(?!\/components\/Web4TSComponent\/[\d.]+\/test\/data)/;
      expect(result.stdout).not.toMatch(productionPathPattern);
      console.log(`   ✅ No production paths leaked into test isolation`);
    });
  });

  describe('🎯 Radical OOP Principles Verification', () => {
    it('should use getTarget() for WHAT to show', () => {
      // Black-box verification: links shows IdealMinimalComponent, not Web4TSComponent
      const result = executeCLIInTestIsolation(`${testComponentCLI} links`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('IdealMinimalComponent');
      console.log(`   ✅ getTarget() provides WHAT to show (component name)`);
    });

    it('should use getCLI() for WHERE to look (Path Authority)', () => {
      // Black-box verification: links searches in test/data path (from CLI model)
      const result = executeCLIInTestIsolation(`${testComponentCLI} links`);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('/test/data');
      console.log(`   ✅ getCLI() provides WHERE to look (path authority)`);
    });

    it('should have model-driven header (NO functional helpers)', () => {
      // Black-box verification: header shows all computed properties correctly
      const result = executeCLIInTestIsolation(`${testComponentCLI} info`);
      
      expect(result.exitCode).toBe(0);
      // All these are model properties calculated ONCE in updateModelPaths()
      expect(result.stdout).toContain('IdealMinimalComponent CLI Tool');
      expect(result.stdout).toContain(`v${currentVersion}`);
      expect(result.stdout).toContain('via Web4TSComponent');
      expect(result.stdout).toContain('TEST ISOLATION MODE');
      console.log(`   ✅ Header is model-driven (displayName, displayVersion, delegationInfo, testIsolationContext)`);
    });
  });
});

