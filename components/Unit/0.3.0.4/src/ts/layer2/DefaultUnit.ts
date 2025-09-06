/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit, UnitInput, UnitOutput } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { DefaultStorage } from './UnitIndexStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class DefaultUnit implements Unit {
  private model: UnitModel;
  private storage: DefaultStorage;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: 'default-unit',
      description: 'Default unit implementation',
      state: 'uninitialized',
      capabilities: ['execute'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.storage = new DefaultStorage();
    // Storage will be initialized with scenario in init() method
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.model = scenario.model;
      this.model.state = 'initialized';
    }
    // Initialize storage with scenario - Web4 pattern
    const storageScenario: Scenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.0.4' },
      owner: '',
      model: { uuid: crypto.randomUUID(), projectRoot: '', indexBaseDir: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    };
    this.storage.init(storageScenario);
    return this;
  }

  async execute(input: UnitInput): Promise<UnitOutput> {
    if (this.model.state === 'uninitialized') {
      throw new Error('Unit not initialized - call init() first');
    }

    this.model.state = 'executed';
    this.model.updatedAt = new Date().toISOString();

    return {
      result: {
        unitName: this.model.name,
        processed: input.data,
        timestamp: new Date().toISOString()
      },
      metadata: {
        executionId: crypto.randomUUID(),
        unitUuid: this.model.uuid
      }
    };
  }

  async toScenario(): Promise<Scenario> {
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

    // Save to central storage with LD links - create speaking name link in current directory
    const currentDir = process.cwd();
    const speakingNameLink = `${currentDir}/${this.model.name}`;
    await this.storage.saveScenario(this.model.uuid, scenario, [speakingNameLink]);

    return scenario;
  }

  // Helper methods
  setName(name: string): this {
    this.model.name = name;
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  setDescription(description: string): this {
    this.model.description = description;
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