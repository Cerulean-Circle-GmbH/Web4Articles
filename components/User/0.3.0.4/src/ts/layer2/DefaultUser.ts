/**
 * DefaultUser - Simple user component
 * Web4 pattern: Empty constructor + scenario initialization
 */

export class DefaultUser {
  private data: any = {};

  constructor() {
    // Empty constructor
  }

  init(scenario: any): this {
    if (scenario.model) {
      this.data = scenario.model;
    }
    return this;
  }

  async generateOwnerData(params: any): Promise<string> {
    // Generate simple owner data
    return JSON.stringify({
      user: params.user || 'system',
      hostname: params.hostname || 'localhost',
      timestamp: new Date().toISOString()
    });
  }

  toScenario(): any {
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