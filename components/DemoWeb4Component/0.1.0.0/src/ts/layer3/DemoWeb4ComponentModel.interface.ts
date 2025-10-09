/**
 * DemoWeb4ComponentModel - DemoWeb4Component Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface DemoWeb4ComponentModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}
