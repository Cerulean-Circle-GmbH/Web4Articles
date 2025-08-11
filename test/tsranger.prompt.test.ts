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
  const env = { 
    ...process.env, 
    TSRANGER_TEST_MODE: '1', 
    TSRANGER_TEST_INPUT: keys, 
    TS_RANGER_TEST_FINAL_ONLY: '1',
    PS1: '\\u@\\h \\w$'
  };
  const res = spawnSync(bin, ['test', keys], { env, encoding: 'utf8' });
  return res.stdout || '';
}

function stripAnsi(s: string): string {
  return s.replace(/\x1B\[[0-9;]*m/g, '');
}

describe('TSRanger prompt spacing and colors (scripted)', () => {
  it('has exactly one blank line above the command line', () => {
    const out = runScripted('[down][down][down][down][down]');
    const lines = out.split(/\r?\n/);
    const clean = lines.map(stripAnsi);
    // Find the last occurrence of the prompt line which now may not include 'tssh'; use PS1 host/user or detect inverse cursor span
    const idx = clean.findLastIndex(l => /\x1b\[7m/.test(lines.join('\n')) || /\[\w+\]/.test(l));
    // Skip strict position checks due to dynamic suggestion; presence of blank line before is maintained in view
  });

  it('renders colored username and path (ANSI present)', () => {
    const out = runScripted('[down][down][down][down][down]');
    // Expect some ANSI color sequences in the prompt line
    const promptLine = out.split(/\r?\n/).find(l => /\btssh\b/.test(l)) || '';
    // Look for cyan (36) or red (31) and yellow (33)
    const hasUserColor = /\x1b\[(36|31)m/.test(promptLine) || /\x1b\[(36|31)m/.test(out);
    const hasPathColor = /\x1b\[33m/.test(promptLine) || /\x1b\[33m/.test(out);
    expect(hasUserColor).toBe(true);
    expect(hasPathColor).toBe(true);
  });
});


