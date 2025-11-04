/**
 * PDCAModel - PDCA Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface PDCAModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
  component?: string;        // Component name for CLI display
  version?: string;          // Component version for CLI display and test promotion
  targetDirectory?: string;  // Path Authority from CLI
}
