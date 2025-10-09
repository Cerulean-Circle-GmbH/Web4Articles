/**
 * ParameterInfo Interface
 * Web4 principle: One type per file
 * Purpose: Parameter analysis structure for method documentation
 */

export interface ParameterInfo {
  name: string;
  type: string;
  required: boolean;
  description: string;
  examples: string[];
  validation: string[];
}

