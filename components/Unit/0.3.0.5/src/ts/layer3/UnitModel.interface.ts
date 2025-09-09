/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */

import { Model } from './Model.interface.js';
import { TypeM3 } from './TypeM3.enum.js';
import { UnitReference } from './UnitReference.interface.js';

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // ✅ UNCHANGED: IOR string format from 0.3.0.4
  definition: string;              // ✅ UNCHANGED: IOR string format from 0.3.0.4
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
  indexPath: string;               // scenarios/index/path to this unit
  
  // ✅ ENHANCED: Unified reference tracking (replaces symlinkPaths + namedLinks)
  references: UnitReference[];     // Unified reference array with IOR strings
  
  createdAt: string;               // UnitModel specific
  updatedAt: string;               // UnitModel specific
  
  // ❌ REMOVED: symlinkPaths, namedLinks, executionCapabilities, storageCapabilities
}