/**
 * PDCAModel - PDCA Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface PDCAModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  component: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  cmm3Violations?: { [key: string]: string[] }; // Store detailed violation info for cmm3check
}
