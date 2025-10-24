/**
 * Web4TSComponent - Web4 TypeScript Component Interface
 * Web4 pattern: Component interface for TypeScript component standards enforcement
 */

import { Component } from './Component.interface.js';
import { Scenario } from './Scenario.interface.js';
import { Web4TSComponentModel } from './Web4TSComponentModel.interface.js';

export interface Web4TSComponent extends Component<Web4TSComponentModel> {
  // Web4 standard methods (from Component)
  // init(scenario: Scenario): this; - inherited
  // test(scope?: string, ...references: string[]): Promise<this>; - inherited
  // build(): Promise<this>; - inherited
  // clean(): Promise<this>; - inherited
  // tree?(depth?: string, showHidden?: string): Promise<this>; - inherited
  
  transform(data?: unknown): this;
  validate(object?: any): this;
  // process() - REMOVED: placebo method with no value
  
  // Component-specific methods
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  
  // Configuration methods
  setTargetDirectory(directory: string): void;
}