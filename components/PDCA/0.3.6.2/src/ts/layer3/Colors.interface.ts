/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface Colors {
  // Basic colors
  reset: string;
  bold: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  orange: string;
  
  // Semantic colors for CLI (context-specific usage)
  toolName: string;      // Component/tool name display
  version: string;       // Version numbers
  commands: string;      // Command names
  parameters: string;    // Parameter names
  descriptions: string;  // Documentation and help text
  examples: string;      // Example values
  sections: string;      // Section headers
}

