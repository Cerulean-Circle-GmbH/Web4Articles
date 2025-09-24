/**
 * DefaultTestCompleteBuilding - TestCompleteBuilding Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { TestCompleteBuilding } from '../layer3/TestCompleteBuilding.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { TestCompleteBuildingModel } from '../layer3/TestCompleteBuildingModel.interface.js';

export class DefaultTestCompleteBuilding implements TestCompleteBuilding {
  private model: TestCompleteBuildingModel;

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
  init(scenario: Scenario<TestCompleteBuildingModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<TestCompleteBuildingModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'TestCompleteBuilding',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TestCompleteBuilding',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for TestCompleteBuilding
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ TestCompleteBuilding operation completed`);
    return this;
  }

  /**
   * Process data through TestCompleteBuilding logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current TestCompleteBuilding state
   */
  async info(): Promise<this> {
    console.log(`📋 TestCompleteBuilding Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }
}