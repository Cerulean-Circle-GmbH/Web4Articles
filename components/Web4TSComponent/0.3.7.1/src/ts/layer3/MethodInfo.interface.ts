/**
 * MethodInfo Interface - Method analysis information for dynamic CLI documentation
 * Web4 principle: One type per file
 * Purpose: Structure for component method analysis and documentation generation
 */

import { ParameterInfo } from './ParameterInfo.interface.js';

export interface MethodInfo {
  name: string;
  parameters: ParameterInfo[];
  description: string;
  examples: string[];
  returnType: string;
  isPublic: boolean;
  category: 'create' | 'modify' | 'query' | 'delete' | 'utility' | 'context';
}