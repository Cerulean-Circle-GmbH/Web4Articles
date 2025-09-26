/**
 * DefaultTestComp2 - TestComp2 Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { TestComp2 } from '../layer3/TestComp2.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { TestComp2Model } from '../layer3/TestComp2Model.interface.js';

export class DefaultTestComp2 implements TestComp2 {
  private model: TestComp2Model;

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
  init(scenario: Scenario<TestComp2Model>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<TestComp2Model>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'TestComp2',
      version: '0.1.0.1'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TestComp2',
        version: '0.1.0.1'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for TestComp2
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ TestComp2 operation completed`);
    return this;
  }

  /**
   * Process data through TestComp2 logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current TestComp2 state
   */
  async info(): Promise<this> {
    console.log(`📋 TestComp2 Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }
}