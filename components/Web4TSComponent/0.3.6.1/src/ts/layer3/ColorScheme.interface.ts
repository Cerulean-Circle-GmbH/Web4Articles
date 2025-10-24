/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface ColorScheme {
  toolName: string;      // Cyan bold for tool header
  version: string;       // Yellow bold for version
  commands: string;      // Green bold for command names
  parameters: string;    // Magenta bold for parameters
  descriptions: string;  // White for descriptions
  examples: string;      // Yellow for examples
  sections: string;      // Blue bold for section headers
  reset: string;         // Reset to default
}

export interface DocumentationSections {
  header: string;
  usage: string;
  commands: string;
  parameters: string;
  examples: string;
  integration: string;
}