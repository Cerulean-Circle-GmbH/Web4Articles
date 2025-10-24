/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface ONCE {
  /**
   * Initialize from scenario (Web4 pattern)
   */
  init(scenario: any): this;

  /**
   * Start ONCE kernel
   */
  start(args: string[]): Promise<void>;

  /**
   * Stop ONCE kernel
   */
  stop(args: string[]): Promise<void>;

  /**
   * Get kernel status
   */
  status(args: string[]): Promise<void>;

  /**
   * Get kernel information
   */
  info(args: string[]): Promise<void>;

  /**
   * Show help information
   */
  help(args: string[]): Promise<void>;

  /**
   * Interactive demo functionality (ONCE 0.2.0.0 feature parity)
   */
  demo(args: string[]): Promise<void>;

  /**
   * Non-interactive test sequence functionality
   */
  test(args: string[]): Promise<void>;

  /**
   * Comprehensive ecosystem deinstall
   */
  deinstall(args: string[]): Promise<void>;
}