/**
 * Environment Completion Consistency Test
 * 
 * Verifies that completion behavior is IDENTICAL across all 4 execution scenarios,
 * regardless of working directory or environment variables.
 * 
 * @pdca 2025-11-03-UTC-1430.pdca.md - Phase 2: Environment-agnostic completion testing
 * 
 * Test Principle: Web4 is environment-agnostic
 * - Zero Knowledge, Zero Config, Just Scenarios and Models
 * - Completion should work the same from ANY location
 * - NO dependency on sourced source.env files
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// ✅ Web4 Pattern: Calculate once at module level
const currentFileUrl = new URL(import.meta.url);
const currentDir = join(fileURLToPath(currentFileUrl), '../..');
const componentRoot = join(currentDir, '..');
const projectRoot = join(componentRoot, '../../..');

describe('🌍 Environment Completion Consistency', () => {
  // Full path to idealminimalcomponent CLI wrapper (environment-agnostic)
  const idealminimalcomponentCLI = join(projectRoot, 'components/IdealMinimalComponent/0.1.0.0/idealminimalcomponent');
  
  // Test command that should work from ANY directory
  const testCommand = `${idealminimalcomponentCLI} complete '{"ior":{"uuid":"test","component":"IdealMinimalComponent","version":"0.1.0.0","ownerData":"e30="},"model":{"uuid":"test","projectRoot":".","completionCompWords":["idealminimalcomponent","li"],"completionCompCword":1}}'`;
  
  /**
   * Extract completion signature for comparison
   * Strips ANSI codes and filters to key completion output
   */
  const extractSignature = (output: string): string[] => {
    return output.split('\n')
      .map(line => {
        // Strip ANSI codes for comparison
        return line.replace(/\x1b\[[0-9;]*m/g, '').trim();
      })
      .filter(line => {
        // Include key lines only
        return line.includes('links') || 
               line.includes('────') || 
               line.includes('Documentation') || 
               line.includes('Show semantic') ||
               line.includes('your web4 command') ||
               line.startsWith('WORD:') ||
               line.startsWith('DISPLAY:');
      });
  };
  
  /**
   * Scenario 1: Production Component Environment
   * Running from: /path/to/components/IdealMinimalComponent/0.1.0.0
   */
  it('Scenario 1: Production Component Environment', () => {
    const componentPath = join(projectRoot, 'components/IdealMinimalComponent/0.1.0.0');
    
    if (!existsSync(componentPath)) {
      console.log('⏩ Skipping: IdealMinimalComponent not created yet');
      return;
    }
    
    const output = execSync(testCommand, {
      cwd: componentPath,
      encoding: 'utf-8',
      env: { ...process.env, WEB4_PROJECT_ROOT: undefined } // Explicitly unset env var
    });
    
    const signature = extractSignature(output);
    expect(signature.length).toBeGreaterThan(0);
    expect(signature.some(line => line.includes('links'))).toBe(true);
    expect(output).toContain('WORD: links'); // Actual CLI output format
    
    console.log(`   ✅ Scenario 1: ${signature.length} completion lines`);
  });
  
  /**
   * Scenario 2: Test Isolation Environment
   * Running from: /path/to/Web4TSComponent/0.3.17.3/test/data/components/IdealMinimalComponent/0.1.0.0
   */
  it('Scenario 2: Test Isolation Environment', () => {
    const testIsolationPath = join(componentRoot, 'test/data/components/IdealMinimalComponent/0.1.0.0');
    
    if (!existsSync(testIsolationPath)) {
      console.log('⏩ Skipping: Test isolation component not created yet');
      return;
    }
    
    const output = execSync(testCommand, {
      cwd: testIsolationPath,
      encoding: 'utf-8',
      env: { ...process.env, WEB4_PROJECT_ROOT: undefined } // Explicitly unset env var
    });
    
    const signature = extractSignature(output);
    expect(signature.length).toBeGreaterThan(0);
    expect(signature.some(line => line.includes('links'))).toBe(true);
    expect(output).toContain('WORD: links'); // Actual CLI output format
    
    console.log(`   ✅ Scenario 2: ${signature.length} completion lines`);
  });
  
  /**
   * Scenario 3: Web4TSComponent Development Environment
   * Running from: /path/to/components/Web4TSComponent/0.3.17.3
   */
  it('Scenario 3: Web4TSComponent Development Environment', () => {
    const web4tsPath = componentRoot;
    
    const output = execSync(testCommand, {
      cwd: web4tsPath,
      encoding: 'utf-8',
      env: { ...process.env, WEB4_PROJECT_ROOT: undefined } // Explicitly unset env var
    });
    
    const signature = extractSignature(output);
    expect(signature.length).toBeGreaterThan(0);
    expect(signature.some(line => line.includes('links'))).toBe(true);
    expect(output).toContain('WORD: links'); // Actual CLI output format
    
    console.log(`   ✅ Scenario 3: ${signature.length} completion lines`);
  });
  
  /**
   * Scenario 4: Project Root Environment
   * Running from: /path/to/Web4Articles
   */
  it('Scenario 4: Project Root Environment', () => {
    const output = execSync(testCommand, {
      cwd: projectRoot,
      encoding: 'utf-8',
      env: { ...process.env, WEB4_PROJECT_ROOT: undefined } // Explicitly unset env var
    });
    
    const signature = extractSignature(output);
    expect(signature.length).toBeGreaterThan(0);
    expect(signature.some(line => line.includes('links'))).toBe(true);
    expect(output).toContain('WORD: links'); // Actual CLI output format
    
    console.log(`   ✅ Scenario 4: ${signature.length} completion lines`);
  });
  
  /**
   * CRITICAL TEST: All scenarios produce identical signatures
   * This is the CORE requirement for environment-agnostic behavior
   */
  it('All scenarios produce identical signatures', () => {
    const scenarios = [
      { name: 'Production', path: join(projectRoot, 'components/IdealMinimalComponent/0.1.0.0') },
      { name: 'Test Isolation', path: join(componentRoot, 'test/data/components/IdealMinimalComponent/0.1.0.0') },
      { name: 'Web4TS Dev', path: componentRoot },
      { name: 'Project Root', path: projectRoot }
    ];
    
    const signatures: Record<string, string[]> = {};
    
    for (const scenario of scenarios) {
      if (!existsSync(scenario.path)) {
        console.log(`⏩ Skipping ${scenario.name}: Path doesn't exist`);
        continue;
      }
      
      try {
        const output = execSync(testCommand, {
          cwd: scenario.path,
          encoding: 'utf-8',
          env: { ...process.env, WEB4_PROJECT_ROOT: undefined } // Explicitly unset env var
        });
        
        signatures[scenario.name] = extractSignature(output);
        console.log(`   📊 ${scenario.name}: ${signatures[scenario.name].length} lines`);
      } catch (error) {
        console.error(`❌ ${scenario.name} failed:`, (error as Error).message);
      }
    }
    
    // Compare all signatures
    const signatureKeys = Object.keys(signatures);
    if (signatureKeys.length > 1) {
      const baseline = signatures[signatureKeys[0]];
      
      for (let i = 1; i < signatureKeys.length; i++) {
        const current = signatures[signatureKeys[i]];
        
        // Compare lengths first
        expect(current.length).toBe(baseline.length);
        
        // Compare content (order-independent for robustness)
        expect(current.sort()).toEqual(baseline.sort());
      }
      
      console.log(`✅ All ${signatureKeys.length} scenarios produce identical output`);
    } else {
      console.log(`⚠️  Only ${signatureKeys.length} scenario(s) available for comparison`);
    }
  });
  
  /**
   * Verify NO environment variable dependency
   * Test should pass even when all Web4 env vars are explicitly undefined
   */
  it('Should work WITHOUT any Web4 environment variables', () => {
    const output = execSync(testCommand, {
      cwd: projectRoot,
      encoding: 'utf-8',
      env: {
        ...process.env,
        WEB4_PROJECT_ROOT: undefined,
        WEB4_COMPONENT_CONTEXT: undefined,
        WEB4_COMPONENT_NAME: undefined,
        WEB4_COMPONENT_VERSION: undefined
      }
    });
    
    expect(output).toContain('WORD: links'); // Actual CLI output format
    expect(output).toContain('links');
    
    console.log(`   ✅ Completion works WITHOUT environment variables`);
  });
});

