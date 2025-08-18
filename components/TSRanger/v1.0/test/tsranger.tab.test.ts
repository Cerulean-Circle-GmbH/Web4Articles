import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

function runScripted(keys: string): string {
  const projectRoot = process.cwd();
  const bin = path.join(projectRoot, 'components/TSRanger/v1.0/src/sh/tsranger');
  const env = { ...process.env, TSRANGER_TEST_MODE: '1', TSRANGER_TEST_INPUT: keys, TS_RANGER_TEST_FINAL_ONLY: '1', PS1: '\\u@\\h \\w$' };
  const res = spawnSync(bin, ['test', keys], { env, encoding: 'utf8' });
  return res.stdout || '';
}

describe('TSRanger Tab behavior', () => {
  it('tab moves to next column like right arrow', () => {
    const outRight = runScripted('[right]');
    const outTab = runScripted('[tab]');
    // Heuristic: when in methods column, the header should show [Methods]
    const showsMethodsRight = /\[Methods\]/.test(outRight);
    const showsMethodsTab = /\[Methods\]/.test(outTab);
    expect(showsMethodsRight).toBe(true);
    expect(showsMethodsTab).toBe(true);
  });
});


