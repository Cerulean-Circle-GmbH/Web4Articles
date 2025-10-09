/**
 * Web4TSComponent - Web4 TypeScript Component Interface
 * Web4 pattern: Component interface for TypeScript component standards enforcement
 */

import { Scenario } from './Scenario.interface.js';

export interface Web4TSComponent {
  // Web4 standard methods
  init(scenario: Scenario): this;
  transform(data?: unknown): this;
  validate(object?: any): this;
  process(): this;
  
  // Component-specific methods
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  
  // Configuration methods
  setTargetDirectory(directory: string): void;
}