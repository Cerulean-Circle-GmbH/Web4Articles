/**
 * IOR Interface - Interoperable Object Reference data structure
 * Web4 principle: Single interface per file
 * Purpose: Standard IOR data format for scenario hibernation
 */

export interface IOR {
  uuid: string;
  component: string;
  version: string;
}