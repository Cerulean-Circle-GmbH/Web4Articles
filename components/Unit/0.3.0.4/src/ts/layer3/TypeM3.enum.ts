/**
 * TypeM3 Enum - MOF Meta-Meta-Model Level Classification
 * Web4 principle: Single enum per file for MOF M3 level types
 * Purpose: Classify units at the M3 meta-meta-model level
 * 
 * Values:
 * - CLASS: Components, classes, objects, types that can be instantiated
 * - ATTRIBUTE: Files, properties, data, values that describe characteristics  
 * - RELATIONSHIP: LD Links, associations, connections, references between entities
 */
export enum TypeM3 {
  CLASS = "CLASS",
  ATTRIBUTE = "ATTRIBUTE", 
  RELATIONSHIP = "RELATIONSHIP"
}