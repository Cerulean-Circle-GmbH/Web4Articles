/**
 * UnitModel Interface - UnitIndex as actual Unit model (MOF M3/M2/M1 Hierarchy)
 * Web4 principle: Single interface per file
 * Purpose: Unit model contains storage capabilities and MOF classification
 */

export enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data  
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections
}

export interface UnitModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  name: string;                    // Human-readable unit name for terminal identification (uni-t)
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  typeM3: TypeM3;                  // MOF M3/M2/M1 hierarchy classification
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