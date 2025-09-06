/**
 * DefaultUser - Clean user component implementation
 * Web4 pattern: Empty constructor + scenario initialization
 */

import { User, OwnerParams, Scenario, UserModel } from '../layer3/User.interface.js';

export class DefaultUser implements User {
  private data: UserModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.data = {
      uuid: crypto.randomUUID(),
      username: 'system',
      hostname: 'localhost',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
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
        uuid: this.data.uuid,
        component: 'User',
        version: '0.3.0.4'
      },
      owner: '',
      model: this.data
    };
  }
}