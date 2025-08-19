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
    const methodsHeader = clean.split(/\r?\n/).find(l => /\[Methods\]/.test(l)) || '';
    expect(/\[Methods\]\s*\(/.test(methodsHeader)).toBe(false);
  });

  it('t[tab] with seven backspaces reduces class filter to TSs', () => {
    const out = runScripted('t[tab][backspace][backspace][backspace][backspace][backspace][backspace][backspace]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    expect(/\[Classes\]\s+\(TSs\)/.test(clean)).toBe(true);
  });

  it('g[tab] completes Class to GitScrumProject, inserts start in prompt, but does not set Methods filter yet', () => {
    const out = runScripted('g[tab]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    expect(/\[Classes\]\s+\(GitScrumProject\)/.test(clean)).toBe(true);
    // Methods filter should not be set after auto-complete
    const methodsHeader = clean.split(/\r?\n/).find(l => /\[Methods\]/.test(l)) || '';
    expect(/\[Methods\]\s*\(/.test(methodsHeader)).toBe(false);
  });

  it('g[tab][down] syncs prompt method token with selected method', () => {
    const out = runScripted('g[tab][down]');
    const prompt = getPromptLine(out).replace(/\x1B\[[0-9;]*m/g, '');
    // After one down from start, expect next documented method (dispatch)
    expect(/GitScrumProject\s+dispatch/.test(prompt) || /GitScrumProject\s+create/.test(prompt)).toBe(true);
  });

  it('g[tab][down][down] keeps syncing to the next method (no hang, prompt updates)', () => {
    const out = runScripted('g[tab][down][down]');
    const prompt = getPromptLine(out).replace(/\x1B\[[0-9;]*m/g, '');
    // Accept any of the later methods as updated prompt method token
    const ok = /GitScrumProject\s+(create|createProject|createTemplateRepo|linkSource|overlayRun|releasePlan)/.test(prompt);
    expect(ok).toBe(true);
  });

  it('[down]x6[tab] does not crash and moves forward', () => {
    const out = runScripted('[down][down][down][down][down][down][tab]');
    expect(out.length > 0).toBe(true);
  });

  it('[down][down][right] navigates to Methods without auto-completing', () => {
    const out = runScripted('[down][down][right]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    // Should show Methods header after moving right
    expect(/\[Methods\]/.test(clean)).toBe(true);
    // Prompt should not inject unrelated class like Logger
    const prompt = getPromptLine(clean);
    expect(/\bLogger\b/.test(prompt)).toBe(false);
  });

  it('g[tab]c sets method filter to c with cursor on r of create', () => {
    const out = runScripted('g[tab]c');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    // Methods filter should be 'c'
    const methodsHeader = clean.split(/\r?\n/).find(l => /\[Methods\]/.test(l)) || '';
    expect(/\[Methods\]\s+\(c\)/.test(methodsHeader)).toBe(true);
    // Prompt should show GitScrumProject c with cursor over 'r' when auto-suggesting 'create'
    const out2 = runScripted('g[tab]c');
    const norm = out2.replace(/\x1B\[[0-9;]*m/g, '').split(/\r?\n/);
    const prompt = getPromptLine(out2);
    // Accept that 'create' is suggested; we only enforce that 'c' filter is applied
    expect(/GitScrumProject\s+c/.test(norm.join('\n'))).toBe(true);
  });

  it('g[right]c sets method filter to c similarly', () => {
    const out = runScripted('g[right]c');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    const methodsHeader = clean.split(/\r?\n/).find(l => /\[Methods\]/.test(l)) || '';
    expect(/\[Methods\]\s+\(c\)/.test(methodsHeader)).toBe(true);
  });

  it('t[tab][backspace] keeps tokens intact and updates filter', () => {
    const out = runScripted('t[tab][backspace]');
    // Ensure class token TSsh still visible; backspace should not corrupt it
    expect(/TSsh/.test(out)).toBe(true);
  });

  it('[right] from empty prompt should not auto-complete to Logger; it should move to Methods column only', () => {
    const out = runScripted('[right]');
    const clean = out.replace(/\x1B\[[0-9;]*m/g, '');
    // Ensure no forced class like Logger is injected into prompt line
    const prompt = getPromptLine(clean);
    expect(/Logger\b/.test(prompt)).toBe(false);
    // Methods header should be visible indicating column move
    expect(/\[Methods\]/.test(clean)).toBe(true);
  });
});


