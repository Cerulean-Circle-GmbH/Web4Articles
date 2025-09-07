/**
 * CLIModel Interface - CLI component model with terminal identity
 * Web4 principle: Single interface per file
 * Purpose: CLI model with terminal identity and rendering capabilities
 */

export interface CLIModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  name: string;                    // CLI name for terminal identification
  origin: string;                  // GitTextIOR format: ior:git:text:giturl with line/column positions
  definition: string;              // GitTextIOR format: ior:git:text:giturl with character positions
  indexPath: string;               // scenarios/index/path to this CLI
  symlinkPaths: string[];          // LD links tracking
  namedLinks: NamedLink[];         // Named links with location and filename
  componentName: string;           // Component name for CLI operations
  componentVersion: string;        // Component version
  componentDescription: string;    // Component description
  terminalCapabilities: string[];  // Terminal rendering capabilities
  cliCapabilities: string[];       // CLI functionality capabilities
  createdAt: string;
  updatedAt: string;
}

export interface NamedLink {
  location: string;                // Relative path to scenario file
  filename: string;                // Link filename (e.g., "cli-tool.unit")
}