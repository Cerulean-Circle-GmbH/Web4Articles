/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */

import { Model } from './Model.interface.js';
import { TypeM3 } from './TypeM3.enum.js';
import { IOR } from './IOR.interface.js';
import { UnitReference } from './UnitReference.interface.js';

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: IOR;                     // ✅ IOR type - IS the master file reference
  definition: string;              // MD formatted text
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
  indexPath: string;               // scenarios/index/path to this unit
  
  // ❌ ELIMINATED: masterFile (origin IS the master reference)
  
  references: UnitReference[];     // ✅ Pure IOR-based reference tracking
  
  createdAt: string;               // UnitModel specific, NOT in base Model
  updatedAt: string;               // UnitModel specific, NOT in base Model
  
  // ❌ OCCAM'D OUT: capabilities (not needed for MVP)
}