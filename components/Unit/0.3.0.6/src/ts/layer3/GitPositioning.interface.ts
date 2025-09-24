/**
 * GitPositioning Interface - URL anchor positioning specialization
 * Web4 principle: Single interface per file
 * Purpose: Handle URL anchor positioning with line/column and character ranges for git references
 */

export interface GitPositioning {
  type: 'line-column' | 'character';
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
  startChar?: number;
  endChar?: number;
}