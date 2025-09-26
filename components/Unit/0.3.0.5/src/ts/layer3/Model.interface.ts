/**
 * Model Interface - Minimal base interface for all Web4 component models
 * Web4 principle: Single interface per file, minimal essential structure
 * Purpose: Universal identifier for all model data structures
 * 
 * TRON QA Feedback Applied:
 * - Occam's Razor: Only uuid property (createdAt/updatedAt moved to ChangeEvent)
 * - Minimal data structure interface, not behavior interface
 * - Universal identifier for all Web4 component models
 */

export interface Model {
  uuid: string;                    // UUIDv4 format - universal identifier (ONLY essential property)
}