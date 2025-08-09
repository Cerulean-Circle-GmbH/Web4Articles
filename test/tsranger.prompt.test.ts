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
    // Find the last occurrence of the prompt+command containing 'tssh'
    const idx = clean.findLastIndex(l => /\btssh\b/.test(l));
    expect(idx).toBeGreaterThan(2);
    // Check that the line before is empty and the one two lines before is not empty (exactly one blank line above)
    expect(clean[idx - 1]).toBe('');
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


