/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface CLI {
  // Note: Static methods cannot be in TypeScript interfaces
  // Static start() method implemented directly in classes
  
  
  init(component: any): this;
  
  
  execute(args: string[]): Promise<void>;
  
  
  showUsage(): void;
}