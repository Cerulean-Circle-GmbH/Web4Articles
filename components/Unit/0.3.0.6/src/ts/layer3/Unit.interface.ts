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
  toScenario(): Promise<Scenario>;

  /**
   * Load unit context for subsequent operations - eliminates repetitive identifiers
   * Web4 pattern: Context loading for workflow optimization and Occam's razor efficiency
   * @param identifier - Unit identifier (UUID or scenario file) @cliSyntax uuid|scenarioFile
   * @returns Promise resolving to this for chaining with loaded context
   * 
   * @example
   * ```typescript
   * // Workflow optimization - load once, use many times
   * await unit.on('44443290-015c-4720-be80-c42caf842252')
   *           .set('syncStatus', 'MODIFIED')
   *           .set('origin', 'ior:git:...TSRanger/v2.2...')
   *           .definition('component.ts', '5,10', '5,30')
   *           .copyInto('backup/')
   *           .execute();
   * ```
   */
  on(identifier: UnitIdentifier): Promise<this>;

  /**
   * Set sophisticated definition from file text reference with GitTextIOR
   * Web4 pattern: Sophisticated text reference capability with precise positioning
   * @param identifier - Unit identifier (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param file - Source file for definition text @cliSyntax file
   * @param startPos - Start position (line,column) @cliSyntax startPos
   * @param endPos - End position (line,column) @cliSyntax endPos
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Create sophisticated definition from file text
   * await unit.definition('44443290-015c-4720-be80-c42caf842252', 'component.ts', '5,10', '5,30').execute();
   * 
   * // Creates GitTextIOR: ior:git:text:...component.ts#L5,10-5,30
   * ```
   */
  definition(identifier: UnitIdentifier, file: string, startPos: string, endPos: string): Promise<this>;

  /**
   * Set sophisticated definition from file text reference using loaded context
   * Web4 pattern: Context-aware sophisticated text reference capability
   * @param file - Source file for definition text @cliSyntax file
   * @param startPos - Start position (line,column) @cliSyntax startPos
   * @param endPos - End position (line,column) @cliSyntax endPos
   * @returns Promise resolving to this for chaining
   */
  definition(file: string, startPos: string, endPos: string): Promise<this>;

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
   * Discover files with same name and add as references with comprehensive metadata
   * Web4 pattern: Automatic copy detection with git hash IOR and sync status management
   * @param identifier - Unit identifier (UUID or scenario file) @cliSyntax uuid|scenario
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Automatic copy discovery and reference management
   * await unit.discover('44443290-015c-4720-be80-c42caf842252').execute();
   * 
   * // Discovers all files named TSCompletion.ts and adds as references with metadata
   * ```
   */
  discover(identifier: UnitIdentifier): Promise<this>;

  /**
   * Move unit link to target folder with correct relative path calculation
   * Web4 pattern: Unit link movement with automatic relative path recalculation
   * @param lnfile - Unit link file to move @cliSyntax lnfile
   * @param targetFolder - Target directory for move @cliSyntax targetFolder
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // Move unit link with automatic relative path calculation
   * await unit.move('Folder.unit', 'MDAv4/M3/CLASS/').execute();
   * 
   * // Automatically recalculates relative path from new location
   * ```
   */
  move(lnfile: string, targetFolder: string): Promise<this>;

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