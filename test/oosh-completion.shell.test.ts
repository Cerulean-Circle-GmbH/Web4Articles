/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

  it('completes default value for GitScrumProject create project using COMP_WORDS/COMP_CWORD', () => {
    // Simulate Bash completion environment
    const env = {
      ...process.env,
      COMP_WORDS: 'oosh GitScrumProject create project',
      COMP_CWORD: '4',
      NODE_NO_WARNINGS: '1',
    };
    const result = execSync(`bash ${shScript}`, { encoding: 'utf8', env });
    expect(result).toMatch(/Web4Scrum/);
  });
import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';

const shScript = path.resolve(__dirname, '../src/sh/oosh-completion.sh');
const ooshBin = path.resolve(__dirname, '../src/ts/layer1/OOSH.ts');

// Helper to run a shell command and return stdout
function runShell(cmd: string) {
  return execSync(cmd, { encoding: 'utf8', env: { ...process.env, NODE_NO_WARNINGS: '1' } });
}

describe('oosh-completion.sh integration', () => {

  it('completes classes on empty input', () => {
    const result = runShell(`bash ${shScript}`);
    expect(result).toMatch(/OOSH/);
  });

  it('completes methods for OOSH', () => {
    const result = runShell(`bash ${shScript} OOSH`);
    expect(result).toMatch(/help/);
    expect(result).toMatch(/create/);
  });

  it('completes parameters for GitScrumProject create', () => {
    const result = runShell(`bash ${shScript} GitScrumProject create`);
    expect(result).toMatch(/project/);
  });

//   it('completes default value for GitScrumProject create project', () => {
//     const result = runShell(`bash ${shScript} GitScrumProject create project`);
//     expect(result).toMatch(/Web4Scrum/);
//   });


});
