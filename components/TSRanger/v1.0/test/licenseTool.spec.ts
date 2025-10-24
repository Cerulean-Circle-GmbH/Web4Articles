/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { LicenseTool } from '../src/ts/layer2/LicenseTool.ts';

describe('LicenseTool.ensureHeader', () => {
  it('inserts a block header for .ts', () => {
    const style = (LicenseTool as any).getCommentStyle('/tmp/x.ts');
    const out = (LicenseTool as any).ensureHeader('console.log("hi")\n', style, '/AI-GPL.md', '/LICENSE');
    expect(out.startsWith('/**')).toBe(true);
    expect(out.includes('SPDX-License-Identifier')).toBe(true);
  });
  it('inserts an HTML comment header for .md', () => {
    const style = (LicenseTool as any).getCommentStyle('/tmp/x.md');
    const out = (LicenseTool as any).ensureHeader('# Title\n', style, '/AI-GPL.md', '/LICENSE');
    expect(out.startsWith('<!--')).toBe(true);
    expect(out.includes('AI-GPL')).toBe(true);
  });
});