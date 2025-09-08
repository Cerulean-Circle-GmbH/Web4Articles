/**
 * UnitModel Interface - Unit component model extending minimal base Model
 * Web4 principle: Single interface per file, extends minimal Model
 * Purpose: Unit-specific model with MOF classification and terminal identity
 */

import { Model } from './Model.interface.js';
import { NamedLink } from './NamedLink.interface.js';

export enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data  
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections
}

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