/**
 * UnitModel Interface - UnitIndex as actual Unit model
 * Web4 principle: Single interface per file
 * Purpose: Unit model contains storage capabilities, not requirement-like attributes
 */

export interface UnitModel {
  uuid: string;                    // UUIDv4 format using crypto.randomUUID()
  indexPath: string;               // scenarios/index/path to this unit
  symlinkPaths: string[];          // LD links tracking
  executionCapabilities: string[]; // What unit can execute
  storageCapabilities: string[];   // Storage features
  createdAt: string;
  updatedAt: string;
}