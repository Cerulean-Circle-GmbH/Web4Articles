import { spawnSync } from 'child_process';
import * as path from 'path';

describe('oosh bash completion integration', () => {
  const completionScript = path.resolve(__dirname, '../src/sh/oosh-completion.sh');
  const tsCompletion = path.resolve(__dirname, '../src/ts/layer4/TSCompletion.ts');

  function runCompletion(args: string[]): string[] {
    // Simulate the completion backend directly
    const result = spawnSync('ts-node', [tsCompletion, ...args], {
      env: { ...process.env, TS_NODE_PROJECT: 'tsconfig.json' },
      encoding: 'utf-8',
    });
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
    expect(completions.length).toBeGreaterThan(0);
  });
});
