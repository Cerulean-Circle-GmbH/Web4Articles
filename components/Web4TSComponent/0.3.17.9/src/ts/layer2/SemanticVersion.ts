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

