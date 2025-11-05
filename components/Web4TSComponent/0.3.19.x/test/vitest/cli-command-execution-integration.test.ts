/**
 * CLI Command Execution Integration Test
 * Tests ACTUAL CLI command execution (not just method existence)
 * 
 * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
 * 
 * THIS TEST SHOULD EXPOSE THE BUG:
 * - discoverMethods() runs BEFORE component exists
 * - Component methods are NEVER discovered
 * - Shell commands DON'T WORK even though unit tests pass
 */

import { describe, it, expect } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';

describe('🔴 CLI Command Execution Integration (REAL USAGE)', () => {
  it('should discover component methods during construction', () => {
    const cli = new Web4TSComponentCLI();
    const methodSignatures = (cli as any).methodSignatures;
    
    // ❌ SHOULD FAIL: Component methods NOT discovered
    // Component commands that SHOULD exist:
    const expectedCommands = ['create', 'test', 'version', 'list', 'upgrade'];
    
    for (const cmd of expectedCommands) {
      const hasCommand = methodSignatures.has(cmd);
      expect(hasCommand, `Command '${cmd}' should be discovered but was not`).toBe(true);
    }
  });
  
  it('should be able to execute component commands', async () => {
    const cli = new Web4TSComponentCLI();
    
    // ❌ SHOULD FAIL: 'version' command not discovered
    await expect(cli.execute(['version'])).resolves.not.toThrow();
  });
  
  it('should have non-zero method signatures after construction', () => {
    const cli = new Web4TSComponentCLI();
    const methodSignatures = (cli as any).methodSignatures;
    
    // This might pass (CLI methods exist)
    expect(methodSignatures.size).toBeGreaterThan(0);
    
    // ❌ But THIS should fail - no component methods!
    const componentMethodCount = Array.from(methodSignatures.keys())
      .filter((key: string) => !['showUsage', 'execute', 'on'].includes(key))
      .length;
    
    expect(componentMethodCount, 'Should have component methods').toBeGreaterThan(0);
  });
});

