/**
 * UnitReference Interface - IOR string-based reference tracking
 * Web4 principle: Single interface per file, IOR 0.3.0.4 compatibility
 * Purpose: Track unit references with IOR strings and sync status
 */

export interface UnitReference {
  linkLocation: string;            // IOR string (0.3.0.4 format): "ior:local:ln:file://..."
  linkTarget: string;              // IOR string (0.3.0.4 format): "ior:unit:uuid"
  syncStatus: SyncStatus;
}

export enum SyncStatus {
  SYNCED = "SYNCED",
  OUTDATED = "OUTDATED", 
  BROKEN = "BROKEN",
  UNKNOWN = "UNKNOWN"
}