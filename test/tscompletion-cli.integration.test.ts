import { execa } from 'execa';
import { describe, it, expect } from 'vitest';

const CLI = ['node', '--loader', 'ts-node/esm', 'src/ts/layer4/TSCompletion.ts'];

async function runCompletion(args: string) {
  const argv = args.trim().split(/\s+/).filter(Boolean);
  const { stdout } = await execa(CLI[0], CLI.slice(1).concat(argv), {
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
  });
  return stdout.trim();
}

describe('TSCompletion CLI Integration', () => {
  it('completes TSsh in to installCompletion', async () => {
    expect(await runCompletion('TSsh in')).toBe('stallCompletion');
  });

  it('completes in to installCompletion (fallback)', async () => {
    expect(await runCompletion('in')).toBe('stallCompletion');
  });

  it('completes TSsh inpu to empty', async () => {
    expect(await runCompletion('TSsh inpu')).toBe('');
  });

  it('completes TSsh insta to llCompletion', async () => {
    expect(await runCompletion('TSsh insta')).toBe('llCompletion');
  });

  it('completes insta to llCompletion (fallback)', async () => {
    expect(await runCompletion('insta')).toBe('llCompletion');
  });

  it('completes GitScrumProject cre to create, createProject, and createTemplateRepo', async () => {
    const result = (await runCompletion('GitScrumProject cre')).split(/\s+/).sort();
    expect(result).toEqual(['create', 'createProject', 'createTemplateRepo'].sort());
  });

  it('completes GitScrumProject createP to roject', async () => {
    expect(await runCompletion('GitScrumProject createP')).toBe('roject');
  });

  it('completes GitScrumProject create to create, createProject, and createTemplateRepo', async () => {
    const result = (await runCompletion('GitScrumProject create')).split(/\s+/).sort();
    expect(result).toEqual(['create', 'createProject', 'createTemplateRepo'].sort());
  });
});
