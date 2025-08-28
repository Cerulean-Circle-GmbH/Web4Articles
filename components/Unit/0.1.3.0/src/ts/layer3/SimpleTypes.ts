/**
 * Simple Web4 Types - Layer 3 (Interface/Contract)
 * 
 * Simplified interfaces for Unit component to avoid external dependencies
 */

/**
 * Simple IOR (Internet Object Reference) interface
 */
export interface IOR {
  resolve(): Promise<any>;
  getEndpoint(): string;
  isLocal(): boolean;
  serialize(): string;
}

/**
 * Simple Scenario interface
 */
export interface Scenario {
  serialize(): string;
  validate(): boolean;
  getReferences(): IOR[];
}
