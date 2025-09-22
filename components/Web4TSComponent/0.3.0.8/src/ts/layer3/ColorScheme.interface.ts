/**
 * ColorScheme Interface - TSCompletion color standards for CLI output
 * Web4 principle: One type per file
 * Purpose: Color coding system for professional CLI documentation output
 */

export interface ColorScheme {
  toolName: string;      // Cyan bold for tool header
  version: string;       // Yellow bold for version
  commands: string;      // Green bold for command names
  parameters: string;    // Magenta bold for parameters
  descriptions: string;  // White for descriptions
  examples: string;      // Yellow for examples
  sections: string;      // Blue bold for section headers
  reset: string;         // Reset to default
}

export interface DocumentationSections {
  header: string;
  usage: string;
  commands: string;
  parameters: string;
  examples: string;
  integration: string;
}