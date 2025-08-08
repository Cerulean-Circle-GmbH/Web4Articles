import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RangerView } from '@src/ts/layer5/RangerView.ts';
import { RangerModel } from '@src/ts/layer2/RangerModel.ts';

function setStdoutSize(columns: number, rows: number) {
  const stdout: any = process.stdout;
  Object.defineProperty(stdout, 'columns', { configurable: true, get: () => columns });
  Object.defineProperty(stdout, 'rows', { configurable: true, get: () => rows });
}

describe('RangerView layout', () => {
  const originalWrite = process.stdout.write;
  const writes: string[] = [];

  beforeEach(() => {
    // Capture writes
    // @ts-ignore
    process.stdout.write = (chunk: any) => {
      writes.push(typeof chunk === 'string' ? chunk : String(chunk));
      return true as any;
    };
    writes.length = 0;
  });

  afterEach(() => {
    // @ts-ignore
    process.stdout.write = originalWrite;
  });

  it('anchors footer on last line with blank spacer above and preview above spacer', () => {
    setStdoutSize(80, 10); // small terminal for predictable counts
    const view = new RangerView();
    const model = new RangerModel();
    model.classes = ['A'];
    model.updateMethods();
    model.updateParams();

    view.render(model);

    const output = writes.join('');
    // Count newline characters: contentRows (height-3) + preview + blank spacer
    const expectedNewlines = (10 - 3) + 1 + 1; // = 9
    const actualNewlines = (output.match(/\n/g) || []).length;
    expect(actualNewlines).toBe(expectedNewlines);

    // Last write should be the footer (blue background code \x1b[44m)
    const lastChunk = writes[writes.length - 1];
    expect(lastChunk).toContain('\x1b[44m');

    // Ensure there is an empty line before footer: look at the penultimate newline position
    const lines = output.split('\n');
    // lines length should be expectedNewlines + 1 (split behavior)
    const penultimate = lines[lines.length - 2]; // this is the blank spacer line content
    expect(penultimate).toBe('');
  });
});