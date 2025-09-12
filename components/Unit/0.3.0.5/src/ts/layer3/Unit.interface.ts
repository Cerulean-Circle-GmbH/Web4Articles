/**
 * Unit Interface - Protocol-less radical OOP atomic element
 * Web4 principle: Single interface per file
 * No Input/Output constructs - direct object methods only
 */

import { Scenario } from './Scenario.interface.js';

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
   * Copy unit's origin file to target location with automatic .unit LD link creation
   * Web4 pattern: Automatic copy management with origin tracking
   * @param targetPath - Target directory or file path for copy @cliSyntax targetPath
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Copy to directory - creates filename.ext and filename.ext.unit
   * await unit.copyInto('components/NewComponent/src/layer4/').execute();
   * 
   * // Copy to specific file - creates specified file and file.unit
   * await unit.copyInto('components/NewComponent/src/utils/MyFile.ts').execute();
   * ```
   */
  copyInto(targetPath: string): Promise<this>;

  /**
   * Execute complete command chain and finalize operations
   * Web4 pattern: Final execution method for fluent interface completion
   */
  execute(): Promise<void>;
}