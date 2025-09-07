/**
 * CLIModel Interface - CLI component model with terminal identity
 * Web4 principle: Single interface per file
 * Purpose: CLI model with terminal identity and rendering capabilities
 */

export interface CLIModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  componentName: string;           // Component name for CLI operations
  componentVersion: string;        // Component version
  createdAt: string;
  updatedAt: string;
}