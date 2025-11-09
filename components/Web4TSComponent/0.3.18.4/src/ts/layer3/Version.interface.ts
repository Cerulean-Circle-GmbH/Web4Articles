/**
 * Version Component Interface - Semantic versioning behavior
 * @pdca 2025-10-28-UTC-0934.pdca.md:1344 - Phase 3: Version Component
 */

import { Component } from './Component.interface.js';
import { VersionModel } from './VersionModel.interface.js';

export interface Version extends Component<VersionModel> {
  /**
   * Parse version string to model
   * @pdca 2025-10-28-UTC-0934.pdca.md:1347
   */
  parse(version: string): this;
  
  /**
   * Convert to string representation
   */
  toString(): string;
  
  /**
   * Compare versions (-1, 0, 1)
   */
  compareTo(other: Version): number;
  
  /**
   * Promote to next major version (immutable)
   * @pdca 2025-10-28-UTC-0934.pdca.md:1356
   * @test test/ts/layer2/SemanticVersion.test.ts:promoteMajorReturnsNewInstance
   */
  promoteMajor(): Promise<Version>;
  
  /**
   * Promote to next minor version (immutable)
   */
  promoteMinor(): Promise<Version>;
  
  /**
   * Promote to next patch version (immutable)
   */
  promotePatch(): Promise<Version>;
  
  /**
   * Promote to next revision (immutable)
   */
  promoteRevision(): Promise<Version>;
  
  /**
   * Validate version string format
   */
  isValid(version: string): boolean;
}

