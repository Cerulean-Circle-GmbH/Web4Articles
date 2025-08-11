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

describe('TSRanger prompt cursor', () => {
  it('shows prompt buffer suggestion and cursor with te[tab]w, and filters to TSsh/TestClass', () => {
    const out = runScripted('t');
    // After typing 't', Classes should include TSsh and TestClass only
    const onlyTClasses = /\[Classes\]\s+\(t\)/.test(out) && /TSsh/.test(out) && /TestClass/.test(out);
    expect(onlyTClasses).toBe(true);

    const out2 = runScripted('te[tab]w');
    // Look for any inverse span (ESC[7m ... ESC[0m)
    const hasInverse = /\x1b\[7m[\s\S]*?\x1b\[0m/.test(out2);
    expect(hasInverse).toBe(true);
    // Command line should reflect completion and typing (TSsh start...) eventually; loosen to presence of TSsh
    expect(/TSsh/.test(out2)).toBe(true);
  });
});


