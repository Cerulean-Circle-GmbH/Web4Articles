/**
 * Component.interface.ts - Base interface for ALL Web4 components
 * Every Web4 component must implement these fundamental lifecycle methods
 * 
 * Purpose: Provides common contract for:
 * - Lifecycle (init, toScenario)
 * 
 * Note: Development methods (test, build, clean) are in Web4TSComponent interface
 * as they're specific to TypeScript component development, not universal
 */

import { Scenario } from './Scenario.interface.js';
import { Model } from './Model.interface.js';
import { MethodSignature } from './MethodSignature.interface.js';

/**
 * Base interface for all Web4 components
 * Ensures every component has fundamental lifecycle methods
 * 
 * @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Added REQUIRED model property for polymorphic access
 * @pdca 2025-11-05-UTC-1158.pdca.md - Added method discovery interface for type-safe CLI routing
 */
export interface Component<TModel extends Model = Model> {
  /**
   * Component's internal model/state (REQUIRED)
   * Every Web4 component MUST have a model (empty constructor + init pattern)
   * Exposed for polymorphic access in DefaultCLI and other generic contexts
   */
  model: TModel;
  
  // ========================================
  // LIFECYCLE METHODS (Web4 pattern)
  // ========================================
  
  /**
   * Initialize component with optional scenario
   * Empty constructor + init() pattern (radical OOP)
   * @pdca 2025-10-28-UTC-0934.pdca.md:597 - Phase 1: Init Pattern
   * @param scenario Optional scenario containing component configuration
   * @returns this for method chaining
   */
  init(scenario?: Scenario<TModel>): this;
  
  /**
   * Convert component state to scenario for persistence
   * @param name Optional scenario name
   * @returns Scenario representation of current state
   */
  toScenario(name?: string): Promise<Scenario<TModel>>;
  
  // ========================================
  // METHOD DISCOVERY INTERFACE (Web4 pattern)
  // @pdca 2025-11-05-UTC-1158.pdca.md - Type-safe method routing
  // ========================================
  
  /**
   * Check if component has a method
   * Used by CLI for type-safe method routing without `as any` casting
   * @param name Method name to check
   * @returns true if method exists, false otherwise
   */
  hasMethod(name: string): boolean;
  
  /**
   * Get method signature for CLI routing
   * Returns null if method doesn't exist (explicit null, not undefined)
   * @param name Method name
   * @returns Method signature or null
   */
  getMethodSignature(name: string): MethodSignature | null;
  
  /**
   * List all available method names
   * Used for CLI completion and usage generation
   * @returns Array of method names
   */
  listMethods(): string[];
}


