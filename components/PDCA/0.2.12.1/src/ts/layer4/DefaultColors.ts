/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Colors } from '../layer3/Colors.interface.js';

export class DefaultColors implements Colors {
  // Basic colors
  reset = '\x1b[0m';
  bold = '\x1b[1m';
  dim = '\x1b[90m';
  red = '\x1b[31m';
  green = '\x1b[32m';
  yellow = '\x1b[33m';
  blue = '\x1b[34m';
  magenta = '\x1b[35m';
  cyan = '\x1b[36m';
  white = '\x1b[37m';
  orange = '\x1b[38;5;208m';
  
  // Semantic colors for CLI (context-specific usage)
  toolName = '\x1b[1;36m';      // Cyan bold for component/tool names
  version = '\x1b[1;36m';       // Cyan bold for version numbers
  commands = '\x1b[0;37m';      // White for command names
  parameters = '\x1b[1;33m';    // Yellow bold for parameters
  descriptions = '\x1b[0;32m';  // Green for documentation/help text
  examples = '\x1b[0;37m';      // White for example values
  sections = '\x1b[1;37m';      // White bold for section headers
  
  /**
   * Singleton instance
   */
  private static instance: DefaultColors;
  
  /**
   * Get singleton instance
   */
  static getInstance(): DefaultColors {
    if (!DefaultColors.instance) {
      DefaultColors.instance = new DefaultColors();
    }
    return DefaultColors.instance;
  }
}

