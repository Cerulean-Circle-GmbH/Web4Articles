/**
 * MethodInfo Interface - Method analysis information for dynamic CLI documentation
 * Web4 principle: One type per file
 * Purpose: Structure for component method analysis and documentation generation
 */

export interface MethodInfo {
  name: string;
  parameters: any[];  // Simplified - was ParameterInfo[] (deleted bloat interface)
  description: string;
  examples: string[];
  returnType: string;
  isPublic: boolean;
  category: 'create' | 'modify' | 'query' | 'delete' | 'utility' | 'context';
}