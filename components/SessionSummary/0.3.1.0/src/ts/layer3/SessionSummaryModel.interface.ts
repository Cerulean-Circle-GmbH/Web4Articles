/**
 * SessionSummaryModel - SessionSummary Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface SessionSummaryModel extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}