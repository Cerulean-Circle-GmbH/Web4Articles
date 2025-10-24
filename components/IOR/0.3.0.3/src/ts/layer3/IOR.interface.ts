/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface IOR {
  /**
   * Unique identifier for the object
   */
  uuid: string;

  /**
   * Component type name
   */
  component: string;

  /**
   * Component version
   */
  version: string;

  /**
   * Optional network location (no environment assumptions)
   */
  location?: string;

  /**
   * Optional endpoint path (no environment assumptions)
   */
  endpoint?: string;
}