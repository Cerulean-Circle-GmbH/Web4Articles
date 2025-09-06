/**
 * DefaultUser - Clean user component implementation
 * Web4 pattern: Empty constructor + scenario initialization
 */

import { User, OwnerParams, Scenario } from '../layer3/User.interface.js';

export class DefaultUser implements User {
  private data: any = {};

  constructor() {
    // Empty constructor - Web4 pattern
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.data = scenario.model;
    }
    return this;
  }

  async generateOwnerData(params: OwnerParams): Promise<string> {
    // Generate simple owner data
    return JSON.stringify({
      user: params.user || 'system',
      hostname: params.hostname || 'localhost',
      timestamp: new Date().toISOString()
    });
  }

  toScenario(): Scenario {
    return {
      ior: {
        uuid: this.data.uuid || crypto.randomUUID(),
        component: 'User',
        version: '0.3.0.4'
      },
      owner: '',
      model: this.data
    };
  }
}