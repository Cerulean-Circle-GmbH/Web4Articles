/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit, UnitInput, UnitOutput } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { UnitIndexStorage } from './UnitIndexStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class DefaultUnit implements Unit {
  private model: UnitModel;
  private storage: UnitIndexStorage;

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
    this.storage = new UnitIndexStorage();
    this.storage.init(this.findProjectRoot());
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.model = scenario.model;
      this.model.state = 'initialized';
    }
    // Storage already initialized in constructor
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
      owner: btoa(ownerData), // TODO: Implement proper encryption
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
      // Add speaking name link for this unit
      const linkPath = `components/Unit/0.3.0.4/${speakingName}.unit`;
      await this.storage.addSymbolicLink(this.model.uuid, linkPath);
      console.log(`✅ Speaking name added: ${speakingName} -> ${this.model.uuid}`);
    } catch (error) {
      throw new Error(`Failed to add speaking name: ${(error as Error).message}`);
    }
  }

  async removeSpeakingName(speakingName: string): Promise<void> {
    try {
      // Remove speaking name link for this unit
      const linkPath = `components/Unit/0.3.0.4/${speakingName}.unit`;
      await this.storage.removeSymbolicLink(this.model.uuid, linkPath);
      console.log(`✅ Speaking name removed: ${speakingName}`);
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