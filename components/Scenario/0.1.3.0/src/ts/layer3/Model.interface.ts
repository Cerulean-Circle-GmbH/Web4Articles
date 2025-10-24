/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface Model {
  uuid?: string;
  name?: string;
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

/**
 * Scenario Model - Can contain any structure
 * This is the most flexible model as scenarios 
 * need to store various component states
 */
export interface ScenarioModel extends Model {
  [key: string]: unknown;
}