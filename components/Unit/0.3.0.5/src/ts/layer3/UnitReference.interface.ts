/**
 * UnitReference Interface - IOR-based reference tracking
 * Web4 principle: Single interface per file, pure IOR types
 * Purpose: Track unit references with IOR types and sync status
 */

import { IOR } from './IOR.interface.js';

export interface UnitReference {
  linkLocation: IOR;                // IOR type (LocalLnIOR, FileIOR, etc.)
  linkTarget: IOR;                  // IOR type (UnitIOR, GitTextIOR, etc.)
  syncStatus: SyncStatus;
}

export enum SyncStatus {
  SYNCED = "SYNCED",
  OUTDATED = "OUTDATED", 
  BROKEN = "BROKEN",
  UNKNOWN = "UNKNOWN"
}