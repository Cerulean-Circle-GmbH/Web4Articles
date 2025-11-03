/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Scenario } from './Scenario.interface.js';
import { Model } from './Model.interface.js';

/**
 * Base interface for all Web4 components
 * Ensures every component has fundamental lifecycle and development methods
 */
export interface Component<TModel extends Model = Model> {
  // ========================================
  // LIFECYCLE METHODS (Web4 pattern)
  // ========================================
  
  /**
   * Initialize component with scenario
   * @param scenario Scenario containing component configuration
   * @returns this for method chaining
   */
  init(scenario: Scenario<TModel>): this;
  
  /**
   * Convert component state to scenario for persistence
   * @param name Optional scenario name
   * @returns Scenario representation of current state
   */
  toScenario(name?: string): Promise<Scenario<TModel>>;
  
  // ========================================
  // DEVELOPMENT METHODS (Delegated to Web4TSComponent)
  // ========================================
  
  /**
   * Run component tests (full suite or selective)
   * Delegates to Web4TSComponent for hierarchical testing
   * 
   * @param scope Test scope: 'all' | 'file' | 'describe' | 'itCase'
   * @param references Hierarchical test references (e.g., '1', '2a', '3b2')
   * @returns this for method chaining
   * 
   * @example
   * await component.test();              // Run all tests
   * await component.test('file', '1');   // Run test file #1
   * await component.test('itCase', '2a1'); // Run specific test case
   */
  test(scope?: string, ...references: string[]): Promise<this>;
  
  /**
   * Build component (TypeScript compilation)
   * Delegates to Web4TSComponent
   * 
   * @returns this for method chaining
   */
  build(): Promise<this>;
  
  /**
   * Clean component build artifacts
   * Delegates to Web4TSComponent
   * 
   * @returns this for method chaining
   */
  clean(): Promise<this>;
  
  // ========================================
  // INTROSPECTION METHODS (Optional but useful)
  // ========================================
  
  /**
   * Show component directory tree structure
   * Delegates to Web4TSComponent
   * 
   * @param depth Maximum depth to show (default: 4)
   * @param showHidden Whether to show hidden files (default: false)
   * @returns this for method chaining
   */
  tree?(depth?: string, showHidden?: string): Promise<this>;
  
  /**
   * Show semantic version links (dev, test, prod, latest)
   * Delegates to Web4TSComponent
   * 
   * @param action Optional action (e.g., 'repair' to fix broken links)
   * @returns this for method chaining
   */
  links?(action?: string): Promise<this>;
}

