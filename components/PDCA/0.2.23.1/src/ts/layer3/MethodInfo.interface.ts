/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface MethodInfo {
  name: string;
  parameters: any[];  // Simplified - was ParameterInfo[] (deleted bloat interface)
  description: string;
  examples: string[];
  returnType: string;
  isPublic: boolean;
  category: 'create' | 'modify' | 'query' | 'delete' | 'utility' | 'context';
}