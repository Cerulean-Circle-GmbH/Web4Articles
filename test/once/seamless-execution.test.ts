/**
 * ONCE Seamless Execution Test - FIRST AND MOST CRITICAL TEST
 * 
 * This test validates that typing "once" executes seamlessly from empty environment
 * If this test fails, ALL OTHER TESTING MUST STOP until this is fixed
 * 
 * Validates requirement: 124bb2a3-fc67-4c84-9525-f3c8d1d12d4a
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

describe('ONCE Seamless Execution from Scratch - CRITICAL TEST', () => {
  
  beforeEach(async () => {
    // Clean all build artifacts before each test
    await cleanAllComponents();
  });

  test('once command executes seamlessly from empty environment - GATE TEST', async () => {
    console.log('🧪 CRITICAL TEST: ONCE seamless execution from scratch');
    console.log('⚠️ If this test fails, ALL OTHER TESTING MUST STOP');
    
    try {
      // Execute once command without any parameters to show usage
      const result = execSync('./scripts/once', { 
        encoding: 'utf8',
        timeout: 60000, // 60 seconds for complete build chain
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      console.log('✅ ONCE command executed successfully');
      console.log('📋 Output preview:', result.substring(0, 200) + '...');
      
      // Verify seamless execution requirements
      expect(result).toContain('Web4 ONCE CLI Tool');
      expect(result).toContain('Usage:');
      expect(result).toContain('Commands:');
      expect(result).toContain('Examples:');
      
      // Verify NO build failures or missing modules
      expect(result).not.toContain('Build failed');
      expect(result).not.toContain('Cannot find module');
      expect(result).not.toContain('Module not found');
      expect(result).not.toContain('❌');
      
      // Verify build chain executed
      expect(result).toContain('✅');
      
      console.log('🎉 CRITICAL TEST PASSED: ONCE executes seamlessly from scratch');
      
    } catch (error) {
      console.error('❌ CRITICAL TEST FAILED: ONCE seamless execution');
      console.error('🚨 ALL OTHER TESTING MUST STOP UNTIL THIS IS FIXED');
      console.error('Error:', (error as Error).message);
      
      // Re-throw to fail the test and stop execution
      throw new Error(`CRITICAL: ONCE seamless execution failed - ${(error as Error).message}`);
    }
  });

  test('once command uses comprehensive build chain automatically', async () => {
          console.log('🧪 Testing ONCE comprehensive build chain integration');
    
    try {
      // Execute once command and capture detailed output
      const result = execSync('./scripts/once', { 
        encoding: 'utf8',
        timeout: 120000, // 2 minutes for complete dependency building
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      // Verify comprehensive build chain was used (new behavior)
      expect(result).toContain('🏗️ Triggering comprehensive build chain for ONCE');
      expect(result).toContain('✅ Build chain complete - ONCE ready for execution');
      
      // Verify no fallback messages (comprehensive build succeeded)
      expect(result).not.toContain('Build component not available');
      expect(result).not.toContain('using enhanced fallback');
      
      console.log('✅ ONCE dependency build chain successful');
      
    } catch (error) {
      console.error('❌ ONCE dependency build chain failed');
      throw error;
    }
  });
});

/**
 * Clean all Web4 component build artifacts
 */
async function cleanAllComponents(): Promise<void> {
  console.log('🧹 Cleaning all Web4 component build artifacts...');
  
  const componentPaths = [
    '/workspace/components/IOR/0.3.0.0',
    '/workspace/components/Scenario/0.1.3.0',
    '/workspace/components/User/0.1.3.0',
    '/workspace/components/Build/0.3.0.0',
    '/workspace/components/ONCE/0.3.0.0',
    '/workspace/components/HttpServer/0.3.0.0',
    '/workspace/components/WsServer/0.3.0.0',
    '/workspace/components/P2PServer/0.3.0.0'
  ];
  
  for (const componentPath of componentPaths) {
    if (existsSync(componentPath)) {
      // Remove dist directory
      const distPath = `${componentPath}/dist`;
      if (existsSync(distPath)) {
        rmSync(distPath, { recursive: true, force: true });
      }
      
      // Remove TypeScript build info
      const buildInfoFiles = [`${componentPath}/tsconfig.tsbuildinfo`];
      for (const buildInfo of buildInfoFiles) {
        if (existsSync(buildInfo)) {
          rmSync(buildInfo, { force: true });
        }
      }
    }
  }
  
  console.log('✅ All component build artifacts cleaned');
}

/**
 * Execute shell command and capture output
 */
async function executeCommand(command: string): Promise<{ exitCode: number; output: string }> {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      cwd: '/workspace',
      stdio: 'pipe'
    });
    
    return { exitCode: 0, output };
    
  } catch (error: any) {
    return { 
      exitCode: error.status || 1, 
      output: error.stdout || error.message || 'Command execution failed'
    };
  }
}