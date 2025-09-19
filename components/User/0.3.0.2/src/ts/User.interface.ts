/**
 * Web4 User Interface
 * 
 * Contract for user management
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';
import { AuthCredentials } from './UserModel.interface.js';

export interface User {
  init(scenario: Scenario): this;
  authenticate(credentials: AuthCredentials): Promise<boolean>;
  toScenario(): Scenario;
}