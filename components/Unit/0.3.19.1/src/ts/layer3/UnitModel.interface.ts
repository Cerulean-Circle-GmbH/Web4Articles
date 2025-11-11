/**
 * UnitModel - Unit Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';
import { TypeM3 } from './TypeM3.enum.js';
import { UnitReference } from './UnitReference.interface.js';

export interface UnitModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  typeM3?: TypeM3;                // MOF M3/M2/M1 hierarchy classification
  indexPath: string;              // scenarios/index/path to this unit
  references: UnitReference[];    // Unified reference array with IOR strings
  createdAt: string;
  updatedAt: string;
  component?: string;             // Component name for CLI display
  version?: string;               // Component version for CLI display and test promotion
  // @pdca 2025-11-10-UTC-1010.pdca.md - Path Authority fields for delegation
  componentRoot?: string;         // THIS component's root directory
  projectRoot?: string;           // Project root directory (for delegation)
  targetDirectory?: string;       // Target directory for operations (Path Authority from CLI)
  componentsDirectory?: string;   // Components directory (from CLI) - @pdca 2025-11-11-UTC-0003
  targetComponentRoot?: string;   // Target component's root (for tree/links delegation)
  context?: any;                  // Context for "on" delegation mode (holds delegated component instance)
  isTestIsolation?: boolean;      // Test isolation mode flag (for DelegationProxy context)
}
