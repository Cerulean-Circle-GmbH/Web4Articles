/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

export class ParameterParser {
  private args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  public parse(): { className: string; command: string; type: string; projectName?: string; restArgs: string[] } {
    // Example: GitScrumProject create project Web4Scrum
    const [className, command, type, projectName, ...rest] = this.args;
    return { className, command, type, projectName, restArgs: rest };
  }
}
