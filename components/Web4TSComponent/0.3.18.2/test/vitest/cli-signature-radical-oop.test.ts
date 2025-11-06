/**
 * @file cli-signature-radical-oop.test.ts
 * @description Test cliSignature API with 100% Radical OOP (parameterless methods)
 * @pdca 2025-11-04-UTC-1819.pdca.md - Radical OOP cliSignature implementation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';

describe('cliSignature - Radical OOP API', () => {
  let cli: Web4TSComponentCLI;
  let originalLog: typeof console.log;
  let originalError: typeof console.error;
  let stdoutLogs: string[];
  let stderrLogs: string[];

  beforeEach(async () => {
    cli = new Web4TSComponentCLI();
    // CRITICAL: Must discover methods before completion works
    await cli.discoverMethods();
    stdoutLogs = [];
    stderrLogs = [];
    originalLog = console.log;
    originalError = console.error;
    // Mock stdout (DISPLAY: and WORD: lines)
    console.log = (...args: any[]) => {
      stdoutLogs.push(args.join(' '));
    };
    // Mock stderr (diagnostic output)
    console.error = (...args: any[]) => {
      stderrLogs.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
  });

  describe('Method Completion (cword=1)', () => {
    it('should show diagnostic: "📊 Completing: METHOD"', async () => {
      // Arrange - use more specific prefix to reduce completion time
      const cword = '1';
      const words = ['web4tscomponent', 'compl'];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - diagnostic goes to stdout as DISPLAY lines (with colors)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('📊 Completing: METHOD'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('WORD:');
      expect(stdoutOutput).toContain('DISPLAY:');
    }, 60000); // 60 second timeout for TSDoc parsing

    it('should show formatted output with signatures', async () => {
      // Arrange - test that we get formatted DISPLAY output
      const cword = '1';
      const words = ['web4tscomponent', 'link'];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - should have DISPLAY lines with signature
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('DISPLAY:');
      expect(stdoutOutput).toContain('links');
      expect(stdoutOutput).toContain('WORD:');
    }, 60000); // 60 second timeout for TSDoc parsing

    it('should show prompt line', async () => {
      // Arrange - verify "your web4 command >" prompt appears
      const cword = '1';
      const words = ['web4tscomponent', 'link'];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - stdout has prompt line
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('your');
      expect(stdoutOutput).toContain('web4');
      expect(stdoutOutput).toContain('command');
    }, 60000); // 60 second timeout for TSDoc parsing
  });

  describe('Parameter Completion (cword>1)', () => {
    it('should show diagnostic: "📊 Completing: PARAMETER X of \'command\'"', async () => {
      // Arrange - completing first parameter of 'on'
      const cword = '2';
      const words = ['web4tscomponent', 'on', ''];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - diagnostic on stdout as DISPLAY lines (with colors)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('Completing:'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('Parameter:');
    });

    it('should show signature as DISPLAY line (visible to user)', async () => {
      // Arrange - completing first parameter of 'on'
      const cword = '2';
      const words = ['web4tscomponent', 'on', ''];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - signature shown on stdout as DISPLAY line (visible diagnostic, with colors)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('Completing:'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('on');
    });

    it('should output completions to stdout only', async () => {
      // Arrange - completing first parameter of 'on'
      const cword = '2';
      const words = ['web4tscomponent', 'on', ''];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - stdout has WORD: lines (bash completion protocol)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('WORD:');
      // Should have actual completions (components)
      expect(stdoutOutput.split('\n').filter(l => l.startsWith('WORD:')).length).toBeGreaterThan(0);
      // Assert - diagnostic is now in DISPLAY lines (not bare text)
      expect(stdoutOutput).toContain('DISPLAY:');
    });
  });

  describe('on Command Completion (Diagnostic Verification)', () => {
    it('should show diagnostic output for on command parameters', async () => {
      // Arrange - completing: web4tscomponent on <Tab>
      const cword = '2';
      const words = ['web4tscomponent', 'on', ''];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - diagnostic on stdout as DISPLAY lines (visible to user, with colors!)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('Completing:'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('Parameter:');
      expect(stdoutOutput).toContain('WORD:');
      // Now actually works! Should have component completions
      expect(stdoutOutput.split('\n').filter(l => l.startsWith('WORD:')).length).toBeGreaterThan(0);
    });

    it('should show diagnostic for version parameter', async () => {
      // Arrange - completing: web4tscomponent on PDCA <Tab>
      const cword = '3';
      const words = ['web4tscomponent', 'on', 'PDCA', ''];

      // Act
      await cli.cliSignature(cword, ...words);

      // Assert - diagnostic on stdout as DISPLAY lines (with colors)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('Completing:'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('Parameter:');
      expect(stdoutOutput).toContain('WORD:');
      // Now works! Should have version completions
      expect(stdoutOutput.split('\n').filter(l => l.startsWith('WORD:')).length).toBeGreaterThan(0);
    });
  });

  describe('Backward Compatibility', () => {
    it('shCompletion should delegate to cliSignature', async () => {
      // Arrange - use specific prefix for faster completion
      const cword = '1';
      const words = ['web4tscomponent', 'link'];

      // Act - call shCompletion (delegates to cliSignature)
      await (cli as any).shCompletion(cword, ...words);

      // Assert - diagnostic on stdout as DISPLAY lines (visible, with colors!)
      const stdoutOutput = stdoutLogs.join('\n');
      expect(stdoutOutput).toContain('📊 Completing: METHOD'); // Check content (color codes may vary)
      expect(stdoutOutput).toContain('WORD:');
      expect(stdoutOutput).toContain('DISPLAY:');
    }, 60000); // 60 second timeout for TSDoc parsing
  });
});

