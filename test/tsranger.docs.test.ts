/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

function runScripted(keys: string): string {
  const projectRoot = process.cwd();
  const bin = path.join(projectRoot, 'src/sh/tsranger');
  const env = { ...process.env, TSRANGER_TEST_MODE: '1', TSRANGER_TEST_INPUT: keys, TS_RANGER_TEST_FINAL_ONLY: '1', PS1: '\\u@\\h \\w$' };
  const res = spawnSync(bin, ['test', keys], { env, encoding: 'utf8' });
  return res.stdout || '';
}

function stripAnsi(s: string): string { return s.replace(/\x1B\[[0-9;]*m/g, ''); }

describe('TSRanger Docs column', () => {
  it('shows TestClass class documentation in Docs column', () => {
    // Filter to TestClass to ensure selection
    const out = runScripted('Te');
    const lines = out.split(/\r?\n/).map(stripAnsi);
    // Expect the doc text to be present somewhere in the grid output
    const hasDocSnippet = lines.some(l => l.includes('TS Ranger'));
    expect(hasDocSnippet).toBe(true);
  });

  it('updates Docs when selecting a documented method', () => {
    // Filter to TestClass, then move right to Methods, then down to select 'world'
    const out = runScripted('Te[right][down]');
    const lines = out.split(/\r?\n/).map(stripAnsi);
    const hasMethodDoc = lines.some(l => l.includes('Combines the provided parameters')) || lines.some(l => l.includes('Says hello'));
    expect(hasMethodDoc).toBe(true);
  });
});


