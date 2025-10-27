/**
 * DefaultTestChainComponent - TestChainComponent Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { TestChainComponent } from '../layer3/TestChainComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { TestChainComponentModel } from '../layer3/TestChainComponentModel.interface.js';

export class DefaultTestChainComponent implements TestChainComponent {
  private model: TestChainComponentModel;

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
  init(scenario: Scenario<TestChainComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<TestChainComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'TestChainComponent',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TestChainComponent',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for TestChainComponent
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ TestChainComponent operation completed`);
    return this;
  }

  /**
   * Process data through TestChainComponent logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current TestChainComponent state
   */
  async info(): Promise<this> {
    console.log(`📋 TestChainComponent Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }
}