/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Simple method signature metadata for CLI routing
 */
export interface MethodSignature {
  /**
   * Method name
   */
  name: string;
  
  /**
   * Number of parameters (for validation)
   */
  paramCount: number;
  
  /**
   * Whether method is async (for await handling)
   */
  isAsync: boolean;
}

