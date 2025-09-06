/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { DefaultStorage } from './DefaultStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class DefaultUnit implements Unit {
  private model: UnitModel;
  private storage: DefaultStorage;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),           // UUIDv4 using crypto.randomUUID() (Decision 1a)
      name: '',                            // Unit name for terminal identification (uni-t)
      origin: '',                          // Git Text IOR format with line/column positions
      definition: '',                      // Git Text IOR format with character positions
      indexPath: '',                       // Will be set when stored
      symlinkPaths: [],                    // LD links tracking
      namedLinks: [],                      // Named links with location and filename
      executionCapabilities: ['transform', 'validate', 'process'],
      storageCapabilities: ['scenarios', 'ld-links'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.storage = new DefaultStorage();
    // Storage will be initialized with scenario in init() method
  }

  init(scenario: Scenario): this {
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

  // Protocol-less radical OOP methods - no Input/Output constructs
  transform(data: unknown): unknown {
    this.model.updatedAt = new Date().toISOString();
    return {
      transformed: data,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
  }

  validate(object: any): boolean {
    this.model.updatedAt = new Date().toISOString();
    return object !== null && object !== undefined;
  }

  process(): void {
    this.model.updatedAt = new Date().toISOString();
    console.log(`Unit ${this.model.uuid} processed`);
  }

  async toScenario(name?: string): Promise<Scenario> {
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
        this.model.namedLinks.push({
          location: relativePath,
          filename: linkFilename
        });
      } catch (error) {
        console.error('Failed to read symlink for namedLinks:', (error as Error).message);
      }
    }
    
    // Load the saved scenario to get the updated model with correct storage paths
    try {
      const savedScenario = await this.storage.loadScenario(this.model.uuid);
      const originalNamedLinks = this.model.namedLinks; // Save namedLinks before overwriting
      this.model = savedScenario.model as any; // Update our model with storage-corrected paths
      
      // Restore namedLinks if we had them
      if (originalNamedLinks && originalNamedLinks.length > 0) {
        this.model.namedLinks = originalNamedLinks;
        savedScenario.model = this.model;
        // Save the updated scenario with correct namedLinks
        await this.storage.saveScenario(this.model.uuid, savedScenario, [namedLink]);
        // Load again to get the final updated scenario
        const finalScenario = await this.storage.loadScenario(this.model.uuid);
        this.model = finalScenario.model as any;
        return finalScenario;
      }
      
      return savedScenario; // Return the complete saved scenario with correct paths
    } catch (error) {
      console.error('Failed to load saved scenario:', (error as Error).message);
      return scenario; // Fallback to original scenario
    }
  }

  // Helper methods for Unit model management
  addExecutionCapability(capability: string): this {
    if (!this.model.executionCapabilities.includes(capability)) {
      this.model.executionCapabilities.push(capability);
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Testing helper method
  getModel(): UnitModel {
    return this.model;
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
    if (!this.model.storageCapabilities.includes(capability)) {
      this.model.storageCapabilities.push(capability);
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Speaking name resolution methods (Decision 2a - in DefaultUnit)
  async resolveSpeakingName(speakingName: string): Promise<string | null> {
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
}