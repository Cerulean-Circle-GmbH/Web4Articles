/**
 * Web4 Model Interface
 * 
 * Base interface for all component models
 * Provides type safety while allowing flexibility
 */

export interface Model {
  uuid?: string;
  name?: string;
  created?: string;
  updated?: string;
  [key: string]: unknown;
}

/**
 * Scenario Model - Can contain any structure
 * This is the most flexible model as scenarios 
 * need to store various component states
 */
export interface ScenarioModel extends Model {
  [key: string]: unknown;
}