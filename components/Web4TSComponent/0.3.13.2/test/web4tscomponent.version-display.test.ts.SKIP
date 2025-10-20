/**
 * Version Display Tests - Ensure CLI shows correct version
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

describe('🔢 Web4TSComponent Version Display', () => {

  it('should have correct version in package.json matching 0.3.4.1', async () => {
    // Get the actual version from package.json
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const expectedVersion = packageJson.version;
    
    // Test that version is 0.3.4.1 (current version)
    expect(expectedVersion).toBe('0.3.4.1');
    
    console.log(`✅ Version consistency verified: ${expectedVersion}`);
  });

  it('should not contain old hardcoded version 0.3.0.9 in source files', async () => {
    // Check main CLI file doesn't have old version
    const cliPath = path.join(__dirname, '..', 'src', 'ts', 'layer5', 'Web4TSComponentCLI.ts');
    const cliContent = readFileSync(cliPath, 'utf-8');
    
    // Should NOT contain old hardcoded version
    expect(cliContent).not.toContain('0.3.0.9');
    expect(cliContent).toContain('0.3.4.1');
    
    console.log(`✅ CLI file version check passed`);
  });

  it('should have consistent version across DefaultCLI fallback', async () => {
    // Check DefaultCLI fallback version
    const defaultCliPath = path.join(__dirname, '..', 'src', 'ts', 'layer2', 'DefaultCLI.ts');
    const defaultCliContent = readFileSync(defaultCliPath, 'utf-8');
    
    // Should NOT contain old hardcoded version
    expect(defaultCliContent).not.toContain('0.3.0.9');
    expect(defaultCliContent).toContain('0.3.4.1');
    
    console.log(`✅ DefaultCLI version check passed`);
  });
});
