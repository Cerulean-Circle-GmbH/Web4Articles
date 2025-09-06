/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit, UnitInput, UnitOutput } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
// TODO: Import UnitIndexStorage when available
// import { UnitIndexStorage } from '../../0.3.0.2/src/ts/layer2/UnitIndexStorage.js';

export class DefaultUnit implements Unit {
  private model: UnitModel;
  // TODO: Add storage when UnitIndexStorage available
  // private storage: UnitIndexStorage;

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
    // TODO: Initialize storage when available
    // this.storage = new UnitIndexStorage();
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.model = scenario.model;
      this.model.state = 'initialized';
    }
    // TODO: Initialize storage when available
    // this.storage.init(this.findProjectRoot());
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

    // TODO: Save to central storage when UnitIndexStorage available
    // const speakingNameLinks = [`components/Unit/0.3.0.4/${this.model.name}.unit`];
    // await this.storage.saveScenario(this.model.uuid, scenario, speakingNameLinks);

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

  private findProjectRoot(): string {
    let currentDir = process.cwd();
    while (currentDir !== '/') {
      try {
        require('fs').accessSync(`${currentDir}/scenarios`);
        return currentDir;
      } catch {
        currentDir = require('path').dirname(currentDir);
      }
    }
    return process.cwd();
  }
}