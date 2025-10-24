/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import { DefaultWsServer } from '../src/ts/layer2/DefaultWsServer.js';

describe('WsServer Basic Tests', () => {
  it('should create instance successfully', () => {
    const component = new DefaultWsServer();
    expect(component).toBeDefined();
  });

  it('should have empty constructor (Web4 standard)', () => {
    const component = new DefaultWsServer();
    expect(component).toBeInstanceOf(DefaultWsServer);
  });
});
