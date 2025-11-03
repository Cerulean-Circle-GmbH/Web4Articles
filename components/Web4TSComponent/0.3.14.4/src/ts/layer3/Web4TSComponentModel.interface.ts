/**
 * Web4TSComponentModel - Web4 TypeScript Component Model Interface
 * Web4 principle: Single interface per file, minimal Model extension
 * Purpose: Component model following Web4 architecture patterns
 */

import { Model } from './Model.interface.js';
import { ComponentDependency } from './ComponentDependency.interface.js';

export interface Web4TSComponentModel extends Model {
  // uuid inherited from Model - don't redeclare
  name: string;
  origin: string;
  definition: string;
  
  // Single source of truth: component identity
  component: string;  // Component name (e.g., 'Web4TSComponent')
  version: string;    // Version from directory name (e.g., X.Y.Z.W format)
  
  // Web4TSComponent-specific properties
  projectRoot: string;        // Discovered once at init, used for all absolute path operations
  targetDirectory: string;    // Can be overridden (e.g., test/data for test isolation)
  dependencies?: ComponentDependency[];  // Component dependencies with auto-build
  
  // Note: createdAt/updatedAt removed per Web4 principle - these belong in ChangeEvent
  // Note: componentStandards, validationRules, scaffoldingTemplates removed - never used in main test story
}
