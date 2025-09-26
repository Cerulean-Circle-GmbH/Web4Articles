/**
 * NamedLink Interface - Named link structure for LD link management
 * Web4 principle: Single interface per file
 * Purpose: Bidirectional linking between workspace locations and central storage
 * 
 * TRON Feedback: Web4 compliance violation identified - multiple interfaces in single file
 * Fixed: NamedLink moved to separate interface file
 */
export interface NamedLink {
  location: string;                // Relative path from link to scenario
  filename: string;                // Link filename (e.g., "test-unit.unit")
}