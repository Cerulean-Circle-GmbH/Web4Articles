/**
 * SemanticVersion Component (X.Y.Z.W format)
 * Radical OOP: Version is behavior + data, not just string manipulation
 * @pdca 2025-10-28-UTC-0934.pdca.md:1412 - Phase 3: Implementation
 * @test test/ts/layer2/SemanticVersion.test.ts
 */

import { Version } from '../layer3/Version.interface.js';
import { VersionModel } from '../layer3/VersionModel.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { randomUUID } from 'crypto';

export class SemanticVersion implements Version {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model!: VersionModel;

  /**
   * Semantic link names for version management
   * Single source of truth for all version link operations
   * @pdca 2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md - DRY: Define once, use everywhere
   */
  static readonly SEMANTIC_LINKS = ['latest', 'dev', 'test', 'prod'] as const;
  static readonly SEMANTIC_LINKS_SET = new Set(SemanticVersion.SEMANTIC_LINKS);

  /**
   * Empty constructor (Web4 radical OOP pattern)
   * @pdca 2025-10-28-UTC-0934.pdca.md:597 - Phase 1: Init Pattern
   */
  constructor() {
    // Empty - initialization moved to init()
  }
  
  // ========================================
  // COMPONENT INTERFACE IMPLEMENTATION
  // @pdca 2025-11-05-UTC-1158.pdca.md - Stub implementation (no discoverable methods)
  // ========================================
  
  /**
   * Check if version has a method (always false - no discoverable methods)
   */
  hasMethod(name: string): boolean {
    return false;
  }
  
  /**
   * Get method signature (always null - no discoverable methods)
   */
  getMethodSignature(name: string): MethodSignature | null {
    return null;
  }
  
  /**
   * List all method names (always empty - no discoverable methods)
   */
  listMethods(): string[] {
    return [];
  }

  /**
   * Initialize with optional scenario
   * @pdca 2025-10-28-UTC-0934.pdca.md:1412 - Phase 3: Version Component
   */
  init(scenario?: Scenario<VersionModel>): this {
    if (!this.model) {
      this.model = {
        uuid: randomUUID(),
        name: 'version',
        origin: 'system',
        definition: 'Semantic version',
        major: 0,
        minor: 0,
        patch: 0,
        revision: 0,
        versionString: '0.0.0.0'
      };
    }
    
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    return this;
  }

  /**
   * Factory method: Create from version string
   * @pdca 2025-10-28-UTC-0934.pdca.md:1464
   */
  static fromString(version: string): SemanticVersion {
    const v = new SemanticVersion().init();
    v.parse(version);
    return v;
  }

  /**
   * Parse version string to model
   * @pdca 2025-10-28-UTC-0934.pdca.md:1347
   */
  parse(version: string): this {
    if (!this.isValid(version)) {
      throw new Error(`Invalid version format: ${version}. Expected X.Y.Z.W`);
    }
    
    const parts = version.split('.').map(p => parseInt(p, 10));
    this.model.major = parts[0];
    this.model.minor = parts[1];
    this.model.patch = parts[2];
    this.model.revision = parts[3];
    this.model.versionString = version;
    
    return this;
  }

  /**
   * Validate version string format (X.Y.Z.W)
   */
  isValid(version: string): boolean {
    const pattern = /^\d+\.\d+\.\d+\.\d+$/;
    return pattern.test(version);
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this.model.versionString;
  }

  /**
   * Compare versions (-1 if less, 0 if equal, 1 if greater)
   */
  compareTo(other: Version): number {
    const otherModel = (other as any).model as VersionModel;
    
    if (this.model.major !== otherModel.major) {
      return this.model.major < otherModel.major ? -1 : 1;
    }
    if (this.model.minor !== otherModel.minor) {
      return this.model.minor < otherModel.minor ? -1 : 1;
    }
    if (this.model.patch !== otherModel.patch) {
      return this.model.patch < otherModel.patch ? -1 : 1;
    }
    if (this.model.revision !== otherModel.revision) {
      return this.model.revision < otherModel.revision ? -1 : 1;
    }
    
    return 0;
  }

  /**
   * Compare two version strings (static helper for sorting)
   * @param a First version string
   * @param b Second version string
   * @returns -1 if a < b, 0 if equal, 1 if a > b
   * @pdca 2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md - DRY: Use existing compareTo()
   */
  static compare(a: string, b: string): number {
    const versionA = SemanticVersion.fromString(a);
    const versionB = SemanticVersion.fromString(b);
    return versionA.compareTo(versionB);
  }

  /**
   * Get highest version from array of version strings
   * @param versions Array of version strings
   * @returns Highest version string
   * @pdca 2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md - DRY: Consolidate version comparison
   */
  static getHighest(versions: string[]): string {
    if (versions.length === 0) {
      throw new Error('Cannot get highest version from empty array');
    }
    return versions.sort((a, b) => SemanticVersion.compare(b, a))[0];
  }

  /**
   * Promote to next major version (immutable)
   * Returns NEW instance
   * @pdca 2025-10-28-UTC-0934.pdca.md:1356
   */
  async promoteMajor(): Promise<Version> {
    const newVersion = new SemanticVersion().init();
    newVersion.model.major = this.model.major + 1;
    newVersion.model.minor = 0;
    newVersion.model.patch = 0;
    newVersion.model.revision = 0;
    newVersion.model.versionString = `${newVersion.model.major}.${newVersion.model.minor}.${newVersion.model.patch}.${newVersion.model.revision}`;
    return newVersion;
  }

  /**
   * Promote to next minor version (immutable)
   */
  async promoteMinor(): Promise<Version> {
    const newVersion = new SemanticVersion().init();
    newVersion.model.major = this.model.major;
    newVersion.model.minor = this.model.minor + 1;
    newVersion.model.patch = 0;
    newVersion.model.revision = 0;
    newVersion.model.versionString = `${newVersion.model.major}.${newVersion.model.minor}.${newVersion.model.patch}.${newVersion.model.revision}`;
    return newVersion;
  }

  /**
   * Promote to next patch version (immutable)
   */
  async promotePatch(): Promise<Version> {
    const newVersion = new SemanticVersion().init();
    newVersion.model.major = this.model.major;
    newVersion.model.minor = this.model.minor;
    newVersion.model.patch = this.model.patch + 1;
    newVersion.model.revision = 0;
    newVersion.model.versionString = `${newVersion.model.major}.${newVersion.model.minor}.${newVersion.model.patch}.${newVersion.model.revision}`;
    return newVersion;
  }

  /**
   * Promote to next revision (immutable)
   */
  async promoteRevision(): Promise<Version> {
    const newVersion = new SemanticVersion().init();
    newVersion.model.major = this.model.major;
    newVersion.model.minor = this.model.minor;
    newVersion.model.patch = this.model.patch;
    newVersion.model.revision = this.model.revision + 1;
    newVersion.model.versionString = `${newVersion.model.major}.${newVersion.model.minor}.${newVersion.model.patch}.${newVersion.model.revision}`;
    return newVersion;
  }

  /**
   * Promote version by type (DRY helper for upgrade operations)
   * Handles all promotion types and specific version strings
   * 
   * @param currentVersionString Current version string
   * @param promotionType Type of promotion or specific version (nextBuild, nextPatch, nextMinor, nextMajor, or X.Y.Z.W)
   * @returns New version string
   * @pdca 2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md - DRY: Consolidate promotion logic
   */
  static async promote(currentVersionString: string, promotionType: string): Promise<string> {
    // If it's a specific version, return it (validation happens elsewhere)
    if (promotionType.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return promotionType;
    }

    const version = SemanticVersion.fromString(currentVersionString);
    
    switch (promotionType) {
      case 'nextBuild':
      case 'build':
        return (await version.promoteRevision()).toString();
      
      case 'nextPatch':
      case 'patch':
        return (await version.promotePatch()).toString();
      
      case 'nextMinor':
      case 'minor':
        return (await version.promoteMinor()).toString();
      
      case 'nextMajor':
      case 'major':
        return (await version.promoteMajor()).toString();
      
      default:
        throw new Error(`Invalid version promotion type: ${promotionType}. Use: nextBuild, nextPatch, nextMinor, nextMajor, or specific version (X.Y.Z.W)`);
    }
  }

  /**
   * Check if string is a valid semantic link name
   * @param link Link name to check (e.g., 'latest', 'dev')
   * @returns true if valid semantic link
   */
  static isSemanticLink(link: string): boolean {
    return SemanticVersion.SEMANTIC_LINKS_SET.has(link as any);
  }

  /**
   * Resolve version string to actual version number
   * Handles: actual versions, semantic links, 'current' keyword
   * 
   * @param versionString Version to resolve (e.g., 'latest', 'current', '0.3.18.3')
   * @param componentDir Component directory for resolving semantic links
   * @param currentVersion Current version for 'current' keyword resolution
   * @returns Actual version number
   * @pdca 2025-11-07-UTC-0000.eliminate-path-duplication-all-cases.pdca.md - Move to SemanticVersion (semantic responsibility)
   */
  static async resolveVersion(
    versionString: string,
    componentDir: string,
    currentVersion: SemanticVersion
  ): Promise<string> {
    const { existsSync, lstatSync, readlinkSync } = await import('fs');
    const path = await import('path');
    
    // Handle 'current' keyword
    if (versionString === 'current') {
      return currentVersion.toString();
    }
    
  // If already a valid version number, return as-is
  const versionPattern = /^\d+\.\d+\.\d+\.\d+$/;
  if (versionPattern.test(versionString)) {
    return versionString;
  }
    
    // Resolve semantic link (latest/dev/test/prod)
    if (SemanticVersion.isSemanticLink(versionString)) {
      const linkPath = path.join(componentDir, versionString);
      if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
        const resolvedVersion = readlinkSync(linkPath);
        // Extract version number from link target (handles both "0.1.0.0" and "../0.1.0.0")
        const versionMatch = resolvedVersion.match(/(\d+\.\d+\.\d+\.\d+)/);
        return versionMatch ? versionMatch[1] : resolvedVersion;
      } else {
        throw new Error(`Semantic link '${versionString}' does not exist or is not a symlink`);
      }
    }
    
    // Unknown format - return as-is and let caller validate
    return versionString;
  }

  /**
   * Convert component state to scenario for persistence
   * @pdca 2025-10-28-UTC-2015.user-scenario-antipattern.pdca.md - Owner data as scenario structure
   */
  async toScenario(name?: string): Promise<Scenario<VersionModel>> {
    // ✅ Owner data as minimal User-like scenario (consistent with Web4 pattern)
    const ownerScenario = {
      ior: {
        uuid: this.model.uuid,
        component: 'User',
        version: '0.0.0.0',
        timestamp: new Date().toISOString()
      },
      owner: '',  // No nested owner in SemanticVersion
      model: {
        user: process.env.USER || 'system',
        hostname: process.env.HOSTNAME || 'localhost',
        uuid: this.model.uuid,
        component: 'SemanticVersion',
        version: this.model.versionString
      }
    };
    
    return {
      ior: {
        uuid: this.model.uuid,
        component: 'SemanticVersion',
        version: this.model.versionString
      },
      owner: JSON.stringify(ownerScenario),
      model: this.model
    };
  }
}

