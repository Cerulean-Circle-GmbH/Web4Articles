/**
 * TSRanger v2.2 - REGRESSION PREVENTION TEST SUITE
 * 
 * CRITICAL: These tests prevent destructive fix cycles by validating golden states
 * NEVER modify these tests without explicit user approval
 * ALL core functionality must pass before any code changes are committed
 */

import { describe, test, expect } from 'vitest';
import { spawn } from 'child_process';
import path from 'path';

// Test helper: Run TSRanger with specific keystroke sequence
async function runTSRanger(keystrokes: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const testScript = path.join(process.cwd(), 'components/TSRanger/v2.2/sh/tsranger');
    const child = spawn(testScript, ['test', keystrokes], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`TSRanger exited with code ${code}. Error: ${errorOutput}`));
      }
    });

    // Timeout after 10 seconds to prevent hanging
    setTimeout(() => {
      child.kill();
      reject(new Error('TSRanger test timed out after 10 seconds'));
    }, 10000);
  });
}

describe('TSRanger v2.2 - REGRESSION PREVENTION GOLDEN STATES', () => {
  
  test('GOLDEN STATE 1: g[tab]c → GitScrumProject create (Method Filtering)', async () => {
    console.log('🔍 Testing GOLDEN STATE 1: g[tab]c method filtering');
    const result = await runTSRanger('g[tab]c');
    
    // CRITICAL: Must show GitScrumProject with create method
    expect(result).toContain('GitScrumProject');
    expect(result).toContain('create');
    
    // CRITICAL: Must show method filter active
    expect(result).toContain('[Methods] (c)');
    
    // CRITICAL: Must show prompt with class and method
    expect(result).toMatch(/GitScrumProject.*create/);
    
    console.log('✅ GOLDEN STATE 1: Method filtering works correctly');
  }, 15000);

  test('GOLDEN STATE 2: g[tab] → GitScrumProject start (Tab Advancement)', async () => {
    console.log('🔍 Testing GOLDEN STATE 2: g[tab] tab advancement');
    const result = await runTSRanger('g[tab]');
    
    // CRITICAL: Must advance to Methods column
    expect(result).toContain('GitScrumProject');
    expect(result).toContain('start');
    
    // CRITICAL: Must show prompt with class and method
    expect(result).toMatch(/GitScrumProject.*start/);
    
    // CRITICAL: Must show class filter applied  
    expect(result).toContain('[Classes] (GitScrumProject)');
    
    console.log('✅ GOLDEN STATE 2: Tab advancement works correctly');
  }, 15000);

  test('GOLDEN STATE 3: g[tab]s → start method filtering', async () => {
    console.log('🔍 Testing GOLDEN STATE 3: g[tab]s method filter display');
    const result = await runTSRanger('g[tab]s');
    
    // CRITICAL: Must show method filter in header
    expect(result).toContain('[Methods] (s)');
    
    // CRITICAL: Must show start method
    expect(result).toContain('start');
    
    // CRITICAL: Must show GitScrumProject
    expect(result).toContain('GitScrumProject');
    
    console.log('✅ GOLDEN STATE 3: Method filter display works correctly');
  }, 15000);

  test('GOLDEN STATE 4: g[right][left] → Clean retreat', async () => {
    console.log('🔍 Testing GOLDEN STATE 4: g[right][left] column retreat');
    const result = await runTSRanger('g[right][left]');
    
    // CRITICAL: Must return to Classes column
    expect(result).toContain('[Classes]');
    
    // CRITICAL: Should show filtered classes
    expect(result).toContain('GitScrumProject');
    
    console.log('✅ GOLDEN STATE 4: Column retreat works correctly');
  }, 15000);

  test('GOLDEN STATE 5: Basic g filter → GitScrumProject selection', async () => {
    console.log('🔍 Testing GOLDEN STATE 5: g filter basic functionality');
    const result = await runTSRanger('g');
    
    // CRITICAL: Must filter to GitScrumProject
    expect(result).toContain('GitScrumProject');
    expect(result).toContain('[Classes] (g)');
    
    // CRITICAL: Must show GitScrumProject (not just Logger alone)  
    expect(result).toContain('GitScrumProject');
    
    console.log('✅ GOLDEN STATE 5: Basic filtering works correctly');
  }, 15000);

});

describe('TSRanger v2.2 - REGRESSION DETECTION ANTI-PATTERNS', () => {
  
  test('ANTI-PATTERN 1: g[tab] must NOT default to Logger', async () => {
    console.log('🔍 Testing ANTI-PATTERN 1: Logger fixation detection');
    const result = await runTSRanger('g[tab]');
    
    // CRITICAL: Must NOT show Logger after g filter
    expect(result).not.toContain('Logger log');
    expect(result).not.toMatch(/Logger.*log\[\s*\]/);
    
    // CRITICAL: Must show GitScrumProject instead
    expect(result).toContain('GitScrumProject');
    
    console.log('✅ ANTI-PATTERN 1: No Logger fixation detected');
  }, 15000);

  test('ANTI-PATTERN 2: Method filter must display in header', async () => {
    console.log('🔍 Testing ANTI-PATTERN 2: Missing method filter display');
    const result = await runTSRanger('g[tab]c');
    
    // CRITICAL: Must show method filter in header, not just filter functionality
    expect(result).toContain('[Methods] (c)');
    
    // CRITICAL: Must not have method filter working but invisible
    expect(result).toContain('create'); // Filter works
    expect(result).toContain('[Methods] (c)'); // Filter displays
    
    console.log('✅ ANTI-PATTERN 2: Method filter display working');
  }, 15000);

});

console.log('🛡️ TSRanger v2.2 Regression Prevention Suite Loaded');
console.log('⚠️  CRITICAL: All tests must pass before any code commits');
console.log('🔄 These tests prevent the destructive fix cycles identified in PDCA');
