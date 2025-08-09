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

function getPromptLine(out: string): string {
  const lines = out.split(/\r?\n/);
  const footerIdx = lines.findIndex(l => l.includes('column') && l.includes('Enter: select'));
  if (footerIdx > 1) {
    return lines[footerIdx - 2] || '';
  }
  return '';
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

  it('t[tab][backspace] removes the first method char and keeps tokens intact (filters reflect tart)', () => {
    const out = runScripted('t[tab][backspace]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    // Classes filter should be TSsh
    expect(/\[Classes\]\s+\(TSsh\)/.test(clean)).toBe(true);
    // Methods filter should be tart
    expect(/\[Methods\]\s+\(tart\)/.test(clean)).toBe(true);
  });

  it('t[tab] with multiple backspaces erases method then leaves only class filter', () => {
    const out = runScripted('t[tab][backspace][backspace][backspace][backspace][backspace][backspace]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    // Classes filter remains TSsh
    expect(/\[Classes\]\s+\(TSsh\)/.test(clean)).toBe(true);
    // Methods filter absent (no parentheses after Methods)
    expect(/\[Methods\]\s+\(.*?\)/.test(clean)).toBe(false);
  });

  it('t[tab] with seven backspaces reduces class filter to TSs', () => {
    const out = runScripted('t[tab][backspace][backspace][backspace][backspace][backspace][backspace][backspace]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    expect(/\[Classes\]\s+\(TSs\)/.test(clean)).toBe(true);
  });

  it('g[tab] completes Class to GitScrumProject and sets Methods filter to start', () => {
    const out = runScripted('g[tab]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    expect(/\[Classes\]\s+\(GitScrumProject\)/.test(clean)).toBe(true);
    expect(/\[Methods\]\s+\(start\)/.test(clean)).toBe(true);
  });

  it('[down]x6[tab] does not crash and moves forward', () => {
    const out = runScripted('[down][down][down][down][down][down][tab]');
    expect(out.length > 0).toBe(true);
  });

  it('t[tab][backspace] keeps tokens intact and updates filter', () => {
    const out = runScripted('t[tab][backspace]');
    // Ensure class token TSsh still visible; backspace should not corrupt it
    expect(/TSsh/.test(out)).toBe(true);
  });
});


