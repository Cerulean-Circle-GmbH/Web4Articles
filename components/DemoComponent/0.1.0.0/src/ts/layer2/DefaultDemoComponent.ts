/**
 * DefaultDemoComponent - DemoComponent Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { DemoComponent } from '../layer3/DemoComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { DemoComponentModel } from '../layer3/DemoComponentModel.interface.js';

export class DefaultDemoComponent implements DemoComponent {
  private model: DemoComponentModel;

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
  init(scenario: Scenario<DemoComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<DemoComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'DemoComponent',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'DemoComponent',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for DemoComponent
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ DemoComponent operation completed`);
    return this;
  }

  /**
   * Process data through DemoComponent logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current DemoComponent state
   */
  async info(): Promise<this> {
    console.log(`📋 DemoComponent Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Execute component tests using Web4TSComponent test infrastructure
   * Delegates to web4tscomponent for comprehensive testing and version promotion workflow
   * @cliSyntax
   * @cliExample testpatterncomponent test
   */
  async test(): Promise<this> {
    console.log(`🧪 Running DemoComponent tests via Web4TSComponent infrastructure...`);
    
    try {
      // Call web4tscomponent on DemoComponent dev test to use the promotion workflow
      const { execSync } = await import('child_process');
      execSync('web4tscomponent on DemoComponent dev test', { 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ DemoComponent tests completed successfully`);
    } catch (error) {
      console.error(`❌ DemoComponent tests failed`);
      throw error;
    }
    
    return this;
  }
}
