/**
 * OwnerParams Interface
 * 
 * Web4 principle: Single interface per file
 * Parameters for owner data generation
 * 
 * NOTE: Copied from components/User/0.3.0.4/src/ts/layer3/User.interface.ts
 * to prevent build dependency on User component
 */

export interface OwnerParams {
  user: string;
  hostname: string;
  uuid?: string;
}

