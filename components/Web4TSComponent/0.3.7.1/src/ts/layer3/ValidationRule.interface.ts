/**
 * ValidationRule Interface - Web4 Validation Rule Definition
 * Web4 principle: Single interface per file
 * Purpose: Define validation rules with pattern matching and severity levels
 */

export interface ValidationRule {
  name: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}


