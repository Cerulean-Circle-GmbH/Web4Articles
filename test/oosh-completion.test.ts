  it('bash completion script returns only valid completions (no warnings)', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const shDir = path.join(projectRoot, 'src/sh');
    const ooshCompletionScript = path.join(shDir, 'oosh-completion.sh');
    // Simulate COMP_WORDS and COMP_CWORD for "oosh"
    const env = {
      ...process.env,
      COMP_WORDS: 'oosh',
      COMP_CWORD: '1',
      BASH_SOURCE: ooshCompletionScript,
    };
    const result = spawnSync('bash', ['-c',
      'source ./oosh-completion.sh && COMP_WORDS=(oosh); COMP_CWORD=1; _oosh_completion; printf "%s\n" "${COMPREPLY[@]}"'
    ], {
      cwd: shDir,
      env,
      encoding: 'utf-8',
    });
    if (result.error || result.status !== 0) {
      console.error('DEBUG: shell script error:', result.error);
      console.error('DEBUG: shell script stderr:', result.stderr);
      console.error('DEBUG: shell script stdout:', result.stdout);
    }
    // Should contain only valid completions, no warnings
    expect(result.stdout).toMatch(/GitScrumProject/);
    expect(result.stdout).toMatch(/TestClass/);
    expect(result.stdout).not.toMatch(/ExperimentalWarning/);
  });

  it('bash completion script returns methods for TestClass (no warnings)', () => {
    const projectRoot = path.resolve(__dirname, '..');
    const shDir = path.join(projectRoot, 'src/sh');
    const ooshCompletionScript = path.join(shDir, 'oosh-completion.sh');
    const env = {
      ...process.env,
      COMP_WORDS: 'oosh TestClass',
      COMP_CWORD: '2',
      BASH_SOURCE: ooshCompletionScript,
    };
    const result = spawnSync('bash', ['-c',
      'source ./oosh-completion.sh && COMP_WORDS=(oosh TestClass); COMP_CWORD=2; _oosh_completion; printf "%s\n" "${COMPREPLY[@]}"'
    ], {
      cwd: shDir,
      env,
      encoding: 'utf-8',
    });
    if (result.error || result.status !== 0) {
      console.error('DEBUG: shell script error:', result.error);
      console.error('DEBUG: shell script stderr:', result.stderr);
      console.error('DEBUG: shell script stdout:', result.stdout);
    }
    expect(result.stdout).toMatch(/hello/);
    expect(result.stdout).toMatch(/world/);
    expect(result.stdout).not.toMatch(/ExperimentalWarning/);
  });
  it('simulates the shell script and checks completions are visible', () => {
    // Simulate the shell script invocation as in bash completion
    const projectRoot = path.resolve(__dirname, '..');
    const shDir = path.join(projectRoot, 'src/sh');
    const ooshCompletionScript = path.join(shDir, 'oosh-completion.sh');
    // Simulate COMP_WORDS and COMP_CWORD for "oosh"
    const env = {
      ...process.env,
      COMP_WORDS: 'oosh',
      COMP_CWORD: '1',
      BASH_SOURCE: ooshCompletionScript,
    };
    const result = spawnSync('bash', ['-c',
      'source ./oosh-completion.sh && COMP_WORDS=(oosh); COMP_CWORD=1; _oosh_completion; printf "%s\n" "${COMPREPLY[@]}"'
    ], {
      cwd: shDir,
      env,
      encoding: 'utf-8',
    });
    if (result.error || result.status !== 0) {
      console.error('DEBUG: shell script error:', result.error);
      console.error('DEBUG: shell script stderr:', result.stderr);
      console.error('DEBUG: shell script stdout:', result.stdout);
    }
    // Should contain at least one completion (e.g., GitScrumProject)
    expect(result.stdout).toMatch(/GitScrumProject/);
  });
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
  it('works from src/sh directory like the shell script', () => {
    // Simulate running from src/sh, as the shell script does
    const projectRoot = path.resolve(__dirname, '..');
    const tsConfigPath = path.join(projectRoot, 'tsconfig.json');
    const tsCompletion = path.join(projectRoot, 'src/ts/layer4/TSCompletion.ts');
    const shDir = path.join(projectRoot, 'src/sh');
    const relCompletion = path.relative(shDir, tsCompletion);
    let tsNodeRealBin = path.join(projectRoot, 'node_modules/ts-node/dist/bin.js');
    let tsNodeCmd = ['node', tsNodeRealBin];
    let result;
    if (require('fs').existsSync(tsNodeRealBin)) {
      result = spawnSync('node', [tsNodeRealBin, relCompletion], {
        cwd: shDir,
        env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
        encoding: 'utf-8',
      });
    } else {
      // fallback to npx
      result = spawnSync('npx', ['ts-node', relCompletion], {
        cwd: shDir,
        env: { ...process.env, TS_NODE_PROJECT: tsConfigPath },
        encoding: 'utf-8',
      });
    }
    if (result.error || result.status !== 0) {
      // Print debug info if the test fails
      console.error('DEBUG: spawnSync error:', result.error);
      console.error('DEBUG: spawnSync stderr:', result.stderr);
      console.error('DEBUG: spawnSync stdout:', result.stdout);
      console.error('DEBUG: command:', `${tsNodeCmd.join(' ')} ${relCompletion}`);
      console.error('DEBUG: cwd:', shDir);
      console.error('DEBUG: TS_NODE_PROJECT:', tsConfigPath);
    }
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('GitScrumProject');
  });
});
