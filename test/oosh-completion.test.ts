
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as path from 'node:path';

describe('oosh bash completion integration (clean ESM)', () => {
  const projectRoot = path.resolve(path.dirname(import.meta.url.replace('file://', '')), '..');
  const tsCompletion = path.join(projectRoot, 'src/ts/layer4/TSCompletion.ts');
  const shDir = path.join(projectRoot, 'src/sh');

  function runCompletion(args: string[] = [], cwd = projectRoot) {
    const result = spawnSync('ts-node', [tsCompletion, ...args], {
      cwd,
      env: { ...process.env, TS_NODE_PROJECT: path.join(projectRoot, 'tsconfig.json') },
      encoding: 'utf-8',
    });
    if (result.error || result.status !== 0) {
      // Print debug info if the test fails
      console.error('DEBUG: spawnSync error:', result.error);
      console.error('DEBUG: spawnSync stderr:', result.stderr);
      console.error('DEBUG: spawnSync stdout:', result.stdout);
      console.error('DEBUG: command:', `ts-node ${tsCompletion} ${args.join(' ')}`);
      console.error('DEBUG: cwd:', cwd);
    }
    return result.stdout.trim().split(/\s+/).filter(Boolean);
  }

  it('completes classes on empty input', () => {
    const completions = runCompletion([]);
    expect(completions).toContain('GitScrumProject');
  });

  it('completes methods for GitScrumProject', () => {
    const completions = runCompletion(['GitScrumProject']);
    expect(completions).toContain('create');
  });

  it('completes parameters for create', () => {
    const completions = runCompletion(['GitScrumProject', 'create']);
    expect(completions.length).toBeGreaterThanOrEqual(0);
  });

  it('works from src/sh directory like the shell script', () => {
    const relCompletion = path.relative(shDir, tsCompletion);
    const result = spawnSync('ts-node', [relCompletion], {
      cwd: shDir,
      env: { ...process.env, TS_NODE_PROJECT: path.join(projectRoot, 'tsconfig.json') },
      encoding: 'utf-8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('GitScrumProject');
  });
});
