/**
 * Web4TSComponentModel - Web4 TypeScript Component Model Interface
 * Web4 principle: Single interface per file, minimal Model extension
 * Purpose: Component model following Web4 architecture patterns
 */

import { Model } from './Model.interface.js';
import { ComponentDependency } from './ComponentDependency.interface.js';
import { SemanticVersion } from '../layer2/SemanticVersion.js';

export interface Web4TSComponentModel extends Model {
  // uuid inherited from Model - don't redeclare
  name: string;
  origin: string;
  definition: string;
  
  // Single source of truth: component identity
  component: string;  // Component name (e.g., 'Web4TSComponent')
  /**
   * Version component (INSTANCE with behavior!)
   * @pdca 2025-10-28-UTC-0934.pdca.md:2290 - Phase 3: Version INSTANCE
   */
  version: SemanticVersion;  // ✅ INSTANCE, not string!
  
  // Web4TSComponent-specific properties
  projectRoot: string;        // Discovered once at init, used for all absolute path operations
  targetDirectory: string;    // Can be overridden (e.g., test/data for test isolation)
  dependencies?: ComponentDependency[];  // Component dependencies with auto-build
  
  /**
   * Context: Another component INSTANCE (not data!)
   * Used by on() to load target component for operations
   * @pdca 2025-10-28-UTC-0934.pdca.md:3041 - Phase 4: Context INSTANCE
   */
  context?: any;  // Will be DefaultWeb4TSComponent (avoiding circular import)
  
  // Note: createdAt/updatedAt removed per Web4 principle - these belong in ChangeEvent
  // Note: componentStandards, validationRules, scaffoldingTemplates removed - never used in main test story
}

