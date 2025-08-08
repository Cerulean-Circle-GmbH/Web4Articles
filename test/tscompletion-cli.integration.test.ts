import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

const CLI = ['node', '--loader', 'ts-node/esm', 'src/ts/layer4/TSCompletion.ts'];

function runCompletion(args: string) {
  const argv = args.trim().length > 0 ? args.trim().split(/\s+/).filter(Boolean) : [];
  const stdout = execFileSync(CLI[0], CLI.slice(1).concat(argv), {
    encoding: 'utf8',
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  });
  return stdout.trim();
}

describe('TSCompletion CLI Integration', () => {
  it('completes TSsh in to installCompletion', () => {
    expect(runCompletion('TSsh in')).toBe('stallCompletion');
  });

  it('completes in to installCompletion (fallback)', () => {
    expect(runCompletion('in')).toBe('stallCompletion');
  });

  it('completes TSsh inpu to empty', () => {
    expect(runCompletion('TSsh inpu')).toBe('');
  });

  it('completes TSsh insta to llCompletion', () => {
    expect(runCompletion('TSsh insta')).toBe('llCompletion');
  });

  it('completes insta to llCompletion (fallback)', () => {
    expect(runCompletion('insta')).toBe('llCompletion');
  });

  it('completes GitScrumProject cre to create, createProject, and createTemplateRepo', async () => {
    const result = (await runCompletion('GitScrumProject cre')).split(/\s+/).sort();
    expect(result).toEqual(['create', 'createProject', 'createTemplateRepo'].sort());
  });

  it('completes GitScrumProject createP to roject', () => {
    expect(runCompletion('GitScrumProject createP')).toBe('roject');
  });

  it('completes GitScrumProject create to create, createProject, and createTemplateRepo', async () => {
    const result = (await runCompletion('GitScrumProject create')).split(/\s+/).sort();
    expect(result).toEqual(['create', 'createProject', 'createTemplateRepo'].sort());
  });
});
