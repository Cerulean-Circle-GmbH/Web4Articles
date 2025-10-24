/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';

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

export interface ComponentScaffoldOptions {
  componentName: string;
  version: string;
  includeLayerArchitecture?: boolean;
  includeCLI?: boolean;
  includeSpecFolder?: boolean;
  includeVitest?: boolean;
}

export interface ComponentMetadata {
  name: string;
  version: string;
  hasLocationResilientCLI: boolean;
  hasLayeredArchitecture: boolean;
  hasEmptyConstructors: boolean;
  hasScenarioSupport: boolean;
  complianceScore?: number;
  issues?: string[];
}

export interface CLIStandardValidation {
  isCompliant: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}