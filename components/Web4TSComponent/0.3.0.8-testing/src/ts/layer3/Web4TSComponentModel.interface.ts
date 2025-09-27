/**
 * Web4TSComponentModel - Web4 TypeScript Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface Web4TSComponentModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  
  // Web4TSComponent-specific properties
  targetDirectory: string;
  componentStandards: ComponentStandard[];
  validationRules: ValidationRule[];
  scaffoldingTemplates: ScaffoldingTemplate[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ComponentStandard {
  name: string;
  version: string;
  description: string;
  requirements: string[];
  validationRules: string[];
}

export interface ValidationRule {
  name: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface ScaffoldingTemplate {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  conditions?: string[];
}