/**
 * Web4 Model Interface - Unified Standard for Component Data
 * 
 * Occam's razor sharp: Simple, unified model pattern
 * No RequirementData, RequirementModel, RequirementFactory, RequirementManager
 * Just Model interface + DefaultModel implementation
 */

export interface Model {
  /**
   * Required: Unique identifier matching IOR.uuid
   */
  uuid: string;

  /**
   * Required: Human-readable name
   */
  name: string;

  /**
   * Required: Description of purpose/functionality
   */
  description: string;

  /**
   * Optional: Component-specific state data
   * Each component adds its own properties to the model
   */
  [key: string]: any;
}