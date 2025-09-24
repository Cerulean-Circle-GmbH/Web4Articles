/**
 * Web4 Unit Model Interface
 * 
 * Type-safe model for Unit component
 */

export interface ExecutionRecord {
  timestamp: string;
  input: unknown;
  output: unknown;
  status: 'success' | 'failed';
}

export interface UnitModel {
  uuid: string;
  name: string;
  description: string;
  state: 'uninitialized' | 'initialized' | 'executed';
  capabilities: string[];
  executionHistory: ExecutionRecord[];
  owner?: string;
}

export interface UnitInput {
  [key: string]: unknown;
}

export interface UnitOutput {
  [key: string]: unknown;
}