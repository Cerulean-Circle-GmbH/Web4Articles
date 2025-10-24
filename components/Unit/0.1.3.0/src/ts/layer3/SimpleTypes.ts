/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * Simple IOR (Internet Object Reference) interface
 */
export interface IOR {
  resolve(): Promise<any>;
  getEndpoint(): string;
  isLocal(): boolean;
  serialize(): string;
}

/**
 * Simple Scenario interface
 */
export interface Scenario {
  serialize(): string;
  validate(): boolean;
  getReferences(): IOR[];
}
