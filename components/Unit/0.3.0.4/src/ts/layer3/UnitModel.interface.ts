/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */

import { Model } from './Model.interface.js';
import { NamedLink } from './NamedLink.interface.js';
import { TypeM3 } from './TypeM3.enum.js';

export interface UnitModel extends Model {
  // Base Model property inherited: uuid
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
  indexPath: string;               // scenarios/index/path to this unit
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  executionCapabilities: string[]; // What unit can execute
  storageCapabilities: string[];   // Storage features
  createdAt: string;               // UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
  updatedAt: string;               // UnitModel specific, NOT in base Model (TRON's Occam's Razor feedback)
}