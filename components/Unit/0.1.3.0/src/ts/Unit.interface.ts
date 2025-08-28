/**
 * Web4 Unit Interface
 * 
 * Contract for atomic executable elements
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';
import { UnitInput, UnitOutput } from './UnitModel.interface.js';

export interface Unit {
  init(scenario: Scenario): this;
  execute(input: UnitInput): Promise<UnitOutput>;
  toScenario(): Scenario;
}