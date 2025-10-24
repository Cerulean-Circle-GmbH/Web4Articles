/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface IOR {
  /**
   * Unique identifier (UUID v4)
   * Required: Every Web4 object must have unique identity
   */
  uuid: string;

  /**
   * Component type identifier 
   * Required: Identifies the component that manages this object
   * Examples: "ONCE", "Scenario", "Unit", "Web4Requirement"
   */
  component: string;

  /**
   * Component version
   * Required: Ensures compatibility and evolution tracking
   * Format: semantic versioning (e.g., "0.3.0.0")
   */
  version: string;

  /**
   * Network location (optional)
   * For distributed object references across Web4 network
   * Examples: "localhost:42777", "web4://peer.example.com:8080"
   */
  location?: string;

  /**
   * Specific endpoint path (optional)  
   * For detailed object access within a location
   * Examples: "/api/components/once", "/scenarios/uuid"
   */
  endpoint?: string;
}

/**
 * Web4 Component Exports - Radical OOP Pattern
 * Integrated exports following Decision 3b
 */

export { DefaultIOR } from '../layer2/DefaultIOR.js';
export { DefaultModel } from '../layer2/DefaultModel.js';
export type { Model } from './Model.interface.js';
// Universal CLI exports
export type { CLI } from '../layer5/CLI.interface.js';
export { DefaultCLI } from '../layer5/DefaultCLI.js';
// Service integration exports
export type { ServiceCapable } from './ServiceCapable.interface.js';