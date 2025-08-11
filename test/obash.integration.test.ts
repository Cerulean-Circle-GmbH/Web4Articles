/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';

const obashScript = path.resolve(__dirname, '../src/sh/obash');

function run(cmd: string) {
  const env = { ...process.env, NODE_NO_WARNINGS: '1' } as NodeJS.ProcessEnv;
  return execSync(cmd, { encoding: 'utf8', env });
}

describe('obash integration', () => {
  it('sets PROJECT_ROOT and prepends PATH in rc for non-interactive', () => {
    const out = run(`${obashScript} 'printf "%s\n" "$PROJECT_ROOT" "$PATH"'`);
    const lines = out.trim().split(/\n+/);
    const expectedRoot = path.resolve(__dirname, '..');
    expect(lines[0]).toBe(expectedRoot);
    expect(lines.join('\n')).toMatch(/src\/sh/);
  });

  it('supports non-interactive command execution', () => {
    const out = run(`${obashScript} 'command -v tssh'`);
    expect(out).toMatch(/src\/sh\/tssh/);
  });

  it('registers tssh completion function', () => {
    const out = run(`${obashScript} 'complete -p tssh || true'`);
    expect(out).toMatch(/_tssh_completion/);
  });
});


