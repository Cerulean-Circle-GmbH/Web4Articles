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


});
