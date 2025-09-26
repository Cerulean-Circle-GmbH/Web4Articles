/**
 * Web4 IOR (Interoperable Object Reference) Interface - Unified Standard
 * 
 * Radically simplified yet resilient object reference system
 * Based on Occam's razor principle from Scenario component
 * Enhanced with minimal essential network features for ONCE compatibility
 */

export interface IOR {
  /**
   * Unique identifier (UUID v4)
   * Required: Every Web4 object must have unique identity
   */
  uuid: string;

  /**
   * Component type identifier 
   * Required: Identifies the component that manages this object
   * Examples: "ONCE", "Scenario", "Unit", "Web4Requirement"
   */
  component: string;

  /**
   * Component version
   * Required: Ensures compatibility and evolution tracking
   * Format: semantic versioning (e.g., "0.3.0.0")
   */
  version: string;

  /**
   * Network location (optional)
   * For distributed object references across Web4 network
   * Examples: "localhost:42777", "web4://peer.example.com:8080"
   */
  location?: string;

  /**
   * Specific endpoint path (optional)  
   * For detailed object access within a location
   * Examples: "/api/components/once", "/scenarios/uuid"
   */
  endpoint?: string;
}

/**
 * Web4 Component Exports - Radical OOP Pattern
 * Integrated exports following Decision 3b
 */

export { DefaultIOR } from '../layer2/DefaultIOR.js';
export { DefaultModel } from '../layer2/DefaultModel.js';
export type { Model } from './Model.interface.js';
// Universal CLI exports
export type { CLI } from '../layer5/CLI.interface.js';
export { DefaultCLI } from '../layer5/DefaultCLI.js';
// Service integration exports
export type { ServiceCapable } from './ServiceCapable.interface.js';