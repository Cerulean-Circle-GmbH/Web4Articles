/**
 * Scenario - Web4 Scenario Interface
 * Web4 pattern: Scenario-based initialization
 */

export interface Scenario<T = any> {
  model?: T;
  context?: any;
}

