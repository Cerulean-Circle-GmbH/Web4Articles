/**
 * ScaffoldingTemplate Interface - Web4 Scaffolding Template Definition
 * Web4 principle: Single interface per file
 * Purpose: Define scaffolding templates for component generation
 */

export interface ScaffoldingTemplate {
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  conditions?: string[];
}


