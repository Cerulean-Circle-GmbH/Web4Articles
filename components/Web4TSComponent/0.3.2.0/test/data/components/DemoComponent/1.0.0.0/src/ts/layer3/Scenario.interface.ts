/**
 * Scenario - Web4 Scenario Interface
 * Web4 pattern: Scenario support for component state management
 */

export interface Scenario<T = any> {
  ior: {
    uuid: string;
    component: string;
    version: string;
  };
  owner: string;
  model: T;
}