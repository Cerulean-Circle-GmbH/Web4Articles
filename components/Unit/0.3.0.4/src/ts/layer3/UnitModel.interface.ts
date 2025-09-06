/**
 * UnitModel Interface - Clean unit model
 * Web4 principle: Single interface per file
 */

export interface UnitModel {
  uuid: string;
  name: string;
  description: string;
  state: 'uninitialized' | 'initialized' | 'executed';
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}