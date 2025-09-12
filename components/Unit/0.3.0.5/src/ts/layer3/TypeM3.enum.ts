/**
 * TypeM3 Enum - MOF M3/M2/M1 hierarchy classification
 * Web4 principle: Single type per file, enum in separate .enum.ts file
 * Purpose: MOF meta-model level classification for units
 * 
 * TRON QA Feedback: Web4 compliance violation - enum must be in separate file
 * Fixed: TypeM3 moved from UnitModel.interface.ts to TypeM3.enum.ts
 */

export enum TypeM3 {
  CLASS = "CLASS",           // Components, classes, objects
  ATTRIBUTE = "ATTRIBUTE",   // Files, properties, data  
  RELATIONSHIP = "RELATIONSHIP" // LD Links, associations, connections
}