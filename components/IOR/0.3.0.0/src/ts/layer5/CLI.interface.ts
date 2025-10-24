/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface CLI {
  /**
   * Start component (delegates to component.start())
   */
  start(args: string[]): Promise<void>;

  /**
   * Stop component (delegates to component.stop())
   */
  stop(args: string[]): Promise<void>;

  /**
   * Get component status (delegates to component.status())
   */
  status(args: string[]): Promise<void>;

  /**
   * Get component info (delegates to component.info())
   */
  info(args: string[]): Promise<void>;

  /**
   * Show component help (delegates to component.help())
   */
  help(args: string[]): Promise<void>;

  /**
   * Execute component command dynamically
   */
  execute(command: string, args: string[]): Promise<void>;
}