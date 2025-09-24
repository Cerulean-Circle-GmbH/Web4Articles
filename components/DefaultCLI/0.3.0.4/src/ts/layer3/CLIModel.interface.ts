/**
 * CLIModel Interface - CLI component model (Occam's Razor Applied)
 * Web4 principle: Single interface per file
 * Purpose: Maximally simplified CLI model for command operations
 */

export interface CLIModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  componentName: string;           // Component name for CLI operations
  componentVersion: string;        // Component version
}