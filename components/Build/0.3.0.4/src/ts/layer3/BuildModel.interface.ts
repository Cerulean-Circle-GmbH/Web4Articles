/**
 * BuildModel Interface - Build component model
 * Web4 principle: Single interface per file
 * Purpose: Build system model with terminal identity support
 */

export interface BuildModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  name: string;                    // Build system name for terminal identification
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  indexPath: string;               // scenarios/index/path to this build system
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  buildCapabilities: string[];     // What build system can build
  dependencyCapabilities: string[]; // Dependency resolution features
  createdAt: string;
  updatedAt: string;
}

export interface NamedLink {
  location: string;                // Relative path to scenario file
  filename: string;                // Link filename (e.g., "build-system.unit")
}