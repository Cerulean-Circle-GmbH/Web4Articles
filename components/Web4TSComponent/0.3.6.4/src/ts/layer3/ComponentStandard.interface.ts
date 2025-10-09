/**
 * ComponentStandard Interface - Web4 Component Standard Definition
 * Web4 principle: Single interface per file
 * Purpose: Define component standards with requirements and validation rules
 */

export interface ComponentStandard {
  name: string;
  version: string;
  description: string;
  requirements: string[];
  validationRules: string[];
}


