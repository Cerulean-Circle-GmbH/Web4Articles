/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';



describe('🧪 2025-10-18 Feature Black Box Tests - PHASE 1: web4tscomponent', () => {
  const projectRoot = process.cwd();
  const cliPath = join(projectRoot, 'web4tscomponent');

  beforeAll(() => {
    // Verify CLI exists
    if (!existsSync(cliPath)) {
      throw new Error(`CLI not found at ${cliPath}`);
    }
  });

  describe('Feature 1: Hierarchical Method Display on Single TAB', () => {
    // PDCA: 2025-10-18-UTC-1930
    // Spec: web4tscomponent completion method should show numbered hierarchical list

    it('1a. should show hierarchical display with numbered methods', () => {
      const command = `${cliPath} completion method`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should contain numbered entries
      expect(output).toMatch(/\d+:/);
      
      // Should contain method names with parameters
      expect(output).toContain('on');
      expect(output).toContain('create');
      expect(output).toContain('links');
      
      // Should NOT be a simple flat list
      expect(output.split('\n').length).toBeGreaterThan(50);
    });

    it('1b. should filter hierarchical display by method prefix', () => {
      const command = `${cliPath} completion method cre`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Strip ANSI codes for testing
      const stripped = output.replace(/\x1b\[[0-9;]*m/g, '');
      
      // Should show only methods starting with 'cre'
      expect(stripped).toContain('create');
      
      // Should still be hierarchical (numbers + parameters)
      expect(stripped).toMatch(/\d+:/);
      expect(stripped).toMatch(/<\w+>/); // Parameter notation
    });
  });

  describe('Feature 2: Method Chaining with Optional Parameters', () => {
    // PDCA: 2025-10-18-UTC-2300
    // Spec: Methods with optional params should correctly chain to next method
    // NOTE: Testing WITHOUT context - chaining on web4tscomponent itself

    it('2a. should NOT chain when filter matches method name', () => {
      // completion method create should NOT execute 'create'
      const command = `${cliPath} completion method create`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should show filtered list, NOT execute create
      expect(output).toContain('create');
      expect(output).toMatch(/\d+:/); // Hierarchical display
      
      // Should NOT show create execution output
      expect(output).not.toContain('Created component');
    });
  });

  describe('Feature 3: Test Scope Completion', () => {
    // PDCA: 2025-10-18-UTC-2230
    // Spec: test scope parameter should NOT show 'all' (it's the default)

    it('3a. should NOT include "all" in scope completions', () => {
      const command = `${cliPath} completeParameter scopeParameterCompletion test`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should include valid scopes
      expect(output).toContain('file');
      expect(output).toContain('describe');
      expect(output).toContain('itCase');
      
      // Should NOT include 'all' (it's the default)
      expect(output).not.toContain('all');
    });

    it('3b. should complete scope parameter values', () => {
      const command = `${cliPath} completeParameter scopeParameterCompletion test`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should include valid scopes
      expect(output).toContain('file');
      expect(output).toContain('describe');
      expect(output).toContain('itCase');
      
      // Should NOT include 'all' (it's the default)
      expect(output).not.toContain('all');
    });
  });

  describe('Feature 4: Help Example Update', () => {
    // PDCA: 2025-10-18-UTC-2034
    // Spec: Help should show updated example: links fix (not verifyAndFix)

    it('4a. should show updated example in help output', () => {
      const command = `${cliPath}`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Strip ANSI for testing
      const stripped = output.replace(/\x1b\[[0-9;]*m/g, '');

      // Should contain updated example elements
      expect(stripped).toContain('links');
      expect(stripped).toContain('fix');
      
      // Should NOT show outdated 'verifyAndFix'
      expect(stripped).not.toContain('verifyAndFix');
    });
  });

  describe('Feature 5: Action Parameter Completion', () => {
    // PDCA: 2025-10-18-UTC-2034
    // Spec: actionParameterCompletion should NOT have empty string

    it('5a. should NOT include empty string in action completions', () => {
      const command = `${cliPath} completeParameter actionParameterCompletion links`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should include valid actions
      expect(output).toContain('fix');
      expect(output).toContain('verify');
      expect(output).toContain('show');
      expect(output).toContain('list');
      
      // Should be space-separated, no empty string
      const actions = output.trim().split(' ');
      expect(actions).not.toContain('');
      expect(actions.length).toBe(4);
    });

    it('5b. should return all action values for completion', () => {
      const command = `${cliPath} completeParameter actionParameterCompletion links`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });

      // Should return all actions (bash will filter)
      expect(output).toContain('fix');
      expect(output).toContain('verify');
      expect(output).toContain('show');
      expect(output).toContain('list');
    });
  });
});

