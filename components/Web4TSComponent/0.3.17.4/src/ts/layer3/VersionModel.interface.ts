/**
 * VersionModel - State for SemanticVersion component
 * @pdca 2025-10-28-UTC-0934.pdca.md:1331 - Phase 3: Version Component
 */

import { Model } from './Model.interface.js';

export interface VersionModel extends Model {
  major: number;
  minor: number;
  patch: number;
  revision: number;
  versionString: string;
}

