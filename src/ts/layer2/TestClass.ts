/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

// Minimal test class for completion validation
/**
 * TestClass is a rich example used by TS Ranger to validate the Docs column.
 *
 * It demonstrates class-level documentation, method documentation, and
 * parameter documentation that `TSCompletion` can extract and display.
 */
export class TestClass {
  /**
   * Says hello in a friendly manner.
   * @returns A greeting string
   */
  hello(): string { return 'hello'; }

  /**
   * Combines the provided parameters into a descriptive phrase.
   * @param param1 The primary text to include in the phrase
   * @param param2 An optional numeric qualifier appended to the result
   * @returns A composed phrase string
   */
  world(param1: string, param2?: number): string {
    return param2 === undefined ? `${param1}` : `${param1}-${param2}`;
  }
}
