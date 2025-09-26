/**
 * DefaultTestReleaseComponent - TestReleaseComponent Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { TestReleaseComponent } from '../layer3/TestReleaseComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { TestReleaseComponentModel } from '../layer3/TestReleaseComponentModel.interface.js';

export class DefaultTestReleaseComponent implements TestReleaseComponent {
  private model: TestReleaseComponentModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<TestReleaseComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<TestReleaseComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'TestReleaseComponent',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TestReleaseComponent',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for TestReleaseComponent
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ TestReleaseComponent operation completed`);
    return this;
  }

  /**
   * Process data through TestReleaseComponent logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current TestReleaseComponent state
   */
  async info(): Promise<this> {
    console.log(`📋 TestReleaseComponent Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }
}