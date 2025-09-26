/**
 * Web4 Requirement Interface
 * 
 * Contract for requirement management
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';

export interface Requirement {
  init(scenario: Scenario): this;
  toScenario(): Scenario;
  saveToFile(filePath: string): Promise<void>;
}