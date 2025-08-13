import { describe, it, expect } from 'vitest';
import { SimpleTaskStateMachine } from '@src/domain/SimpleTaskStateMachine.ts';

describe('SimpleTaskStateMachine', () => {
  it('transitions open -> in-progress -> qa-review -> done', () => {
    const sm = new SimpleTaskStateMachine();
    expect(sm.getState()).toBe('open');
    sm.startProgress();
    expect(sm.getState()).toBe('in-progress');
    sm.submitForQA();
    expect(sm.getState()).toBe('qa-review');
    sm.markDone();
    expect(sm.getState()).toBe('done');
  });

  it('block and unblock behavior', () => {
    const sm = new SimpleTaskStateMachine();
    sm.block();
    expect(sm.getState()).toBe('blocked');
    sm.unblock();
    expect(sm.getState()).toBe('open');
  });
});