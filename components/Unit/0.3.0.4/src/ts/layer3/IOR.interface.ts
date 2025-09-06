/**
 * IOR Interface - Simple IOR for Unit component
 * Web4 principle: Single interface per file
 * TODO: Use single source of truth when available
 */

export interface IOR {
  uuid: string;
  component: string;
  version: string;
}