/**
 * UnitModel Interface - UnitIndex as actual Unit model
 * Web4 principle: Single interface per file
 * Purpose: Unit model contains storage capabilities, not requirement-like attributes
 */

export interface UnitModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  name: string;                    // Human-readable unit name for terminal identification
  origin: string;                  // Git Text IOR format: ior:git:text:giturl with line/column positions
  definition: string;              // Git Text IOR format: ior:git:text:giturl with character positions
  indexPath: string;               // scenarios/index/path to this unit
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  executionCapabilities: string[]; // What unit can execute
  storageCapabilities: string[];   // Storage features
  createdAt: string;
  updatedAt: string;
}

export interface NamedLink {
  location: string;                // Full path to the link file
  filename: string;                // Link filename (e.g., "test-unit.unit")
}