/**
 * IOR Interface - Internet Object Reference
 * 
 * Web4 principle: Single interface per file
 * Simple IOR with uuid, component, version
 */

export interface IOR {
  uuid: string;
  component: string;
  version: string;
}