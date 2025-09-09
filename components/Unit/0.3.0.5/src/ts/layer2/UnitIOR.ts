/**
 * UnitIOR - Unit protocol IOR implementation
 * Web4 principle: Single class per file, implements IOR interface
 * Purpose: Unit-specific IOR for UUID-based unit references
 */

import { IOR } from '../layer3/IOR.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';

export class UnitIOR implements IOR {
  readonly profile = {
    tag: 'unit',
    protocol: 'unit',
    transport: 'scenario',
    addressing: 'uuid'
  };

  constructor(private uuid: string) {}

  getUrl(): string {
    return `ior:unit:${this.uuid}`;
  }

  getType(): string {
    return 'unit';
  }

  getUuid(): string {
    return this.uuid;
  }

  getScenarioPath(): string {
    const uuidPath = this.uuid.split('').slice(0, 10).join('/').match(/.{1,2}/g)?.slice(0, 5).join('/') || '';
    return `/workspace/scenarios/index/${uuidPath}/${this.uuid}.scenario.json`;
  }

  getMasterFilePath(): string {
    const uuidPath = this.uuid.split('').slice(0, 10).join('/').match(/.{1,2}/g)?.slice(0, 5).join('/') || '';
    return `/workspace/scenarios/index/${uuidPath}/${this.uuid}.master.file`;
  }

  async loadScenario(): Promise<Scenario<UnitModel> | null> {
    try {
      const { readFile } = await import('fs/promises');
      const scenarioContent = await readFile(this.getScenarioPath(), 'utf8');
      return JSON.parse(scenarioContent) as Scenario<UnitModel>;
    } catch {
      return null;
    }
  }

  async exists(): Promise<boolean> {
    try {
      const { access } = await import('fs/promises');
      await access(this.getScenarioPath());
      return true;
    } catch {
      return false;
    }
  }
}