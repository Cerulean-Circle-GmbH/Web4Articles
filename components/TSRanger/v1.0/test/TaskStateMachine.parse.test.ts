import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TaskStateMachine } from '../src/domain/TaskStateMachine.ts';

function writeTemp(content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w4a-'));
  const file = path.join(dir, 'task-1.0-sample.md');
  fs.writeFileSync(file, content, 'utf-8');
  return file;
}

describe('TaskStateMachine.parseTaskFile', () => {
  it('parses title, status and steps with checkboxes', () => {
    const md = `# Task 1.0: Sample

## Status
- [ ] Planned
- [x] In Progress
- [ ] QA Review
- [ ] Done

## Steps
- [ ] first thing
- [x] second thing
- plain bullet
`;
    const file = writeTemp(md);
    const task = TaskStateMachine.parseTaskFile(file);
    expect(task.title).toContain('Task 1.0: Sample');
    expect(task.status).toBe('in-progress');
    expect(task.steps.length).toBe(3);
    expect(task.steps[0]).toEqual({ name: 'first thing', status: 'open' });
    expect(task.steps[1]).toEqual({ name: 'second thing', status: 'done' });
    expect(task.steps[2]).toEqual({ name: 'plain bullet', status: 'open' });
  });

  it('falls back to planned when no status checked', () => {
    const md = `# Task X

## Status
- [ ] Planned
- [ ] In Progress

## Steps
- a
`;
    const file = writeTemp(md);
    const task = TaskStateMachine.parseTaskFile(file);
    expect(task.status).toBe('planned');
  });
});