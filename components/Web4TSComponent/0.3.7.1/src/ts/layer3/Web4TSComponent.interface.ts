/**
 * Web4TSComponent - Web4 TypeScript Component Interface
 * Web4 pattern: Component interface for TypeScript component standards enforcement
 */

import { Scenario } from './Scenario.interface.js';
import { ComponentScaffoldOptions } from './ComponentScaffoldOptions.interface.js';
import { ComponentMetadata } from './ComponentMetadata.interface.js';
import { CLIStandardValidation } from './CLIStandardValidation.interface.js';

export interface Web4TSComponent {
  // Web4 standard methods
  init(scenario: Scenario): this;
  transform(data?: unknown): this;
  validate(object?: any): this;
  process(): this;
  
  // Component-specific methods
  scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata>;
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  validateCLIStandard(scriptPath: string): Promise<CLIStandardValidation>;
  auditComponentCompliance(componentPath: string): Promise<ComponentMetadata>;
  generateComplianceReport(componentDir: string): Promise<ComponentMetadata[]>;
  
  // Configuration methods
  setTargetDirectory(directory: string): void;
  showStandard(): void;
  showGuidelines(): void;
}