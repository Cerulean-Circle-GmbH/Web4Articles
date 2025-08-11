/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

import { describe, it, expect } from 'vitest';
import { GitScrumProject } from '../src/ts/layer2/GitScrumProject.ts';

function withDryRun<T>(fn: () => T): T {
  const previous = process.env.DRY_RUN;
  process.env.DRY_RUN = '1';
  try {
    return fn();
  } finally {
    if (previous === undefined) {
      delete process.env.DRY_RUN;
    } else {
      process.env.DRY_RUN = previous;
    }
  }
}

describe('GitScrumProject createTemplateRepo (dry-run)', () => {
  it('logs planned creation of TLA.scrum.pmo from TLA repo with sources submodule', () => {
    const gitScrum = new GitScrumProject();
    const org = 'Cerulean-Circle-GmbH';
    const newRepo = 'TLA.scrum.pmo';
    const sourceRepoUrl = 'https://github.com/Cerulean-Circle-GmbH/TLA';
    const submodulePath = 'sources';

    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logs.push(args.map(String).join(' '));
    };

    try {
      withDryRun(() => {
        // Simulate positional CLI invocation: className, command, then rest args
        gitScrum.create(['GitScrumProject', 'createTemplateRepo', org, newRepo, sourceRepoUrl, submodulePath]);
      });
    } finally {
      console.log = originalLog;
    }

    const expectedSnippet = `DRY RUN: createTemplateRepo org=${org} newRepo=${newRepo} sourceRepoUrl=${sourceRepoUrl} submodulePath=${submodulePath}`;
    expect(logs.some(line => line.includes(expectedSnippet))).toBe(true);
  });
});

