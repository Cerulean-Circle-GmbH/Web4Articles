/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import { SimpleTaskStateMachine } from '../src/domain/SimpleTaskStateMachine.ts';

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