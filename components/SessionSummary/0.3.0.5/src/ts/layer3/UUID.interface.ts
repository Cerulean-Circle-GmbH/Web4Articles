/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface UUID {
  /**
   * Get the UUID string representation
   * @returns 36-character UUID string in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   */
  toString(): string;

  /**
   * Get the UUID as a string (alias for toString)
   * @returns 36-character UUID string
   */
  valueOf(): string;

  /**
   * Check if UUID is valid format
   * @returns true if UUID format is valid
   */
  isValid(): boolean;

  /**
   * Get UUID version number
   * @returns UUID version (1, 2, 3, 4, or 5)
   */
  getVersion(): number;

  /**
   * Compare with another UUID
   * @param other - Another UUID to compare with
   * @returns true if UUIDs are equal
   */
  equals(other: UUID): boolean;

  /**
   * Get UUID as hyphenless string
   * @returns 32-character UUID string without hyphens
   */
  toHex(): string;
}