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
  it('shows cursor after completion in te[tab]w', () => {
    const out = runScripted('te[tab]w');
    // Look for any inverse span (ESC[7m ... ESC[0m)
    const hasInverse = /\x1b\[7m[\s\S]*?\x1b\[0m/.test(out);
    expect(hasInverse).toBe(true);
  });
});


