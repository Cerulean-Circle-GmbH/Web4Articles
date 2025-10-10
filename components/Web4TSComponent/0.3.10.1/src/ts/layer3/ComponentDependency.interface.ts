/**
 * ComponentDependency - Component Dependency Interface
 * Web4 principle: Single interface per file
 * Purpose: Define component dependencies for auto-build
 */

export interface ComponentDependency {
  component: string;  // Component name (e.g., 'IOR', 'Scenario')
  version: string;    // Required version (e.g., '0.3.0.3')
  path?: string;      // Optional custom path (defaults to ../ComponentName/version)
}

