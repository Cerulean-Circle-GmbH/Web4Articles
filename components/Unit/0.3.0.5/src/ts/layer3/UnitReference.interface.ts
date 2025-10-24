/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface UnitReference {
  linkLocation: string;            // IOR string (0.3.0.4 format): "ior:local:ln:file://..."
  linkTarget: string;              // IOR string (0.3.0.4 format): "ior:unit:uuid"
  syncStatus: SyncStatus;
}

export enum SyncStatus {
  SYNCED = "SYNCED",
  OUTDATED = "OUTDATED", 
  BROKEN = "BROKEN",
  UNKNOWN = "UNKNOWN",
  MODIFIED = "MODIFIED",
  TO_BE_CHECKED = "TO_BE_CHECKED"
}