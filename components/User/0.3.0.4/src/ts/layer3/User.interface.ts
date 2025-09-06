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

export interface IOR {
  uuid: string;
  component: string;
  version: string;
}

export interface Scenario {
  ior: IOR;
  owner: string;
  model: UserModel;
}

export interface UserModel {
  uuid: string;
  username: string;
  hostname: string;
  createdAt: string;
  updatedAt: string;
}