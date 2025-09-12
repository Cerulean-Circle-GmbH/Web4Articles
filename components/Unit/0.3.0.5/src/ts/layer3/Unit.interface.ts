/**
 * Unit Interface - Protocol-less radical OOP atomic element
 * Web4 principle: Single interface per file
 * No Input/Output constructs - direct object methods only
 */

import { Scenario } from './Scenario.interface.js';
import { UnitIdentifier } from './UnitIdentifier.type.js';

export interface Unit {
  /**
   * Initialize from scenario - Web4 pattern with command chaining
   */
  init(scenario: Scenario): this;

  /**
   * Transform data with command chaining support - fluent interface
   */
  transform(data?: unknown): this;

  /**
   * Validate object with command chaining support - fluent interface
   */
  validate(object?: any): this;

  /**
   * Process unit logic with command chaining support - fluent interface
   */
  process(): this;

  /**
   * Convert to scenario for hibernation
   */
  toScenario(name?: string): Promise<Scenario>;

  /**
   * Set model attribute value with universal identifier pattern
   * Web4 pattern: Universal <uuid|lnfile> parameter for attribute manipulation
   * @param identifier - Unit identifier (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param attribute - Model attribute name @cliSyntax modelAttribute
   * @param value - Attribute value @cliSyntax value
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Set attributes by UUID
   * await unit.set('44443290-015c-4720-be80-c42caf842252', 'syncStatus', 'MODIFIED').execute();
   * 
   * // Set attributes by .unit file
   * await unit.set('TSCompletion.ts.unit', 'origin', 'ior:git:...TSRanger/v2.2...').execute();
   * ```
   */
  set(identifier: UnitIdentifier, attribute: string, value: string): Promise<this>;

  /**
   * Get model attribute value with universal identifier pattern
   * Web4 pattern: Universal <uuid|lnfile> parameter for attribute access
   * @param identifier - Unit identifier (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param attribute - Model attribute name @cliSyntax modelAttribute
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Get attributes by UUID
   * await unit.get('44443290-015c-4720-be80-c42caf842252', 'syncStatus').execute();
   * 
   * // Get attributes by .unit file
   * await unit.get('TSCompletion.ts.unit', 'origin').execute();
   * ```
   */
  get(identifier: UnitIdentifier, attribute: string): Promise<this>;

  /**
   * Copy unit's origin file to target location with automatic .unit LD link creation
   * Web4 pattern: Universal <uuid|lnfile> parameter pattern with scenario loading
   * @param identifier - Unit identifier (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param targetFolder - Target directory for copy @cliSyntax targetFolder
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Copy unit by UUID to directory - creates filename.ext and filename.ext.unit
   * await unit.copyInto('44443290-015c-4720-be80-c42caf842252', 'components/NewComponent/src/layer4/').execute();
   * 
   * // Copy unit by .unit file to directory
   * await unit.copyInto('TSCompletion.ts.unit', 'components/NewComponent/src/layer4/').execute();
   * ```
   */
  copyInto(identifier: UnitIdentifier, targetFolder: string): Promise<this>;

  /**
   * Execute complete command chain and finalize operations
   * Web4 pattern: Final execution method for fluent interface completion
   */
  execute(): Promise<void>;
}