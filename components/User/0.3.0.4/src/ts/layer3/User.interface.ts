/**
 * User Interface - Web4 User component contract
 * 
 * Web4 principle: Single interface per file
 * Clean interface without any types or over-engineering
 */

export interface User {
  /**
   * Initialize from scenario
   */
  init(scenario: Scenario): this;

  /**
   * Generate owner data for scenarios
   */
  generateOwnerData(params: OwnerParams): Promise<string>;

  /**
   * Convert to scenario format
   */
  toScenario(): Scenario;
}

export interface OwnerParams {
  user: string;
  hostname: string;
  uuid?: string;
}

export interface Scenario {
  ior: {
    uuid: string;
    component: string;
    version: string;
  };
  owner: string;
  model: any;
}