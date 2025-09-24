/**
 * ComponentAnalysis Interface - Component structure analysis for dynamic documentation
 * Web4 principle: One type per file
 * Purpose: Structure for complete component analysis and documentation generation
 */

import { MethodInfo } from './MethodInfo.interface.js';

export interface ComponentAnalysis {
  className: string;
  version: string;
  description: string;
  methods: MethodInfo[];
  interfaces: InterfaceAnalysis[];
  examples: ExampleAnalysis[];
}

export interface InterfaceAnalysis {
  name: string;
  properties: PropertyAnalysis[];
  description: string;
}

export interface PropertyAnalysis {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ExampleAnalysis {
  title: string;
  code: string;
  description: string;
  category: string;
}