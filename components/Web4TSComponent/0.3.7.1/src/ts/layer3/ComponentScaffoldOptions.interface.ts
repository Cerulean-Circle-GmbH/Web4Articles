/**
 * ComponentScaffoldOptions Interface
 * Web4 principle: One type per file
 * Purpose: Configuration options for component scaffolding
 */

export interface ComponentScaffoldOptions {
  componentName: string;
  version: string;
  includeLayerArchitecture?: boolean;
  includeCLI?: boolean;
  includeSpecFolder?: boolean;
  includeVitest?: boolean;
}

