/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export class ParameterParser {
  private args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  public parse(): { className: string; command: string; type: string; projectName?: string; restArgs: string[] } {
    // Example: GitScrumProject createTemplateRepo org newRepo sourceRepoUrl submodulePath
    const [className, command, type, projectName, ...rest] = this.args;
    return { className, command, type, projectName, restArgs: rest };
  }
}
