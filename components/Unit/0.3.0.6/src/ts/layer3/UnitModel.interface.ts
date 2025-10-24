/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Model } from './Model.interface.js';
import { TypeM3 } from './TypeM3.enum.js';
import { UnitReference } from './UnitReference.interface.js';

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // ✅ UNCHANGED: IOR string format from 0.3.0.4
  definition: string;              // ✅ UNCHANGED: IOR string format from 0.3.0.4
  typeM3?: TypeM3;                 // MOF M3/M2/M1 hierarchy classification (optional for backward compatibility)
  indexPath: string;               // scenarios/index/path to this unit
  
  // ✅ ENHANCED: Unified reference tracking (replaces symlinkPaths + namedLinks)
  references: UnitReference[];     // Unified reference array with IOR strings
  
  createdAt: string;               // UnitModel specific
  updatedAt: string;               // UnitModel specific
  
  // ❌ REMOVED: symlinkPaths, namedLinks, executionCapabilities, storageCapabilities
}