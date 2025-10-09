/**
 * DocumentationSections Interface
 * Web4 principle: One type per file
 * Purpose: Documentation section structure for CLI output
 */

export interface DocumentationSections {
  header: string;
  usage: string;
  commands: string;
  parameters: string;
  examples: string;
  integration: string;
}

