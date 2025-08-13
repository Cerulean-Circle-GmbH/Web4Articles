/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
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