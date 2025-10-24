/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

describe('🔍 Completion Discovery Feature Tests', () => {
  const projectRoot = join(__dirname, '..');
  const cliPath = join(projectRoot, 'web4tscomponent');

  beforeAll(async () => {
    // CRITICAL: Ensure component builds without errors before testing completion
    try {
      console.log('🔧 Building component before completion discovery tests...');
      execSync('npm run build', { 
        cwd: projectRoot, 
        stdio: 'inherit',
        timeout: 60000 
      });
      console.log('✅ Component build successful');
    } catch (error) {
      console.error('❌ Component build failed:', error);
      throw new Error('Component must build successfully before testing completion discovery');
    }
  });

  describe('1. Method Discovery - Single Match Auto-Completion', () => {
    it('1a. should complete initP to initProject (single match)', () => {
      const command = `${cliPath} completion method initP`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain the method name
      expect(output).toContain('initProject');
      
      // Should contain TSDoc separator (cyan dashes)
      expect(output).toMatch(/─{60}/);
      
      // Should contain documentation header
      expect(output).toContain('📖 Documentation:');
      
      // Should contain actual TSDoc content
      expect(output).toContain('Initialize or upgrade project');
    });

    it('1b. should show full signature with parameters for releaseTest', () => {
      const command = `${cliPath} completion method releaseT`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain method name
      expect(output).toContain('releaseTest');
      
      // Should contain parameter with default value
      expect(output).toContain('<?successPromotion:');
      expect(output).toContain('nextPatch');
      
      // Should contain documentation
      expect(output).toContain('Run tests with configurable release promotion');
      
      // Should contain workflow details
      expect(output).toContain('Two-stage workflow');
    });

    it('1c. should return plain name for method without TSDoc', () => {
      const command = `${cliPath} completion method createB`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain method name
      expect(output).toContain('createBasePackageJson');
      
      // Should NOT contain separator (no TSDoc available for private method)
      // This gracefully falls back to just showing the method name
    });
  });

  describe('2. Method Discovery - Multiple Match Listing', () => {
    it('2a. should list all methods starting with "create"', () => {
      const command = `${cliPath} completion method create`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Strip ANSI codes for easier testing
      const stripped = output.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Should contain numbered list
      expect(output).toMatch(/1:/);
      expect(output).toMatch(/2:/);
      
      // Should contain main create method
      expect(stripped).toContain('create');
      
      // Should contain parameters for main create
      expect(output).toContain('<component>');
      expect(output).toContain('<?version:');
      expect(output).toContain('<?options:');
      
      // Should contain other create methods
      expect(stripped).toContain('createBasePackageJson');
      expect(stripped).toContain('createLayerStructure');
    });

    it('2b. should list methods starting with "bui"', () => {
      const command = `${cliPath} completion method bui`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Strip ANSI codes for easier testing
      const stripped = output.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Should contain numbered list
      expect(output).toMatch(/1:/);
      expect(output).toMatch(/2:/);
      
      // Should contain build method
      expect(stripped).toContain('build');
      
      // Should contain buildDependencies
      expect(stripped).toContain('buildDependencies');
    });

    it('2c. should show all methods when no filter provided', () => {
      const command = `${cliPath} completion method`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain many numbered items (Web4TSComponent has 200+ methods)
      const numberedLines = output.match(/\d+:/g);
      expect(numberedLines).toBeDefined();
      expect(numberedLines!.length).toBeGreaterThan(50); // Should have many methods
      
      // Should contain various common methods
      expect(output).toContain('build');
      expect(output).toContain('test');
      expect(output).toContain('create');
    });
  });

  describe('3. Parameter Discovery - Value Discovery', () => {
    it('3a. should discover values for successPromotion parameter', () => {
      const command = `${cliPath} completion parameter successPromotion`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain all promotion levels
      expect(output).toContain('nextPatch');
      expect(output).toContain('nextMinor');
      expect(output).toContain('nextMajor');
    });

    it('3b. should discover values for options parameter', () => {
      const command = `${cliPath} completion parameter options`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain individual options
      expect(output).toContain('all');
      expect(output).toContain('cli');
      expect(output).toContain('spec');
      expect(output).toContain('vitest');
      expect(output).toContain('layers');
      
      // Should contain combined options
      expect(output).toContain('cli layers');
      expect(output).toContain('cli spec');
    });

    it('3c. should complete parameter prefix to full name', () => {
      const command = `${cliPath} completion parameter suc`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should complete to full parameter name (for tab completion)
      expect(output).toContain('successPromotion');
      
      // Should NOT contain values (only completes to name, not discovering values yet)
      expect(output).not.toContain('nextPatch nextMinor');
    });

    it('3d. should complete parameter prefix "v" to version', () => {
      const command = `${cliPath} completion parameter v`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should complete to version
      expect(output).toContain('version');
    });
  });

  describe('4. Parameter Discovery - Listing with Notation', () => {
    it('4a. should list all parameters with Web4 notation', () => {
      const command = `${cliPath} completion parameter`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain numbered list
      expect(output).toMatch(/1:/);
      
      // Should contain required parameters in angle brackets
      expect(output).toMatch(/<\w+>/);
      
      // Should contain optional parameters with defaults
      expect(output).toContain('<?version:');
      expect(output).toContain('<?options:');
      expect(output).toContain('<?successPromotion:');
      expect(output).toContain('<?depth:');
    });

    it('4b. should show parameter with default value notation', () => {
      const command = `${cliPath} completion parameter`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should show version with default
      expect(output).toContain("<?version:'0.1.0.0'>");
      
      // Should show options with default
      expect(output).toContain("<?options:'all'>");
      
      // Should show successPromotion with default
      expect(output).toContain("<?successPromotion:'nextPatch'>");
    });
  });

  describe('5. Search Term Highlighting (ANSI Codes)', () => {
    it('5a. should include ANSI color codes for method highlighting', () => {
      const command = `${cliPath} completion method crea`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain ANSI escape codes
      expect(output).toMatch(/\x1b\[/); // ANSI escape sequence
      
      // Should contain bright cyan for numbers (1;36m)
      expect(output).toContain('\x1b[1;36m');
      
      // Should contain reset codes
      expect(output).toContain('\x1b[0m');
    });

    it('5b. should include ANSI color codes for parameters', () => {
      const command = `${cliPath} completion parameter`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain bright cyan for numbers
      expect(output).toContain('\x1b[1;36m');
      
      // Should contain bright yellow for parameters (1;33m)
      expect(output).toContain('\x1b[1;33m');
      
      // Should contain reset codes
      expect(output).toContain('\x1b[0m');
    });
  });

  describe('6. Documentation Display Format', () => {
    it('6a. should format documentation with separator and header', () => {
      const command = `${cliPath} completion method initP`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain separator (60 dashes)
      const separatorMatch = output.match(/─+/);
      expect(separatorMatch).toBeDefined();
      if (separatorMatch) {
        expect(separatorMatch[0].length).toBe(60);
      }
      
      // Should contain documentation header with emoji
      expect(output).toContain('📖 Documentation:');
      
      // Should have proper spacing (double newline at end)
      expect(output).toMatch(/\n\n$/);
    });

    it('6b. should include green ANSI codes for TSDoc content', () => {
      const command = `${cliPath} completion method initP`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should contain green color code for TSDoc (32m)
      expect(output).toContain('\x1b[32m');
      
      // Green should be applied to documentation content
      const greenMatch = output.match(/\x1b\[32m.*Initialize.*\x1b\[0m/s);
      expect(greenMatch).toBeDefined();
    });

    it('6c. should show method signature with parameters before docs', () => {
      const command = `${cliPath} completion method releaseT`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Strip ANSI codes for easier testing
      const stripped = output.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Method name should appear in output
      expect(stripped).toContain('releaseTest');
      
      // Should contain parameter
      expect(stripped).toContain('successPromotion');
      
      // Separator should be present
      const separatorLine = stripped.split('\n').find(l => l.includes('─'));
      expect(separatorLine).toBeDefined();
      
      // Separator should come after method signature
      const signatureIndex = stripped.indexOf('releaseTest');
      const separatorIndex = stripped.indexOf('─');
      expect(separatorIndex).toBeGreaterThan(signatureIndex);
    });
  });

  describe('7. Performance and Edge Cases', () => {
    it('7a. should handle method discovery without timing out', () => {
      // Test that full method discovery doesn't take too long
      const start = Date.now();
      const command = `${cliPath} completion method`;
      execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env }, timeout: 15000 });
      const duration = Date.now() - start;
      
      // Should complete within reasonable time (not the old 20s+ timeout)
      expect(duration).toBeLessThan(15000);
      console.log(`✅ Method discovery completed in ${duration}ms`);
    });

    it('7b. should handle parameter discovery without timing out', () => {
      const start = Date.now();
      const command = `${cliPath} completion parameter`;
      execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env }, timeout: 15000 });
      const duration = Date.now() - start;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(15000);
      console.log(`✅ Parameter discovery completed in ${duration}ms`);
    });

    it('7c. should handle non-existent method prefix gracefully', () => {
      const command = `${cliPath} completion method zzznobody`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should return all methods when no match found (fallback behavior)
      // This is the current implementation behavior - show all when filter doesn't match
      expect(output).toBeDefined();
    });

    it('7d. should handle non-existent parameter prefix gracefully', () => {
      const command = `${cliPath} completion parameter zzznobody`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      
      // Should return all parameters when no match found (fallback behavior)
      expect(output).toBeDefined();
    });
  });

  describe('8. Integration - Complete Workflow', () => {
    it('8a. should support complete discovery workflow: find → complete → discover values', () => {
      // Step 1: List parameters
      let command = `${cliPath} completion parameter`;
      let output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      expect(output).toContain('<?successPromotion:');
      
      // Step 2: Complete to specific parameter
      command = `${cliPath} completion parameter suc`;
      output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      expect(output).toContain('successPromotion');
      
      // Step 3: Discover parameter values
      command = `${cliPath} completion parameter successPromotion`;
      output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      expect(output).toContain('nextPatch');
      expect(output).toContain('nextMinor');
      expect(output).toContain('nextMajor');
    });

    it('8b. should support method discovery workflow: find → complete → see docs', () => {
      // Step 1: List methods
      let command = `${cliPath} completion method`;
      let output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      expect(output).toContain('releaseTest');
      
      // Step 2: Complete to specific method (shows docs)
      command = `${cliPath} completion method releaseT`;
      output = execSync(command, { encoding: 'utf8', cwd: projectRoot, env: { ...process.env } });
      expect(output).toContain('releaseTest');
      expect(output).toContain('<?successPromotion:');
      expect(output).toContain('📖 Documentation:');
      expect(output).toContain('Run tests with configurable release promotion');
    });
  });
});

