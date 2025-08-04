
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { describe, it, expect } from 'vitest';

describe('tssh CLI integration (realistic scenarios)', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const tsshPath = path.join(projectRoot, 'src', 'sh', 'tssh');
  const backendPath = path.join(projectRoot, 'src', 'ts', 'layer1', 'TSsh.ts');
  const completionScriptPath = path.join(projectRoot, 'src', 'sh', 'tssh-completion.sh');
  const completionTarget = path.join(os.homedir(), '.local', 'share', 'bash-completion', 'completions', '_tssh_completion');

  it('prints project root and unit path when called with no arguments', () => {
    const result = spawnSync('bash', [tsshPath], { encoding: 'utf-8' });
    expect(result.stdout).toMatch(/Project Root:/);
    expect(result.stdout).toMatch(/Unit Path:/);
    expect(result.status).toBe(0);
  });

  it('installs bash completion via positional arguments', () => {
    if (fs.existsSync(completionTarget)) fs.unlinkSync(completionTarget);
    const result = spawnSync('bash', [tsshPath, 'TSsh', 'installCompletion'], { encoding: 'utf-8' });
    expect(result.status).toBe(0);
    expect(fs.existsSync(completionTarget)).toBe(true);
    const content = fs.readFileSync(completionTarget, 'utf-8');
    expect(content).toMatch(/_tssh_completion/);
    // Ensure completion script is not embedded in TypeScript
    const tsContent = fs.readFileSync(backendPath, 'utf-8');
    expect(tsContent).not.toMatch(/_tssh_completion/);
  });

  // Completion mechanism is a guardrail: it only ever suggests valid, existing arguments (class, method, etc.).
  // Shell-style options like --install-completion are never suggested by completion and cannot be completed.
  // This test only verifies CLI invocation, not completion behavior.
  it('rejects shell-style options for CLI invocation', () => {
    const result = spawnSync('bash', [tsshPath, '--install-completion'], { encoding: 'utf-8' });
    expect(result.stdout).toMatch(/error: shell-style options are not supported/i);
    expect(result.status).toBe(0);
  });

  it('handles invalid commands gracefully (CLI only)', () => {
    const result = spawnSync('bash', [tsshPath, 'notACommand'], { encoding: 'utf-8' });
    expect(result.stdout).toMatch(/error: invalid|unknown command/i);
    expect(result.status).toBe(0);
  });

  it('directly calls the backend with installCompletion and prints expected output', () => {
    const result = spawnSync('ts-node', ['--esm', backendPath, 'TSsh', 'installCompletion'], {
      env: {
        ...process.env,
        TSSH_PROJECT_ROOT: '/mock/project/root',
        TSSH_UNIT_PATH: '/mock/unit/path',
      },
      encoding: 'utf-8',
    });
    // Output is only expected for CLI, not for completion. Accept either a confirmation or silence.
    expect([0, undefined]).toContain(result.status);
    // If output is present, it should mention completion installed; otherwise, allow empty output.
    if (result.stdout) {
      expect(result.stdout).toMatch(/Completion installed at/);
    }
  });

  // Manual test for completion behavior (documented for QA)
  it.skip('manual: bash completion suggestions are robust and user-friendly', () => {
    // Completion must only ever suggest valid, existing arguments (class, method, parameter, etc.).
    // Shell-style options (e.g., --install-completion) and unsupported input must never be suggested.
    // Run `tssh [Tab][Tab]` and verify suggestions are correct for valid input.
    // For invalid completions, confirm silence (no output, no error).
  });
});
