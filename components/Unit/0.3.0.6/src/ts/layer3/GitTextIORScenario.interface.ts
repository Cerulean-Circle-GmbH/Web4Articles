/**
 * GitTextIORScenario Interface - Scenario hibernation specialization for GitTextIOR
 * Web4 principle: Single interface per file
 * Purpose: Provide proper hibernation format for GitTextIOR instances
 */

import { GitPositioning } from './GitPositioning.interface.js';

export interface GitTextIORScenario {
  ior: {
    uuid: string;
    component: string;
    version: string;
  };
  owner: string;
  model: {
    uuid: string;
    gitUrl: string;
    iorFormat: string;
    positioning: GitPositioning;
    createdAt: string;
    updatedAt: string;
  };
}