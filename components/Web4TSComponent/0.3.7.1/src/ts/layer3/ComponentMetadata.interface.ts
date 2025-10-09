/**
 * ComponentMetadata Interface
 * Web4 principle: One type per file
 * Purpose: Component metadata and compliance information
 */

export interface ComponentMetadata {
  name: string;
  version: string;
  hasLocationResilientCLI: boolean;
  hasLayeredArchitecture: boolean;
  hasEmptyConstructors: boolean;
  hasScenarioSupport: boolean;
  complianceScore?: number;
  issues?: string[];
}

