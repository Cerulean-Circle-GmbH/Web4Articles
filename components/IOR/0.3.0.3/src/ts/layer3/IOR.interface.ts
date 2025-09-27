/**
 * IOR Interface - Interoperable Object Reference
 * 
 * Web4 principle: Simple, fundamental, dependency-free
 * Version 0.3.0.3: No environment knowledge, pure object identification
 */

export interface IOR {
  /**
   * Unique identifier for the object
   */
  uuid: string;

  /**
   * Component type name
   */
  component: string;

  /**
   * Component version
   */
  version: string;

  /**
   * Optional network location (no environment assumptions)
   */
  location?: string;

  /**
   * Optional endpoint path (no environment assumptions)
   */
  endpoint?: string;
}