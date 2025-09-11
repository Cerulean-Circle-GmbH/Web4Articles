/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Upgrade } from '../layer3/Upgrade.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { UnitReference, SyncStatus } from '../layer3/UnitReference.interface.js';
import { UnitIdentifier, isUUIDv4, isFilePath } from '../layer3/UnitIdentifier.type.js';
import { UUIDv4 } from '../layer3/UUIDv4.class.js';
import { TypeM3 } from '../layer3/TypeM3.enum.js';
import { Model } from '../layer3/Model.interface.js';
import { DefaultStorage } from './DefaultStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class DefaultUnit implements Unit, Upgrade {
  private model: UnitModel;
  private storage: DefaultStorage;

  // Getter for CLI access to model
  get unitModel(): UnitModel {
    return this.model;
  }

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),           // UUIDv4 using crypto.randomUUID() (Decision 1a)
      name: '',                            // Unit name for terminal identification (uni-t)
      origin: '',                          // GitTextIOR format with line/column positions
      definition: '',                      // GitTextIOR format with character positions
      typeM3: TypeM3.CLASS,                // Default MOF classification (can be changed)
      indexPath: '',                       // Will be set when stored
      references: [],                      // ✅ Enhanced: Unified reference tracking
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.storage = new DefaultStorage();
    // Storage will be initialized with scenario in init() method
  }

  init(scenario: Scenario<UnitModel>): this {
    if (scenario.model) {
      this.model = scenario.model;
      // No state in UnitIndex model - state is requirement-like attribute
    }
    
    // Check for missing terminal identity and show warnings (backward compatibility)
    this.showTerminalIdentityWarning();
    
    // Initialize storage with scenario - Web4 pattern
    const storageScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.0.4' },
      owner: '',
      model: { uuid: crypto.randomUUID(), projectRoot: '', indexBaseDir: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    };
    this.storage.init(storageScenario);
    return this;
  }

  /**
   * Transform input data with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param data - Input data for transformation @cliSyntax json @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('data.json').transform(rules).validate(schema).execute();
   * ```
   */
  transform(data?: unknown): this {
    this.model.updatedAt = new Date().toISOString();
    
    // Store transformation result in unit for chaining
    (this.model as any).lastTransformation = {
      transformed: data,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Data transformed by unit: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Validate object with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param object - Object to validate @cliSyntax json @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('data.json').transform(rules).validate(schema).execute();
   * ```
   */
  validate(object?: any): this {
    this.model.updatedAt = new Date().toISOString();
    
    const isValid = object !== null && object !== undefined;
    
    // Store validation result in unit for chaining
    (this.model as any).lastValidation = {
      isValid: isValid,
      validatedObject: object,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Object ${isValid ? 'validated' : 'validation failed'} by unit: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Process data with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @returns this - Enables command chaining for fluent interface
   */
  process(): this {
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Unit processed: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Execute the complete command chain and finalize operations
   * Web4 pattern: Final execution method for command chaining completion
   * 
   * @returns Promise<void> - Resolves when all chained operations complete
   * @example
   * ```typescript
   * await unit.from('component.ts').linkInto('backup/').transform(rules).validate(schema).execute();
   * ```
   */
  async execute(): Promise<void> {
    try {
      // Save final unit state after all chained operations
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`🎯 Command chain executed successfully!`);
      console.log(`   Unit: ${this.model.name || 'Unnamed'} (${this.model.uuid})`);
      console.log(`   Operations completed: ${this.getExecutedOperations()}`);
      console.log(`   Final state saved to: ${this.model.indexPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to execute command chain: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Get list of executed operations in the command chain
   * @cliHide
   */
  private getExecutedOperations(): string {
    const operations: string[] = [];
    
    const extendedModel = this.model as any;
    if (extendedModel.lastTransformation) operations.push('transform');
    if (extendedModel.lastValidation) operations.push('validate');
    if (this.model.references?.length > 0) operations.push('link');
    
    return operations.join(' → ') || 'initialization';
  }

  async validateModel(): Promise<boolean> {
    // Comprehensive UnitModel validation
    try {
      // Required string properties
      if (!this.model.uuid || typeof this.model.uuid !== 'string') return false;
      if (!this.model.name || typeof this.model.name !== 'string') return false;
      if (!this.model.origin || typeof this.model.origin !== 'string') return false;
      if (!this.model.definition || typeof this.model.definition !== 'string') return false;
      if (!this.model.indexPath || typeof this.model.indexPath !== 'string') return false;
      
      // TypeM3 validation (optional field)
      if (this.model.typeM3 && !Object.values(TypeM3).includes(this.model.typeM3)) return false;
      
      // Array properties
      if (!Array.isArray(this.model.references)) return false;
      
      // Timestamp validation
      if (!this.model.createdAt || isNaN(Date.parse(this.model.createdAt))) return false;
      if (!this.model.updatedAt || isNaN(Date.parse(this.model.updatedAt))) return false;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    // Generate proper owner data
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Unit',
      version: '0.3.0.4'
    });

    const scenario: Scenario = {
      ior: {
        uuid: this.model.uuid,
        component: 'Unit',
        version: '0.3.0.4'
      },
      owner: ownerData, // Modern TypeScript - no Web2 btoa() shit
      model: this.model
    };

    // Save to central storage with LD links - create named link in current directory
    const currentDir = process.cwd();
    const linkFilename = name ? `${name}.unit` : `unit-${this.model.uuid.slice(0, 8)}`;
    const namedLink = `${currentDir}/${linkFilename}`;
    
    await this.storage.saveScenario(this.model.uuid, scenario, [namedLink]);
    
    // Add to namedLinks array if name provided - location should be relative path from link to scenario
    if (name) {
      // Get the actual relative path that was used to create the symlink
      const { relative, dirname } = await import('path');
      const { readlinkSync } = await import('fs');
      
      try {
        const relativePath = readlinkSync(namedLink);
        this.model.references.push({
          linkLocation: `ior:local:ln:file:${namedLink}`,
          linkTarget: `ior:unit:${this.model.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      } catch (error) {
        console.error('Failed to read symlink for namedLinks:', (error as Error).message);
      }
    }
    
    // Load the saved scenario to get the updated model with correct storage paths
    try {
      const savedScenario = await this.storage.loadScenario(this.model.uuid);
      const originalReferences = this.model.references; // Save references before overwriting
      this.model = savedScenario.model as any; // Update our model with storage-corrected paths
      
      // Restore references if we had them
      if (originalReferences && originalReferences.length > 0) {
        this.model.references = originalReferences;
        savedScenario.model = this.model;
        // Save the updated scenario with correct namedLinks
        await this.storage.saveScenario(this.model.uuid, savedScenario, [namedLink]);
        // Load again to get the final updated scenario
        const finalScenario = await this.storage.loadScenario(this.model.uuid) as Scenario<UnitModel>;
        this.model = finalScenario.model;
        return finalScenario;
      }
      
      return savedScenario as Scenario<UnitModel>; // Return the complete saved scenario with correct paths
    } catch (error) {
      console.error('Failed to load saved scenario:', (error as Error).message);
      return scenario as Scenario<UnitModel>; // Fallback to original scenario
    }
  }

  // Helper methods for Unit model management
  addExecutionCapability(capability: string): this {
    // Note: executionCapabilities removed in 0.3.0.5 (Occam's Razor)
    console.log(`Note: Execution capability '${capability}' noted (capabilities removed in 0.3.0.5)`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Testing helper method
  getModel(): UnitModel {
    return this.model;
  }

  /**
   * Extract UUID from scenario path
   * @cliHide
   */
  private extractUuidFromPath(scenarioPath: string): string {
    // Extract UUID from path like ../scenarios/index/a/b/c/d/e/uuid.scenario.json
    const pathParts = scenarioPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    return filename.replace('.scenario.json', '');
  }

  /**
   * Calculate relative path between directories
   * @cliHide
   */
  private async calculateRelativePath(fromPath: string, toPath: string): Promise<string> {
    const { relative } = await import('path');
    return relative(fromPath, toPath);
  }

  // Advanced CLI Commands (Task 19) - Direct method naming convention v0.1.2.2
  /**
   * Create initial link to existing component with unified parameter support
   * Web4 pattern: Union type interface supporting both UUIDv4 and file path parameters
   * 
   * @param identifier - Unit identifier (UUIDv4 instance or UUID string)
   * @param filename - File path for link creation (relative to project root)
   * @returns Promise<void> - Resolves when link creation completes
   * @throws Error when UUID invalid or filename inaccessible
   * @example
   * ```typescript
   * await unit.link(UUIDv4.from('44443290-015c-4720-be80-c42caf842252'), 'auth-validator.unit');
   * await unit.link('44443290-015c-4720-be80-c42caf842252', 'auth-validator.unit');
   * ```
   */
  async link(identifier: UnitIdentifier, filename: string): Promise<void> {
    try {
      // ✅ NEW: Extract UUID from union type parameter
      let uuid: string;
      if (isUUIDv4(identifier)) {
        uuid = identifier.toString();
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        uuid = identifier;
      } else {
        throw new Error(`Invalid UUID identifier: ${identifier}`);
      }
      
      // Convert multi-word filenames (spaces → single dots) for consistency
      const convertedFilename = filename.replace(/\s+/g, '.');
      
      // Create new LD link to existing unit in different location
      const currentDir = process.cwd();
      const linkPath = `${currentDir}/${convertedFilename}.unit`;
      
      // Load existing unit scenario
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Update scenario with new link
      existingScenario.model.references.push({
        linkLocation: `ior:local:ln:file:${linkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      
      // Create new LD link pointing to existing scenario
      const scenarioPath = existingScenario.model.indexPath;
      await this.storage.saveScenario(uuid, existingScenario, [linkPath]);
      
      console.log(`✅ Link created: ${convertedFilename}.unit → ${uuid}`);
      console.log(`   Target: ${scenarioPath}`);
    } catch (error) {
      console.error(`Failed to create link: ${(error as Error).message}`);
    }
  }

  /**
   * Create link to unit in target folder with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param unit - Unit reference (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param folder - Target directory (relative to project root) @cliSyntax folder
   * @param originalUnit - Optional original unit reference for copy tracking @cliSyntax uuid|lnfile @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @throws Error when unit invalid or folder inaccessible
   * @example
   * ```typescript
   * await unit.linkInto('44443290-015c-4720-be80-c42caf842252', 'backup/').transform(data).execute();
   * await unit.linkInto('TSCompletion.ts.unit', 'backup/').validate(rules).execute();
   * ```
   */
  async linkInto(unit: UnitIdentifier, folder: string, originalUnit?: UnitIdentifier): Promise<this> {
    try {
      const { promises: fs } = await import('fs');
      const { resolve, basename } = await import('path');
      
      let uuid: string;
      let linkFilename: string;
      
      // ✅ UNIFIED: Extract UUID from unit parameter
      if (isUUIDv4(unit)) {
        uuid = unit.toString();
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string' && this.isUUID(unit)) {
        uuid = unit;
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string') {
        // File path - extract UUID and preserve filename
        const { readlinkSync } = await import('fs');
        const currentDir = process.cwd();
        const existingLinkPath = resolve(currentDir, unit);
        
        const scenarioPath = readlinkSync(existingLinkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        linkFilename = basename(unit);
      } else {
        throw new Error(`Invalid unit identifier: ${unit}`);
      }
      
      // Load unit scenario
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Create new link in target folder
      const targetPath = resolve(folder);
      const newLinkPath = `${targetPath}/${linkFilename}`;
      
      // Create directory if it doesn't exist
      await fs.mkdir(targetPath, { recursive: true });
      
      // Create symbolic link to scenario
      const relativePath = await this.calculateRelativePath(targetPath, scenario.model.indexPath);
      await fs.symlink(relativePath, newLinkPath);
      
      // Update scenario model with new link reference
      scenario.model.references.push({
        linkLocation: `ior:local:ln:file:${newLinkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      scenario.model.updatedAt = new Date().toISOString();
      
      // ✅ UNIFIED: Handle optional copy tracking
      if (originalUnit) {
        // Copy tracking logic
        let originalUUID: string;
        
        if (isUUIDv4(originalUnit)) {
          originalUUID = originalUnit.toString();
        } else if (typeof originalUnit === 'string' && this.isUUID(originalUnit)) {
          originalUUID = originalUnit;
        } else if (typeof originalUnit === 'string') {
          // Extract UUID from original unit file
          const { readlinkSync } = await import('fs');
          const currentDir = process.cwd();
          const originalLinkPath = resolve(currentDir, originalUnit);
          const originalScenarioPath = readlinkSync(originalLinkPath);
          originalUUID = this.extractUuidFromPath(originalScenarioPath);
        } else {
          throw new Error(`Invalid original unit identifier: ${originalUnit}`);
        }
        
        // Add copy reference to original unit
        const copyIOR = await this.generateSimpleIOR(newLinkPath);
        const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
        
        originalScenario.model.references.push({
          linkLocation: copyIOR,
          linkTarget: `ior:unit:${originalUUID}`,
          syncStatus: SyncStatus.SYNCED
        });
        originalScenario.model.updatedAt = new Date().toISOString();
        
        await this.storage.saveScenario(originalUUID, originalScenario, []);
        
        console.log(`✅ Copy reference added to original unit: ${originalUUID}`);
      }
      
      // Save updated scenario
      await this.storage.saveScenario(uuid, scenario, []);
      
      console.log(`✅ Link created in target folder: ${linkFilename}`);
      console.log(`   Unit: ${scenario.model.name} (${uuid})`);
      console.log(`   Target: ${newLinkPath}`);
      console.log(`   Copy tracking: ${originalUnit ? 'enabled' : 'disabled'}`);
      console.log(`   References: ${scenario.model.references.length}`);
      
      // ✅ COMMAND CHAINING: Return this for fluent interface
      return this;
    } catch (error) {
      console.error(`❌ Failed to create link: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Create link with copy tracking and enhanced parameter support
   * Web4 pattern: Unified interface supporting both UUID and ln file parameters with copy tracking
   * 
   * @param uuidOrLnFile - Unit UUID (36-character) or existing ln file path
   * @param targetFolder - Target directory for link creation (relative to project root)
   * @param originalUnitUUID - Optional original unit UUID for copy reference tracking
   * @returns Promise<void> - Resolves when link creation and copy tracking completes
   * @throws Error when UUID/file invalid or target folder inaccessible
   * @example
   * ```typescript
   * await unit.linkIntoCopy('44443290-015c-4720-be80-c42caf842252', 'components/backup/', 'original-uuid');
   * await unit.linkIntoCopy('TSCompletion.ts.unit', 'components/backup/', 'original-uuid');
   * ```
   */
  async linkIntoCopy(uuidOrLnFile: string, targetFolder: string, originalUnitUUID?: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const { resolve, basename } = await import('path');
      
      let uuid: string;
      let linkFilename: string;
      
      // Determine if parameter is UUID or ln file
      if (this.isUUID(uuidOrLnFile)) {
        // Parameter is UUID - use unit name for filename
        uuid = uuidOrLnFile;
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else {
        // Parameter is ln file - extract UUID and preserve filename
        const { readlinkSync } = await import('fs');
        const currentDir = process.cwd();
        const existingLinkPath = resolve(currentDir, uuidOrLnFile);
        
        // Extract UUID from existing link
        const scenarioPath = readlinkSync(existingLinkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        linkFilename = basename(uuidOrLnFile);
      }
      
      // Load unit scenario
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Create new link in target folder
      const targetPath = resolve(targetFolder);
      const newLinkPath = `${targetPath}/${linkFilename}`;
      
      // Create directory if it doesn't exist
      await fs.mkdir(targetPath, { recursive: true });
      
      // Create symbolic link to scenario
      const relativePath = await this.calculateRelativePath(targetPath, scenario.model.indexPath);
      await fs.symlink(relativePath, newLinkPath);
      
      // Update scenario model with new link reference
      scenario.model.references.push({
        linkLocation: `ior:local:ln:file:${newLinkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      scenario.model.updatedAt = new Date().toISOString();
      
      // If original unit UUID provided, add copy reference tracking
      if (originalUnitUUID) {
        const copyIOR = await this.generateSimpleIOR(newLinkPath);
        const originalScenario = await this.storage.loadScenario(originalUnitUUID) as Scenario<UnitModel>;
        
        // Add copy reference to original unit
        originalScenario.model.references.push({
          linkLocation: copyIOR,
          linkTarget: `ior:unit:${originalUnitUUID}`,
          syncStatus: SyncStatus.SYNCED
        });
        originalScenario.model.updatedAt = new Date().toISOString();
        
        // Save original unit with copy reference
        await this.storage.saveScenario(originalUnitUUID, originalScenario, []);
        
        console.log(`✅ Copy reference added to original unit: ${originalUnitUUID}`);
      }
      
      // Save updated scenario
      await this.storage.saveScenario(uuid, scenario, []);
      
      console.log(`✅ Link with copy tracking created: ${linkFilename}`);
      console.log(`   Unit: ${scenario.model.name} (${uuid})`);
      console.log(`   Target: ${newLinkPath}`);
      console.log(`   Copy tracking: ${originalUnitUUID ? 'enabled' : 'disabled'}`);
      console.log(`   References: ${scenario.model.references.length}`);
      
    } catch (error) {
      console.error(`❌ Failed to create link with copy tracking: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Delete specific link file with unified parameter support
   * Web4 pattern: Union type interface supporting both UUID and file path parameters
   * 
   * @param identifier - Unit identifier (UUID string) or link file path
   * @returns Promise<void> - Resolves when link deletion completes
   * @throws Error when identifier invalid or link not found
   * @example
   * ```typescript
   * await unit.deleteLink('44443290-015c-4720-be80-c42caf842252');
   * await unit.deleteLink('TSCompletion.ts.unit');
   * ```
   */
  async deleteLink(identifier: UnitIdentifier): Promise<void> {
    try {
      // ✅ NEW: Handle unified parameter types
      let uuid: string;
      let linkPath: string;
      
      if (isUUIDv4(identifier)) {
        // UUIDv4 instance - find link by UUID
        uuid = identifier.toString();
        // Need to find the link file for this UUID (implementation needed)
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        // UUID string - find link by UUID
        uuid = identifier;
        // Need to find the link file for this UUID (implementation needed)
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string') {
        // File path - use as link file
        const { readlinkSync, unlinkSync } = await import('fs');
        const currentDir = process.cwd();
        linkPath = `${currentDir}/${identifier}`;
        
        // Read the symlink to get scenario path
        const scenarioPath = readlinkSync(linkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        
        // Load unit scenario
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        
        // Remove from references
        const referenceIndex = scenario.model.references.findIndex(
          ref => ref.linkLocation.includes(identifier)
        );
        if (referenceIndex > -1) {
          scenario.model.references.splice(referenceIndex, 1);
        }
        
        // Update scenario in storage
        await this.storage.saveScenario(uuid, scenario, []);
        
        // Remove the actual link file
        unlinkSync(linkPath);
        
        console.log(`✅ Link deleted: ${identifier}`);
      } else {
        throw new Error(`Invalid identifier for deletion: ${identifier}`);
      }
      console.log(`   Unit ${uuid} preserved in central storage`);
      console.log(`   Remaining links: ${[].length}`);
    } catch (error) {
      console.error(`Failed to delete link: ${(error as Error).message}`);
    }
  }

  async deleteUnit(linkFilename: string): Promise<void> {
    try {
      // Resolve link file to get target UUID
      const { readlinkSync, unlinkSync } = await import('fs');
      const { unlink } = await import('fs/promises');
      const currentDir = process.cwd();
      const linkPath = `${currentDir}/${linkFilename}`;
      
      // Read the symlink to get scenario path
      const scenarioPath = readlinkSync(linkPath);
      const uuid = this.extractUuidFromPath(scenarioPath);
      
      // Load unit scenario to get all links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Delete all LD link files
      let deletedLinks = 0;
      for (const symlinkPath of []) {
        try {
          unlinkSync(symlinkPath);
          deletedLinks++;
          console.log(`   Deleted link: ${symlinkPath}`);
        } catch (error) {
          console.warn(`   Warning: Could not delete link ${symlinkPath}: ${(error as Error).message}`);
        }
      }
      
      // Delete the unit scenario from central storage
      const scenarioFullPath = scenario.model.indexPath;
      await unlink(scenarioFullPath);
      
      console.log(`✅ Unit deleted completely: ${uuid}`);
      console.log(`   Scenario removed: ${scenarioFullPath}`);
      console.log(`   Links deleted: ${deletedLinks}/${[].length}`);
      console.log(`   References removed: ${scenario.model.references.length}`);
    } catch (error) {
      console.error(`Failed to delete unit: ${(error as Error).message}`);
    }
  }

  /**
   * List all links pointing to specific component with unified parameter support
   * Web4 pattern: Union type interface supporting both UUID and file path parameters
   * 
   * @param identifier - Unit identifier (UUID string) or link file path
   * @returns Promise<void> - Resolves when link listing completes
   * @throws Error when identifier invalid or unit not found
   * @example
   * ```typescript
   * await unit.list('44443290-015c-4720-be80-c42caf842252');
   * await unit.list('TSCompletion.ts.unit');
   * ```
   */
  async list(identifier: UnitIdentifier): Promise<void> {
    try {
      // ✅ NEW: Extract UUID from unified parameter
      let uuid: string;
      
      if (isUUIDv4(identifier)) {
        uuid = identifier.toString();
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        uuid = identifier;
      } else if (typeof identifier === 'string') {
        // File path - extract UUID from link
        const { readlinkSync } = await import('fs');
        const { resolve } = await import('path');
        const currentDir = process.cwd();
        const linkPath = resolve(currentDir, identifier);
        const scenarioPath = readlinkSync(linkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
      } else {
        throw new Error(`Invalid identifier for listing: ${identifier}`);
      }
      
      // Load unit scenario and list all LD links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`LD Links for Unit ${uuid}:`);
      // Note: Legacy symlinkPaths display removed in 0.3.0.5 (pure references array)
      
      if (scenario.model.references && scenario.model.references.length > 0) {
        console.log(`References:`);
        scenario.model.references.forEach((ref: any) => {
          const filename = ref.linkLocation.split('/').pop() || 'unknown';
          console.log(`  - ${filename} → ${ref.linkTarget} (${ref.syncStatus})`);
        });
      }
    } catch (error) {
      console.error(`Failed to list links: ${(error as Error).message}`);
    }
  }

  // Method overloads for different parameter sets (Decision 5b)
  /**
   * Create unit from file with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param filename - Source file path @cliSyntax file
   * @param startPos - Start position for word-in-file @cliSyntax position @cliOptional
   * @param endPos - End position for word-in-file @cliSyntax position @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('component.ts').linkInto('backup/').transform(data).execute();
   * await unit.from('file.ts', '1,1', '10,20').validate(rules).execute();
   * ```
   */
  async from(filename: string): Promise<this>;
  async from(filename: string, startPos: string, endPos: string): Promise<this>;
  async from(filename: string, startPos?: string, endPos?: string): Promise<this> {
    try {
      // Automatic detection based on parameters (Decision 4a)
      if (startPos && endPos) {
        // Word-in-file mode: GitTextIOR with positions
        await this.createFromWordInFile(filename, startPos, endPos);
      } else {
        // Complete file mode: Simple ior:url reference
        await this.createFromCompleteFile(filename);
      }
      
      // ✅ COMMAND CHAINING: Return this for fluent interface
      return this;
    } catch (error) {
      console.error(`Failed to create unit from file: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create unit from word-in-file with GitTextIOR (precise positioning)
   */
  private async createFromWordInFile(filename: string, startPos: string, endPos: string): Promise<void> {
    const { promises: fs } = await import('fs');
    const { GitTextIOR } = await import('./GitTextIOR.js');
    
    // Read file content
    const fileContent = await fs.readFile(filename, 'utf-8');
    const lines = fileContent.split('\n');
    
    // Parse positions (line:column format)
    const [startLine, startCol] = startPos.split(':').map(Number);
    const [endLine, endCol] = endPos.split(':').map(Number);
    
    // Extract text from specified range
    let extractedText = '';
    for (let i = startLine - 1; i <= endLine - 1; i++) {
      if (i === startLine - 1 && i === endLine - 1) {
        // Same line
        extractedText = lines[i].substring(startCol - 1, endCol);
      } else if (i === startLine - 1) {
        // Start line
        extractedText += lines[i].substring(startCol - 1) + '\n';
      } else if (i === endLine - 1) {
        // End line
        extractedText += lines[i].substring(0, endCol);
      } else {
        // Middle lines
        extractedText += lines[i] + '\n';
      }
    }
    
    // Extract unit name from text (first word or identifier)
    const nameMatch = extractedText.match(/\b[A-Za-z][A-Za-z0-9_]*\b/);
    const unitName = nameMatch ? nameMatch[0] : 'ExtractedUnit';
    
    // Create GitTextIOR for origin with absolute path
    const gitIOR = new GitTextIOR();
    const { resolve } = await import('path');
    const absolutePath = resolve(filename);
    const relativePath = absolutePath.replace('/workspace/', '');
    const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
    const originIOR = gitIOR.parse(gitUrl);
    
    // Set terminal identity
    this.setTerminalIdentity(unitName, originIOR, '');
    
    console.log(`✅ Unit created from word-in-file: ${unitName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin GitTextIOR: ${originIOR}`);
    console.log(`   Extracted from: ${filename} (${startPos}-${endPos})`);
  }

  /**
   * Create unit from complete file with simple ior:url reference
   */
  private async createFromCompleteFile(filename: string): Promise<void> {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // Generate simple IOR from file (Decision 4a)
    const originIOR = await this.generateSimpleIOR(filename);
    
    // Extract file name for unit name
    const fileName = path.basename(filename, path.extname(filename));
    
    // Analyze file type for TypeM3 classification
    const extension = path.extname(filename);
    if (extension === '.ts' || extension === '.js') {
      this.model.typeM3 = TypeM3.CLASS;
    } else if (extension === '.md' || extension === '.txt') {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    } else {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    }
    
    // Update unit model
    this.model.name = fileName;
    this.model.origin = originIOR;
    this.model.definition = originIOR; // Same as origin for complete files
    this.model.updatedAt = new Date().toISOString();
    
    // Store unit
    await this.storage.saveScenario(this.model.uuid, await this.toScenario(), []);
    
    console.log(`✅ Unit created from complete file: ${fileName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin IOR: ${originIOR}`);
    console.log(`   File: ${filename}`);
    console.log(`   TypeM3: ${this.model.typeM3}`);
  }


  /**
   * Generate simple IOR format: ior:giturlFromFile
   */
  private async generateSimpleIOR(filePath: string): Promise<string> {
    // Simple IOR format as requested
    const projectRoot = this.findProjectRoot();
    const path = await import('path');
    const relativePath = path.relative(projectRoot, filePath);
    
    return `ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}`;
  }

  /**
   * Check if origin has changed and sync is needed
   */
  private async checkOriginSync(): Promise<{ needsSync: boolean; changes: string[] }> {
    try {
      const { promises: fs } = await import('fs');
      
      if (!this.model.origin) {
        return { needsSync: false, changes: [] };
      }
      
      // Extract file path from IOR
      const filePath = this.extractFilePathFromIOR(this.model.origin);
      if (!filePath) {
        return { needsSync: false, changes: ['Cannot extract file path from IOR'] };
      }
      
      // Check if file exists and get modification time
      const stats = await fs.stat(filePath);
      const fileModTime = stats.mtime;
      const unitModTime = new Date(this.model.updatedAt);
      
      const needsSync = fileModTime > unitModTime;
      const changes = needsSync ? [`File modified: ${fileModTime.toISOString()} > Unit: ${unitModTime.toISOString()}`] : [];
      
      return { needsSync, changes };
      
    } catch (error) {
      return { needsSync: false, changes: [`Error checking sync: ${(error as Error).message}`] };
    }
  }

  /**
   * Extract file path from IOR format
   */
  private extractFilePathFromIOR(ior: string): string | null {
    // Parse ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/path
    const match = ior.match(/ior:git:github\.com\/Cerulean-Circle-GmbH\/Web4Articles\/blob\/dev\/once0304\/(.+)/);
    return match ? match[1] : null;
  }

  async definition(uuid: string, filename: string, startPos: string, endPos: string): Promise<void> {
    try {
      // Add definition source reference to existing unit
      const { GitTextIOR } = await import('./GitTextIOR.js');
      
      // Create GitTextIOR for definition with absolute path
      const gitIOR = new GitTextIOR();
      const { resolve } = await import('path');
      const absolutePath = resolve(filename);
      const relativePath = absolutePath.replace('/workspace/', '');
      const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
      const definitionIOR = gitIOR.parse(gitUrl);
      
      // Load existing unit
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Update definition
      existingScenario.model.definition = definitionIOR;
      
      // Save updated scenario
      await this.storage.saveScenario(uuid, existingScenario, []);
      
      console.log(`✅ Definition added to unit: ${uuid}`);
      console.log(`   Definition: ${definitionIOR}`);
      console.log(`   Source: ${filename} (${startPos}-${endPos})`);
    } catch (error) {
      console.error(`Failed to add definition: ${(error as Error).message}`);
    }
  }

  async origin(uuid: string): Promise<void> {
    try {
      // Display dual links to origin and definition as clickable URLs
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`Unit ${scenario.model.name || uuid} Source References:`);
      console.log('');
      
      if (scenario.model.origin) {
        const originUrl = scenario.model.origin.replace('ior:git:text:', '');
        console.log(`Origin: ${originUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Origin: not specified');
      }
      
      console.log('');
      
      if (scenario.model.definition) {
        const definitionUrl = scenario.model.definition.replace('ior:git:text:', '');
        console.log(`Definition: ${definitionUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Definition: not specified');
      }
      
      console.log('');
    } catch (error) {
      console.error(`Failed to show origin: ${(error as Error).message}`);
    }
  }

  // Terminal Identity (uni-t) methods
  setTerminalIdentity(name: string, origin: string, definition: string): this {
    this.model.name = name;
    this.model.origin = origin;
    this.model.definition = definition;
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  validateTerminalIdentity(): { isComplete: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.model.name || this.model.name.trim() === '') {
      missing.push('name');
    }
    if (!this.model.origin || this.model.origin.trim() === '') {
      missing.push('origin');
    }
    if (!this.model.definition || this.model.definition.trim() === '') {
      missing.push('definition');
    }

    return {
      isComplete: missing.length === 0,
      missing
    };
  }

  showTerminalIdentityWarning(): void {
    const validation = this.validateTerminalIdentity();
    if (!validation.isComplete) {
      console.warn(`⚠️  Warning: Unit '${this.model.uuid}' missing terminal identity information:`);
      validation.missing.forEach(field => {
        console.warn(`   - ${field}: not specified`);
      });
      console.warn('');
      console.warn('   Next build version will require migration method for missing model info.');
      console.warn('   Please update unit with complete terminal identity (uni-t) attributes.');
    }
  }

  addStorageCapability(capability: string): this {
    // Note: storageCapabilities removed in 0.3.0.5 (Occam's Razor)
    console.log(`Note: Storage capability '${capability}' noted (capabilities removed in 0.3.0.5)`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Speaking name resolution methods (Decision 2a - in DefaultUnit)
  private async resolveSpeakingName(speakingName: string): Promise<string | null> {
    try {
      // TODO: Implement speaking name to UUID resolution
      // For now, return null - will be implemented with LD links system
      return null;
    } catch (error) {
      console.warn(`Failed to resolve speaking name ${speakingName}: ${(error as Error).message}`);
      return null;
    }
  }

  async addSpeakingName(speakingName: string): Promise<void> {
    try {
      // Add speaking name link for this unit - will be implemented when storage methods are Web4 compliant
      console.log(`✅ Speaking name to add: ${speakingName} -> ${this.model.uuid}`);
    } catch (error) {
      throw new Error(`Failed to add speaking name: ${(error as Error).message}`);
    }
  }

  async removeSpeakingName(speakingName: string): Promise<void> {
    try {
      // Remove speaking name link for this unit - will be implemented when storage methods are Web4 compliant
      console.log(`✅ Speaking name to remove: ${speakingName}`);
    } catch (error) {
      throw new Error(`Failed to remove speaking name: ${(error as Error).message}`);
    }
  }

  private findProjectRoot(): string {
    let currentDir = process.cwd();
    
    while (currentDir !== '/') {
      try {
        // Modern ESM approach - use existsSync from fs import
        if (existsSync(`${currentDir}/scenarios`)) {
          return currentDir;
        }
        currentDir = dirname(currentDir);
      } catch {
        currentDir = dirname(currentDir);
      }
    }
    return process.cwd();
  }

  /**
   * Upgrade unit model to target version
   * Radical OOP: Method implementation of Upgrade interface
   * Modern TypeScript: ESM imports, type safety, class-based pattern
   */
  async upgrade(targetVersion: string): Promise<boolean> {
    try {
      if (targetVersion === '0.3.0.5') {
        return await this.upgradeToVersion035();
      }
      
      throw new Error(`Unsupported upgrade target version: ${targetVersion}`);
    } catch (error) {
      console.error(`Upgrade failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Upgrade from 0.3.0.4 to 0.3.0.5 model
   * Transforms symlinkPaths + namedLinks to unified references array
   * Keeps existing IOR string format for compatibility
   */
  private async upgradeToVersion035(): Promise<boolean> {
    const currentModel = this.model as any; // Cast for 0.3.0.4 compatibility
    
    // Transform to enhanced 0.3.0.5 model
    const enhancedModel: UnitModel = {
      uuid: currentModel.uuid,
      name: currentModel.name,
      origin: currentModel.origin || '',           // ✅ UNCHANGED: IOR string format
      definition: currentModel.definition || '',   // ✅ UNCHANGED: IOR string format
      typeM3: currentModel.typeM3,
      indexPath: currentModel.indexPath,
      
      // ✅ ENHANCED: Transform arrays to unified references
      references: this.transformArraysToReferences(currentModel),
      
      createdAt: currentModel.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Update internal model
    this.model = enhancedModel;
    
    // Save enhanced scenario with version update
    const scenario = await this.toScenario();
    scenario.ior.version = '0.3.0.5';
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit upgraded to 0.3.0.5: ${this.model.uuid}`);
    return true;
  }

  /**
   * Transform old arrays to unified references (0.3.0.4 → 0.3.0.5)
   * Uses existing IOR string format for compatibility
   */
  private transformArraysToReferences(currentModel: any): UnitReference[] {
    const references: UnitReference[] = [];
    
    // Convert symlinkPaths to references
    if (currentModel.symlinkPaths) {
      for (const path of currentModel.symlinkPaths) {
        references.push({
          linkLocation: `ior:local:ln:file:${path}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    // Convert namedLinks to references
    if (currentModel.namedLinks) {
      for (const link of currentModel.namedLinks) {
        const absolutePath = this.resolveLinkPath(link.location, link.filename);
        references.push({
          linkLocation: `ior:local:ln:file:${absolutePath}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    return references;
  }

  // ❌ REMOVED: Legacy symlinks compatibility methods (migration successful)

  /**
   * Resolve link path from location and filename (0.3.0.4 compatibility)
   */
  private resolveLinkPath(location: string, filename: string): string {
    const baseDir = location.replace('../scenarios/', '/workspace/scenarios/');
    return `${dirname(baseDir)}/${filename}`;
  }

  /**
   * Rename a unit link file and update all references in the unit model
   * Web4 pattern: IOR-based reference updating with file system synchronization
   * 
   * @param oldLinkPath - Current link file path (relative to project root)
   * @param newLinkPath - New link file path (relative to project root)
   * @returns Promise<void> - Resolves when link rename and reference updates complete
   * @throws Error when old link doesn't exist or new link path is invalid
   * @example
   * ```typescript
   * await unit.renameLink('TSCompletion.unit', 'TSCompletion.ts.unit');
   * ```
   */
  async renameLink(oldLinkPath: string, newLinkPath: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      // Resolve absolute paths
      const projectRoot = this.findProjectRoot();
      const oldAbsolutePath = path.resolve(projectRoot, oldLinkPath);
      const newAbsolutePath = path.resolve(projectRoot, newLinkPath);
      
      // Check if old link exists
      if (!existsSync(oldAbsolutePath)) {
        throw new Error(`Link file not found: ${oldLinkPath}`);
      }
      
      // Rename the physical file
      await fs.rename(oldAbsolutePath, newAbsolutePath);
      
      // Update references in unit model
      if (this.model.references) {
        for (const reference of this.model.references) {
          // Update linkLocation if it matches the old path
          if (reference.linkLocation.includes(oldLinkPath)) {
            reference.linkLocation = reference.linkLocation.replace(oldLinkPath, newLinkPath);
          }
        }
      }
      
      // Update model timestamp
      this.model.updatedAt = new Date().toISOString();
      
      // Save updated model
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`✅ Link renamed: ${oldLinkPath} → ${newLinkPath}`);
      console.log(`   References updated in unit model: ${this.model.uuid}`);
      
    } catch (error) {
      console.error(`❌ Failed to rename link: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Rename the unit and update all associated file references and paths
   * Web4 pattern: Comprehensive name change with IOR reference updating
   * Updates unit name, file paths, link names, and all references containing the old name
   * 
   * @param newName - New name for the unit (kebab-case preferred)
   * @returns Promise<void> - Resolves when unit rename and all reference updates complete
   * @throws Error when new name is invalid or conflicts exist
   * @example
   * ```typescript
   * await unit.rename('ts-completion-enhanced');
   * ```
   */
  async rename(newName: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      if (!newName || newName.trim().length === 0) {
        throw new Error('New name cannot be empty');
      }
      
      const oldName = this.model.name;
      const projectRoot = this.findProjectRoot();
      
      // Update unit model name
      this.model.name = newName.trim();
      this.model.updatedAt = new Date().toISOString();
      
      // Update references that contain the old name
      if (this.model.references) {
        for (const reference of this.model.references) {
          // Update linkLocation paths that contain old name
          if (reference.linkLocation.includes(oldName)) {
            reference.linkLocation = reference.linkLocation.replace(
              new RegExp(oldName, 'g'), 
              newName
            );
          }
        }
      }
      
      // Update origin and definition IORs if they contain the old name
      if (this.model.origin && this.model.origin.includes(oldName)) {
        this.model.origin = this.model.origin.replace(
          new RegExp(oldName, 'g'), 
          newName
        );
      }
      
      if (this.model.definition && this.model.definition.includes(oldName)) {
        this.model.definition = this.model.definition.replace(
          new RegExp(oldName, 'g'), 
          newName
        );
      }
      
      // Find and rename associated files that include the old name
      const potentialFiles = [
        `${oldName}.unit`,
        `${oldName}.ts.unit`,
        `${oldName}.link`,
        `${oldName}.ts`,
        `${oldName}.js`
      ];
      
      // Search for files in the project that might need renaming
      const filesToRename: Array<{oldPath: string, newPath: string}> = [];
      
      // Check common locations for unit-related files
      const searchDirs = [
        'components',
        'scenarios',
        'scrum.pmo',
        'docs'
      ];
      
      for (const dir of searchDirs) {
        const dirPath = path.resolve(projectRoot, dir);
        if (existsSync(dirPath)) {
          await this.findFilesToRename(dirPath, oldName, newName, filesToRename);
        }
      }
      
      // Rename found files
      for (const {oldPath, newPath} of filesToRename) {
        try {
          await fs.rename(oldPath, newPath);
          console.log(`✅ File renamed: ${path.relative(projectRoot, oldPath)} → ${path.relative(projectRoot, newPath)}`);
        } catch (error) {
          console.warn(`⚠️  Could not rename file: ${oldPath} (${error instanceof Error ? error.message : error})`);
        }
      }
      
      // Save updated model
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`✅ Unit renamed: "${oldName}" → "${newName}"`);
      console.log(`   UUID: ${this.model.uuid}`);
      console.log(`   References updated: ${this.model.references?.length || 0}`);
      
    } catch (error) {
      console.error(`❌ Failed to rename unit: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Recursively find files that contain the old name and should be renamed
   * Helper method for comprehensive unit renaming
   */
  private async findFilesToRename(
    dirPath: string, 
    oldName: string, 
    newName: string, 
    filesToRename: Array<{oldPath: string, newPath: string}>
  ): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively search subdirectories
          await this.findFilesToRename(fullPath, oldName, newName, filesToRename);
        } else if (entry.isFile()) {
          // Check if filename contains old name
          if (entry.name.includes(oldName)) {
            const newFileName = entry.name.replace(new RegExp(oldName, 'g'), newName);
            const newPath = path.join(dirPath, newFileName);
            filesToRename.push({
              oldPath: fullPath,
              newPath: newPath
            });
          }
        }
      }
    } catch (error) {
      // Continue search even if some directories are inaccessible
      console.warn(`⚠️  Could not search directory: ${dirPath}`);
    }
  }

  /**
   * Check if string is a valid UUID format
   * Helper method for parameter type detection
   */
  private isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Convert unit name to filename with 0.3.0.4 perfected standards
   * Web4 pattern: Spaces to dots, preserve capitalization, safe filename characters
   * 
   * @param name - Unit name to convert
   * @returns Filename-safe string with spaces converted to dots (0.3.0.4 standard)
   * @example
   * ```typescript
   * convertNameToFilename("UUID Indexing") // returns "UUID.Indexing"
   * convertNameToFilename("Async Method Signature Update") // returns "Async.Method.Signature.Update"
   * convertNameToFilename("TSCompletion") // returns "TSCompletion"
   * ```
   */
  private convertNameToFilename(name: string): string {
    if (!name) return 'unnamed';
    
    return name
      .replace(/\s+/g, '.')            // ✅ CORRECT: Replace spaces with dots
      .replace(/[^A-Za-z0-9.-]/g, '')  // ✅ CORRECT: Keep uppercase letters (0.3.0.4 standard)
      .replace(/\.+/g, '.')            // ✅ CORRECT: Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '');      // ✅ CORRECT: Remove leading/trailing dots
  }

  /**
   * Detect changes in copy files and notify origin units
   * Web4 pattern: Bidirectional sync architecture with change propagation
   * 
   * @param copyPath - Path to copy file to check for changes
   * @param originalUUID - UUID of original unit to notify
   * @returns Promise<ChangeStatus> - Status of change detection
   * @example
   * ```typescript
   * const status = await unit.detectCopyChanges('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async detectCopyChanges(copyPath: string, originalUUID: string): Promise<string> {
    try {
      const { promises: fs } = await import('fs');
      
      // Get copy file stats
      const copyStats = await fs.stat(copyPath);
      
      // Load original unit to compare
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        return 'NO_ORIGIN';
      }
      
      // Get original file stats
      const originalStats = await fs.stat(originalPath);
      
      // Compare modification times
      if (copyStats.mtime > originalStats.mtime) {
        // Copy is newer - notify origin
        await this.notifyOriginOfCopyChange(originalUUID, copyPath, 'COPY_NEWER');
        return 'COPY_NEWER';
      } else if (originalStats.mtime > copyStats.mtime) {
        // Origin is newer - recommend sync
        console.log(`📢 Copy sync recommended: ${copyPath}`);
        console.log(`   Origin is newer: ${originalPath}`);
        return 'ORIGIN_NEWER';
      }
      
      return 'SYNCHRONIZED';
      
    } catch (error) {
      console.error(`❌ Failed to detect copy changes: ${error instanceof Error ? error.message : error}`);
      return 'ERROR';
    }
  }

  /**
   * Notify origin unit of copy changes
   * Web4 pattern: Origin notification with sync recommendations
   * 
   * @param originalUUID - UUID of original unit to notify
   * @param copyPath - Path to modified copy file
   * @param changeType - Type of change detected
   * @returns Promise<void> - Resolves when notification completes
   */
  async notifyOriginOfCopyChange(originalUUID: string, copyPath: string, changeType: string): Promise<void> {
    try {
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      
      // Find copy reference in original unit
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath) || ref.linkLocation.includes(copyPath.replace(/.*\//, ''))
      );
      
      if (copyReference) {
        // Update sync status to indicate change
        copyReference.syncStatus = SyncStatus.MODIFIED;
        
        // Add notification metadata to model (extend with any for flexibility)
        const extendedModel = originalScenario.model as any;
        if (!extendedModel.notifications) {
          extendedModel.notifications = [];
        }
        
        extendedModel.notifications.push({
          type: 'COPY_CHANGE',
          copyPath: copyPath,
          changeType: changeType,
          timestamp: new Date().toISOString(),
          syncRecommended: true
        });
        
        originalScenario.model.updatedAt = new Date().toISOString();
        
        // Save updated original unit
        await this.storage.saveScenario(originalUUID, originalScenario, []);
        
        console.log(`📢 Origin notified of copy change: ${originalUUID}`);
        console.log(`   Copy: ${copyPath}`);
        console.log(`   Change: ${changeType}`);
        console.log(`   Sync recommended: Use 'unit syncFromCopy' to update origin`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to notify origin: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Sync origin from modified copy file
   * Web4 pattern: Bidirectional sync with copy-to-origin propagation
   * 
   * @param copyPath - Path to modified copy file
   * @param originalUUID - UUID of original unit to update
   * @returns Promise<void> - Resolves when sync completes
   * @throws Error when sync fails or conflicts detected
   * @example
   * ```typescript
   * await unit.syncFromCopy('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async syncFromCopy(copyPath: string, originalUUID: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      
      // Load original unit
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        throw new Error('Original file path not found in origin IOR');
      }
      
      // Copy the modified file back to origin
      await fs.copyFile(copyPath, originalPath);
      
      // Update sync status in references
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath)
      );
      
      if (copyReference) {
        copyReference.syncStatus = SyncStatus.SYNCED;
      }
      
      // Clear notifications
      const extendedModel = originalScenario.model as any;
      if (extendedModel.notifications) {
        extendedModel.notifications = extendedModel.notifications.filter((n: any) => 
          n.type !== 'COPY_CHANGE' || !n.copyPath.includes(copyPath)
        );
      }
      
      originalScenario.model.updatedAt = new Date().toISOString();
      
      // Save updated original unit
      await this.storage.saveScenario(originalUUID, originalScenario, []);
      
      console.log(`✅ Origin synced from copy: ${originalUUID}`);
      console.log(`   Copy: ${copyPath}`);
      console.log(`   Origin: ${originalPath}`);
      console.log(`   Status: SYNCED`);
      
    } catch (error) {
      console.error(`❌ Failed to sync from copy: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Sync copy from updated origin file
   * Web4 pattern: Bidirectional sync with origin-to-copy propagation
   * 
   * @param copyPath - Path to copy file to update
   * @param originalUUID - UUID of original unit to sync from
   * @returns Promise<void> - Resolves when sync completes
   * @throws Error when sync fails or conflicts detected
   * @example
   * ```typescript
   * await unit.syncToCopy('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async syncToCopy(copyPath: string, originalUUID: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      
      // Load original unit
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        throw new Error('Original file path not found in origin IOR');
      }
      
      // Copy the original file to copy location
      await fs.copyFile(originalPath, copyPath);
      
      // Update sync status in references
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath)
      );
      
      if (copyReference) {
        copyReference.syncStatus = SyncStatus.SYNCED;
      }
      
      originalScenario.model.updatedAt = new Date().toISOString();
      
      // Save updated original unit
      await this.storage.saveScenario(originalUUID, originalScenario, []);
      
      console.log(`✅ Copy synced from origin: ${originalUUID}`);
      console.log(`   Origin: ${originalPath}`);
      console.log(`   Copy: ${copyPath}`);
      console.log(`   Status: SYNCED`);
      
    } catch (error) {
      console.error(`❌ Failed to sync to copy: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }
}