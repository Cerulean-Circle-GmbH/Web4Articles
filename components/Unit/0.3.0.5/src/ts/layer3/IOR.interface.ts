/**
 * IOR Interface - Interoperable Object Reference for Web4 components
 * Web4 principle: Single interface per file, minimal dependencies
 * Purpose: Universal object identification and location across distributed systems
 * Based on CORBA 2.3 IOR principles with Web4 adaptations
 */

export interface IOR {
  getUrl(): string;                // Complete IOR URL string
  getType(): string;               // Protocol type identifier
}