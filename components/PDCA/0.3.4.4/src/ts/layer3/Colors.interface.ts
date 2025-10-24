/**
 * Colors interface for terminal ANSI color codes
 * Web4 pattern: Single source of truth for all color definitions
 */
export interface Colors {
  // Basic colors
  reset: string;
  bold: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  orange: string;
  
  // Semantic colors for CLI (context-specific usage)
  toolName: string;      // Component/tool name display
  version: string;       // Version numbers
  commands: string;      // Command names
  parameters: string;    // Parameter names
  descriptions: string;  // Documentation and help text
  examples: string;      // Example values
  sections: string;      // Section headers
}

