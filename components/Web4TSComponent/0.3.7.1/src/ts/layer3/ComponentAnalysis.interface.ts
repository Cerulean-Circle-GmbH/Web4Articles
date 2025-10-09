/**
 * ComponentAnalysis Interface - Component structure analysis for dynamic documentation
 * Web4 principle: One type per file
 * Purpose: Structure for complete component analysis and documentation generation
 */

import { MethodInfo } from './MethodInfo.interface.js';
import { InterfaceAnalysis } from './InterfaceAnalysis.interface.js';
import { ExampleAnalysis } from './ExampleAnalysis.interface.js';

export interface ComponentAnalysis {
  className: string;
  version: string;
  description: string;
  methods: MethodInfo[];
  interfaces: InterfaceAnalysis[];
  examples: ExampleAnalysis[];
}