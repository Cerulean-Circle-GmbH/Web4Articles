/**
 * CLIStandardValidation Interface
 * Web4 principle: One type per file
 * Purpose: CLI standard validation results
 */

export interface CLIStandardValidation {
  isCompliant: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

