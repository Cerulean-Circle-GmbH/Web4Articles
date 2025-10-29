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
  /**
   * Project root path (STORAGE only - NOT calculated by component)
   * ✅ BASELINE COMPLIANCE (2025-10-28-UTC-0934.pdca.md:158):
   * Component STORES this value (set by CLI via setTargetDirectory)
   * Component does NOT CALCULATE this - that's DefaultCLI's responsibility
   * @pdca 2025-10-29-UTC-1323.path-separation-violation-fix.pdca.md
   */
  projectRoot: string;
  
  /**
   * Target directory for component operations (STORAGE only - NOT calculated)
   * ✅ BASELINE COMPLIANCE (2025-10-28-UTC-0934.pdca.md:158):
   * Component STORES this value (set by CLI or tests via setTargetDirectory)
   * Component does NOT CALCULATE paths - that's DefaultCLI's responsibility
   * Used for test isolation (e.g., test/data for tests, project root for production)
   * @pdca 2025-10-29-UTC-1323.path-separation-violation-fix.pdca.md
   */
  targetDirectory: string;
  
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

