/**
 * ComponentDependency - Component Dependency Interface
 * Web4 principle: Single interface per file
 * Purpose: Define component dependencies for auto-build
 */

export interface ComponentDependency {
  component: string;  // Component name (e.g., 'IOR', 'Scenario', 'PDCA')
  version: string;    // Required version in semantic format
  path?: string;      // Optional custom path (defaults to ../ComponentName/version)
}

