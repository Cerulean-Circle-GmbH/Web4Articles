/**
 * InterfaceAnalysis Interface
 * Web4 principle: One type per file
 * Purpose: Analysis structure for interface documentation
 */

import { PropertyAnalysis } from './PropertyAnalysis.interface.js';

export interface InterfaceAnalysis {
  name: string;
  properties: PropertyAnalysis[];
  description: string;
}

