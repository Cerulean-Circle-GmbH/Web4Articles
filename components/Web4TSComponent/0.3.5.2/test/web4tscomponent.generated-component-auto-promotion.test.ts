/**
 * Tests for generated component auto-promotion via npm test
 * 
 * This test verifies that generated components have the SAME auto-promotion
 * behavior as Web4TSComponent itself. When `npm test` is run on a generated
 * component, it should automatically trigger version promotion based on test results.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { execSync } from 'child_process';
import { existsSync, readlinkSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const testDataDir = path.join(__dirname, 'data');

describe('🚀 Generated Component Auto-Promotion', () => {
  let component: DefaultWeb4TSComponent;
  const testComponentName = 'AutoPromoTest';
  
  beforeEach(() => {
    component = new DefaultWeb4TSComponent();
    component.setTargetDirectory(testDataDir);
    
    // Clean up test component before each test
    const componentPath = path.join(testDataDir, 'components', testComponentName);
    if (existsSync(componentPath)) {
      rmSync(componentPath, { recursive: true, force: true });
    }
  });

  it('should auto-promote through full workflow via npm test', async () => {
    console.log('\n📖 Testing GENERATED COMPONENT auto-promotion via npm test...');
    console.log('⚠️  This test proves generated components behave like Web4TSComponent\n');
    
    // Stage 0: Create component
    console.log('🏗️  Stage 0: Create component...');
    await component.create(testComponentName, '0.1.0.0', 'all');
    
    const componentPath = path.join(testDataDir, 'components', testComponentName);
    expect(existsSync(path.join(componentPath, '0.1.0.0'))).toBe(true);
    expect(readlinkSync(path.join(componentPath, 'prod'))).toBe('0.1.0.0');
    expect(readlinkSync(path.join(componentPath, 'latest'))).toBe('0.1.0.0');
    console.log('   ✅ Created: 0.1.0.0 → prod + latest');
    
    // Stage 1: First npm test → Create dev
    console.log('\n🚧 Stage 1: First npm test → Create dev...');
    try {
      // Run in clean environment (don't inherit VITEST from parent)
      const cleanEnv = { ...process.env };
      delete cleanEnv.VITEST;
      delete cleanEnv.VITEST_WORKER_ID;
      
      execSync('npm test', { 
        cwd: componentPath,
        stdio: 'inherit',
        timeout: 120000,  // 120s timeout
        env: cleanEnv  // Use clean environment without VITEST
      });
    } catch (error) {
      // npm test may fail if tests fail, but promotion should still happen
      console.log('   ⚠️  npm test exited with error (may be expected)');
    }
    
    expect(existsSync(path.join(componentPath, '0.1.0.1'))).toBe(true);
    expect(readlinkSync(path.join(componentPath, 'dev'))).toBe('0.1.0.1');
    expect(readlinkSync(path.join(componentPath, 'latest'))).toBe('0.1.0.1');
    console.log('   ✅ Stage 1: 0.1.0.0 (prod) → 0.1.0.1 (dev)');
    
    // Stage 2: npm test on dev → Create test
    console.log('\n🧪 Stage 2: npm test on dev → Create test...');
    try {
      const cleanEnv = { ...process.env };
      delete cleanEnv.VITEST;
      delete cleanEnv.VITEST_WORKER_ID;
      
      execSync('npm test', { 
        cwd: componentPath,
        stdio: 'inherit',
        timeout: 120000,
        env: cleanEnv
      });
    } catch (error) {
      console.log('   ⚠️  npm test exited with error (may be expected)');
    }
    
    expect(existsSync(path.join(componentPath, '0.1.0.2'))).toBe(true);
    expect(readlinkSync(path.join(componentPath, 'test'))).toBe('0.1.0.2');
    expect(readlinkSync(path.join(componentPath, 'latest'))).toBe('0.1.0.2');
    console.log('   ✅ Stage 2: 0.1.0.1 (dev) → 0.1.0.2 (test)');
    
    // Stage 3: npm test on test with 100% → Promote to prod
    console.log('\n🚀 Stage 3: npm test on test → Promote to prod...');
    try {
      const cleanEnv = { ...process.env };
      delete cleanEnv.VITEST;
      delete cleanEnv.VITEST_WORKER_ID;
      
      execSync('npm test', { 
        cwd: componentPath,
        stdio: 'inherit',
        timeout: 120000,
        env: cleanEnv
      });
    } catch (error) {
      console.log('   ⚠️  npm test exited with error (may be expected)');
    }
    
    expect(existsSync(path.join(componentPath, '0.1.1.0'))).toBe(true);
    expect(existsSync(path.join(componentPath, '0.1.1.1'))).toBe(true);
    expect(readlinkSync(path.join(componentPath, 'prod'))).toBe('0.1.1.0');
    expect(readlinkSync(path.join(componentPath, 'dev'))).toBe('0.1.1.1');
    console.log('   ✅ Stage 3: 0.1.0.2 (test) → 0.1.1.0 (prod) + 0.1.1.1 (dev)');
    
    console.log('\n🎉 FULL AUTO-PROMOTION WORKFLOW PROVEN:');
    console.log('   ✅ 0.1.0.0 → prod (initial)');
    console.log('   ✅ 0.1.0.1 → dev (Stage 1)');
    console.log('   ✅ 0.1.0.2 → test (Stage 2)');
    console.log('   ✅ 0.1.1.0 → prod (Stage 3)');
    console.log('   ✅ 0.1.1.1 → dev (Stage 3)');
    console.log(`\n💡 Check evidence: ${componentPath}`);
  }, 600000); // 10 minute timeout for full workflow

  it('should prevent infinite recursion', async () => {
    console.log('\n📖 Testing recursion prevention...');
    
    // Create component
    await component.create(testComponentName, '0.1.0.0', 'all');
    const componentPath = path.join(testDataDir, 'components', testComponentName);
    
    // Run npm test - should complete without hanging
    const startTime = Date.now();
    try {
      const cleanEnv = { ...process.env };
      delete cleanEnv.VITEST;
      delete cleanEnv.VITEST_WORKER_ID;
      
      execSync('npm test', { 
        cwd: componentPath,
        stdio: 'inherit',
        timeout: 60000,  // 60s timeout - if it hangs, it fails
        env: cleanEnv
      });
    } catch (error) {
      // Error is OK as long as it didn't hang
    }
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(60000); // Should complete within 60s
    console.log(`   ✅ Test completed in ${Math.round(duration/1000)}s (no infinite loop)`);
  }, 120000); // 2 minute timeout
});

