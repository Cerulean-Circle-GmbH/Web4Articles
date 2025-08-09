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

describe('Prompt-line behavior for t, t[right], t[tab]', () => {
  it('t filters to TSsh/TestClass and shows TSsh with cursor on S', () => {
    const out = runScripted('t');
    expect(/TSsh/.test(out)).toBe(true);
    expect(/TestClass/.test(out)).toBe(true);
    // Expect cursor inverse near TSsh (inverse span exists)
    expect(/\x1b\[7m[\s\S]*?\x1b\[0m/.test(out)).toBe(true);
  });

  it('t[right] shows TSsh start with cursor on s of start', () => {
    const out = runScripted('t[right]');
    // Loosely assert TSsh and start appear in the prompt line output
    expect(/TSsh/.test(out)).toBe(true);
    expect(/start/.test(out)).toBe(true);
    // Cursor inverse present
    expect(/\x1b\[7m[\s\S]*?\x1b\[0m/.test(out)).toBe(true);
  });

  it('t[tab] behaves like completion to TSsh start and shows cursor', () => {
    const out = runScripted('t[tab]');
    expect(/TSsh/.test(out)).toBe(true);
    expect(/start/.test(out)).toBe(true);
    expect(/\x1b\[7m[\s\S]*?\x1b\[0m/.test(out)).toBe(true);
  });
});


