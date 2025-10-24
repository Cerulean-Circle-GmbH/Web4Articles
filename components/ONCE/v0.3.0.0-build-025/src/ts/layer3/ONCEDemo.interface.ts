/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface ONCEDemo {
  /**
   * Start interactive demo with browser integration
   */
  demo(args: string[]): Promise<void>;

  /**
   * Run non-interactive test sequences
   */
  test(args: string[]): Promise<void>;

  /**
   * Show demo help and available sequences
   */
  showDemoHelp(): void;

  /**
   * Run test sequence from input string
   */
  runTestSequence(input: string): Promise<void>;

  /**
   * Open browser for demo (platform-specific)
   */
  openBrowser(): Promise<void>;

  /**
   * Sleep utility for test sequences
   */
  sleep(ms: number): Promise<void>;
}